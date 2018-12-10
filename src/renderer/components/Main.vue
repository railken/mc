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
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 md6 v-for="mod in mods" pa-4>
            <v-card>
              <v-img :src="mod.img" aspect-ratio="2.75"></v-img>

              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{ mod.title }}</h3>
                  <div>{{ mod.description }}</div>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-btn flat color="primary">Update</v-btn>
                <v-btn flat color="primary">Remove</v-btn>
                <v-btn flat color="primary">Launch</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app><div class='mx-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div></v-footer>
  </v-app>
</template>
<script>
  export default {
    data () {
      return {
        mods: []
      }
    },
    mounted () {
      this.mods = [
        {
          img: 'https://i1.wp.com/www.minecraftrocket.com/wp-content/uploads/2015/03/Minecraft-Wallpaper-1.jpg',
          title: 'Dummy',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
          img: 'https://i1.wp.com/www.minecraftrocket.com/wp-content/uploads/2015/03/Minecraft-Wallpaper-1.jpg',
          title: 'Dummy',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
          img: 'https://i1.wp.com/www.minecraftrocket.com/wp-content/uploads/2015/03/Minecraft-Wallpaper-1.jpg',
          title: 'Dummy',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
          img: 'https://i1.wp.com/www.minecraftrocket.com/wp-content/uploads/2015/03/Minecraft-Wallpaper-1.jpg',
          title: 'Dummy',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        }
      ]
    }
  }
</script>
<style>

  .divWithBgImage {
    position:fixed;
    bottom: 0;
    right: 0;
    margin: 25px;
  }

</style>
