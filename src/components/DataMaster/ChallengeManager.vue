<!-- @format --> 

<template>
  <v-main class="list">
    <h1 align="center" class="mb-5">Challenge Manager</h1>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <v-select
          v-model="selectedPeriode"
          :items="periode"
          label="Periode"
          item-value="ID_PERIOD"
        >
          <template v-slot:selection="data">
            {{ periodeCombine(data.item.YEAR_START) }} /
            {{ periodeCombine(data.item.YEAR_FINISH) }}
          </template>
          <template v-slot:item="data">
            {{ periodeCombine(data.item.YEAR_START) }} /
            {{ periodeCombine(data.item.YEAR_FINISH) }}
          </template>
        </v-select>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="dialog = true">
          New Challenge
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="filteredItems" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            color="yellow darken-2"
            small
            class="mr-2"
            @click="editHandler(item.ID_EVENTS)"
            >mdi-pencil</v-icon
          >
          <v-icon
            color="red darken-2"
            small
            class="mr-2"
            @click="deleteHandler(item.ID_EVENTS)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Challenge </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-select
              v-model="form.idperiode"
              :items="periods"
              :item-text="'year_period'"
              :item-value="'ID_PERIOD'"
              label="Periode"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-select
              v-model="form.type"
              :items="types"
              :item-text="'EVENT_TYPE'"
              :item-value="'ID_EVENT_TYPE'"
              label="Challenge Type"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-text-field
              v-model="form.name"
              label="Nama Challenge"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="form.description"
              label="Deskripsi"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="form.datestart"
              type="date"
              label="Date Start"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="form.datefinish"
              type="date"
              label="Date Finish"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-select
              v-model="form.destination"
              label="Destination"
              :items="['student', 'teacher', 'all user']"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-layout row wrap>
            <div>
              <b>Photo</b> <br />
              <input
                type="file"
                name="PHOTO"
                class="form-control-file"
                id="PHOTO"
                required
                accept=".jpg, .png, .jpeg"
                :rules="[(v) => !!v || 'Photo tidak boleh kosong']"
                @change="onFileChange"
              />
              <p></p>
              <img :src="imagePreview" width="200" v-show="showPreview" />
              <br />
              <v-btn
                color="red white--text darken-1"
                @click="
                  form.photo = null;
                  showPreview = false;
                "
                v-if="showPreview"
              >
                Remove Photo
              </v-btn>
            </div>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs3 md2>
                <b>QRCode</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="form.qrcode"
                  :label="`QRCode`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!form.qrcode"
                  v-model="form.infoqr"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!form.qrcode"
                  v-model="form.poinqr"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !form.poinqr || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Photo</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="form.foto"
                  :label="`Photo`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!form.foto"
                  v-model="form.infofoto"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!form.foto"
                  v-model="form.poinfoto"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !form.poinfoto || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Twitter</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="form.twitter"
                  :label="`Twitter`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!form.twitter"
                  v-model="form.infotw"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!form.twitter"
                  v-model="form.pointtw"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !form.pointtw || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Facebook</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="form.facebook"
                  :label="`Facebook`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!form.facebook"
                  v-model="form.infofb"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!form.facebook"
                  v-model="form.poinfb"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !form.poinfb || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Instagram</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="form.instagram"
                  :label="`Instagram`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!form.instagram"
                  v-model="form.infoig"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!form.instagram"
                  v-model="form.poinig"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !form.poinig || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDetail" persistent max-width="800px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Challenge </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-select
              v-model="items.ID_PERIOD"
              :items="periods"
              :item-text="'year_period'"
              :item-value="'ID_PERIOD'"
              label="Periode"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-select
              v-model="items.ID_EVENT_TYPE"
              :items="types"
              :item-text="'EVENT_TYPE'"
              :item-value="'ID_EVENT_TYPE'"
              label="Challenge Type"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-text-field
              v-model="items.NAME_EVENTS"
              label="Nama Challenge"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="items.DESC_EVENTS"
              label="Deskripsi"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="items.DATE_START"
              type="date"
              label="Date Start"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="items.DATE_FINISH"
              type="date"
              label="Date Finish"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-select
              v-model="items.DESTINATION"
              label="Destination"
              :items="['student', 'teacher', 'all user']"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-row justify="center">
              <div id="app">
                <v-img
                  :v-model="image"
                  :label="Photo"
                  :max-height="250"
                  :max-width="150"
                  :src="items.PHOTO_SMALL"
                ></v-img>
                <v-flex xs8>
                  <v-file-input
                    v-model="image"
                    accept=".png, .jpeg, .jpg"
                    :rules="imagesize"
                    type="file"
                    name="PHOTO"
                    class="form-control-file"
                    id="PHOTO"
                    hint="File extentions (.png, .jpg, .jpeg) File Size limits (max: 10mb)"
                    placeholder="Upload image"
                    prepend-icon="mdi-camera"
                    outlined
                    filled
                    @click:clear="items.PHOTO_SMALL = ''"
                    @change="onFileChange2"
                  />
                </v-flex>
              </div>
            </v-row>
            <v-layout row wrap>
              <v-flex xs3 md2>
                <b>QRCode</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="items.qrcode"
                  :label="`QRCode`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!items.qrcode"
                  v-model="items.INFO_QR"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!items.qrcode"
                  v-model="items.PointQR"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !items.PointQR || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Photo</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="items.foto"
                  :label="`Photo`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!items.foto"
                  v-model="items.INFO_PHOTO"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!items.foto"
                  v-model="items.PointPhoto"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) =>
                      !!v || !items.PointPhoto || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Twitter</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="items.twitter"
                  :label="`Twitter`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!items.twitter"
                  v-model="items.INFO_TW"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!items.twitter"
                  v-model="items.PointTW"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !items.PointTW || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Facebook</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="items.facebook"
                  :label="`Facebook`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!items.facebook"
                  v-model="items.INFO_FB"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!items.facebook"
                  v-model="items.PointFB"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !items.PointFB || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 md2>
                <b>Instagram</b>
                <v-checkbox
                  style="margin: -1px"
                  v-model="items.instagram"
                  :label="`Instagram`"
                ></v-checkbox>
                <v-text-field
                  :disabled="!items.instagram"
                  v-model="items.INFO_IG"
                  label="Detail"
                  outlined
                  dense
                  class="item font"
                ></v-text-field>
                <v-text-field
                  :disabled="!items.instagram"
                  v-model="items.PointIG"
                  label="Point"
                  outlined
                  dense
                  class="item font"
                  :rules="[
                    (v) => !!v || !items.PointIG || `Point tidak boleh kosong!`,
                  ]"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus challenge ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
    <script>
