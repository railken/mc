<template>
  <div class="wrapper">
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
              <v-btn flat color="primary">Launch</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
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
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    font-family: 'Source Sans Pro', sans-serif; 
  }

  .divWithBgImage {
    position:fixed;
    bottom: 0;
    right: 0;
    margin: 25px;
  }

</style>
