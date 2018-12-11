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
            <v-list-tile :to="{'name': 'main'}">
              <v-list-tile-content><v-list-tile-title>Settings</v-list-tile-title></v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content @click="logout()"><v-list-tile-title>Logout</v-list-tile-title></v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    
    </v-content>
    <v-footer app><div class='mx-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div></v-footer>
  </v-app>
</template>

<script>
  import store from 'store2'

  export default {
    data () {
      return {
        user: null
      }
    },
    mounted () {
      this.user = window.user
    },
    methods: {
      logout () {
        window.user = null
        store.set('user', null)
        window.location.href = '/'
      }
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