import moment from "moment";
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogEdit: false,
      dialogmax: false,
      selectedPeriode: "",
      valid: true,
      headers: [
        { text: "No", align: "start", sortable: true, value: "ID_EVENTS" },
        { text: "Name", value: "NAME_EVENTS" },
        { text: "Description", value: "DESC_EVENTS" },
        { text: "Date Start (Y-m-d H:i:s)", value: "DATE_START" },
        { text: "Date Finish (Y-m-d H:i:s)", value: "DATE_FINISH" },
        { text: "Update Status", value: "actions" },
      ],
      event: new FormData(),
      periode: [],
      periods: [],
      types: [],
      data: [],
      form: {
        idperiode: null,
        name: null,
        description: null,
        type: null,
        datestart: null,
        datefinish: null,
        destination: null,
        notification: false,
        notifmsg: null,
        photo: null,
        PHOTO_SMALL: null,
        qrcode: null,
        poinqr: 0,
        infoqr: "",
        foto: null,
        poinfoto: 0,
        infofoto: "",
        twitter: null,
        pointtw: 0,
        infotw: "",
        facebook: null,
        poinfb: 0,
        infofb: "",
        instagram: null,
        poinig: 0,
        infoig: "",
      },
      items: {
        ID_PERIOD: null,
        NAME_EVENTS: null,
        DESC_EVENTS: null,
        ID_EVENT_TYPE: null,
        DATE_START: null,
        DATE_FINISH: null,
        DESTINATION: null,
        qrcode: null,
        PointQR: 0,
        INFO_QR: "",
        foto: null,
        PointPhoto: 0,
        INFO_PHOTO: "",
        twitter: null,
        PointTW: 0,
        INFO_TW: "",
        facebook: null,
        PointFB: 0,
        INFO_FB: "",
        instagram: null,
        PointIG: 0,
        INFO_IG: "",
        PHOTO_SMALL: null,
        photo: null,
      },
      detailData: null,
      //Image
      imagePreview: null,
      showPreview: false,
      tempGambar: null,
      deleteId: "",
      editId: "",
      image: "",
    };
  },
  methods: {
    setForm() {
      //Menentukan url API untuk simpan/update
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    periodeCombine(item) {
      //Format tanggal menggunakan library moment
      return moment(item).format("DD MMM YYYY");
    },
    readData() {
      //Pemanggilan API untuk mendapat challenge (event)
      var url = this.$api + `/challenge`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.data = response.data.data;
          this.periods = response.data.yearperiod;
          this.types = response.data.chall_type;
        })
        .catch((error) => {
          this.data = [];
          console.log(`${error.response.data.message} ${this.selectedPeriode}`);
        });
    },
    readPeriode() {
      //Pemanggilan API untuk mendapat data periode
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
    editHandler(id) {
      //Pemanggilan API untuk mendapat detail data challenge/event
      var url = this.$api + `/challenge/${id}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detailData = response.data.data;
          this.detailData.DATE_START = moment(
            response.data.data.DATE_START
          ).format("YYYY-MM-DD");
          this.detailData.DATE_FINISH = moment(
            response.data.data.DATE_FINISH
          ).format("YYYY-MM-DD");
          this.items = Object.assign({}, this.detailData);
        });
      this.inputType = "Ubah";
      this.editId = id;
      if (this.items.PHOTO_SMALL != null) {
        this.tempGambar = this.items.PHOTO_SMALL;
        this.showPreview = true;
        this.imagePreview = this.tempGambar;
      }
      this.dialogDetail = true;
    },
    save() {
      //Pemanggilan API untuk menyimpan data challenge/event baru
      this.event.append("ID_PERIOD", this.form.idperiode);
      this.event.append("ID_EVENT_TYPE", this.form.type);
      this.event.append("NAME_EVENTS", this.form.name);
      this.event.append("DESC_EVENTS", this.form.description);
      this.event.append("DATE_START", this.form.datestart);
      this.event.append("DATE_FINISH", this.form.datefinish);
      this.event.append("DESTINATION", this.form.destination);
      this.event.append("PHOTO", this.form.photo);
      this.event.append("PointQR", this.form.poinqr);
      this.event.append("INFO_QR", this.form.infoqr);
      this.event.append("PointPhoto", this.form.poinfoto);
      this.event.append("INFO_PHOTO", this.form.infofoto);
      this.event.append("PointTW", this.form.pointtw);
      this.event.append("INFO_TW", this.form.infotw);
      this.event.append("PointFB", this.form.poinfb);
      this.event.append("INFO_FB", this.form.infofb);
      this.event.append("PointIG", this.form.poinig);
      this.event.append("INFO_IG", this.form.infoig);

      var url = this.$api + "/challenge";
      this.load = true;
      this.$http
        .post(url, this.event, {
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
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    update() {
      //Pemanggilan API untuk update data challenge/event
      this.event.append("ID_PERIOD", this.items.ID_PERIOD);
      this.event.append("ID_EVENT_TYPE", this.items.ID_EVENT_TYPE);
      this.event.append("NAME_EVENTS", this.items.NAME_EVENTS);
      this.event.append("DESC_EVENTS", this.items.DESC_EVENTS);
      this.event.append("DATE_START", this.items.DATE_START);
      this.event.append("DATE_FINISH", this.items.DATE_FINISH);
      this.event.append("DESTINATION", this.items.DESTINATION);
      this.event.append("PHOTO", this.image); //Foto
      this.event.append("PointQR", this.items.PointQR);
      this.event.append("INFO_QR", this.items.INFO_QR);
      this.event.append("PointPhoto", this.items.PointPhoto);
      this.event.append("INFO_PHOTO", this.items.INFO_PHOTO);
      this.event.append("PointTW", this.items.PointTW);
      this.event.append("INFO_TW", this.items.INFO_TW);
      this.event.append("PointFB", this.items.PointFB);
      this.event.append("INFO_FB", this.items.INFO_FB);
      this.event.append("PointIG", this.items.PointIG);
      this.event.append("INFO_IG", this.items.INFO_IG);
      var url = this.$api + "/challenge/" + this.editId;
      this.load = true;
      this.$http
        .post(url, this.event, {
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
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    close() {
      this.dialog = false;
      this.resetForm();
      this.dialogEdit = false;
      this.dialogmax = false;
      this.dialogConfirm = false;
      this.dialogDetail = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    deleteData() {
      //menghapus data
      var url = this.$api + "/challenge/" + this.deleteId;
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
    resetForm() {
      this.form = {
        idperiode: null,
        name: null,
        description: null,
        type: null,
        datestart: null,
        datefinish: null,
        destination: null,
        notification: false,
        notifmsg: null,
        photo: null,
        PHOTO_SMALL: null,
        qrcode: null,
        poinqr: 0,
        infoqr: "",
        foto: null,
        poinfoto: 0,
        infofoto: "",
        twitter: null,
        pointtw: 0,
        infotw: "",
        facebook: null,
        poinfb: 0,
        infofb: "",
        poinig: 0,
        infoig: "",
      };
    },
    onFileChange(event) {
      //Menampilkan gambar yang diupload
      this.form.photo = event.target.files[0];
      //console.log("di onfile change", this.form.photo);

      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          this.showPreview = true;
          this.imagePreview = reader.result;
        }.bind(this),
        false
      );

      if (this.form.photo) {
        if (/\.(jpe?g|png|gif)$/i.test(this.form.photo.name)) {
          //console.log("loader", this.form.photo);

          reader.readAsDataURL(this.form.photo);
        }
      }
    },
    onFileChange2(e) {
      //Menampilkan gambar yang diupload
      this.items.PHOTO_SMALL = URL.createObjectURL(this.image);

      console.log(e.target.files[0]);
      this.image = e.target.files[0];

      let reader = new FileReader();

      if (this.image) {
        if (/\.(jpe?g|png|gif)$/i.test(this.image)) {
          //console.log("loader", this.form.photo);

          reader.readAsDataURL(this.image);
        }
      }
    },
  },
  computed: {
    filteredItems() {
      return this.data.filter((i) => {
        return !this.selectedPeriode || i.ID_PERIOD === this.selectedPeriode;
      });
    },
  },
  mounted() {
    this.readPeriode();
    this.readData();
  },
};
</script>

<style scoped>
.styled-input {
  width: 230px;
}
@media (min-width: 56.25em) {
  /* 900px */
  .flex-parent {
    display: flex;
  }
}
.flex-child {
  flex: 1 1 0;
}
</style>