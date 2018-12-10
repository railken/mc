<template>
  <div class="wrapper">
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-img
            src="https://i1.wp.com/www.minecraftrocket.com/wp-content/uploads/2015/03/Minecraft-Wallpaper-1.jpg"
            aspect-ratio="2.75"
          ></v-img>

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Dummy modpack</h3>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="primary">Update</v-btn>
            <v-btn flat color="primary">Launch</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

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
