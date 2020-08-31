<template>
  <v-card class="justify-center pa-4">
    <v-card-title class="justify-center pb-0">
      <v-avatar color="primary" size="60">
        <span class="white--text headline">{{ initials }}</span>
      </v-avatar>
    </v-card-title>
    <v-card-title class="justify-center pa-2" no-gutter>{{ customer.name }}</v-card-title>
    <v-card-subtitle class="justify-center center pt-1">
      <v-rating
        :value="customer.rating + 1"
        background-color="orange lighten-3"
        color="orange"
        dense
        medium
        readonly
        half-increments
      ></v-rating>
    </v-card-subtitle>
    <v-divider/>
    <v-list-item>
      <v-list-item-content>
        <strong class="caption">Phone number</strong>
        <span class="subtitle-2">{{ customer.phone }}</span>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <strong class="caption">Alt. Phone number</strong>
        <span class="subtitle-2">{{ customer.altPhone }}</span>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <strong class="caption">Address</strong>
        <span class="subtitle-2">{{ customer.address }},
                 {{ customer.state }}</span>
      </v-list-item-content>
    </v-list-item>
    <v-divider/>
    <v-list-item v-if="customer.comment">
      <v-list-item-content>
        <strong class="caption">Remark</strong>
        <span>{{ customer.comment }}</span>
      </v-list-item-content>
    </v-list-item>

    <v-card-actions>
      <v-btn block rounded color="primary" outlined class="mt-3" @click="$emit('edit', true)">Edit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CustomerCard',
  props: {
    customer: {
      required: true,
      type: Object
    }
  },
  computed: {
    initials() {
      return this.customer.name ? this.customer.name.match(/\b(\w)/g).join('').toUpperCase() : '';
    }
  },
};
</script>
