<!-- @format --> 

<template>
  <v-main class="list">
    <h1 align="center" class="mb-5">Redeem Manager</h1>
    <v-template>
      <v-text-field
        outlined
        label="Max Redeem"
        dense
        append-outer-icon="mdi-cog"
        v-model="maxredeems"
        readonly
        @click:append-outer="dialogmax = true"
        class="styled-input"
      ></v-text-field>
    </v-template>
    <template>
      <v-card>
        <v-toolbar>
          <v-tabs v-model="tabs" color="deep-purple accent-4">
            <v-tab> Student </v-tab>
            <v-tab> Teacher </v-tab>
          </v-tabs>
        </v-toolbar>

        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-card flat>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search Keseluruhan"
                  single-line
                  hide-details
                >
                </v-text-field>
                <v-spacer></v-spacer>
                <v-select
                  v-model="selectedPeriode1"
                  :items="periode"
                  label="Periode"
                  item-value="ID_PERIOD"
                >
                  <template v-slot:selection="data">
                    {{ periodeCombine(data.item.YEAR_START) }} /
                    {{ periodeCombine(data.item.YEAR_FINISH) }}
                  </template>
                  <template v-slot:item="data">
                    {{ periodeCombine(data.item.YEAR_START) }} /
                    {{ periodeCombine(data.item.YEAR_FINISH) }}
                  </template>
                </v-select>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="filteredItems1"
                class="elevation-1"
                :search="search"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    color="blue darken-2"
                    small
                    class="mr-2"
                    @click="editHandler(item)"
                    >mdi-pencil</v-icon
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search Keseluruhan"
                  single-line
                  hide-details
                >
                </v-text-field>
                <v-spacer></v-spacer>
                <v-select
                  v-model="selectedPeriode2"
                  :items="periode"
                  label="Periode"
                  item-value="ID_PERIOD"
                >
                  <template v-slot:selection="data">
                    {{ periodeCombine(data.item.YEAR_START) }} /
                    {{ periodeCombine(data.item.YEAR_FINISH) }}
                  </template>
                  <template v-slot:item="data">
                    {{ periodeCombine(data.item.YEAR_START) }} /
                    {{ periodeCombine(data.item.YEAR_FINISH) }}
                  </template>
                </v-select>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="filteredItems2"
                class="elevation-1"
                :search="search"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    color="blue darken-2"
                    small
                    class="mr-2"
                    @click="editHandler(item)"
                    >mdi-pencil</v-icon
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </template>

    <v-dialog v-model="dialogEdit" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Status Redeem </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="container">
              <v-text-field
                v-model="form.redeemkey"
                label="Redeem Key"
                readonly
                outlined
                dense
                class="item font"
              ></v-text-field>
              <v-select
                outlined
                dense
                label="Status"
                :items="['pending', 'finish']"
                class=""
                v-model="form.redeemstatus"
              ></v-select>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="update()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogmax" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Max Redeem </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="container">
              <v-text-field
                v-model="form.maxredeem"
                label="Maksimal Redeem"
                outlined
                dense
                number
                class="item font mx-2"
              ></v-text-field>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="updatemaxredeem()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
    <script>
import moment from "moment";
export default {
  name: "List",
  data() {
    return {
      inputType: "Update",
      load: false,
      snackbar: false,
      error_message: "",
      tabs: null,
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogEdit: false,
      dialogmax: false,
      selectedPeriode1: "",
      selectedPeriode2: "",
      data1: [],
      data2: [],
      valid: true,
      headers: [
        {
          text: "ID Redeem",
          align: "start",
          sortable: true,
          value: "ID_REDEEM_LOG",
        },
        { text: "ID User", value: "ID_USERS" },
        { text: "Name User", value: "NAME" },
        { text: "ID Catalogue", value: "ID_CATALOGUE" },
        { text: "Nama Catalogue", value: "NAME_CATALOGUE" },
        { text: "Redeem Time", value: "REDEEM_TIME" },
        {
          text: "Finish Redeem Time",
          value: "REDEEM_FINISHED_TIME",
        },
        { text: "Redeem Status", value: "REDEEM_STATUS" },
        { text: "Redeem Key", value: "REDEEM_KEY" },
        { text: "Update Status", value: "actions" },
      ],
      redeemlog: new FormData(),
      redeemlogs: [],
      periode: [],
      maxredeems: [],
      form: {
        redeemstatus: null,
        redeemkey: null,
        maxredeem: null,
      },
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      //Menentukan url API untuk simpan/update
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    periodeCombine(item) {
      //format tanggal menggunakan library moment
      return moment(item).format("DD MMM YYYY");
    },
    readData() {
      //Pemangillan API untuk mengambil data redeem
      var url = this.$api + `/redeem-manager`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.data1 = response.data.datamhs;
          this.data2 = response.data.datadosen;
          this.periods = response.data.yearperiod;
          this.maxredeems = response.data.maxredeem;
        })
        .catch((error) => {
          this.data = [];
          console.log(`${error.response.data.message} ${this.selectedPeriode}`);
        });
    },
    readPeriode() {
      //Pemangillan API untuk menyimpan data periode
      var url = this.$api + "/periode";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.periode = response.data.data;
          //console.log(this.periode);
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    editHandler(item) {
      //Inisialisasi variabel dengan data yang akan diedit
      this.inputType = "Ubah";
      this.editId = item.ID_REDEEM_LOG;
      this.form.redeemstatus = item.REDEEM_STATUS;
      this.form.redeemkey = item.REDEEM_KEY;
      this.dialogEdit = true;
    },
    update() {
      //Pemangillan API untuk update data formulir
      let newData = {
        redeemstatus: this.form.redeemstatus,
      };
      var url = this.$api + "/redeem-manager/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
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
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    updatemaxredeem() {
      //Pemangillan API untuk update batasan maksimum redeem
      let newData = {
        value_max: this.form.maxredeem,
      };
      var url = this.$api + "/maxredeem";
      this.load = true;
      this.$http
        .put(url, newData, {
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
          this.inputType = "Update";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    close() {
      this.dialog = false;
      this.dialogEdit = false;
      this.dialogmax = false;
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
  },
  computed: {
    filteredItems1() {
      //melakukan filter data sesuai dengan periode yang dipilih
      return this.data1.filter((i) => {
        return !this.selectedPeriode1 || i.ID_PERIOD === this.selectedPeriode1;
      });
    },
    filteredItems2() {
      //melakukan filter data sesuai dengan periode yang dipilih
      return this.data2.filter((i) => {
        return !this.selectedPeriode2 || i.ID_PERIOD === this.selectedPeriode2;
      });
    },
  },
  mounted() {
    this.readPeriode();
    this.readData();
  },
};
</script>

        <style scoped>
.styled-input {
  width: 230px;
}
</style>