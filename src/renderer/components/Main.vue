<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md6 v-for="(modpack, index) in data.modpacks" pa-4 :key="index">
        <v-card class="mod">
          <v-img :src="modpack.image ? modpack.image : require('@/assets/grass_block.jpg')" aspect-ratio="2.75"></v-img>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ modpack.name || "No title provided" }}<small class='ml-3'>{{ modpack.version }}</small></h3>
              <div><small>{{ modpack.description || "No description provided" }}</small></div>
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
  import { Launcher } from '@/concerns/Launcher'
  import { Mapper } from '@/concerns/Mapper'
  import { InstallerManifest } from '@/concerns/InstallerManifest'
  const _ = require('lodash')

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
    methods: {
      removeModpack (index) {
        var data = _.cloneDeep(this.data)

        delete data.modpacks[index]

        this.$emit('update:data', data)
      },
      async play (index, modpack) {
        await this.downloadInstallerModpack(index, modpack)

        return this.downloadModpack(this.data.modpacks[index])
      },
      async downloadModpack (modpack) {
        this.$emit('update:loading', true)

        var launcher = new Launcher(new Mapper(this.settings.path))

        await launcher.launch({
          modpack: modpack,
          ram: this.settings.ram
        })

        this.$emit('update:loading', false)
      },
      async downloadInstallerModpack (index, modpack) {
        let installer = new InstallerManifest(this.mapper)
        modpack = await installer.handle(modpack)

        var data = _.cloneDeep(this.data)
        data.modpacks[index] = modpack

        this.$emit('update:data', data)
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
