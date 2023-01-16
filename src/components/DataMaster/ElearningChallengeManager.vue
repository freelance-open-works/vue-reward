<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">E-Learning Challenge Manager</h1>
    <base-table
      :headers="headers"
      url="elearn-challenge"
      :elearnChallManager="true"
      :showBtnCreate="true"
      btnName="E-Learning Challenge"
      @dialog-create="moveToForm('New', -1, null)"
      ref="baseTable"
      @editHandler="editHandler"
      idName="ID_ELEARNING_CHALLENGE"
      :selectedPeriode="selectedPeriode"
      @change-periode="changePeriode"
    />

    <v-dialog v-model="dialogCreate" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} E-Learning Challenge </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="container">
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

export default {
  components: { BaseTable },
  data() {
    return {
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "ID_ELEARNING_CHALLENGE",
        },
        { text: "Name", value: "NAME" },
        { text: "Description", value: "DESC" },
         { text: "Destination", value: "DESTINATION" },
        { text: "Actions", value: "actions" },
      ],
      dialogCreate: false,
      inputType: "New",
      editedItem: {
        NAME: null,
        DESC: null,
        STATUS: null,
      },
      snackbar: false,
      color: null,
      error_message: null,
      //Form untuk save dan update
      formData: new FormData(),
      valid: true,
      editId: "",

      selectedPeriode: null,
    };
  },
  methods: {
    changePeriode(value) {
      //Mengubah dropdown periode
      this.selectedPeriode = value;
    },
    moveToForm(type, id, item) {
      //Pindah halaman ke formulir e-learning challenge
      this.$router.push({
        name: "E-Learning Challenge Form",
        params: {
          inputType: type,
          editId: id,
          item: item,
        },
      });
    },

    editHandler(item) {
      this.moveToForm("Update", item.ID_ELEARNING_CHALLENGE, item);
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