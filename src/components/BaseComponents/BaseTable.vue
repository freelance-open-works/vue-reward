<template>
  <div>
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
          v-if="
            elearnChallManager ||
            packageManager ||
            packageFormManager ||
            newsManager
          "
          v-model="selectedPeriodeChanged"
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

        <!-- TARGET SELECT -->
        <v-spacer v-if="elearnChallManager" />

        <v-select
          v-if="elearnChallManager"
          v-model="selectedTargetChanged"
          :items="['All data', 'student', 'teacher', 'all user']"
          label="Filter Target"
        >
        </v-select>

        <!-- BUTTON NEW -->
        <v-spacer
          v-if="
            elearnChallManager ||
            packageManager ||
            packageFormManager ||
            newsManager
          "
        />

        <v-btn v-if="showBtnCreate" @click="dialogCreate" color="success">
          New {{ btnName }}</v-btn
        >
        <v-spacer v-if="packageFormManager" />

        <v-menu offset-y v-if="packageFormManager">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"> Export </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in ['All Form', 'Selected Periode']"
              :key="item"
              link
            >
              <v-list-item-title>
                <export-excel
                  class="btn btn-default"
                  :data="readDataExport(item)"
                  worksheet="Formulir"
                  :name="namaFileExport(item)"
                >
                  {{ item }}
                </export-excel>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>

      <v-data-table :headers="headers" :items="filteredItems" :search="search">
        <template v-if="periodeManager" v-slot:[`item.YEAR_PERIOD`]="{ item }">
          {{ periodeCombine(item) }}
        </template>

        <template v-if="packageManager" v-slot:[`item.ALERT`]="{ item }">
          <v-icon v-if="item.PENDING > 0" color="red">mdi-alert-circle</v-icon>
        </template>

        <template v-if="packageFormManager" v-slot:[`item.JAM`]="{ item }">
          {{ formattedTime(item.JAM) }}
        </template>

        <template v-if="packageFormManager" v-slot:[`item.TANGGAL`]="{ item }">
          {{ formattedDate(item.TANGGAL) }}
        </template>

        <template v-if="messageManager" v-slot:[`item.opened`]="{ item }">
          <v-icon v-if="item.opened === 0" color="red">mdi-alert-circle</v-icon>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <actions-slot
            :item="item"
            :packageForm="packageFormManager"
            :newsManager="newsManager"
            :kodeKirim="item.KODE_KIRIM != null"
            :messageManager="messageManager"
            @deleteHandler="deleteHandler"
            @editHandler="editHandler"
            @isiQRCode="isiQRCode"
            @sendNotif="openSendNotif"
            @openMessage="openMessage"
          />
        </template>
      </v-data-table>
    </v-card>

    <delete-dialogue
      :dialogDelete="dialogConfirm"
      :url="url"
      :id="deleteId"
      @read-data="readData"
      @close-dialog="closeDelete"
    />

    <!-- MODAL QR CODE -->
    <v-dialog v-model="dialogQrCode" persistent max-width="400px">
      <v-card style="font-family: 'Montserrat', sans-serif" class="parent">
        <div ref="qrCodeRef">
          <v-card-title class="child">
            {{ namaQR }} <br />
            Penerima: {{ penerimaQR }}
          </v-card-title>
          <v-card-text class="child">
            <qrcode-vue :value="value" :size="size" level="H" />
            <span style="font-size: 20px">
              {{ formattedDate(tglQR) }} <br />
              {{ jamQR }}
            </span>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogQrCode = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="printThis()"> Print </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- MODAL SEND NOTIF -->
    <v-dialog v-model="dialogSendNotif" persistent max-width="400px">
      <v-card style="font-family: 'Montserrat', sans-serif">
        <v-card-title> Warning! </v-card-title>
        <v-card-text>
          Apakah anda yakin akan mengirim notifikasi untuk berita ini?
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialogSendNotif = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="sendNotif(dataNotif)">
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </div>
</template>


