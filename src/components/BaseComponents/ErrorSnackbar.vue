<template>
  <v-snackbar v-model="snackbarStatus" :color="color" timeout="2000" bottom>
    {{ errorMessage }}
  </v-snackbar>
</template>

<script>
export default {
  props: {
    errorMessage: String,
    color: String,
    snackbar: Boolean,
  },
  data(){
      return {
          currentSnackbar: false,
      }
  },
  computed: {
    snackbarStatus: {
      get() {
        return this.currentSnackbar;
      },
      set(value) {
        this.currentSnackbar = value;
      },
    },
  },
};
</script>