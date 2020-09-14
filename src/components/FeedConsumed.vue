<template>
  <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-select
            :items="feedTypes"
            label="Type*"
            :rules="[v => !!v || 'Select feed type.']"
            v-model="value.name"
            item-text="name"
            item-value="name"
            @change="updateId"
            required
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Quantity*"
            :suffix="suffix"
            :rules="bagRules"
            v-model="value.bags"
            type="number"
            @change="update"
            @keyup.enter.native="$emit('enter', true)"
            required></v-text-field>
        </v-col>
      </v-row>
    </v-form>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'FeedConsumed',
  data() {
    return {
      feed: {
        packagingSize: '',
        packagingMetric: '',
        unit: 'kg'
      },
      feedTypes: [],
      bagRules: [
        (v) => !!v || 'Please enter total feed consumed.',
        (v) => v >= 0 || 'Feed should be zero (0) or more.'
      ]
    };
  },
  props: ['value'],
  computed: {
    suffix() {
      if (this.value.name) this.updateId();
      return `${this.feed.packagingMetric} (${this.feed.packagingSize}${this.feed.unit})`;
    }
  },
  methods: {
    update() {
      this.value.quantity = +this.value.bags * this.feed.packagingSize;
      this.$emit('input', this.value);
    },
    updateId() {
      this.feed = { ...this.feedTypes.filter((feed) => feed.name === this.value.name)[0] };
      this.value.id = this.feed.id;
    },
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    getFeedTypes() {
      axios.get('/items?category=feed')
        .then(({ data }) => {
          this.feedTypes = data;
        });
    },
  },
  mounted() {
    this.getFeedTypes();
  }
};
</script>
