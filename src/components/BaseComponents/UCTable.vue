<template>
  <v-card elevation="3">
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-select
        v-model="selectedPeriode"
        :items="periode"
        label="Periode"
        item-value="ID_PERIOD"
      >
        <template v-slot:selection="data">
          <!-- HTML that describe how select should render selected items -->
          {{ periodeCombine(data.item.YEAR_START) }} /
          {{ periodeCombine(data.item.YEAR_FINISH) }}
        </template>
        <template v-slot:item="data">
          <!-- HTML that describe how select should render items when the select is open -->
          {{ periodeCombine(data.item.YEAR_START) }} /
          {{ periodeCombine(data.item.YEAR_FINISH) }}
        </template>
      </v-select>
    </v-card-title>
    <v-data-table :headers="headers" :items="filteredItems" :search="search">
      <template v-slot:[`body.prepend`]>
        <tr>
          <td>
            <v-text-field
              v-model="searchID"
              label="ID History"
              append-icon="mdi-magnify"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="searchIDUser"
              label="ID User"
              append-icon="mdi-magnify"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="searchIDEvent"
              label="ID Event"
              append-icon="mdi-magnify"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="searchNamaEvent"
              label="Nama Event"
              append-icon="mdi-magnify"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="searchTarget"
              label="Target"
              append-icon="mdi-magnify"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="searchDate"
              label="Date"
              append-icon="mdi-magnify"
            ></v-text-field>
          </td>
        </tr>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="blue darken-2" small @click="readDetail(item.ID_HISTORY)"
          >mdi-eye</v-icon
        >
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDetail" persistent max-width="50vw">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text>
          <div class="container">
            <read-only-field :model="items.ID_HISTORY" label="ID History" />
            <read-only-field :model="items.ID_USERS" label="ID User" />
            <read-only-field :model="items.NAME" label="Nama" />
            <read-only-field :model="items.ID_EVENTS" label="ID Challenge" />
            <read-only-field :model="items.EVENT_TYPE" label="Challenge Type" />
            <read-only-field
              :model="items.NAME_EVENTS"
              label="Challenge Name"
            />
            <read-only-field
              :model="items.DESTINATION"
              label="Challenge Target"
            />
            <read-only-field :model="items.DATE_HISTORY" label="Date History" />
            <read-only-field
              :model="items.POINT_REACHED"
              label="Points Detail"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ReadOnlyField from "./ReadOnlyField.vue";
// import SearchColumn from "./SearchColumn.vue";
import moment from "moment";

export default {
  components: { ReadOnlyField },
  props: {
    // headers: Array,
    url: String,
    // searchID: String,
  },
  name: "List",
  data() {
    return {
      snackbar: false,
      error_message: "",
      search: null,
      dialogDetail: false,
      searchID: "",
      searchIDUser: "",
      searchIDEvent: "",
      searchNamaEvent: "",
      searchTarget: "",
      searchDate: "",
      data: [],
      periode: [],
      items: {
        ID_HISTORY: "",
        ID_USERS: "",
        NAME: "",
        ID_EVENTS: "",
        EVENT_TYPE: "",
        NAME_EVENTS: "",
        NAME_EVENT_ROLE: "",
        DESTINATION: "",
        DATE_HISTORY: "",
        POINT_REACHED: "",
      },
      headers: [
        {
          text: "ID History",
          align: "start",
          sortable: true,
          value: "ID_HISTORY",
          filter: (f) => {
            return (f + "").toLowerCase().includes(this.searchID.toLowerCase());
          },
        },
        {
          text: "ID User",
          value: "ID_USERS",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.searchIDUser.toLowerCase());
          },
        },
        {
          text: "ID Event",
          value: "ID_EVENTS",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.searchIDEvent.toLowerCase());
          },
        },
        {
          text: "Nama Event",
          value: "NAME_EVENTS",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.searchNamaEvent.toLowerCase());
          },
        },
        {
          text: "Target",
          value: "DESTINATION",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.searchTarget.toLowerCase());
          },
        },
        {
          text: "Date",
          value: "DATE_HISTORY",
          filter: (f) => {
            return (f + "")
              .toLowerCase()
              .includes(this.searchDate.toLowerCase());
          },
        },
        { text: "Actions", value: "actions" },
      ],
      detailData: null,
      selectedPeriode: 4,
    };
  },
  mounted() {
    this.readPeriode();
  },
  computed: {
    filteredItems() {
      return this.data.filter((i) => {
        return !this.selectedPeriode || i.ID_PERIOD === this.selectedPeriode;
      });
    },
  },
  methods: {
    periodeCombine(item) {
      return moment(item).format("DD MMM YYYY");
    },
    readData() {
      var url = this.$api + `/${this.url}`;
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
          //console.log(this.selectedPeriode);
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    readDetail(id) {
      var url = this.$api + `/challenge-history-detail/${id}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detailData = response.data.data;
          this.items = Object.assign({}, this.detailData);
          this.items.ID_HISTORY = this.items.ID_HISTORY.toString();
          this.items.ID_EVENTS = this.items.ID_EVENTS.toString();
          this.items.POINT_REACHED = this.items.POINT_REACHED.toString();
          this.dialogDetail = true;
        });
    },
    close() {
      this.dialogDetail = false;
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
