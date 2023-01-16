<template>
  <div>
    <v-dialog v-model="dialogDelete" persistent max-width="400px">
      <v-card class="font">
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </div>
</template>

<script>
// import ErrorSnackbar from "./ErrorSnackbar.vue";

export default {
  components: {
    // ErrorSnackbar,
  },
  props: {
    dialogDelete: Boolean,
    url: String,
    id: [String, Number],
  },
  data() {
    return {
      error_message: null,
      snackbar: false,
      color: null,
    };
  },
  methods: {
    close() {
      this.$emit("close-dialog");
    },
    readData() {
      this.$emit("read-data");
    },
    deleteData() {
      var url = this.$api + `/${this.url}/${this.id}`;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.readData(); //mengambil data
          this.close();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.snackbar = true;
          this.color = "red";
        });
    },
  },
};
</script>