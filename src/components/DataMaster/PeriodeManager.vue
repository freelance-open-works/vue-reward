<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">Periode Manager</h1>
    <base-table
      :headers="headers"
      url="periode"
      :periodeManager="true"
      :showBtnCreate="true"
      btnName="Periode"
      @dialog-create="dialogCreate = true"
      ref="baseTable"
      @editHandler="editHandler"
      idName="ID_PERIOD"
    />

    <v-dialog v-model="dialogCreate" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Periode </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="container">
              <date-picker
                :date="editedItem.YEAR_START"
                label="Start Date"
                :menuDate="menuStartDate"
                @close-date="closeStartDate"
              />
              <date-picker
                :date="editedItem.YEAR_FINISH"
                label="Finish Date"
                :menuDate="menuFinishDate"
                @close-date="closeFinishDate"

              />
              <v-select
                outlined
                dense
                label="Status"
                :items="['inactive', 'active']"
                class="mr-2"
                v-model="editedItem.STATUS"
              ></v-select>
            </div>
          </v-form>
          <span>
            Warning! Periode have relation with other content (events and
            catalogs). Client just allowed to access contents with active
            periode.
          </span>
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
import DatePicker from "../BaseComponents/DatePicker.vue";

export default {
  components: { BaseTable, DatePicker },
  data() {
    return {
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "ID_PERIOD",
        },
        { text: "Year Periode", value: "YEAR_PERIOD" },
        { text: "Status", value: "STATUS" },
        { text: "Actions", value: "actions" },
      ],
      dialogCreate: false,
      inputType: "New",
      editedItem: {
        YEAR_START: null,
        YEAR_FINISH: null,
        STATUS: null,
      },
      snackbar: false,
      color: null,
      error_message: null,
      //Form untuk save dan update
      formData: new FormData(),
      valid: true,
      menuStartDate: false,
      menuFinishDate: false,
      editId: "",
    };
  },
  methods: {
    closeStartDate(date) {
      //Menutup dialog tanggal setelah memilih tanggal
      this.editedItem.YEAR_START = date;
      this.menuStartDate = false;
    },
    closeFinishDate(date) {
       //Menutup dialog tanggal setelah memilih tanggal
      this.editedItem.YEAR_FINISH = date;
      this.menuFinishDate = false;
    },
    showDialogCreate() {
      this.dialogCreate = true;
    },
    close() {
      this.resetForm();
      //Apabila klik brn edit utk row yg sama utk ke2xnya, formattedDate ga dijalankan lagi karena value datenya sama. Jadi, harus diganti.
      this.editedItem.YEAR_START = null;
      this.editedItem.YEAR_FINISH = null;
      this.dialogCreate = false;
    },

    save(urlApi) {
      //Pemangillan API untuk menyimpan periode baru
       var url = this.$api + urlApi;
      this.$http
        .post(url, this.formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
           console.log(`error message ${this.error_message}`);
          this.snackbar = true;
          this.color = "green";
          this.$refs.baseTable.readData(); //refresh data setelah menyimpan data baru
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
      this.snackbar = false;
      this.inputType = "Update";
      this.editedItem = Object.assign({}, item);
    
      this.editId = item.ID_PERIOD;
      this.dialogCreate = true;
    },

    setForm() {
      //Menentukan url API untuk simpan/update
      if (this.$refs.form.validate()) {
        this.formData.append("YEAR_START", this.editedItem.YEAR_START);
        this.formData.append("YEAR_FINISH", this.editedItem.YEAR_FINISH);
        this.formData.append("STATUS", this.editedItem.STATUS);
        this.formData.append("YEAR_PERIODE", 0);
        var urlApi = "";
        if (this.inputType === "New") {
          urlApi = "/periode";
        } else if (this.inputType === "Update") {
          urlApi = `/periode/${this.editId}`;
        }
        this.save(urlApi);
      }
    },
    resetForm() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.inputType = "New";
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