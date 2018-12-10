<template>
  <v-app :dark="false">
	  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">
    <v-toolbar color="blue" dark app>
      <v-toolbar-title>Minecraft Launcher</v-toolbar-title>

      <v-menu class="ml-2">
        <v-avatar color="red" icon slot="activator" :size='28'>
          <span class="white--text">a</span>
        </v-avatar>
        <v-list>
          <v-list-tile :to="{'name': 'main'}">
            <v-list-tile-content><v-list-tile-title>Settings</v-list-tile-title></v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content ><v-list-tile-title>Logout</v-list-tile-title></v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
      
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app><div class='mx-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div></v-footer>
  </v-app>
</template>

<script>
  import Vuetify from 'vuetify'
  import Vue from 'vue'
  import './stylus/main.styl'

  Vue.use(Vuetify)

  export default {
    name: 'mc'
  }
</script>

<style>
  /* CSS */
</style>
