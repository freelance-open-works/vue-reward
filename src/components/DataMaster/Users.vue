<!-- @format --> 

<template>
  <v-main class="list">
    <h1 align="center" class="mb-5">Users</h1>

    <template>
      <v-card>
        <v-toolbar>
          <v-tabs v-model="tabs" color="deep-purple accent-4">
            <v-tab @click="type = 'student'"> Student </v-tab>
            <v-tab @click="type = 'teacher'"> Teacher </v-tab>
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
                  v-model="selectedPeriode"
                  :items="periode"
                  label="Periode"
                  item-value="ID_PERIOD"
                  @change="changePeriode()"
                >
                  <template v-slot:selection="data">
                    <!-- HTML that describe how select should render selected items -->
                    {{ formattedDate(data.item.YEAR_START) }} /
                    {{ formattedDate(data.item.YEAR_FINISH) }}
                  </template>
                  <template v-slot:item="data">
                    <!-- HTML that describe how select should render items when the select is open -->
                    {{ formattedDate(data.item.YEAR_START) }} /
                    {{ formattedDate(data.item.YEAR_FINISH) }}
                  </template>
                </v-select>
              </v-card-title>
              <v-row>
                <v-col cols="12" sm="7">
                  <v-data-table
                    :headers="headers"
                    :items="users"
                    class="elevation-1"
                    :search="search"
                  >
                    <template v-slot:[`body.prepend`]>
                      <tr>
                        <td>
                          <v-text-field
                            v-model="SearchID"
                            type="text"
                            label="ID User"
                            append-icon="mdi-magnify"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="SearchName"
                            type="search"
                            label="Nama"
                            append-icon="mdi-magnify"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="SearchProdi"
                            type="text"
                            label="Prodi"
                            append-icon="mdi-magnify"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="SearchFakultas"
                            type="text"
                            label="Fakultas"
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
                        @click="readDetail(item.ID_USERS)"
                        >mdi-eye</v-icon
                      >
                    </template>
                  </v-data-table>
                </v-col>
                <v-col>
                  <h2><b>TOP 10 STUDENTS</b></h2>
                  <br />
                  <v-card>
                    <v-data-table
                      :headers="headersLeader"
                      :items="leaderStudent"
                      :loading="!leaderStudent.length"
                      loading-text="Loading..."
                    >
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
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
                  v-model="selectedPeriode"
                  :items="periode"
                  label="Periode"
                  item-value="ID_PERIOD"
                  @change="changePeriode()"
                >
                  <template v-slot:selection="data">
                    <!-- HTML that describe how select should render selected items -->
                    {{ formattedDate(data.item.YEAR_START) }} /
                    {{ formattedDate(data.item.YEAR_FINISH) }}
                  </template>
                  <template v-slot:item="data">
                    <!-- HTML that describe how select should render items when the select is open -->
                    {{ formattedDate(data.item.YEAR_START) }} /
                    {{ formattedDate(data.item.YEAR_FINISH) }}
                  </template>
                </v-select>
              </v-card-title>
              <v-row>
                <v-col cols="12" sm="7">
                  <v-data-table
                    :headers="headers"
                    :items="userss"
                    class="elevation-1"
                    :search="search"
                  >
                    <template v-slot:[`body.prepend`]>
                      <tr>
                        <td>
                          <v-text-field
                            v-model="SearchID"
                            type="text"
                            label="ID User"
                            append-icon="mdi-magnify"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="SearchName"
                            type="search"
                            label="Nama"
                            append-icon="mdi-magnify"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="SearchProdi"
                            type="text"
                            label="Prodi"
                            append-icon="mdi-magnify"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="SearchFakultas"
                            type="text"
                            label="Fakultas"
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
                        @click="readDetail(item.ID_USERS)"
                        >mdi-eye</v-icon
                      >
                    </template>
                  </v-data-table>
                </v-col>
                <v-col>
                  <h3>TOP 10 TEACHERS</h3>
                  <br />
                  <v-card>
                    <v-data-table
                      :headers="headersLeader"
                      :items="leaderTeacher"
                      :loading="!leaderTeacher.length"
                      loading-text="Loading..."
                    >
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </template>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus users ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDetail" persistent max-width="50vw">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text>
          <div class="container">
            <read-only-field :model="items.ID_USERS" label="ID User" />
            <read-only-field :model="items.NAME" label="Nama" />
            <read-only-field :model="items.PRODI" label="Program Studi" />
            <read-only-field :model="items.FAKULTAS" label="Fakultas" />
            <read-only-field :model="items.EMAIL" label="Email" />
            <read-only-field :model="items.TYPE" label="Type" />
            <read-only-field :model="items.POINTS" label="Point" />
            <read-only-field :model="items.API_KEY" label="Api Key" />
          </div>
        </v-card-text>
        <v-row justify="center">
          <v-img
            :label="Photo"
            :max-height="250"
            :max-width="150"
            :src="items.PHOTO"
          ></v-img>
        </v-row>
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
      tabs: null,
      color: null,
      Photo: null,
      snackbar: false,
      error_message: "",
      SearchID: "",
      SearchName: "",
      SearchProdi: "",
      SearchFakultas: "",
      search: "",
      dialog: false,
      dialogConfirm: false,
      dialogDetail: false,
      detailData: null,
      headers: [
        {
          text: "Id",
          align: "start",
          sortable: true,
          value: "ID_USERS",
          filter: (f) => {
            return (f + "").toLowerCase().includes(this.SearchID.toLowerCase());
          },
        },
        {
          text: "Nama",
          value: "NAME",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchName.toLowerCase());
          },
        },
        {
          text: "Prodi",
          value: "PRODI",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchProdi.toLowerCase());
          },
        },
        {
          text: "Fakultas",
          value: "FAKULTAS",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.SearchFakultas.toLowerCase());
          },
        },
        { text: "Point", value: "POINTS" },
        { text: "Actions", value: "actions" },
      ],
      headersLeader: [
        {
          text: "Id",
          align: "start",
          sortable: true,
          value: "ID_USERS",
        },
        {
          text: "Nama",
          value: "NAME",
        },
        {
          text: "Prodi",
          value: "PRODI",
        },
        { text: "Point", value: "point" },
      ],
      user: new FormData(),
      users: [],
      userss: [],
      form: {},
      items: {
        ID_USERS: "",
        NAME: null,
        PRODI: null,
        FAKULTAS: null,
        EMAIL: null,
        TYPE: null,
        POINTS: null,
        PHOTO: null,
        API_KEY: null,
      },
      deleteId: "",
      editId: "",
      type: "student",
      //Periode
      periode: [],
      selectedPeriode: null,
      //Leaderboard
      leaderStudent: [],
      leaderTeacher: [],
    };
  },
  mounted() {
    this.readPeriode();
    this.readData();
  },
  methods: {
    changePeriode() {
      this.leaderStudent = [];
      this.leaderTeacher = [];
      this.readLeaderboard();
    },
    readPeriode() {
      var url = this.$api + "/periode";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.periode = response.data.data;
          this.selectedPeriode = response.data.activePeriode.ID_PERIOD;
          //Setelah dapat ID Periode, read data sesuai periode.
          this.readData();
        });
    },
    formattedDate(item) {
      return moment(item).format("DD MMM YYYY");
    },
    setForm() {
      //Menentukan url API untuk simpan/update
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    readData() {
      //Pemanggilan API untuk mendapatkan data mahasiswa dan dosen
      var url = this.$api + "/users";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.users = response.data.datamhs;
          this.userss = response.data.datadosen;
          this.readLeaderboard();
        });
    },
    readLeaderboard() {
      //Pemanggilan API untuk mendapatkan data mahasiswa dan dosen
      var url = this.$api + `/leaderboardPeriode/${this.selectedPeriode}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.leaderStudent = response.data.student;
          this.leaderTeacher = response.data.teacher;
        });
    },
    readDetail(id) {
      //Pemanggilan API untuk mendapatkan detail data user
      var url = this.$api + `/users/${id}`;
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
    deleteData() {
      ////Pemanggilan API untuk hapus data user
      var url = this.$api + "/users/" + this.deleteId;
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
        status_meja: null,
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
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
