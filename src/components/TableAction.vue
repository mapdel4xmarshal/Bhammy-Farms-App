<template>
  <v-row>
    <v-btn
      outlined
      rounded
      text
      small
      class="mr-2"
      color="primary"
      v-if="editItem"
      @click="editItem(id, item)">
      <v-icon small>mdi-pencil</v-icon>
    </v-btn>

    <v-btn
      outlined
      rounded
      text
      small
      color="primary"
      class="ml-2"
      @click.stop.prevent="deleteItem(id, item)">
      <v-icon small>mdi-delete</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
export default {
  name: 'TableAction',
  props: {
    id: {
      type: String,
      default: 'item'
    },
    item: {
      type: Object,
      required: true
    },
    editItem: {
      type: [Function, String],
      required: true
    },
    deleteItem: {
      type: Function,
      required: true
    }
  }
};
</script>
