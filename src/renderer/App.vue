<template>
  <v-app>
	<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <v-navigation-drawer app></v-navigation-drawer>
    <v-toolbar color="blue" dark app>
      <v-toolbar-title>Minecraft Launcher</v-toolbar-title>

      <v-menu class="ml-2">

        <v-avatar color="red" icon slot="activator" :size='28'>
          <span class="white--text">a</span>
        </v-avatar>
        <v-list>
          <v-list-tile :to="{'name': 'settings'}">
            <v-list-tile-content><v-list-tile-title>Settings</v-list-tile-title></v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content @click="logout();"><v-list-tile-title>Logout</v-list-tile-title></v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
      
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
  import './stylus/main.styl'

  export default {
    name: 'mc'
  }
</script>

<style>
  /* CSS */
</style>
