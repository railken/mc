<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md6 v-for="(modpack, index) in data.modpacks" pa-4 :key="index">
        <v-card class="mod">

          <v-img :src="modpack.image ? modpack.image : require('@/assets/grass_block.jpg')" aspect-ratio="2.75"></v-img>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ modpack.name ? modpack.name : "No title provided" }}<small class='ml-3'>{{ modpack.version }}</small></h3>
              <div><small>{{ modpack.description ? modpack.description : "No description provided" }}</small></div>
              <br><br>
              <small>{{ modpack.hash }} | {{ modpack.updated_at }}</small>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn :disabled="loading" flat color="error" @click="!loading && removeModpack(index)">Remove</v-btn>
            <div style='flex-grow: 1'></div>
            <v-btn :disabled="loading" flat color="primary" @click="!loading && play(index, modpack)">Play</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import axios from 'axios'

  const path = require('path')
  const _ = require('lodash')
  const crypto = require('crypto')
  const fs = require('fs-extra')
  const download = require('download')
  const AdmZip = require('adm-zip')
  const os = require('os')

  export default {
    props: {
      user: {
        required: true
      },
      data: {
        required: true
      },
      settings: {
        required: true
      },
      loading: {
        required: true
      }
    },
    methods: {
      getFileNameData (file) {
        return this.settings.path + path.sep + file
      },
      isModpackFresh (modpack) {
        return !modpack.hash
      },
      removeModpack (index) {
        var data = _.cloneDeep(this.data)

        delete data.modpacks[index]

        this.$emit('update:data', data)
      },
      checksum (str, algorithm, encoding) {
        return crypto
          .createHash(algorithm)
          .update(str, 'binary')
          .digest('hex')
      },
      download (url) {
        this.$emit('update:log', 'Downloading: ' + url)

        return download(url)
      },
      request (url) {
        this.$emit('update:log', 'Retrieving: ' + url)

        return axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      },
      async play (index, modpack) {
        await this.downloadInstallerModpack(index, modpack)

        return this.downloadModpack(modpack)
      },
      downloadModpack (modpack) {
        if (!modpack.minecraft.manifest) {
          return this.$emit('update:log', 'No manifest found: ' + modpack.url)
        }

        this.$emit('update:loading', true)

        this.request(modpack.minecraft.manifest).then(async (result) => {
          modpack.version = result.data.id

          var version = result.data.id

          await this.downloadAssets(version, result.data.assetIndex)
          var libraries = await this.downloadLibraries(version, result.data.libraries.map((o) => { return o.downloads.artifact }).concat(modpack.minecraft.libraries).filter((o) => { return o }))
          await this.downloadNatives(version, modpack.minecraft.natives)

          var mods = await this.downloadMods(version, modpack.minecraft.mods)

          console.log(mods)
          debugger

          await this.installMods(version, modpack, mods)

          var exec = require('child_process').exec
          var command = this.createCommand(modpack, result.data.assetIndex.id, libraries)

          this.$emit('update:log', command)
          this.$emit('update:loading', false)

          exec(command, (error, stdout, stderr) => {
            this.$emit('update:log', stdout)
            this.$emit('update:log', stderr)
            if (error !== null) {
              this.$emit('update:log', error)
            }
          })
        })
      },
      getPathNatives (version) {
        return this.getFileNameData('cache' + path.sep + version + path.sep + 'natives')
      },
      getPathAssets (version) {
        return this.getFileNameData('assets')
      },
      getPathMods (version) {
        return this.getFileNameData('cache' + path.sep + version + path.sep + 'mods')
      },
      getPathObjectsAssets (version) {
        return this.getFileNameData('assets' + path.sep + 'objects')
      },
      getPathModpackMods (modpack) {
        return this.getPathModpack(modpack) + path.sep + 'mods'
      },
      getPathLibraries (version) {
        return this.getFileNameData('cache' + path.sep + version + path.sep + 'libraries')
      },
      getPathModpack (modpack) {
        return this.getFileNameData('modpacks' + path.sep + modpack.slug)
      },
      getPathIndexAssets (version) {
        return this.getFileNameData('assets' + path.sep + 'indexes' + path.sep + version + '.json')
      },
      downloadAndGetCommonFile (url) {
        var filepath = this.getFileNameData('cache' + path.sep + 'common' + path.sep + this.checksum(url, 'sha1'))

        this.download(url).then(data => {
          fs.outputFileSync(filepath, data)
        })

        return filepath
      },
      createCommand (modpack, assetIndex, libraries) {
        return 'java ' +
          '-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump ' +
          '-Xms4096m -Xmx4096m -XX:+UseG1GC -XX:MaxGCPauseMillis=4 ' +
          '-Djava.library.path=' + this.getPathNatives(modpack.version) + ' ' +
          '-Djava.net.preferIPv4Stack=true ' +
          '-cp "' + libraries.join(';') + '" ' +
          'net.minecraft.launchwrapper.Launch ' +
          '--username ' + this.user.selectedProfile.name + ' ' +
          '--gameDir ' + this.getPathModpack(modpack) + ' ' +
          '--assetsDir ' + this.getPathAssets(modpack.version) + ' ' +
          '--assetIndex ' + modpack.version + ' ' +
          '--uuid ' + this.user.selectedProfile.id + ' ' +
          '--accessToken ' + this.user.accessToken + ' ' +
          '--userType mojang ' +
          '--version ' + modpack.version + ' ' +
          '--tweakClass net.minecraftforge.fml.common.launcher.FMLTweaker ' +
          '--versionType Forge '
      },
      async manageFiles (version, objects, basePath, retrievePath, retrieveUrl) {
        var arr = []
        var downloaded = []

        Object.values(objects).map((object) => {
          var filepath = basePath + path.sep + retrievePath(object)

          downloaded.push(filepath)

          if (fs.existsSync(filepath) && this.checksum(fs.readFileSync(filepath), 'sha1') === (object.sha1 || object.hash)) {
            return
          }

          arr.push(() => {
            return this.download(retrieveUrl(object)).then(data => {
              fs.outputFileSync(filepath, data)
            })
          })
        })

        for (let i = 0; i < arr.length; i++) {
          await arr[i]()
        }
        debugger
        console.log(downloaded)

        return downloaded
      },
      async downloadLibraries (version, libraries) {
        return this.manageFiles(
          version,
          libraries,
          this.getPathLibraries(version),
          (object) => {
            return object.path
          },
          (object) => {
            return object.url
          }
        )
      },
      downloadAssets (version, indexAssets) {
        return this.request(indexAssets.url).then(async (result) => {
          fs.outputFileSync(this.getPathIndexAssets(version), JSON.stringify(result.data))
          return this.downloadAssetsObject(version, result.data.objects)
        })
      },
      downloadAssetsObject (version, assets) {
        return this.manageFiles(
          version,
          assets,
          this.getPathObjectsAssets(version),
          (object) => {
            return object.hash.substr(0, 2) + path.sep + object.hash
          },
          (object) => {
            return 'http://resources.download.minecraft.net/' + object.hash.substr(0, 2) + '/' + object.hash
          }
        )
      },
      async downloadMods (version, mods) {
        return this.manageFiles(
          version,
          mods,
          this.getPathMods(version),
          (object) => {
            return object.path
          },
          (object) => {
            return object.url
          }
        )
      },
      cleanDirectory (directory) {
        fs.readdir(directory, (err, files) => {
          if (err) throw err

          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
              if (err) throw err
            })
          }
        })
      },
      installMods (version, modpack, mods) {
        if (!fs.existsSync(this.getPathModpackMods(modpack))) {
          fs.mkdirSync(this.getPathModpackMods(modpack))
        }

        this.cleanDirectory(this.getPathModpackMods(modpack))

        mods.map((mod) => {
          fs.copySync(mod, this.getPathModpackMods(modpack) + path.sep + path.basename(mod))
        })
      },
      async downloadNatives (version, forge) {
        var object = forge

        var filepath = this.getFileNameData('cache' + path.sep + version + path.sep + 'lwjgl.zip')

        if (!fs.existsSync(filepath) || this.checksum(fs.readFileSync(filepath), 'sha1') !== object.hash) {
          await this.download(object.url).then(data => {
            fs.outputFileSync(filepath, data)
          })
        }

        var zip = new AdmZip(filepath)

        var conversions = {
          win32: 'windows'
        }

        var osName = conversions[os.platform()]

        zip.getEntries().filter((obj) => {
          return obj.entryName.match(new RegExp('(.*)/native/' + osName + '/(.*)', 'g'))
        }).forEach((obj) => {
          if (!obj.name) {
            return
          }
          var basepath = this.getPathNatives(version) + path.sep
          var filepath = basepath + obj.name

          if (fs.existsSync(filepath) && (this.checksum(fs.readFileSync(filepath), 'sha1') === this.checksum(obj.getData().toString('utf8'), 'sha1'))) {
            return
          }

          zip.extractEntryTo(obj, basepath, false, true)
        })
      },
      downloadInstallerModpack (index, modpack) {
        return this.request(modpack.url).then((result) => {
          var data = _.cloneDeep(this.data)

          try {
            var hash = crypto.createHash('md5').update(btoa(JSON.stringify(result.data))).digest('hex')

            data.modpacks[index] = result.data
            data.modpacks[index].url = modpack.url
            data.modpacks[index].slug = modpack.slug
            data.modpacks[index].type = modpack.type
            data.modpacks[index].updated_at = new Date().toISOString()
            data.modpacks[index].hash = hash

            this.$emit('update:data', data)
            this.$emit('update:log', 'Modpack installer updated: ' + hash)
          } catch (e) {
            this.$emit('update:log', 'An error has occurred while downloading and parsing the file .json')
          }
        })
      }
    }
  }
</script>
<style scoped>
  .v-card {
    max-width: 100%;
    width: 100%;
  }
</style>
