<template>
  <v-text-field
    v-model="model"
    :label="label"
    readonly
    outlined
    dense
    class="item font mx-2"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    label: String,
    model: [Number, String],
  },
  data() {
    return {};
  },
};
</script>
