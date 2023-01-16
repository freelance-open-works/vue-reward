<!-- @format --> 

<template>
  <v-main class="list">
    <h1 align="center" class="mb-5">Catalogue Stock</h1>
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
        <v-select
          v-model="selectedPeriode"
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
      <v-data-table :headers="headers" :items="filteredItems" :search="search">
        <template v-slot:[`item.status`]="{ item }">
          <v-chip :color="getColor(item)" dark>
            {{ status(item) }}
          </v-chip>
        </template>
        <template v-slot:[`item.valueDiff`]="{ item }">
          {{ myComputed(item) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            color="green darken-2"
            small
            class="mr-2"
            @click="editHandler(item)"
            >mdi-checkbox-marked-circle</v-icon
          >
        </template>
        <template v-slot:[`item.stok`]="{ item }">
          <v-text-field
            v-model="item.STOCK_GUDANG"
            class="centered-input text--darken-3 mt-3"
          ></v-text-field>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin mengubah stok gudang katalog ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="update()"> Submit </v-btn>
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
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogEdit: false,
      valid: true,
      headers: [
        {
          text: "ID Catalogue",
          align: "start",
          sortable: true,
          value: "ID_CATALOGUE",
        },
        { text: "Name", value: "NAME_CATALOGUE" },
        { text: "Stock Aplikasi", value: "STOCK" },
        { text: "Stock Gudang", value: "STOCK_GUDANG" },
        { text: "Keterangan Stock", value: "status" },
        { text: "Stock Difference", value: "valueDiff" },
        { text: "Input Stock Gudang", value: "stok" },
        { text: "Konfirmasi Input", value: "actions" },
      ],
      catalogue: new FormData(),
      data: [],
      selectedPeriode: "",
      periode: [],
      form: {
        stok: 0,
        diff: 0,
      },
      editId: "",
      jumlah: "",
    };
  },
  methods: {
    periodeCombine(item) {
      //Format tanggal menggunakan library moment
      return moment(item).format("DD MMM YYYY");
    },
    readData() {
      //Pemanggilan API untuk mendapat stok tiap katalog
      var url = this.$api + `/catalogue_stock`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.data = response.data.data;
        })
        .catch((error) => {
          this.data = [];
          console.log(`${error.response.data.message} ${this.selectedPeriode}`);
        });
    },
    readPeriode() {
       //Pemanggilan API untuk mendapat data periode
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
      this.inputType = "Ubah";
      this.editId = item.ID_CATALOGUE;
      this.jumlah = item.STOCK_GUDANG;
      this.dialogConfirm = true;
    },
    update() {
       //Pemanggilan API untuk update data stok katalog
      this.catalogue.append("STOCK_GUDANG", this.jumlah);
      var url = this.$api + "/catalogue_stock/" + this.editId;
      this.load = true;
      this.$http
        .post(url, this.catalogue, {
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
    myComputed(item) {
      this.stockreal = item.STOCK_GUDANG;
      this.stockapp = item.STOCK;
      return this.stockreal - this.stockapp;
    },
    status(item) {
      this.stockreal = item.STOCK_GUDANG;
      this.stockapp = item.STOCK;
      this.stockdiff = this.stockreal - this.stockapp;
      if (this.stockdiff < 0) {
        return "Defisit";
      } else {
        return "Balance";
      }
    },
    getColor(item) {
      this.stockreal = item.STOCK_GUDANG;
      this.stockapp = item.STOCK;
      this.stockdiff = this.stockreal - this.stockapp;
      if (this.stockdiff < 0) {
        return "red";
      } else {
        return "green";
      }
    },
    resetForm() {
      this.form = {
        idperiode: null,
        name: null,
        description: null,
        type: null,
        points: null,
        stock: null,
        destination: null,
        photo: null,
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
    filteredItems() {
      return this.data.filter((i) => {
        return !this.selectedPeriode || i.ID_PERIOD === this.selectedPeriode;
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

.v-text-field {
  width: 50px;
}
.icon {
  font-size: 220px;
}
.centered-input >>> input {
  text-align: center;
}
</style>