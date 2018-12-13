<template>
  <v-container fluid >
    <v-card v-if="form">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Settings</h3>
        </div>
      </v-card-title>

      <div class="content">
        {{ form }}
        <v-text-field prepend-icon="attach_file" single-line v-model="form.path" label="Path" @click.native="onFocus" ref="fileTextField"></v-text-field>
        <input type="file" :multiple="false" ref="fileInput" @change="onFileChange" webkitdirectory >


        <v-card-text>
          <v-slider
            v-model="form.ram"
            :min="1"
            :max="maxRam"
            ticks
            tick-size="1"
            label="Ram"
            thumb-label="always"
          ></v-slider>
        </v-card-text>

      </div>

      <v-card-actions tx-align-right style='padding: 20px'>
        <div style='flex-grow:1'></div>
        <v-btn  color="primary" @click="onBack()">Back</v-btn>
        <v-btn  color="primary" @click="onUpdate()">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
  var os = require('os')

  export default {
    props: {
      user: {
        required: true
      },
      settings: {
        required: true
      }
    },
    data () {
      return {
        maxRam: null,
        form: null
      }
    },
    methods: {
      onFocus () {
        this.$refs.fileInput.click()
      },
      onFileChange ($event) {
        this.form.path = $event.target.value
      },
      onUpdate () {
        this.$emit('update:settings', this.form)
        this.onBack()
      },
      onBack () {
        this.$router.push({name: 'main'})
      }
    },
    created () {
      this.maxRam = (os.totalmem() / 1073741824).toFixed(0)
      this.form = this.settings
    }
  }
</script>
<style scoped>
  
  .content {
    padding: 20px;
  }

  input[type=file] {
    display:none;
  }
  .v-card {
    max-width: 100%;
  }
</style>