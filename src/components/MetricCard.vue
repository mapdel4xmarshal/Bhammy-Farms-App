<template>
  <v-card
    class="mx-auto"
    outlined
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1" v-if="value >= 0">
          {{ valuePrefix }}{{ value | formatNumber }} {{ unit }}
        </v-list-item-title>
        <v-list-item-title class="headline mb-1 error--text" v-else>
          &ndash;{{ valuePrefix }}{{ value | formatNumber }} {{ unit }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ title }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="60"
      >
        <img :src="img"
             v-if="img">
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    img: {
      type: String
    },
    digits: {
      type: Number,
      default: 2
    },
    unit: {
      type: String
    },
    valuePrefix: {
      type: String
    }
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(Math.abs(value));
    }
  },
};
</script>
