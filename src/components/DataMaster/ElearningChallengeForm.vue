<template>
  <v-main class="font">
    <h2>{{ inputType }} E-Learning Challenge</h2>
    <br /> 
    <!-- JANGAN DIHAPUS (untuk checkbox update yang aneh)-->
    <span hidden> {{hiddenTextLimit}} - {{hiddenTextOldVer}} - {{hiddenTextOldEvent}} - {{hiddenTextNewVer}} -  {{hiddenTextNewEvent}}</span>
    <!-- ------------- -->
    <v-form ref="form" lazy-validation>
      <div class="flex-parent">
        <div class="flex-child mx-2">
          <v-select
            v-model="editedItem.ID_PERIOD"
            :items="periode"
            outlined
            dense
            label="Periode"
            item-value="ID_PERIOD"
            :rules="[(v) => !!v || `Periode tidak boleh kosong!`]"
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
          <v-text-field
            v-model="editedItem.NAME"
            label="Name"
            outlined
            dense
            placeholder="E-Learning Challenge Name"
            class="item font"
            :rules="[(v) => !!v || `Name tidak boleh kosong!`]"
          ></v-text-field>
          <v-textarea
            v-model="editedItem.DESC"
            label="Description"
            outlined
            dense
            class="item font"
            :rules="[(v) => !!v || `Description tidak boleh kosong!`]"
          ></v-textarea>
          <v-text-field
            v-model="editedItem.POINT"
            label="Point"
            outlined
            dense
            type="number"
            class="item font"
            :rules="[(v) => !!v || `Point tidak boleh kosong!`]"
          ></v-text-field>
          <v-select
            v-model="editedItem.DESTINATION"
            outlined
            dense
            :items="['student', 'teacher', 'all user']"
            label="Destination"
            :rules="[(v) => !!v || `Destination tidak boleh kosong!`]"
          ></v-select>

          <!-- Limit log object -->
          <v-checkbox
            style="margin: -1px"
            v-model="editedItem.LIMIT_LOG"
            :label="`Limit Log Object`"
            @change="changeState(editedItem.LIMIT_LOG, 'Limit')"
          ></v-checkbox>
          <v-text-field
            v-model="editedItem.LIMIT_LOG_VAL"
            :disabled="!editedItem.LIMIT_LOG"
            outlined
            dense
            placeholder="null"
            class="item font"
            :rules="[
              (v) =>
                !!v || !editedItem.LIMIT_LOG || `Limit log tidak boleh kosong!`,
            ]"
          ></v-text-field>
        </div>

        <div class="flex-child mx-2" style="margin-top: -6.5px">
          <b>Event Type</b>

          <!-- Old version -->
          <v-checkbox
            style="margin: -1px"
            v-model="editedItem.OLD_VER"
            :label="`Old version log kuliah db`"
            @change="changeState(editedItem.OLD_VER, 'Old Ver')"
          ></v-checkbox>
          <v-select
            v-model="editedItem.OLD_EVENT"
            label="Events"
            :disabled="!editedItem.OLD_VER || editedItem.OLD_EVENT_TYPE_AVAIL"
            outlined
            dense
            :items="oldEvents"
            class="item font"
            :rules="[
              (v) =>
                !!v ||
                !editedItem.OLD_VER ||
                editedItem.OLD_EVENT_TYPE_AVAIL ||
                `Event tidak boleh kosong!`,
            ]"
            :item-text="(item) => `${item.module} - ${item.action}`"
            :item-value="(item) => `${item.id}-${item.module}-${item.action}`"
          ></v-select>

          <v-checkbox
            style="margin: -1px"
            v-model="editedItem.OLD_EVENT_TYPE_AVAIL"
            :disabled="!editedItem.OLD_VER"
            :label="`Check, if event type not available in the list`"
            @change="changeState(editedItem.OLD_EVENT_TYPE_AVAIL, 'Old Event')"
          ></v-checkbox>
          <v-text-field
            v-model="editedItem.OLD_MODULE"
            :disabled="!editedItem.OLD_EVENT_TYPE_AVAIL"
            label="Module"
            outlined
            dense
            class="item font"
            :rules="[
              (v) =>
                !!v ||
                !editedItem.OLD_EVENT_TYPE_AVAIL ||
                `Module tidak boleh kosong!`,
            ]"
          ></v-text-field>
          <v-text-field
            v-model="editedItem.OLD_ACTION"
            :disabled="!editedItem.OLD_EVENT_TYPE_AVAIL"
            label="Action"
            outlined
            dense
            class="item font"
            :rules="[
              (v) =>
                !!v ||
                !editedItem.OLD_EVENT_TYPE_AVAIL ||
                `Action tidak boleh kosong!`,
            ]"
          ></v-text-field>

          <!-- New version -->
          <v-checkbox
            style="margin: -1px"
            v-model="editedItem.NEW_VER"
            :label="`New version log kuliah db`"
            @change="changeState(editedItem.NEW_VER, 'New Ver')"
          ></v-checkbox>

          <v-autocomplete
            v-model="editedItem.NEW_EVENT"
            :disabled="!editedItem.NEW_VER || editedItem.NEW_EVENT_TYPE_AVAIL"
            label="Events"
            outlined
            dense
            :items="events"
            class="item font"
            :rules="[
              (v) =>
                !!v ||
                !editedItem.NEW_VER ||
                editedItem.NEW_EVENT_TYPE_AVAIL ||
                `Event tidak boleh kosong!`,
            ]"
            :item-text="(item) => `${item.NAME_DISPLAY} - ${item.NAME_CODE}`"
            :item-value="
              (item) =>
                `${item.ID_MDL_EVENT_LIST}-${item.NAME_DISPLAY} - ${item.NAME_CODE}-${item.NAME_CODE}`
            "
          >
          </v-autocomplete>

          <v-checkbox
            style="margin: -1px"
            v-model="editedItem.NEW_EVENT_TYPE_AVAIL"
            :disabled="!editedItem.NEW_VER"
            :label="`Check, if event type not available in the list`"
             @change="changeState(editedItem.NEW_EVENT_TYPE_AVAIL, 'New Event')"
          ></v-checkbox>
          <v-text-field
            v-model="editedItem.NEW_DISPLAY_NAME"
            :disabled="!editedItem.NEW_EVENT_TYPE_AVAIL"
            label="Display Name Event"
            outlined
            dense
            class="item font"
            :rules="[
              (v) =>
                !!v ||
                !editedItem.NEW_EVENT_TYPE_AVAIL ||
                `Display Name tidak boleh kosong!`,
            ]"
          ></v-text-field>
          <v-text-field
            v-model="editedItem.NEW_CODE_NAME"
            :disabled="!editedItem.NEW_EVENT_TYPE_AVAIL"
            label="Code Name Event"
            outlined
            dense
            class="item font"
            :rules="[
              (v) =>
                !!v ||
                !editedItem.NEW_EVENT_TYPE_AVAIL ||
                `Code Name tidak boleh kosong!`,
            ]"
            hint="Example : \assignsubmission_comments\event\comment_created"
          ></v-text-field>

          <div v-if="inputType == 'New'">
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
      </div>
      <br />
      <v-btn color="blue darken-1" text @click="moveToElearn()"> Cancel </v-btn>
      <v-btn color="blue darken-1" text @click="setForm()"> Save </v-btn>
    </v-form>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
