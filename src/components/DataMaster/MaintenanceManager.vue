<template>
  <v-main class="font">
    <v-select
      label="Maintenance"
      v-model="selected"
      :items="['Active', 'Not Active']"
      class="shrink"
    ></v-select>

    <v-btn @click="save()" color="success"> Save</v-btn>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      data: null,
      selected: null,
      url: "/maintenance",
      formData: new FormData(),
      snackbar: false,
      color: null,
      error_message: "",
    };
  },
  mounted() {
    this.readData();
  },
  methods: {
    readData() {
      //Pemangillan API untuk mendapat status maintenance 
      var url = this.$api + this.url;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.data = response.data.data;
          this.selected = this.data.STATUS == "active" ? "Active" : "Not Active";
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
    save() {
      //Pemangillan API untuk update status maintenance 
      let url = this.$api + this.url;
      let status = this.selected == "Active" ? "active" : "not-active"

      this.formData.append("STATUS", status);
      this.formData.append(
        "UPDATE_TIME",
        moment().format("YYYY-MM-DD hh:mm:ss")
      );

      this.$http
        .post(url, this.formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.readData();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
          this.color = "red";
          this.snackbar = true;
        });
      //}
    },
  },
};
</script>

<style scoped>
.shrink {
    width: 50vw;
}
</style>