<template>
  <v-app :dark="false">
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">
    <v-toolbar color="blue" dark app>
      <v-toolbar-title>Minecraft Launcher</v-toolbar-title>
      <div style='flex-grow:1'></div>
      <add-modpack :user="user" v-on:update:user="setUser($event)" :data="data" v-on:update:data="setData($event)"></add-modpack>
      <div v-if="user">
        <v-menu class="ml-2">
          <v-btn flat  slot="activator" >
            <span class='mx-3'>{{ user.selectedProfile.name }}</span>
            <img :src="'https://crafatar.com/avatars/'+user.selectedProfile.id" alt="Avatar" icon style='width:36px'>
          </v-btn>
          <v-list>
            <v-list-tile :to="{'name': 'settings'}">
              <v-list-tile-content ><v-list-tile-title>Settings</v-list-tile-title></v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content @click="logout()"><v-list-tile-title>Logout</v-list-tile-title></v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      
    </v-toolbar>
    <v-content>
      <router-view 
        :user="user" v-on:update:user="setUser($event)" 
        :settings="settings" v-on:update:settings="setSettings($event)"
        :data="data" v-on:update:data="setData($event)"
        :log="log" v-on:update:log="addLog($event)"
        :loading="loading" v-on:update:loading="loading = $event"
      ></router-view>
    </v-content>

    <v-footer app dark>
      <div class="log-title" @click="showLogs = !showLogs">Console: {{ log.length }} logs</div>
      <div ref="logs" class="logs" v-if="showLogs">
        <pre v-for="l in log">{{ l.date.toLocaleString() }} {{ l.message }}</pre>
      </div>
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
        user: null,
        settings: null,
        loading: false,
        data: [],
        log: [
          {message: 'Welcome \n\n', date: new Date()}
        ],
        showLogs: false
      }
    },
    methods: {
      getFileNameData (file) {
        return this.settings.path + path.sep + file
      },
      addLog ($event) {
        this.log.push({
          message: $event,
          date: new Date()
        })

        if (this.$refs.logs) {
          setTimeout(() => {
            this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight
          }, 1)
        }
      },
      setUser ($event) {
        this.user = $event
        store.set('user', $event)
      },
      setData ($event) {
        this.data = $event

        if (!$event) {
          $event = {
            modpacks: {}
          }
        }

        fs.outputJsonSync(this.getFileNameData('launcher.json'), $event)
      },
      setSettings ($event) {
        if ($event === null) {
          $event = {
            path: (process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local')) + path.sep + 'mc-wine',
            ram: 1
          }
        }
        this.settings = $event
        store.set('settings', $event)
      },
      logout () {
        this.setUser(null)
        this.$router.push({name: 'auth'})
      }
    },
    created () {
      this.setUser(store.get('user'))
      this.setSettings(store.get('settings'))

      if (!fs.existsSync(this.getFileNameData('launcher.json'))) {
        this.setData()
      }
      this.setData(fs.readJSONSync(this.getFileNameData('launcher.json'), 'utf8'))

      document.addEventListener('keydown', function (e) {
        if (e.which === 123) {
          require('remote').getCurrentWindow().toggleDevTools()
        } else if (e.which === 116) {
          location.reload()
        }
      })
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .log {
    white-space: nowrap;
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
  .v-footer .logs {
    height: 256px;
    overflow-y: scroll;
    padding: 10px;
  }

  .log-title {
    padding: 10px; 
    background: rgba(255,255,255, 0.1);
    cursor: pointer;
  }

  .log-title:hover {
    background: rgba(255,255,255, 0.2);
  }
</style>