import moment from "moment";

export default {
  props: ["inputType", "editId", "item"],
  data() {
    return {
      editedItem: {
        NAME: null,
        DESC: null,
        STATUS: null,
        POINT: null,
        DESTINATION: null,
        MAX_COUNT: null,
        ID_PERIOD: null,
        ID_EVENTNAME: null,
        ID_CATEGORY: null,
        EVENTNAME_DISPLAY: null,
        EVENTNAME_CODE: null,
        NOTIFICATION: false,
        //Limit Log Object
        LIMIT_LOG: false,
        LIMIT_LOG_VAL: null,
        //Event Type Old Version
        OLD_VER: false,
        OLD_EVENT: null,
        OLD_MODULE: null,
        OLD_ACTION: null,
        OLD_EVENT_TYPE_AVAIL: false,
        //Event Type New Version
        NEW_VER: false,
        NEW_EVENT: null,
        NEW_DISPLAY_NAME: null,
        NEW_CODE_NAME: null,
        NEW_EVENT_TYPE_AVAIL: false,
        MESSAGE: null,
        NAME_CODE: null,
      },
      periode: [],
      events: [],
      oldEvents: [],
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
      //Temp
      hiddenTextOldVer: "",
      hiddenTextOldEvent:"",
      hiddenTextNewVer:"",
      hiddenTextNewEvent:"",
      hiddenTextLimit: "",
    };
  },
  created() {
    if (this.inputType == "Update") this.editItem();
    this.readPeriode();
    this.readEventList();
    this.readKuliahLog();
  },

  methods: {
    changeState(checkbox, jenis){
      //Method ini dibuat utk mengganti state checkbox saat update karena entah kenapa saat update itu checkboxnya tidak mau berganti state.
      if(checkbox == false) {
        checkbox = false;
        switch(jenis) { //Entah mengapa diberi perintah setelah mengganti state itu baru bisa ganti state. Dan harus punya variabel masing2.
          case "Limit":
            this.hiddenTextLimit = "Checkbox Limit False";
            break;
          case "Old Ver":
            this.editedItem.OLD_EVENT_TYPE_AVAIL = false;
            this.hiddenTextOldVer = "Checkbox Old Ver False";
            break;
          case "Old Event":
            this.hiddenTextOldEvent = "Checkbox Old Event False";
            break;
          case "New Ver":
            this.editedItem.NEW_EVENT_TYPE_AVAIL = false;
            this.hiddenTextNewVer = "Checkbox New Ver False";
            break;
          case "New Event":
            this.hiddenTextNewEvent = "Checkbox New Event False";
            break;
      
        }
      }
      else {
        checkbox = true;
        switch(jenis) {
          case "Limit":
            this.hiddenTextLimit = "Checkbox Limit True";
            break;
          case "Old Ver":
            this.hiddenTextOldVer = "Checkbox Old Ver True";
            break;
          case "Old Event":
            this.hiddenTextOldEvent = "Checkbox Old Event True";
            break;
          case "New Ver":
            this.hiddenTextNewVer = "Checkbox New Ver True";
            break;
          case "New Event":
            this.hiddenTextNewEvent = "Checkbox New Event True";
            break;
        }
      }
    
    },

    formattedDate(item) {
      //Mengganti format tanggal menggunakan library moment
      return moment(item).format("DD MMM YYYY");
    },

    eventListCombine(item) {
      //Menyambungkan string
      return `${item.NAME_DISPLAY}-${item.NAME_CODE}`;
    },

    readEventList() {
      //Pemanggilan API untuk get data event dari situs kuliah
      var url = this.$api + "/moodle-event-list";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.events = response.data.data;
          // console.log(this.events);
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    readKuliahLog() {
      //Pemanggilan API untuk get data event lama (old) dari situs kuliah
      var url = this.$api + "/kuliah-log-display";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.oldEvents = response.data.data;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    readPeriode() {
      //Pemanggilan API untuk get data periode
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

    editItem() {
      //Inisialisasi variabel/input field dengan data yang dipilih utk diedit
      this.editedItem = Object.assign({}, this.item);
      //Limit Log
      if (this.item.MAX_COUNT != null) {
        this.editedItem.LIMIT_LOG = true;
        this.editedItem.LIMIT_LOG_VAL = this.item.MAX_COUNT;
      } else {
        this.editedItem.LIMIT_LOG = false;
      }

      //Untuk Old Ver
      if (this.item.ID_CATEGORY > 0) {
        this.editedItem.OLD_VER = true;
        this.editedItem.OLD_EVENT = `${this.editedItem.ID_CATEGORY}-${this.editedItem.MODULE}-${this.editedItem.ACTION}`;
      } else if (this.item.ID_CATEGORY == 0) {
        this.editedItem.OLD_VER = true;
        this.editedItem.OLD_EVENT_TYPE_AVAIL = true;
        this.editedItem.OLD_MODULE = this.item.MODULE;
        this.editedItem.OLD_ACTION = this.item.ACTION;
      } else {
        this.editedItem.OLD_VER = false;
        this.editedItem.OLD_EVENT_TYPE_AVAIL = false;
      }

      //Untuk New Ver
      if (this.item.ID_EVENTNAME != null ) {
        this.editedItem.NEW_VER = true;
        this.editedItem.NEW_EVENT = `${this.editedItem.ID_EVENTNAME}-${this.editedItem.EVENTNAME_DISPLAY}-${this.editedItem.EVENTNAME_CODE}`;
      } else if (this.item.ID_EVENTNAME == null){
         this.editedItem.NEW_VER = false;
      } else {
        this.editedItem.NEW_VER = true;
        this.editedItem.NEW_EVENT_TYPE_AVAIL = true;
        this.editedItem.NEW_DISPLAY_NAME = this.item.EVENTNAME_DISPLAY;
        this.editedItem.NEW_CODE_NAME = this.item.EVENTNAME_CODE;
      }
    },

    moveToElearn() {
      //Pindah halaman
      this.$router.push("/elearn-challenge-manager");
    },
    setForm() {
      //Set url API untuk simpan/update
      var url =
        this.inputType == "New"
          ? "/elearn-challenge"
          : `/elearn-challenge/${this.editId}`;
      this.save(url);
    },

    save(urlApi) {
      //Pemanggilan API untuk simpan/update data
      if (this.$refs.form.validate()) {
        //FORM APPEND
        this.formData.append("NAME", this.editedItem.NAME);
        this.formData.append("DESC", this.editedItem.DESC);
        this.formData.append("POINT", this.editedItem.POINT);
        this.formData.append("DESTINATION", this.editedItem.DESTINATION);
        this.formData.append("ID_PERIOD", this.editedItem.ID_PERIOD);
        //event type
        this.formData.append("OLD_VER", this.editedItem.OLD_VER);
        this.formData.append("NEW_VER", this.editedItem.NEW_VER);
        this.formData.append(
          "OLD_EVENT_TYPE_AVAIL",
          this.editedItem.OLD_EVENT_TYPE_AVAIL
        );
        this.formData.append(
          "NEW_EVENT_TYPE_AVAIL",
          this.editedItem.NEW_EVENT_TYPE_AVAIL
        );
        this.formData.append("LIMIT_LOG", this.editedItem.LIMIT_LOG);
        this.formData.append("LIMIT_LOG_VAL", this.editedItem.LIMIT_LOG_VAL);
        this.formData.append("OLD_MODULE", this.editedItem.OLD_MODULE);
        this.formData.append("OLD_ACTION", this.editedItem.OLD_ACTION);
        this.formData.append("OLD_EVENT", this.editedItem.OLD_EVENT);
        this.formData.append("NEW_EVENT", this.editedItem.NEW_EVENT);
        this.formData.append(
          "NEW_DISPLAY_NAME",
          this.editedItem.NEW_DISPLAY_NAME
        );
        this.formData.append("NEW_CODE_NAME", this.editedItem.NEW_CODE_NAME);
        this.formData.append("NOTIFICATION", this.editedItem.NOTIFICATION);
        this.formData.append("MESSAGE", this.editedItem.MESSAGE);

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
            window.setTimeout(this.moveToElearn, 700);
          })
          .catch((error) => {
            console.log(error.response.data.message);
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
          });
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