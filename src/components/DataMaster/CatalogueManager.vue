<!-- @format --> 

<template>
  <v-main class="list">
    <h1 align="center" class="mb-5">Catalogue Manager</h1>
    <v-template>
      <v-btn outlined dense @click="moveTo()" class="styled-input mb-3"
        ><v-icon dark> mdi-cog </v-icon>
        Catalogue Type
      </v-btn>
    </v-template>
    <v-template>
      <v-btn outlined dense @click="moveTo1()" class="styled-input mb-3"
        ><v-icon dark> mdi-warehouse </v-icon>
        Catalogue Stock
      </v-btn>
    </v-template>
    <v-template>
      <v-btn
        outlined
        dense
        @click="dialogReport = true"
        class="styled-input mb-3"
        ><v-icon dark> mdi-clipboard-list-outline </v-icon>
        Laporan Stock
      </v-btn>
    </v-template>
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
          Tambah Katalog
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="filteredItems" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            color="yellow darken-2"
            small
            class="mr-2"
            @click="editHandler(item.ID_CATALOGUE)"
            >mdi-pencil</v-icon
          >
          <v-icon
            color="red darken-2"
            small
            class="mr-2"
            @click="deleteHandler(item.ID_CATALOGUE)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Katalog </v-card-title>
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
            <v-text-field
              v-model="form.name"
              label="Nama Produk"
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
            <v-select
              v-model="form.type"
              :items="types"
              :item-text="'CTG_TYPE'"
              :item-value="'ID_CTG_TYPE'"
              label="Catalogue Type"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-text-field
              v-model="form.points"
              label="Points Requirement"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="form.stock"
              label="Stock"
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
            <!-- <div
              class="flex-child mx-2"
              style="margin-top: -6.5px"
              v-if="inputType == 'Tambah'"
            >
              <b>Notification</b>
              <v-checkbox
                style="margin: -1px"
                v-model="form.notification"
                :label="`Send Notification`"
              ></v-checkbox>
              <v-textarea
                :disabled="!form.notification"
                v-model="form.notifmsg"
                label="Message"
                outlined
                dense
                class="item font"
                :rules="[
                  (v) =>
                    !!v || !form.notification || `Message tidak boleh kosong!`,
                ]"
              ></v-textarea>
            </div> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDetail" persistent max-width="600px">
      <v-card class="font">
        <v-card-title> {{ inputType }} Katalog </v-card-title>
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
            <v-text-field
              v-model="items.NAME_CATALOGUE"
              label="Nama Produk"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="items.DESCRIPTION"
              label="Deskripsi"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-select
              v-model="items.ID_CTG_TYPE"
              :items="types"
              :item-text="'CTG_TYPE'"
              :item-value="'ID_CTG_TYPE'"
              label="Catalogue Type"
              outlined
              dense
              class="item font mx-2"
            ></v-select>
            <v-text-field
              v-model="items.POINT_REQ"
              label="Points Requirement"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="items.STOCK"
              label="Stock"
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
        <v-card-text> Anda yakin ingin menghapus katalog ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogReport" persistent max-width="400px">
      <v-card class="font">
        <v-card-title> Laporan Stock Katalog </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <!-- <v-text-field
              v-model="form.datestart"
              type="date"
              label="Tanggal Awal"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field>
            <v-text-field
              v-model="form.datefinish"
              type="date"
              label="Tanggal Akhir"
              outlined
              dense
              class="item font mx-2"
            ></v-text-field> -->
            <v-select
              v-model="form.periodeLaporan"
              :items="periode"
              label="Pilih Periode Laporan"
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setLaporan()">
            Generate Laporan
          </v-btn>
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
      dialogReport: false,
      valid: true,
      headers: [
        {
          text: "ID Catalogue",
          align: "start",
          sortable: true,
          value: "ID_CATALOGUE",
        },
        { text: "Name", value: "NAME_CATALOGUE" },
        { text: "Points Requirement", value: "POINT_REQ" },
        { text: "Stock", value: "STOCK" },
        { text: "Actions", value: "actions" },
      ],
      catalogue: new FormData(),
      data: [],
      selectedPeriode: "",
      periode: [],
      form: {
        idperiode: null,
        name: null,
        description: null,
        type: null,
        points: null,
        stock: null,
        destination: null,
        notification: false,
        notifmsg: null,
        photo: null,
        PHOTO_SMALL: null,
        datestart: null,
        datefinish: null,
        periodeLaporan: null,
      },
      items: {
        ID_PERIOD: null,
        NAME_CATALOGUE: null,
        DESCRIPTION: null,
        ID_CTG_TYPE: null,
        POINT_REQ: null,
        STOCK: null,
        DESTINATION: null,
        PHOTO_SMALL: null,
        photo: null,
      },
      detailData: null,
      //Image
      imagePreview: "",
      showPreview: false,
      tempGambar: null,
      deleteId: "",
      editId: "",
      image: "",
      //Laporan
      datestart: null,
      datefinish: null,
      periodeLaporan: null,
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
      //Pemanggilan API untuk mendapatkan data katalog
      var url = this.$api + `/catalogue`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.data = response.data.data;
          this.periods = response.data.yearperiod;
          this.types = response.data.cat_type;
        })
        .catch((error) => {
          this.data = [];
          console.log(`${error.response.data.message} ${this.selectedPeriode}`);
        });
    },
    readPeriode() {
      //Pemanggilan API untuk mendapatkan data periode
      var url = this.$api + "/periode";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.periode = response.data.data;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    editHandler(id) {
      //Pemanggilan API untuk mendapatkan data detail katalog berdasarkan ID saat akan edit data
      var url = this.$api + `/catalogues/${id}`;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detailData = response.data.data;
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
      //Pemanggilan API untuk menyimpan data katalog
      this.catalogue.append("ID_PERIOD", this.form.idperiode);
      this.catalogue.append("NAME_CATALOGUE", this.form.name);
      this.catalogue.append("DESCRIPTION", this.form.description);
      this.catalogue.append("ID_CTG_TYPE", this.form.type);
      this.catalogue.append("POINT_REQ", this.form.points);
      this.catalogue.append("STOCK", this.form.stock);
      this.catalogue.append("DESTINATION", this.form.destination);
      this.catalogue.append("PHOTO", this.form.photo);

      var url = this.$api + "/catalogue";
      this.load = true;
      this.$http
        .post(url, this.catalogue, {
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
      //Pemanggilan API untuk update data katalog
      this.catalogue.append("ID_PERIOD", this.items.ID_PERIOD);
      this.catalogue.append("NAME_CATALOGUE", this.items.NAME_CATALOGUE);
      this.catalogue.append("DESCRIPTION", this.items.DESCRIPTION);
      this.catalogue.append("ID_CTG_TYPE", this.items.ID_CTG_TYPE);
      this.catalogue.append("POINT_REQ", this.items.POINT_REQ);
      this.catalogue.append("STOCK", this.items.STOCK);
      this.catalogue.append("DESTINATION", this.items.DESTINATION);
      this.catalogue.append("PHOTO", this.image);
      var url = this.$api + "/catalogue/" + this.editId;
      this.load = true;
      this.$http
        .post(url, this.catalogue, {
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
    setLaporan() {
      //Membuat laporan katalog
      window.open(
        // `${this.$api}/laporanstok?datestart=${this.form.datestart}&datefinish=${this.form.datefinish}`,
        // "_blank"
        `${this.$api}/laporanstok?periodeLaporan=${this.form.periodeLaporan}`,
        "_blank"
      );
      this.close();
      this.readData(); //mengambil data
      this.resetForm();
    },
    deleteData() {
      //menghapus data
      var url = this.$api + "/catalogue/" + this.deleteId;
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
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.inputType = "Tambah";
      this.resetForm();
      this.dialog = false;
      this.dialogEdit = false;
      this.dialogmax = false;
      this.dialogDetail = false;
      this.dialogConfirm = false;
      this.dialogReport = false;
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        idperiode: null,
        name: null,
        description: null,
        type: null,
        points: null,
        stock: null,
        destination: null,
        photo: null,
      };
    },
    onFileChange(event) {
      //Untuk menampilkan gambar setelah diupload
      this.form.photo = event.target.files[0];

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
      //Untuk menampilkan gambar setelah diupload
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
    moveTo() {
      this.$router.push({
        name: "Catalogue Type",
        params: {},
      });
    },
    moveTo1() {
      this.$router.push({
        name: "Catalogue Stock",
        params: {},
      });
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
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
</style>