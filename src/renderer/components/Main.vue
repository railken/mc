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
            <v-btn :disabled="loading" flat color="primary" @click="!loading && downloadInstallerModpack(index, modpack)">Update</v-btn>
            <v-btn :disabled="loading" flat color="primary" @click="!loading && play(index, modpack)">Play</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import axios from 'axios'
  import { InstallerMinecraft } from '@/concerns/InstallerMinecraft'
  import { InstallerMods } from '@/concerns/InstallerMods'
  import { InstallerVersion } from '@/concerns/InstallerVersion'
  import { Launcher } from '@/concerns/Launcher'
  import { Mapper } from '@/concerns/Mapper'

  const _ = require('lodash')
  const crypto = require('crypto')

  export default {
    props: {
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
    created () {
      let mapper = new Mapper(this.settings.path)

      this.handlers = {}
      this.handlers.minecraft = new InstallerMinecraft(mapper)
      this.handlers.mods = new InstallerMods(mapper)
      this.handlers.version = new InstallerVersion(mapper)
      this.handlers.launcher = new Launcher(mapper)
    },
    methods: {
      removeModpack (index) {
        var data = _.cloneDeep(this.data)

        delete data.modpacks[index]

        this.$emit('update:data', data)
      },
      request (url) {
        this.$emit('update:log', 'Retrieving: ' + url)

        return axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).catch((e) => {
          this.$emit('update:log', e)
        })
      },
      async play (index, modpack) {
        await this.downloadInstallerModpack(index, modpack)

        return this.downloadModpack(this.data.modpacks[index])
      },
      async downloadModpack (modpack) {
        if (!modpack.minecraft.manifest) {
          return this.$emit('update:log', 'No manifest found: ' + modpack.url)
        }

        this.$emit('update:loading', true)

        await this.handlers.minecraft.handle()
        await this.handlers.mods.handle(modpack)
        await this.handlers.version.handle(modpack)
        await this.handlers.launcher.handle(modpack, this.settings.ram)
        await this.handlers.launcher.launch(modpack)

        this.$emit('update:loading', false)
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
