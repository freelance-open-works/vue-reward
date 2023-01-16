<template>
  <v-main class="font">
    <h1>Selamat Datang di Dashboard</h1> 
  </v-main>
</template>

<script>
export default {
  mounted() {
    this.loadingCursor();
  },
  methods: {
    loadingCursor() {
      // When the window has finished loading, set it back to default...
      document.body.style.cursor = "default";
    },
  },
};
</script>