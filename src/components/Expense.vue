<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>New Expense</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="expense.date"
                      clearable
                      label="Date*"
                      hint="Date incurred."
                      :rules="[v => !!v || 'Please enter a date.']"
                      readonly
                      persistent-hint
                      v-on="on"
                      @click:clear="expense.date = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="expense.date"
                    @change="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Farm*"
                  hint="Farm where the expense is incurred."
                  persistent-hint
                  return-object
                  required
                  :rules="[v => !!v || 'Please select a farm.']"
                  v-model="farm"
                  item-text="name"
                  item-value="name"
                  :items="farmLocations"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Pen"
                  hint="Pen where the expense is incurred."
                  persistent-hint
                  required
                  return-object
                  v-model="pen"
                  @blur="updateBatchList"
                  :disabled="selectedFarm === ''"
                  item-text="name"
                  item-value="name"
                  :items="selectedFarm.houses"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Batch"
                  hint="Flock/Batch this expense applied to."
                  persistent-hint
                  required
                  return-object
                  v-model="batch"
                  :disabled="selectedPen === ''"
                  item-text="name"
                  no-data-text="No batch found."
                  item-value="name"
                  :items="batches"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Category*"
                  hint="Expense category."
                  persistent-hint
                  :items="['Purchase', 'Service']"
                  return-object
                  v-model="expense.category"
                  :rules="[v => !!v || 'Please select a category.']"
                  required
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Type*"
                  hint="Expense type."
                  persistent-hint
                  :items="types"
                  return-object
                  v-model="type"
                  item-value="name"
                  item-text="name"
                  :rules="[v => !!v || 'Please select an expense type.']"
                  required>
                </v-select>
              </v-col>

              <v-col>
                <v-text-field
                  type="number"
                  label="Quantity"
                  hint="Quantity."
                  persistent-hint
                  v-model="expense.quantity"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Invoice number"
                  hint="Invoice number."
                  v-model="expense.invoiceNumber"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="supplier"
                  label="Provider/supplier"
                  hint="Product supplier or service provider information."
                  persistent-hint
                  required
                  clearable
                  return-object
                  :items="suppliers"
                  no-data-text="No suppliers to choose from. Please add a new supplier."
                  item-text="name"
                  item-value="name"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar color="primary" tile>
                      <span class="white--text">{{ item.initials }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  accept="image/*"
                  label="Proof of payment"
                  v-model="expense.attachment"
                  hint="Upload proof of payment"
                  prepend-icon=""
                  persistent-hint/>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Amount*"
                  hint="Cost of the purchase / service."
                  persistent-hint
                  prefix="₦"
                  :rules="[v => !!v || 'Please enter an amount.']"
                  type="number"
                  v-model="expense.amount"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Description"
                  clearable
                  filled
                  no-resize
                  v-model="expense.description"
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
        <v-btn color="primary darken-1" text @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" tile @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      absolute
    >
      An error occurred while creating expense.
      <v-btn
        color="red"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'Expense',
  data() {
    return {
      dateMenu: false,
      valid: true,
      attachment: '',
      expense: {
        category: '',
        type: {},
        farm: '',
        pen: null
      },
      selectedFarm: '',
      selectedPen: '',
      batches: [],
      showSnackbar: false
    };
  },
  props: {
    errored: {
      type: Boolean,
      default: false
    },
    types: {
      type: Array,
      default: () => [],
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    suppliers: {
      type: Array,
      default: () => [],
      required: true
    },
    farmLocations: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  computed: {
    snackbar: {
      get() {
        return this.errored;
      },
      set(state) {
        this.$emit('update:errored', state);
      }
    },
    supplier: {
      get() {
        return this.expense.supplier;
      },
      set({ id }) {
        this.expense.supplier = id;
      }
    },
    type: {
      get() {
        return this.expense.type.expense_type_id;
      },
      set(type) {
        this.expense.type = type.expense_type_id;
      }
    },
    farm: {
      get() {
        return this.selectedFarm;
      },
      set(farm) {
        this.selectedFarm = farm;
        this.expense.farm = farm.id;
      }
    },
    pen: {
      get() {
        return this.selectedPen;
      },
      set(pen) {
        this.selectedPen = pen;
        this.expense.pen = pen.id;
      }
    },
    batch: {
      get() {
        return this.expense.batch;
      },
      set(batch) {
        this.expense.batch = batch.id;
      }
    }
  },
  methods: {
    updateBatchList() {
      axios.get(`/batches?house=${this.selectedPen.id}`)
        .then(({ data }) => {
          this.batches = data;
        });
    },
    cancel() {
      this.$emit('cancel', true);
    },
    save() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();
        Object.entries(this.expense).forEach((data) => {
          formData.append(data[0], data[1]);
        });
        this.$emit('save', formData);
      }
    }
  }
};
</script>
