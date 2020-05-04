<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable>
    <v-card>
      <v-card-title>Add Item</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="formValid">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  :items="itemTypes"
                  label="Name"
                  hint="Item name"
                  persistent-hint
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  :items="itemSizes"
                  label="Size"
                  hint="Item size"
                  persistent-hint
                ></v-select>
              </v-col>

              <v-col>
                <v-text-field
                  type="number"
                  label="Quantity"
                  hint="Quantity"
                  suffix="crates"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  disabled
                  prefix="₦"
                  label="Price"
                  hint="Item price"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Discount"
                  prefix="₦"
                  hint="Discount applied"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary darken-1" text @click="update">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" tile @click="update">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Income',
  data() {
    return {
      formValid: false,
      itemTypes: ['Egg', 'Broiler', 'Cockerel', 'Manure', 'Old layers'],
      itemSizes: ['Small', 'Medium', 'Large', '1 kg', '2 kg', '4-5 kg']
    };
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    update() {
      this.$emit('update', false);
    }
  }
};
</script>

<style scoped>

</style>
