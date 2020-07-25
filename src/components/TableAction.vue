<template>
  <div>
    <v-btn
      outlined
      rounded
      text
      small
      class="mr-1"
      color="primary"
      @click="editItem('EggCollection', item)">
      <v-icon small>mdi-pencil</v-icon>
    </v-btn>

    <v-btn
      outlined
      rounded
      text
      small
      color="primary"
      class="ml-1"
      @click="deleteItem('EggCollection', item)">
      <v-icon small>mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'TableAction',
  props: {
    item: {
      type: Object,
      required: true
    },
    editItem: {
      type: Function,
      required: true
    },
    deleteItem: {
      type: Function,
      required: true
    }
  }
};
</script>
