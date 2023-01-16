<!-- @format --> 

<template>
  <v-main class="list">
    <h1 align="center" class="mb-5">User E-Learning Challenge History</h1>
    <v-card>
      <v-card-title>
        <!-- <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
        >
        </v-text-field> -->
         <v-spacer></v-spacer>
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
      <v-data-table :headers="headers" :items="filteredItems" :loading="loading"> 
        <template v-slot:[`body.prepend`]>
          <tr>
            <td>
              <v-text-field
                v-model="SearchID"
                label="ID History"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="SearchIDUser"
                label="ID User"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="SearchName"
                label="Nama User"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="SearchIDCh"
                label="ID Challenge"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="SearchIDLog"
                label="ID Log"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="SearchIP"
                label="IP Address"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="SearchDate"
                label="Date"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="SearchType"
                label="Type"
                append-icon="mdi-magnify"
              ></v-text-field>
            </td>
          </tr>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            color="blue darken-2"
            small
            class="mr-2"
            @click="readDetail(item.ID_ELEARNING_HISTORY)"
            >mdi-eye</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogDetail" persistent max-width="50vw">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text>
          <div class="container">
            <read-only-field
              :model="items.ID_ELEARNING_HISTORY"
              label="ID E-Learning History"
            />
            <read-only-field :model="items.DATE_HISTORY" label="Waktu" />
            <read-only-field :model="items.ID_USERS" label="ID User" />
            <read-only-field :model="items.USERNAME" label="Nama User" />
            <read-only-field
              :model="items.ID_ELEARNING_CHALLENGE"
              label="ID E-Learning Challenge"
            />
            <read-only-field :model="items.NAME" label="Nama Challenge" />
            <read-only-field :model="items.DESTINATION" label="Sasaran" />
            <read-only-field :model="items.TYPE" label="Tipe" />
            <read-only-field :model="items.EVENTNAME_CODE" label="Kode Event" />
            <read-only-field :model="items.POINT" label="Jumlah Poin" />
            <read-only-field :model="items.MAX_COUNT" label="Jumlah Event" />
            <read-only-field :model="items.INFO" label="Info" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
    <script>
import ReadOnlyField from "../BaseComponents/ReadOnlyField.vue";
import moment from "moment";
export default {
  components: { ReadOnlyField },
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      //Table
      loading:false,
      search: null,
      SearchID: "",
      SearchIDCh: "",
      SearchIDUser: "",
      SearchName: "",
      SearchIDLog: "",
      SearchIP: "",
      SearchDate: "",
      SearchType: "",
      selectedPeriode: "",
      dialog: false,
      dialogConfirm: false,
      dialogDetail: false,
      detailData: null,
      headers: [
        {
          text: "ID History",
          align: "start",
          sortable: true,
          value: "ID_ELEARNING_HISTORY",
          filter: (f) => {
            return (f + "").toLowerCase().includes(this.SearchID.toLowerCase());
          },
        },
        {
          text: "ID User",
          value: "ID_USERS",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchIDUser.toLowerCase());
          },
        },
        {
          text: "Nama User",
          value: "NAME",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchName.toLowerCase());
          },
        },
        {
          text: "ID Challenge",
          value: "ID_ELEARNING_CHALLENGE",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchIDCh.toLowerCase());
          },
        },
        {
          text: "ID Log",
          value: "ID_LOG_KULIAH",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchIDLog.toLowerCase());
          },
        },
        {
          text: "IP Address",
          value: "IP_ADDRESS",
          filter: (f) => {
            return (f + "").toLowerCase().includes(this.SearchIP.toLowerCase());
          },
        },
        {
          text: "Date (Y-m-d H:i:s)",
          value: "DATE_HISTORY",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchDate.toLowerCase());
          },
        },
        {
          text: "DB Type",
          value: "TYPE",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchType.toLowerCase());
          },
        },
        { text: "Actions", value: "actions" },
      ],
      elearnhistory: new FormData(),
      data: [],
      periode: [],
      form: {
        yearperiod: null,
      },
      items: {
        ID_ELEARNING_HISTORY: "",
        ID_USERS: null,
        NAME: null,
        ID_ELEARNING_CHALLENGE: null,
        DATE_HISTORY: null,
        DESTINATION: null,
        TYPE: null,
        EVENTNAME_CODE: null,
        POINT: null,
        MAX_COUNT: null,
        INFO: null,
      },
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      //Menentukan apakah akan memanggil fungsi simpan/update data
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
      this.loading = true
      //Pemangillan API untuk mendapat data elearning history 
        var url = this.$api + `/elearn`;
        this.$http
        .get(url, {
             headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            })
            .then((response) => {
              this.loading = false
              this.data = response.data.data;
          })
            .catch((error) => {
            this.data = [];
            console.log(`${error.response.data.message} ${this.selectedPeriode}`);
          });
        },
    readPeriode() {
      //Pemangillan API untuk mendapat data periode 
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

    readDetail(id) {
      //Pemangillan API untuk mendapat data detail suatu history 
      var url = this.$api + `/elearn/${id}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detailData = response.data.data;
          this.items = Object.assign({}, this.detailData);
          this.dialogDetail = true;
        });
    },
    close() {
      this.dialog = false;
      this.dialogDetail = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        nama_bahan: null,
        stok: null,
        satuan: null,
      };
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
.container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.container > div {
  flex: 45%; /* or - flex: 0 50% - or - flex-basis: 50% - */
}
</style>
