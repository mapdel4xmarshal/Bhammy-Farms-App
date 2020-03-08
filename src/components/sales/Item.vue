<template>
  <v-dialog
    v-model="isVisible"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-divider/>
      <v-card-text>
        <v-form v-model="valid">
          <v-select
            v-model="data.type"
            :items="['Egg', 'Fish', 'Old layers']"
            label="Type"
          />

          <v-select
            v-model="data.size"
            :items="['Jumbo', 'Large', 'Medium', 'Pullet']"
            label="Size"
          />

          <v-text-field
            v-model="data.price"
            :rules="nameRules"
            type="number"
            label="Price"
            prefix="₦"
            required
            disabled
          />

          <v-text-field
            v-model="data.quantity"
            :rules="nameRules"
            label="Quantity"
            type="number"
            required
          />

          <v-text-field
            v-model="data.discount"
            :rules="emailRules"
            label="Discount"
            type="number"
            prefix="₦"
            required
          />

        </v-form>
      </v-card-text>

      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn
          rounded
          @click="close"
          text
          color="primary"
          class="item__cancel-button">
          Cancel
        </v-btn>

        <v-btn
          v-if="editMode"
          rounded
          outlined
          color="primary"
          @click="close">
          Delete
        </v-btn>

        <v-btn rounded
               color="primary">
          {{ action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
import CustomDialog from '@/components/common/Dialog';
import ButtonPill from '../common/ButtonPill';

export default {
  name: 'AddItem',
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
    },
    editMode: {
      type: Boolean,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ButtonPill,
    CustomDialog,
  },
  computed: {
    isVisible: {
      // getter
      get() {
        return this.show;
      },
      // setter
      set(newValue) {
        this.$emit('update:show', newValue);
      },
    },
    action() {
      return this.editMode ? 'Update item' : 'Add item';
    },
    title() {
      return this.editMode ? 'Edit item' : 'Add item';
    },
  },
  methods: {
    close() {
      this.$emit('update:show', false);
    },
  },
};
</script>

<style lang="scss" scoped>
  .item {
    display: grid;
    grid-template-columns: auto;
    grid-gap: 15px;
  }

  .item__cancel-button {
    margin-right: auto !important;
  }
</style>
