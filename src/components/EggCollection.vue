<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-select
            :items="['Big', 'Medium', 'Small', 'Crack']"
            label="Size*"
            :rules="[v => !!v || 'Select egg size/type.']"
            v-model="value.size"
            required
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field label="Total crates*"
                        type="number"
                        required
                        suffix="crates"
                        :rules="crateRules"
                        v-model="value.crates"
                        @change="update">
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            :rules="pieceRules"
            type="number"
            label="Total pieces*"
            v-model="value.pieces"
            suffix="pieces"
            required
            @change="update">
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>

export default {
  name: 'EggCollection',
  data() {
    return {
      crateRules: [
        (v) => !!v || 'Please enter total crate of eggs collected.',
        (v) => v >= 0 || 'Crate should be zero (0) or more.'
      ],
      pieceRules: [
        (v) => !!v || 'Please enter total crate of eggs collected.',
        (v) => v >= 0 || 'Pieces should be zero (0) or more.',
        (v) => v <= 29 || 'Pieces should be less than 30',
      ]
    };
  },
  props: ['value'],
  methods: {
    update() {
      this.value.quantity = +this.value.pieces + (this.value.crates * 30);
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
