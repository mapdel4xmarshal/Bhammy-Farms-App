<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-select
            :items="['Layer mash', 'Grower mash', 'Chick mash', 'Broiler mash']"
            label="Type*"
            :rules="[v => !!v || 'Select feed type.']"
            v-model="value.type"
            required
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="['Formulated', 'Finished']"
            label="Category*"
            :rules="[v => !!v || 'Select feed category.']"
            v-model="value.category"
            value="Formulated"
            required
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Quantity*"
            suffix="bags (25kg)"
            :rules="bagRules"
            v-model="value.bags"
            type="number"
            @change="update"
            required></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'FeedConsumed',
  data() {
    return {
      bagRules: [
        (v) => !!v || 'Please enter total feed consumed.',
        (v) => v >= 0 || 'Feed should be zero (0) or more.'
      ]
    };
  },
  props: ['value'],
  methods: {
    update() {
      this.value.quantity = +this.value.bags * 25;
      this.$emit('input', this.value);
    },
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    }
  },
  mounted() {
    this.value.category = 'Formulated';
  }
};
</script>
