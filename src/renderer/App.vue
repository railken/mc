<template>
  <v-app :dark="false">
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">
    <v-toolbar color="blue" dark app>
      <v-toolbar-title>Minecraft Launcher</v-toolbar-title>
      <div style='flex-grow:1'></div>
      <div v-if="user">
        {{ user.selectedProfile.name }}&nbsp&nbsp;
        <v-menu class="ml-2">
          <img :src="'https://crafatar.com/avatars/'+user.selectedProfile.id" alt="Avatar" icon slot="activator" style='width:38px'>
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
      ></router-view>
    </v-content>
    <v-footer app><div class='mx-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div></v-footer>
  </v-app>
</template>

<script>
  import store from 'store2'
  var path = require('path')

  export default {
    data () {
      return {
        user: null,
        settings: null
      }
    },
    methods: {
      setUser ($event) {
        this.user = $event
        store.set('user', $event)
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
      store.set('settings', null)
      this.setUser(store.get('user'))
      this.setSettings(store.get('settings'))
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>
