<template>
  <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-select
            :items="eggTypes"
            label="Size*"
            :rules="[v => !!v || 'Select egg size/type.']"
            item-text="name"
            item-value="id"
            v-model="value.id"
            @change="updateName"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Total crates*"
                        type="number"
                        required
                        suffix="crates"
                        :rules="crateRules"
                        v-model="value.crates"
                        @change="update">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :rules="pieceRules"
            type="number"
            label="Total pieces*"
            v-model="value.pieces"
            suffix="pieces"
            required
            @keyup.enter.native="$emit('enter', true)"
            @change="update">
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'EggCollection',
  data() {
    return {
      eggTypes: [],
      packagingSize: 1,
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
    updateName() {
      const filteredEgg = this.eggTypes.filter((egg) => egg.id === this.value.id)[0];
      this.packagingSize = filteredEgg.packagingSize;
      this.value.packagingSize = this.packagingSize;
      this.value.name = filteredEgg.name;
    },
    update() {
      this.value.quantity = +this.value.pieces + (this.value.crates * this.packagingSize);
      this.$emit('input', this.value);
    },
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    getEggTypes() {
      axios.get('/items?category=egg')
        .then(({ data }) => {
          this.eggTypes = data;
        });
    }
  },
  created() {
    this.getEggTypes();
  }
};
</script>
