<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">Package Manager</h1>
    <v-card>
      <v-tabs>
        <v-tab @click="refreshDataRedeem()"> Data Redeem </v-tab>
        <v-tab> Data Form </v-tab>
        <v-tab-item>
          <base-table
            :headers="headers"
            url="package"
            :showBtnCreate="true"
            btnName="Package Form"
            @dialog-create="dialogCreate = true"
            ref="baseTable1"
            @editHandler="editHandler"
            idName="ID_REDEEM_LOG"
            :packageManager="true"
            :selectedPeriode="selectedPeriode"
            @change-periode="changePeriode"
          />
        </v-tab-item>
        <v-tab-item>
          <base-table
            :headers="headersForm"
            url="package-form"
            :showBtnCreate="true"
            btnName="Package Form"
            @dialog-create="dialogCreate = true"
            ref="baseTable2"
            @editHandler="editHandler"
            idName="ID_PACKAGE"
            :packageFormManager="true"
            :selectedPeriode="selectedPeriode"
            @change-periode="changePeriode"
          />
        </v-tab-item>
      </v-tabs>
    </v-card>

    <v-dialog v-model="dialogCreate" persistent max-width="700px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Package Form </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-select
              v-model="editedItem.ID_PERIOD"
              :items="periode"
              outlined
              dense
              label="Periode"
              item-value="ID_PERIOD"
              :rules="[(v) => !!v || `Periode tidak boleh kosong!`]"
              :disabled="inputType == 'Update'"
              @change="resetFormPeriode()"
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
            <v-autocomplete
              v-model="editedItem.ID_USERS"
              label="ID User"
              outlined
              dense
              class="item font"
              :items="idUsers"
              item-text="ID_USERS"
              :disabled="!editedItem.ID_PERIOD || inputType == 'Update'"
              :rules="[(v) => !!v || `ID User tidak boleh kosong!`]"
              @change="readProducts()"
            ></v-autocomplete>
            <v-text-field
              v-model="editedItem.NAME"
              label="Nama Pengguna"
              outlined
              dense
              placeholder="Nama Pengguna"
              class="item font"
              :rules="[(v) => !!v || `Nama Pengguna tidak boleh kosong!`]"
              :disabled="inputType == 'Update'"
              readonly
            ></v-text-field>
            <v-textarea
              v-model="editedItem.ALAMAT"
              label="Alamat"
              outlined
              dense
              class="item font"
              :rules="[(v) => !!v || `Alamat tidak boleh kosong!`]"
            ></v-textarea>

            <v-menu
              ref="refTime"
              v-model="modelJam"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="editedItem.JAM"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="editedItem.JAM"
                  label="Jam Pengiriman"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="[(v) => !!v || `Jam Pengiriman tidak boleh kosong!`]"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="modelJam"
                v-model="editedItem.JAM"
                full-width
                @click:minute="$refs.refTime.save(editedItem.JAM)"
              ></v-time-picker>
            </v-menu>
            <br />

            <date-picker
              :date="editedItem.TANGGAL"
              label="Tanggal Pengiriman"
              :menuDate="menuDate"
              @close-date="closeDate"
            />

            <v-text-field
              v-model="editedItem.PENERIMA"
              outlined
              dense
              label="Nama Penerima"
              :rules="[(v) => !!v || `Nama Penerima tidak boleh kosong!`]"
            ></v-text-field>

            <v-text-field
              v-if="inputType == 'Update'"
              v-model="editedItem.KODE_KIRIM"
              outlined
              dense
              label="Kode Kirim Go-jek"
            ></v-text-field>

            <b>Isi Paket</b>
            <span v-if="!products"
              ><br />(Isi ID User terlebih dahulu untuk melihat daftar
              redeem)</span
            >
            <div
              v-for="item in products"
              :key="item.ID_REDEEM_LOG"
              style="margin-top: -10px"
            >
              <v-checkbox
                v-if="inputType == 'New'"
                v-model="checkboxProducts"
                :label="`${item.NAME_CATALOGUE} (${item.REDEEM_KEY})`"
                style="margin-bottom: -40px"
                :value="item.ID_REDEEM_LOG"
                :disabled="
                  item.ID_REDEEM_STATUS == 2 || item.ID_REDEEM_STATUS == 3
                "
              ></v-checkbox>

              <v-checkbox
                v-if="inputType == 'Update'"
                v-model="checkboxProducts"
                :label="`${item.NAME_CATALOGUE} (${item.REDEEM_KEY})`"
                style="margin-bottom: -40px"
                :value="item.ID_REDEEM_LOG"
                :disabled="
                  otherProducts != null &&
                  otherProducts.includes(item.ID_REDEEM_LOG)
                "
              ></v-checkbox>
            </div>
            <br />
            {{ this.checkboxProducts }}
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
import DatePicker from "../BaseComponents/DatePicker.vue";
import moment from "moment";

