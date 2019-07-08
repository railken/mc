<template>
  <v-app :dark="false">
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">
    <v-toolbar color="blue" dark app>
      <v-toolbar-title>Minecraft Launcher</v-toolbar-title>
      <div style='flex-grow:1'></div>
      <add-modpack :data="data" v-on:update:data="setData($event)"></add-modpack>
      <v-btn flat  :to="{'name': 'settings'}" style='padding: 0 15px'><v-icon class='mr-2'>create</v-icon>Settings</v-btn>
    </v-toolbar>
    <v-content>
      <router-view 
        :settings="settings" v-on:update:settings="setSettings($event)"
        :data="data" v-on:update:data="setData($event)"
        :loading="loading" v-on:update:loading="loading = $event"
      ></router-view>
    </v-content>

    <v-footer app dark>
      <v-progress-linear v-if="loading" :indeterminate="true" height='15'></v-progress-linear>
    </v-footer>
  </v-app>
</template>

<script>
  import store from 'store2'
  import AddModpack from '@/components/AddModpack'
  const path = require('path')
  const fs = require('fs-extra')

  export default {
    components: {
      AddModpack
    },
    data () {
      return {
        settings: null,
        loading: false,
        data: []
      }
    },
    methods: {
      getFileNameData (file) {
        return this.settings.path + path.sep + file
      },
      setData ($event) {
        this.data = $event

        if (!$event) {
          $event = {
            modpacks: {}
          }
        }

        fs.outputJsonSync(this.getFileNameData('launcher.json'), $event, {spaces: 2})
      },
      setSettings ($event) {
        if ($event === null) {
          $event = {}
        }

        if (!$event.path) {
          $event.path = (process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local')) + path.sep + 'minecraft'
        }

        if (!$event.ram) {
          $event.ram = 1
        }

        this.settings = $event
        store.set('settings', $event)
        this.loadData()
      },
      loadSettings () {
        this.setSettings(store.get('settings'))
      },
      loadData () {
        if (!fs.existsSync(this.getFileNameData('launcher.json'))) {
          this.setData()
        }

        this.setData(fs.readJSONSync(this.getFileNameData('launcher.json'), 'utf8'))
      }
    },
    created () {
      this.loadSettings()
    }
  }
</script>

<style scoped>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }


  .v-footer {
    font-size: 12px;
    display: block;
    min-height: auto;
    height: auto !important;
  }

  .v-footer > div {
    width: 100%;
  }
</style>
