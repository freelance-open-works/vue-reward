<!-- @format --> 

<template>
  <v-main class="list">
    <h1 align="center" class="mb-5">Catalogue Manager</h1>
    <v-template>
      <v-btn outlined dense @click="moveTo()" class="styled-input">
        Catalogue Manager
      </v-btn>
    </v-template>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="dialog = true">
          Tambah Catalogue Type
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="data" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            color="yellow darken-2"
            small
            class="mr-2"
            @click="editHandler(item)"
            >mdi-pencil</v-icon
          >
          <v-icon
            color="red darken-2"
            small
            class="mr-2"
            @click="deleteHandler(item.ID_CTG_TYPE)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Catalogue Type </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="form.name"
              label="Nama Tipe"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="form.maxredeem"
              label="Max Redeem"
              outlined
              dense
              class="item font mx-2"
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

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus katalog ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
    <script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      valid: true,
      headers: [
        { text: "ID", align: "start", sortable: true, value: "ID_CTG_TYPE" },
        { text: "Type Name", value: "CTG_TYPE" },
        { text: "Max Redeem", value: "CTG_MAX_REDEEM" },
        { text: "Actions", value: "actions" },
      ],
      type: new FormData(),
      data: [],
      form: {
        name: null,
        maxredeem: null,
      },
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    readData() {
      //Pemanggilan API untuk mendapat tipe katalog
      var url = this.$api + `/catalogue_type`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.data = response.data.data;
          //console.log(this.data);
        })
        .catch((error) => {
          this.data = [];
          console.log(`${error.response.data.message} ${this.selectedPeriode}`);
        });
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.ID_CTG_TYPE;
      this.form.name = item.CTG_TYPE;
      this.form.maxredeem = item.CTG_MAX_REDEEM;
      this.dialog = true;
    },
    save() {
      //Pemanggilan API untuk menyimpan data tipe katalog
      this.type.append("CTG_TYPE", this.form.name);
      this.type.append("CTG_MAX_REDEEM", this.form.maxredeem);

      var url = this.$api + "/catalogue_type/";
      this.load = true;
      this.$http
        .post(url, this.type, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    update() {
      //Pemanggilan API untuk update data tipe katalog
      this.type.append("CTG_TYPE", this.form.name);
      this.type.append("CTG_MAX_REDEEM", this.form.maxredeem);
      var url = this.$api + "/catalogue_type/" + this.editId;
      this.load = true;
      this.$http
        .post(url, this.type, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      //menghapus data
      var url = this.$api + "/catalogue_type/" + this.deleteId;
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
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
          this.dialogConfirm = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.inputType = "Tambah";
      this.resetForm();
      this.dialog = false;
      this.dialogEdit = false;
      this.dialogmax = false;
      this.dialogConfirm = false;
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        maxredeem: null,
        name: null,
      };
    },
    moveTo() {
      this.$router.push({
        name: "Catalogue Manager",
        params: {},
      });
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>

        <style scoped>
.styled-input {
  width: 230px;
}
</style>