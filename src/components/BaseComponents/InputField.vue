<template>
  <v-text-field
    v-model="cModel"
    :label="label"
    outlined
    dense
    class="item font mx-2"
    :rules="[(v) => !!v || `${label} tidak boleh kosong!`]"
    @change="setInput()"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    label: String,
    pModel: String,
    idName: String,
  },
  data() {
    return {
      dModel: this.pModel,
    };
  },
  computed: {
    cModel: {
      get() {
        //console.log("get input field: " + this.dModel);
        return this.dModel;
      },
      set(value) {
        this.dModel = value;
        //console.log("set input field: " + this.dModel);
      },
    },
    setValue() {
      return this.dModel;
    }
  },
  methods: {
    setInput() {
      this.$emit("set-input", this.dModel, this.idName);
    },
  },
};
</script>