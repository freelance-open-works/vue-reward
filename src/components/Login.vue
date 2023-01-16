<!-- @format -->

<template>
  <v-main class="bg-color">
    <v-container fluid fill-height class="position font">
      <v-layout flex justify-center>
        <v-flex xs12 sm6>
          <v-card elevation="4">
            <v-card-title class="justify-center">
              <span
                class="bold font align-center ma-2"
                style="font-size: 1.8rem"
                >Admin Page</span
              >
            </v-card-title>
            <v-card-text>
              <v-form
                ref="form"
                @submit.prevent="submit"
                lazy-validation
                class="mx-2"
              >
                <v-text-field
                  v-model="login.username"
                  outlined
                  label="Username"
                  :rules="usernameRules"
                ></v-text-field>
                <v-text-field
                  v-model="login.password"
                  outlined
                  label="Password"
                  :rules="passwordRules"
                  type="password"
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    style="background-color: #6495ED"
                    type="submit"
                    block
                    large
                    >Login
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
          <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
          </v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<style scoped>
.bg-color {
  background-color:#DEB887;
  overflow: hidden; /* Hide scrollbars */
}
.position {
  position: absolute;
  top: 20px;
  left: 0px;
  right: 0px;
}

.bold {
  font-weight: 700 !important;
}
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      login: {
        username: "",
        password: "",
      },
      usernameRules: [(v) => !!v || "Username tidak boleh kosong!"],
      passwordRules: [(v) => !!v || "Password tidak boleh kosong!"],
    };
  },

  methods: {
    loadingCursor() {
      document.body.style.cursor = "wait";
    },
  
    submit() {
      //Pemanggilan API untuk mlogin
      this.loadingCursor()
      if (this.$refs.form.validate()) {
        //cek apakah data yang akan dikirim sudah valid
        this.load = true;
        this.$http
          .post(this.$api + "/login", {
            username: this.login.username,
            password: this.login.password,
          })
          .then((response) => {
            localStorage.setItem("id", response.data.user.id); //menyimpan id user yang sedang login
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("token", response.data.access_token); //menyimpan auth token
            localStorage.setItem("user", JSON.stringify(response.data.user))
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.$router.replace("/dashboard");
            this.clear();
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            console.log(this.error_message);
            this.color = "red";
            this.snackbar = true;
            localStorage.removeItem("token");
            this.load = false;
          });
      }
    },

    clear() {
      this.$refs.form.reset(); //Clear form login
    },
  },
};
</script>