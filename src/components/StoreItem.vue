<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable>
    <v-card>
      <v-card-title>New Store Item</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Item name"
                  hint="Item name"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Farm"
                  hint="Farm house where the item is located."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Quantity"
                  hint="Quantity."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Category"
                  hint="Item category."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Brand"
                  hint="Item Brand."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Price"
                  hint="Price of the item."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Total"
                  hint="Item total."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Supplier"
                  hint="Item supplier."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Expiry date"
                  hint="Item expiry date or shelf life."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Empty level (Threshold)"
                  hint="No of items to be considered as low in stock."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Full level"
                  hint="No of items to be considered as full stock."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  accept="image/*"
                  label="Image"
                  hint="Item picture"
                  prepend-icon
                  persistent-hint/>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Description"
                  clearable
                  filled
                  no-resize
                  hint="Additional information about the item."
                  persistent-hint
                  required
                ></v-textarea>
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
  name: 'StoreItem',
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
