<template>
  <v-text-field
    style="font-size: 1em"
    v-model="cSearchCol"
    type="search"
    :label="label"
    append-icon="mdi-magnify"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    label: String,
    searchCol: String,
  },
  data() {
    return {
      dSearchCol: this.searchCol,
    };
  },
  computed: {
    cSearchCol: {
      get() {
        //console.log("get: " + this.dSearchCol)
        return this.dSearchCol;
      },
      set(value) {
        //console.log("changed value: " + value )
        this.dSearchCol = value;
      },
    },
  },
};
</script>