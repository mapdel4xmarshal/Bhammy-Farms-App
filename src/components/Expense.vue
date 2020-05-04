<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable>
    <v-card>
      <v-card-title>New Expense</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col
              >
                <v-text-field
                  label="Date"
                  hint="Date incurred"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Type"
                  hint="Expense type."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Category"
                  hint="Expense category."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col>
                <v-text-field
                  type="number"
                  label="Quantity"
                  hint="Quantity."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Invoice number"
                  hint="Invoice number."
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Provider/supplier"
                  hint="Product supplier or service provider information"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  accept="image/*"
                  label="Proof of payment"
                  hint="Upload proof of payment"
                  prepend-icon=""
                  persistent-hint/>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Amount"
                  hint="Cost of the purchase / service."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Description"
                  clearable
                  filled
                  no-resize=""
                  hint="Description of the expense or service."
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
  name: 'Expense',
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
