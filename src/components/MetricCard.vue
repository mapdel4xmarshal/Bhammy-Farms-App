<template>
  <v-card
    class="mx-auto"
    outlined
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">{{ value }}</v-list-item-title>
        <v-list-item-subtitle>{{ title }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="60"
      >
        <img :src="img">
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
      type: String,
      required: true
    },
    img: {
      type: String
    }
  }
};
</script>
