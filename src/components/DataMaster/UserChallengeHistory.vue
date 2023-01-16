<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">User Challenge History</h1>
 
    <base-table
      :headers="headers"
      :url="'challenge-history'"
    />
  </v-main>
</template>

<script>
import BaseTable from "../BaseComponents/UCTable.vue";

export default {
  components: {
    BaseTable,
  },
  data() {
    return {
      search: null,
      searchID: "",
      headers: [
        {
          text: "ID History",
          align: "start",
          sortable: true,
          value: "ID_HISTORY",
          filter: f => {return ( f + '' ).toLowerCase().includes(this.searchID.toLowerCase())}
        },
        { text: "ID User", value: "ID_USERS" },
        { text: "ID Event", value: "ID_EVENTS" },
        { text: "Nama Event", value: "NAME_EVENTS" },
        { text: "Target", value: "DESTINATION" },
        { text: "Date", value: "DATE_HISTORY" },
        { text: "Actions", value: "actions" },
      ],
      user: new FormData(),
      users: [],
    };
  },
};
</script>