<script>
import ActionsSlot from "./ActionsSlot.vue";
import moment from "moment";
import DeleteDialogue from "./DeleteDialogue.vue";
import QrcodeVue from "qrcode.vue"
import html2canvas from 'html2canvas';
export default {
  components: { ActionsSlot, DeleteDialogue, QrcodeVue },
  props: {
    headers: Array,
    url: String,
    periodeManager: Boolean,
    elearnChallManager: Boolean,
    packageManager: Boolean,
    packageFormManager: Boolean,
    newsManager: Boolean,
    messageManager: Boolean,
    btnName: String,
    showBtnCreate: Boolean,
    idName: String,
    selectedPeriode: Number,
  },
  name: "BaseTable",
  data() {
    return {
      inputType: "Tambah",

      search: null,
      data: [],
      dataChatUnopened: [],
      dataBasedPeriode: [], //untuk export data formulir berdasarkan periode
      form: {
        status_meja: null,
      },
      deleteId: "",
      editId: "",
      dialogConfirm: false,
      currentSelectedPeriode: this.selectedPeriode,
      periode: [],
      paketName: null,
      //QR Code
      value: {},
      size: 300,
      dialogQrCode: false,
      namaQR: null,
      penerimaQR: null,
      tglQR: null,
      jamQR: null,
      //Isi paket
      isiPaket: null,
      //Filter target
      targetType: null,
      currentSelectedTarget: "All data",
      //Snackbar
      snackbar: false,
      color: null,
      error_message: null,
      //Form untuk save dan update
      formData: new FormData(),
      //Send notif
      dialogSendNotif: false,
      dataNotif: {},
    };
  },
  mounted() {
    this.readPeriode();
  },
  computed: {
    selectedPeriodeChanged: {
      //Untuk memilih periode
      get() {
        //console.log("get: " + this.currentSelectedPeriode);
        return this.currentSelectedPeriode;
      },
      set(value) {
        this.currentSelectedPeriode = value;
        this.readFormBasedOnPeriode();
        //console.log("set: " + this.currentSelectedPeriode);
      },
    },
    selectedTargetChanged: {
      //Untuk memilih jenis user di menu elearning manager
      get() {
        //console.log("get: " + this.currentSelectedTarget);
        return this.currentSelectedTarget;
      },
      set(value) {
        this.currentSelectedTarget = value;
      },
    },
    formTitle() {
      return this.inputType;
    },

    filteredItems() {
      //Filter data sesuai periode
      return this.data.filter((i) => {
        //Filter periode
        if (this.packageManager || this.packageFormManager || this.newsManager)
          return (
            !this.currentSelectedPeriode ||
            i.ID_PERIOD === this.currentSelectedPeriode
          );
        //Filter periode dan target/jenis user utk elearning challenge
        else if (this.elearnChallManager) {
          if (this.currentSelectedTarget === "All data") {
            return (
              !this.currentSelectedPeriode ||
              i.ID_PERIOD === this.currentSelectedPeriode
            );
          } else {
            return (
              !this.currentSelectedPeriode ||
              !this.currentSelectedTarget ||
              (i.DESTINATION === this.currentSelectedTarget &&
                i.ID_PERIOD === this.currentSelectedPeriode)
            );
          }
        } else return this.data;
      });
    },
  },

  methods: {
    async printThis() {
      //Untuk perbaikan bug image terpotong.
      window.scrollTo(0,0)
      //Get reference to the element that needs to be printed
      const el = this.$refs.qrCodeRef;
      const options = {
        type: "dataURL",
      };

      //Generate canvas from elemen
      const printCanvas = await html2canvas(el, options);

      //Download the image
      const link = document.createElement("a"); //Generate a link that will prompt user to download image when clicked
      link.setAttribute("download", `${this.namaQR}.png`);
      link.setAttribute(
        "href",
        printCanvas // //Convert canvas to an image
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();
    },

    openSendNotif(item) {
      this.dialogSendNotif = true;
      this.dataNotif = item;
    },

    showIsiPaket(item) {
      //Untuk menampilkan nama dan npm di dialog
      this.jamQR = item.JAM;
      this.tglQR = item.TANGGAL;
      this.namaQR = item.NAME;
      this.penerimaQR = item.PENERIMA;

      this.readIsiPaket(item.ID_PACKAGE, "QR");
    },
    readIsiPaket(item, jenis) {
      var url = this.$api + `/package-name/${item}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.isiPaket = response.data;
          if (jenis == "QR") {
            this.dialogQrCode = true; //buka dialog
          } else {
            this.paketName = this.isiPaket;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changePeriode() {
      this.readData();
      this.$emit("change-periode", this.currentSelectedPeriode); //mengirim data karena jika disini mengganti value, value di parent tidak otomatis terganti. Harus manual.
    },

    changeTarget() {
      this.readData();
      this.$emit("change-target", this.currentSelectedTarget); //mengirim data karena jika disini mengganti value, value di parent tidak otomatis terganti. Harus manual.
    },
    formattedDate(item) {
      return moment(item).format("DD MMM YYYY");
    },
    formattedTime(item) {
      return moment(item, "hh:mm:ss").format("hh:mm");
    },
    dialogCreate() {
      this.$emit("dialog-create");
    },
    namaFileExport(item) {
      if (item == "All Form") return "Data Formulir Semua Periode";
      else return `Data Formulir Periode ${this.currentSelectedPeriode}`;
    },

    readDataExport(item) {
      if (item == "All Form") return this.data;
      else {
        return this.dataBasedPeriode;
      }
    },

    readFormBasedOnPeriode() {
      var url = this.$api + "/package-form/" + this.currentSelectedPeriode;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.dataBasedPeriode = response.data;
          //console.log(this.dataBasedPeriode);
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
          this.selectedPeriodeChanged = response.data.activePeriode.ID_PERIOD;
          //Setelah dapat ID Periode, read data sesuai periode.
          this.readData();
        });
    },
    readData() {
      var url = this.elearnChallManager
        ? this.$api + `/${this.url}/admin`
        : this.packageManager
        ? this.$api + `/${this.url}/${this.currentSelectedPeriode}`
        : this.$api + `/${this.url}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.data = response.data.data;
          if (this.messageManager) {
            this.dataChatUnopened = response.data.unopened;
            console.log(this.dataChatUnopened);
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
          //apabile didelete
          // this.data = error.response.data.data;
        });
    },

    deleteHandler(item) {
      //console.log(`id delete: ${item[this.idName]}`);
      this.deleteId = item[this.idName];
      this.dialogConfirm = true;
    },

    periodeCombine(item) {
      return `${moment(item.YEAR_START).format("DD/MMM/YYYY")} - ${moment(
        item.YEAR_FINISH
      ).format("DD/MMM/YYYY")}`;
    },

    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },

    editHandler(item) {
      this.$emit("editHandler", item);
    },

    openMessage(item) {
      this.$emit("openMessage", item);
    },
    closeDelete() {
      this.dialogConfirm = false;
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
    isiQRCode(item) {
      //untuk mengisi QR Code
      this.value = `ID Package: ${item.ID_PACKAGE} |\nNama: ${item.NAME} |\nAlamat: ${item.ALAMAT} |\nJam Pengiriman: ${item.JAM} |\nTanggal Pengiriman: ${item.TANGGAL} |\nNama Penerima: ${item.PENERIMA}`;
      this.showIsiPaket(item);
    },
    sendNotif(item) {
      //Mengirim notifikasi menggunakna Firebase
      console.log(item);
      this.formData.append("NEWS_TITLE", item.NEWS_TITLE);
      this.formData.append("NEWS_DESCRIPTION", item.NEWS_DESCRIPTION);
      this.formData.append("MESSAGE", item.MESSAGE);

      var urlApi = `${this.$api}/send-notif-news`;
      this.$http
        .post(urlApi, this.formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          this.error_message = "Send notification success!";
          this.color = "green";
          this.snackbar = true;
          this.formData = new FormData();
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
  },
};
</script>

<style scoped>
/* biar center qr codenya */
.parent {
  display: grid;
  place-items: center;
}
.child {
  text-align: center;
}
</style>
