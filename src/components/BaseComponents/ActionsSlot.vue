<template>
  <div v-if="!messageManager">
    <v-icon
      color="yellow darken-2"
      small
      class="mr-2"
      @click="editHandler(item)"
      >mdi-pencil</v-icon
    >
    <v-icon small color="red" @click="deleteHandler(item)" :disabled="kodeKirim"
      >mdi-delete</v-icon
    >
    <v-btn
      small
      text
      @click="isiQRCode(item)"
      v-if="packageForm"
    >
      <v-icon> mdi-qrcode-scan </v-icon>
    </v-btn>

     <v-icon v-if="newsManager" small color="yellow darken-3" @click="sendNotif(item)"> mdi-bell </v-icon>
  </div>
  <div v-else>
     <v-icon
      color="yellow darken-2"
      small
      class="mr-2"
      @click="openMessage(item)"
      >mdi-chat</v-icon
    >
  </div>
</template>

<script>
export default {
  props: ["item", "packageForm", "kodeKirim", "newsManager", "messageManager"],
  methods: {
    deleteHandler(item) {
      this.$emit("deleteHandler", item);
    },
    editHandler(item) {
      this.$emit("editHandler", item);
    },
    isiQRCode(item) {
      this.$emit("isiQRCode", item);
    },
    sendNotif(item) {
      this.$emit("sendNotif", item);
    },
    openMessage (item) {
      this.$emit("openMessage", item);
    },
  },
};
</script>