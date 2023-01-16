<template>
  <v-main class="font">
    <h2>{{ inputType }} News</h2>
    <br />
    <v-form ref="form" lazy-validation>
      <div class="flex-parent">
        <div class="flex-child mx-2">
          <v-text-field
            v-model="editedItem.NEWS_TITLE"
            label="News Title"
            outlined
            dense
            class="item font"
            :rules="[(v) => !!v || `Title tidak boleh kosong!`]"
          ></v-text-field>
          <v-textarea
            v-model="editedItem.NEWS_DESCRIPTION"
            label="News Description"
            outlined
            dense
            class="item font"
            :rules="[(v) => !!v || `Description tidak boleh kosong!`]"
          ></v-textarea>
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
                editedItem.PHOTO = null;
                showPreview = false;
              "
              v-if="showPreview"
            >
              Remove Photo
            </v-btn>
          </div>
        </div>
        <div
          class="flex-child mx-2"
          style="margin-top: -6.5px"
          v-if="inputType == 'New'"
        >
          <b>Notification</b>
          <v-checkbox
            style="margin: -1px"
            v-model="editedItem.NOTIFICATION"
            :label="`Send Notification`"
          ></v-checkbox>
          <v-textarea
            :disabled="!editedItem.NOTIFICATION"
            v-model="editedItem.MESSAGE"
            label="Message"
            outlined
            dense
            class="item font"
            :rules="[
              (v) =>
                !!v ||
                !editedItem.NOTIFICATION ||
                `Message tidak boleh kosong!`,
            ]"
          ></v-textarea>
        </div>
      </div>
      <br />
      <v-btn color="blue darken-1" text @click="moveToNews()"> Cancel </v-btn>
      <v-btn color="blue darken-1" text @click="setForm()"> Save </v-btn>
    </v-form>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
import moment from "moment";
// import moment from 'moment'

export default {
  props: ["inputType", "editId", "item"],
  data() {
    return {
      editedItem: {
        NEWS_TITLE: null,
        NEWS_DESCRIPTION: null,
        PHOTO: null,
        PHOTO_SMALL: null,
        DATE: null,
        NOTIFICATION: false,
        MESSAGE: null,
      },
      //Image
      imagePreview: null,
      showPreview: false,
      tempGambar: null,
      //Form
      formData: new FormData(),
      //Snackbar
      snackbar: null,
      color: null,
      error_message: "",
      //Periode
      activePeriode: null,
    };
  },
  created() {
    this.editItem();
    this.readPeriode();
  },
  methods: {
    editItem() {
      //Inisialisasi input field/variabel dengan data yang akan diedit
      this.editedItem = Object.assign({}, this.item);
      //munculin gambar di dialog edit menu
      if (this.editedItem.PHOTO_SMALL != null) {
        this.tempGambar = this.editedItem.PHOTO_SMALL;
        this.showPreview = true;
        this.imagePreview = `${this.tempGambar}`;
        //this.imagePreview = `${this.$imageUpload}${this.tempGambar}`;
      }
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
          this.activePeriode = response.data.activePeriode.ID_PERIOD;
          //console.log(this.activePeriode);
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    moveToNews() {
      //Pindah halaman ke tabel news
      this.$router.push("/news-manager");
    },
    setForm() {
      //Menentukan url API untuk simpan/update
      var url =
        this.inputType == "New"
          ? "/news-manager"
          : `/news-manager/${this.editId}`;
      this.save(url);
    },

    save(urlApi) {
      //Pemangillan API untuk menyimpan data berita
      if (this.$refs.form.validate()) {
        this.formData.append("NEWS_TITLE", this.editedItem.NEWS_TITLE);
        this.formData.append(
          "NEWS_DESCRIPTION",
          this.editedItem.NEWS_DESCRIPTION
        );
        this.formData.append("PHOTO", this.editedItem.PHOTO);
        this.formData.append("DATE", moment().format("YYYY-MM-DD hh:mm:ss"));
        this.formData.append("NOTIFICATION", this.editedItem.NOTIFICATION);
        this.formData.append("MESSAGE", this.editedItem.MESSAGE);
        this.formData.append("ID_PERIOD", this.activePeriode);

        this.valid = true;
        var url = `${this.$api}${urlApi}`;
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
            window.setTimeout(this.moveToNews, 700);
          })
          .catch((error) => {
            if (this.editedItem.PHOTO == null) {
              console.log(error.response.data.message.PHOTO[0]);
              this.error_message = error.response.data.message.PHOTO[0];
            } else {
              console.log(error.response.data);
              this.error_message = error.response.data.message;
            }
            this.color = "red";
            this.snackbar = true;
          });
      }
    },
    onFileChange(event) {
      //Untuk memunculkan gambar yang diupload
      /*
    Set the local file variable to what the user has selected.
    */
      this.editedItem.PHOTO = event.target.files[0];
      //console.log("di onfile change", this.editedItem.PHOTO);

      let reader = new FileReader();

      /*
    Add an event listener to the reader that when the file
    has been loaded, we flag the show preview as true and set the
    image to be what was read from the reader.
    */
      reader.addEventListener(
        "load",
        function () {
          this.showPreview = true;
          this.imagePreview = reader.result;
        }.bind(this),
        false
      );

      /*
    Check to see if the file is not empty.
    */
      if (this.editedItem.PHOTO) {
        /*
            Ensure the file is an image file.
        */
        if (/\.(jpe?g|png|gif)$/i.test(this.editedItem.PHOTO.name)) {
          //console.log("loader", this.editedItem.PHOTO);
          /*
            Fire the readAsDataURL method which will read the file in and
            upon completion fire a 'load' event which we will listen to and
            display the image in the preview.
            */
          reader.readAsDataURL(this.editedItem.PHOTO);
        }
      }
    },
  },
};
</script>

<style scoped>
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