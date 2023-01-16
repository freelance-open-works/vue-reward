<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">News Manager</h1>
    <base-table
      :headers="headers"
      url="news-manager"
      :showBtnCreate="true"
      btnName="News"
      @dialog-create="moveToForm('New', -1, null)"
      ref="baseTable"
      @editHandler="editHandler"
      idName="ID_NEWS"
      :newsManager="true"
      :selectedPeriode="selectedPeriode"
      @change-periode="changePeriode"
    />
    <error-snackbar
      :color="color"
      :errorMessage="error_message"
      :snackbar="snackbar"
    />
  </v-main>
</template>

<script>
import BaseTable from "../BaseComponents/BaseTable.vue";
import ErrorSnackbar from "../BaseComponents/ErrorSnackbar.vue";
// import moment from "moment";

export default {
  components: { BaseTable, ErrorSnackbar },
  data() {
    return {
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "ID_NEWS",
        },
        { text: "News Title", value: "NEWS_TITLE" },
        { text: "News Description", value: "NEWS_DESCRIPTION" },
        { text: "Date", value: "DATE" },
        { text: "Actions", value: "actions" },
      ],
      dialogCreate: false,
      inputType: "New",
      editedItem: {
        NEWS_TITLE: null,
        NEWS_DESCRIPTION: null,
        DATE: null,
      },
      snackbar: false,
      color: null,
      error_message: null,
      editId: "",
      //Periode
      selectedPeriode: null,
      //Target/Destination
      selectedTarget: null,
    };
  },
  methods: {
    moveToForm(type, id, item) {
      //Pindah halaman ke formulir pengisian berita
      this.$router.push({
        name: "News Form",
        params: {
          inputType: type,
          editId: id,
          item: item,
         
        },
      });
    },
    editHandler(item) {
      this.snackbar = false;
      this.moveToForm("Update", item.ID_NEWS, item);
    },
    changePeriode(value) {
      //Ganti dropdown periode
      this.selectedPeriode = value;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
</style>