<template>
  <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <input hidden/>
          <v-text-field
            label="Quantity*"
            type="number"
            required
            :rules="quantityRules"
            v-model="value.quantity"
            suffix="liters"
            @keyup.enter="$emit('enter', true)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
</template>

<script>
export default {
  name: 'WaterConsumed',
  data() {
    return {
      quantityRules: [
        (v) => !!v || 'Please enter quantity.',
        (v) => v >= 0 || 'Quantity should be zero (0) or more.'
      ]
    };
  },
  props: ['value'],
  methods: {
    update() {
      this.$emit('input', this.value);
    },
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