export default {
  components: { BaseTable, DatePicker },
  data() {
    return {
      headers: [
        { text: "ID User", value: "ID_USERS" },
        { text: "Nama", value: "NAME" },
        { text: "Pending", value: "PENDING" },
        { text: "Pending Alert", value: "ALERT" },
        { text: "On Process", value: "ON_PROCESS" },
        { text: "Finished", value: "FINISHED" },
        { text: "Total", value: "TOTAL" },
      ],
      headersForm: [
        { text: "ID User", value: "ID_USERS" },
        { text: "Nama", value: "NAME" },
        { text: "Alamat", value: "ALAMAT" },
        { text: "Jam Pengiriman", value: "JAM" },
        { text: "Tanggal Pengiriman", value: "TANGGAL" },
        { text: "Penerima", value: "PENERIMA" },
        { text: "Kode pengiriman", value: "KODE_KIRIM" },
        { text: "ID Isi Paket", value: "ISI_PAKET" },
        { text: "Isi Paket", value: "ISI_PAKET_NAME" },
        { text: "Actions", value: "actions" },
      ],
      dialogCreate: false,
      inputType: "New",
      editedItem: {
        ID_USERS: null,
        NAME: null,
        ALAMAT: null,
        JAM: null,
        TANGGAL: null,
        PENERIMA: null,
        KODE_KIRIM: null,
        ISI_PAKET: null,
        ID_PERIOD: null,
      },
      //Time Picker
      modelJam: false,
      //Date Picker
      menuDate: false,
      //Snackbar
      snackbar: false,
      color: null,
      error_message: null,
      //Form untuk save dan update
      formData: new FormData(),
      valid: true,
      editId: "",
      //Checkbox
      checkboxProducts: [],
      //Untuk v-autocomplete form
      idUsers: null,
      products: null,
      nama: null,
      otherProducts: null,
      //Periode
      selectedPeriode: null,
      activePeriode: null,
      periode: [],
    };
  },
  mounted() {
    this.readIdUsers();
    this.readPeriode();
  },
  methods: {
    refreshDataRedeem(){
      this.$refs.baseTable1.readData();
    },
    formattedDate(item) {
      //Format tanggal dengan library moment
      return moment(item).format("DD MMM YYYY");
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
    exportExcel() {
      //Fungsi untuk export data menjadi file excel
      var url = this.$api + `/exportExcel`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Laporan`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          this.color = "red";
          this.error_message = "Tidak ada data!";
          this.snackbar = true;
          console.log(error.response);
        });
    },
    changePeriode(value) {
      //Ganti dropdown periode
      this.selectedPeriode = value;
    },

    readIdUsers() {
      //Pemangillan API untuk mendapatkan ID User
      var url = this.$api + "/id-users";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.idUsers = response.data.data;
          //supaya formnya selalu baca data dari periode yg aktif
          this.activePeriode = response.data.active.ID_PERIOD;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    readProducts() {
      //Pemangillan API untuk mendapat data redeem produk dari suatu pengguna dan periode tertentu
      var url =
        this.$api +
        `/products/${this.editedItem.ID_USERS}/${this.editedItem.ID_PERIOD}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.products = response.data.data;
          this.editedItem.NAME = response.data.user.NAME;
          //console.log(this.products);
        })
        .catch((error) => {
          this.error_message = `Tidak ada data redeem ${this.editedItem.ID_USERS} di ID Periode ${this.editedItem.ID_PERIOD}`;
          console.log(error.response.data.message);
          this.snackbar = true;
          this.color = "red";
          console.log(this.error_message);
          //Reset
          this.editedItem.ID_USERS = null;
          this.editedItem.NAME = null;
          this.$refs.form.resetValidation();
          this.products = null;
        });
    },
    readOtherPackage() {
      ////Pemangillan API untuk mendapat data redeem produk yang sudah dipilih/diinput di formulir lain
      //Untuk disable checkbox produk yg sudah ada di form lain
      var url = this.$api + "/products/" + this.editId;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.otherProducts = response.data.data;
          let length = this.otherProducts.length;
          for (let i = 0; i < length; i++) {
            this.otherProducts.push(this.otherProducts[i].ID_REDEEM_LOG);
          }
          //Show dialog nya disini supaya isi other productsnya selesai dulu
          this.dialogCreate = true;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
          this.dialogCreate = true;
        });
    },

    closeDate(date) {
      this.editedItem.TANGGAL = date;
      this.menuDate = false;
    },
    setInput(value, idName) {
      this.editedItem[idName] = value;
    },

    showDialogCreate() {
      this.dialogCreate = true;
    },
    close() {
      this.resetForm();
      //Apabila klik brn edit utk row yg sama utk ke2xnya, formattedDate ga dijalankan lagi karena value datenya sama. Jadi, harus diganti.
      this.editedItem.TANGGAL = null;
      this.editedItem.KODE_KIRIM = null;
      this.dialogCreate = false;
    },

    setForm() {
      //Menentukan url API dan data yang akan disimpan/update
      if (this.$refs.form.validate()) {
        //Mengubah string isi paket menjadi array
        let isiPaket = JSON.parse(this.editedItem.ISI_PAKET);
        //Mendeteksi perbedaan dari array lama (isi Paket) dan baru (checkbox products) -> utk ubah status redeem difference tsb (di un-select) menjadi 1
        if (isiPaket != null) {
          let difference = isiPaket.filter(
            (x) => !this.checkboxProducts.includes(x)
          );
          //Ganti lagi jadi string untuk disimpan
          difference = JSON.stringify(difference);
          this.formData.append("DIFFERENCE", difference);
        }

        this.formData.append("ID_USERS", this.editedItem.ID_USERS);
        this.formData.append("JAM", this.editedItem.JAM);
        this.formData.append("TANGGAL", this.editedItem.TANGGAL);
        this.formData.append("PENERIMA", this.editedItem.PENERIMA);
        this.formData.append("ALAMAT", this.editedItem.ALAMAT);
        this.formData.append("ID_PERIOD", this.editedItem.ID_PERIOD);
        //Mengubah array menjadi string untuk disimpan di database
        this.editedItem.ISI_PAKET = JSON.stringify(this.checkboxProducts);
        this.formData.append("ISI_PAKET", this.editedItem.ISI_PAKET);

        var urlApi = "";
        if (this.inputType === "New") {
          urlApi = "/package-form";
        } else if (this.inputType === "Update") {
          if (this.editedItem.KODE_KIRIM != null) {
            this.formData.append("KODE_KIRIM", this.editedItem.KODE_KIRIM);
          }
          urlApi = `/package-form/${this.editId}`;
        }
        this.save(urlApi);
      }
    },

    save(urlApi) {
      //Pemangillan API untuk menyimpan data formulir
      var url = this.$api + urlApi;
      this.$http
        .post(url, this.formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          //Call method dari component base table
          this.$refs.baseTable1.readData();
          this.$refs.baseTable2.readData();
          this.close();
        })
        .catch((error) => {
          if (this.checkboxProducts.length == 0) {
            this.error_message = "Isi Paket tidak boleh kosong";
          } else {
            this.error_message = error.response.data.message;
          }
          console.log(this.error_message);
          this.color = "red";
          this.snackbar = true;
        });
      //}
    },
    editHandler(item) {
      //Inisialisasi input field/variabel dengan data yang dingin diedit
      this.snackbar = false;
      this.inputType = "Update";
      this.editedItem = Object.assign({}, item);

      //Mengubah data string isi paket menjadi array
      let isiPaket = JSON.parse(this.editedItem.ISI_PAKET);
      //Data array dimasukkan ke checkboxProduct supaya ter-centang
      this.checkboxProducts = isiPaket;
      this.editId = item.ID_PACKAGE;

      this.readProducts();
      this.readOtherPackage();
    },

    resetForm() {
      this.$refs.form.reset();
      this.products = null;
      this.$refs.form.resetValidation();
      this.inputType = "New";
      this.otherProducts = [];
      this.formData = new FormData();
    },

    resetFormPeriode() {
      this.editedItem.ISI_PAKET = null;
      this.editedItem.KODE_KIRIM = null;
      this.editedItem.PENERIMA = null;
      this.editedItem.TANGGAL = null;
      this.editedItem.JAM = null;
      this.editedItem.NAME = null;
      this.editedItem.ID_USERS = null;
      this.$refs.form.resetValidation();
    },
  },
};
</script>