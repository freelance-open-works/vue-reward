<template>
  <v-menu
    v-model="menuDateChanged"
    :close-on-content-click="true"
    max-width="290"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="formattedDate"
        :label="label"
        readonly
        v-bind="attrs"
        v-on="on"
        outlined
        dense
        class="mr-2"
         :rules="[(v) => !!v || `Tanggal tidak boleh kosong!`]"
      ></v-text-field>
    </template>
    <v-date-picker v-model="dateChanged" @change="closeDate()"></v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment";

export default {
  props: {
    label: String,
    date: String,
    menuDate: Boolean,
  },
  data() {
    return {
        currentMenuDate: this.menuDate,
        currentDate: this.date
    };
  },
//   model: {
//     prop: ["date", "menuDate"],
//     event: ["changeDate", "changeMenuDate"],
//   },
  computed: {
    menuDateChanged: {
      get() {
        return this.currentMenuDate;
      },
      set(value) {
        this.currentMenuDate = value
      },
    },
    dateChanged: {
      get() {
        //console.log("get date changed: " + this.currentDate)
        return this.currentDate;
      },
      set(value) {
        this.currentDate = value
        //console.log("set date changed: " + this.currentDate)
      },
    },
    formattedDate() {
      //console.log(this.date ? moment(this.date).format("DD/MMM/YYYY") : "");
      return this.date ? moment(this.date).format("DD/MMM/YYYY") : "";
      // return this.$emit('formatted-edit');
    },
  },
  methods: {
    closeDate() {
      this.$emit("close-date", this.currentDate); //mengirim date karena jika disini mengganti value, value di parent tidak otomatis terganti. Harus manual.
    },
  },
};
</script>