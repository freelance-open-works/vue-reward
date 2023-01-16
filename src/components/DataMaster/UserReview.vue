<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">User Review</h1>

    <base-table
      :headers="headers"
      url="review"
    />
  </v-main>
</template>

<script>
import BaseTable from "../BaseComponents/BaseTable.vue";

export default {
  components: {
    BaseTable,
  },
  data() {
    return {
      search: null,
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "ID",
        },
        { text: "ID User", value: "ID_USERS" },
        { text: "Review", value: "REVIEW" },
        { text: "Date", value: "TIME_CREATED" },
      ],
    };
  },
};
</script>