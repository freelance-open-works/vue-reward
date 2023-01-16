<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">Device Manager</h1>
    <base-table
      :headers="headers"
      url="device"
      :showBtnCreate="true"
      btnName="Device"
      @dialog-create="dialogCreate = true"
      ref="baseTable"
      @editHandler="editHandler"
      idName="ID_DEVICE_VERSION"
    />

    <v-dialog v-model="dialogCreate" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Device </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="editedItem.DEVICE"
              label="Device"
              outlined
              dense
              class="item font mx-2"
              :rules="[(v) => !!v || `Device tidak boleh kosong!`]"
            ></v-text-field>
           <v-text-field
              v-model="editedItem.VERSION"
              label="Version"
              outlined
              dense
              class="item font mx-2"
              :rules="[(v) => !!v || `Version tidak boleh kosong!`]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
import BaseTable from "../BaseComponents/BaseTable.vue";
// import InputField from "../BaseComponents/InputField.vue";

export default {
  components: { BaseTable },
  data() {
    return {
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "ID_DEVICE_VERSION",
        },
        { text: "Device", value: "DEVICE" },
        { text: "Version", value: "VERSION" },
        { text: "Actions", value: "actions" },
      ],
      dialogCreate: false,
      inputType: "New",
      editedItem: {
        DEVICE: null,
        VERSION: null,
      },
      snackbar: false,
      color: null,
      error_message: null,
      //Form untuk save dan update
      formData: new FormData(),
      valid: true,
      editId: "",
    };
  },
  methods: {
    close() {
      //Menutup modal dialog
      this.resetForm();
      this.dialogCreate = false;
    },

    setForm() {
      //Membuat form untuk menyimpan/update data
      if (this.$refs.form.validate()) {
        this.formData.append("DEVICE", this.editedItem.DEVICE);
        this.formData.append("VERSION", this.editedItem.VERSION);
        var urlApi = "";
        if (this.inputType === "New") {
          urlApi = "/device";
        } else if (this.inputType === "Update") {
          urlApi = `/device/${this.editId}`;
        }
        this.save(urlApi);
      }
    },
    save(urlApi) {
      //Pemanggilan API untuk menyimpan/update data
      var url = this.$api + urlApi;
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
          this.$refs.baseTable.readData();
          this.close();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
          this.color = "red";
          this.snackbar = true;
        });
      //}
    },
    editHandler(item) {
      //Untuk menginisialisasi input field/ variabel dengan data yang dipilih dari tabel utk diedit
      this.snackbar = false;
      this.inputType = "Update";
      this.editedItem = Object.assign({}, item); 
      this.editId = item.ID_DEVICE_VERSION;
      this.dialogCreate = true;
    },
    resetForm() {
      //reset isi input field dan validasinya
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.inputType = "New";
    },
  },
};
</script>