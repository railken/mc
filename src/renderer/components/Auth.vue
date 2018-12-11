<template>
  <div class="centered-container">
    <v-card>
      <div class="title">
        Ban
      </div>
      <div class="md-body-1">Nice day to fish, ain't it?</div>
      <v-alert v-if="error" type="error" :value="true">{{ error }}</v-alert>
      <div class="form mt-4">
          <v-text-field
            prepend-icon="person"
            v-model="form.username"
            label="Username"
            primary
          ></v-text-field>
          <v-text-field
            prepend-icon="lock"
            v-model="form.password"
            label="Password"
            :type="show3 ? 'text' : 'password'"
            @click:append="show3 = !show3"
            :append-icon="show3 ? 'visibility_off' : 'visibility'"
          ></v-text-field>
      </div>

      <div class="actions fluid">
        <div class='fill'></div>
        <v-btn dark color="primary" @click="login()" :loading="loading" :disabled="loading">Log in</v-btn>
      </div>

    </v-card>
    <div class="background" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    user: {
      required: true
    }
  },
  data () {
    return {
      form: {
      },
      show3: false,
      loading: false,
      error: null
    }
  },
  methods: {
    login () {
      console.log(this.form)

      if (!this.form.username || !this.form.password) {
        return
      }

      this.loading = true

      this.api.post('/authenticate', {
        clientToken: 'MC-01-LAUNCHER',
        requestUser: true,
        username: this.form.username,
        password: this.form.password,
        agent: {
          name: 'Minecraft',
          version: 1
        },
        message: 'hello'
      }).then(response => {
        this.$emit('change', response.data)
        this.$router.push({name: 'main'})
        this.loading = false
      }).catch(error => {
        this.error = error.response.data.errorMessage
        this.loading = false
      })
    }
  },
  mounted () {
    if (this.user) {
      this.$router.push({name: 'main'})
    }

    this.api = axios.create({
      baseURL: 'https://authserver.mojang.com',
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }
}
</script>

<style >
  .centered-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100vh;
  }
  .centered-container .title {
      text-align: center;
      margin-bottom: 30px;
  }
  .centered-container img {
    margin-bottom: 16px;
    max-width: 220px;
  }

  .actions .md-button {
    margin: 0;
  }

  .form {
    margin-bottom: 60px;
  }
  .background {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
  }
  .v-card {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
</style>
