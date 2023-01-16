<template>
  <v-main class="font">
    <h1 align="center" class="mb-5">Message Manager</h1>
    <base-table
      :headers="headers"
      url="message/sender-unique"
      :periodeManager="true"
      :messageManager="true"
      btnName="Message"
      ref="baseTable"
      @openMessage="openMessage"
      idName="id"
    />
    <v-dialog
      v-model="dialogMessage"
      persistent
      max-width="700px"
      max-height="400px"
    >
      <v-card style="font-family: 'Montserrat', sans-serif" class="parent">
        <v-app-bar flat>
          <v-toolbar-title class="text-h6 black--text pl-0">
            {{ id_sender }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="black" icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <div class="chat-room-height" v-chat-scroll>
          <div v-for="(m, i) in message" :key="`message-${i}`" id="chat">
            <v-card-text>
              <div style="margin-left: auto" v-if="m.id_sender !== id_sender">
                <div class="bubble-chat sender">
                  {{ m.message }}
                </div>
                <span style="display: flex">
                  <span style="margin-left: auto"
                    >{{ formattedDate(m.created_at) }}
                  </span>
                </span>
              </div>
              <div style="margin-right: auto" v-else>
                <div class="bubble-chat receiver">{{ m.message }}</div>
                {{ formattedDate(m.created_at) }}
              </div>
            </v-card-text>
          </div>
        </div>
        <v-divider></v-divider>
        <br />
        <v-card-text>
          <v-textarea v-model="editedItem.message" label="Enter a message">
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue lighten-2" text @click="sendMessage()">
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import BaseTable from "../BaseComponents/BaseTable.vue";
import moment from "moment";

export default {
  components: { BaseTable },
  data() {
    return {
      headers: [
        {
          text: "ID User",
          align: "start",
          sortable: true,
          value: "id_sender",
        },
        {
          text: "Nama User",
          value: "NAME",
        },
        {
          text: "New Messages?",
          value: "opened",
        },
        { text: "Actions", value: "actions" },
      ],
      inputType: "New",
      editedItem: {
        message: null,
        device: null,
        version: null,
        id_sender: null,
        id_receiver: null,
      },
      id_sender: null,
      //Form untuk save dan update
      formData: new FormData(),
      valid: true,
      menuStartDate: false,
      menuFinishDate: false,
      editId: "",
      //Dialog
      dialogMessage: false,
      //Message
      message: [],
      namaAdmin: null,
      //warna bubble
      blue: "#0d5895",
      orange: "#f1ad1b",
    };
  },
  methods: {
    formattedDate(item) {
      return moment(item).format("DD MMM YYYY | hh:mm");
    },
    closeDialog() {
      this.editedItem.message = null;
      this.dialogMessage = false;
      this.message = [];
      this.$refs.baseTable.readData();
    },
    openMessage(item) {
      //Membuka modal dialog yang berisi data chat
      this.id_sender = Object.assign({}, item).id_sender;
      this.updateOpened(this.id_sender);
      //console.log(this.id_sender)
      this.readMessage();
      this.namaAdmin = localStorage.getItem("username");
      this.dialogMessage = true;
    },

    readMessage() {
      //Pemangillan API untuk mendapat data chat antara admin dan para user
      var url = this.$api + `/message/` + this.id_sender;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.message = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    sendMessage() {
      //Pemangillan API untuk menyimpan chat yang dikirim
      this.formData.append("message", this.editedItem.message);
      this.formData.append("id_sender", localStorage.getItem("id")); //sender selalu admin
      this.formData.append("id_receiver", this.id_sender); //receiver selalu mhs

      var url = this.$api + "/message";
      this.$http
        .post(url, this.formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.readMessage();
          this.editedItem.message = null;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
          this.color = "red";
          this.snackbar = true;
        });
      //}
    },

    updateOpened(userId) {
      //Pemangillan API untuk update status chat dari unopened (0) menjadi opened (1)
      var url = this.$api + "/message/opened/" + userId;
      this.$http
        .post(url, this.formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.readMessage();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
          // this.color = "red";
          // this.snackbar = true;
        });
      //}
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}

.chat-room-height {
  max-height: 30em;
  overflow-x: hidden;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.bubble-chat {
  min-width: 20%;
  max-width: 60%;
  padding: 10px;
  margin-top: -20px;
  border-radius: 10px;
}

.sender {
  background-color: #0d5895;
  color: white;
  margin-left: auto;
}

.receiver {
  background-color: #f1ad1b;
  color: #1d1d1d;
  margin-right: auto;
}
</style>