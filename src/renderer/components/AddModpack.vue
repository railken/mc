<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">

      <v-btn flat slot="activator"><v-icon class='mr-2'>create</v-icon>Add modpack</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">New Modpack</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Slug" placeholder='E.g. my-modpack-project' required v-model="form.slug"></v-text-field>
          <v-autocomplete
            :items="['HTTP-JSON']"
            label="Type"
            v-model="form.type"
          ></v-autocomplete>
          <v-text-field label="URL" required v-model="form.url"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="addModpack()">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  var _ = require('lodash')
  export default {
    props: {
      user: {
        required: true
      },
      data: {
        required: true
      }
    },
    data: () => ({
      dialog: false,
      form: {
        type: 'HTTP-JSON',
        url: null,
        slug: 'my-modpack'
      }
    }),
    methods: {
      addModpack () {
        if (!this.form.url || !this.form.type) {
          return
        }

        var data = _.cloneDeep(this.data)

        if (typeof data.modpacks === 'undefined') {
          data.modpacks = {}
        }

        data.modpacks[this.form.slug] = this.form
        this.$emit('update:data', data)
        this.dialog = false
      }
    }
  }
</script>