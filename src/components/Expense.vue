<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation :readonly="!isEditMode">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  max-width="290"
                  :disabled="!isEditMode"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="value.date"
                      clearable
                      label="Date*"
                      hint="Date incurred."
                      :rules="[v => !!v || 'Please enter a date.']"
                      readonly
                      persistent-hint
                      @change="update"
                      v-on="on"
                      @click:clear="value.date = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="value.date"
                    @change="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Farm*"
                  hint="Farm where the expense is incurred."
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select a farm.']"
                  v-model="value.farm"
                  @change="update"
                  item-text="name"
                  item-value="id"
                  :items="farmLocations"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Pen"
                  hint="Pen where the expense is incurred."
                  persistent-hint
                  required
                  v-model="value.house"
                  @change="update"
                  @blur="updateBatchList"
                  :disabled="isEditMode && value.farm === ''"
                  item-text="name"
                  item-value="id"
                  :items="houses"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Batch"
                  hint="Flock/Batch this expense applied to."
                  persistent-hint
                  required
                  v-model="value.batch"
                  @change="update"
                  :disabled="isEditMode && value.house === ''"
                  item-text="name"
                  no-data-text="No batch found."
                  item-value="batchId"
                  :items="batches"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Category*"
                  hint="Expense category."
                  persistent-hint
                  @change="changeCategory"
                  :items="['Purchase', 'Service', 'Salary']"
                  v-model="value.category"
                  :rules="[v => !!v || 'Please select a category.']"
                  required
                >
                </v-select>
              </v-col>

              <v-col cols="12" v-if="value.category === 'Service'">
                <v-select
                  label="Type*"
                  hint="Service type."
                  persistent-hint
                  :items="types"
                  v-model="value.type"
                  @change="update"
                  item-value="expense_type_id"
                  item-text="name"
                  :rules="[v => !!v || 'Please select an expense type.']"
                  required>
                </v-select>
              </v-col>
              <v-col cols="12" v-if="value.category === 'Service'">
                <v-text-field
                  label="Provider*"
                  hint="Service provider."
                  persistent-hint
                  v-model="value.provider"
                  @change="update"
                  :rules="[v => !!v || 'Please enter provider name']"
                  required>
                </v-text-field>
              </v-col>

              <v-col v-if="value.category === 'Purchase'" cols="12" md="6">
                <v-autocomplete
                  v-if="value.updateStoreInventory"
                  label="Item"
                  hint="Item purchased."
                  @change="update"
                  persistent-hint
                  :rules="[v => !!v || 'Please select item purchased']"
                  v-model="value.item"
                  item-value="id"
                  item-text="name"
                  @click="getItems"
                  :items="items"
                  required
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar tile>
                      <v-img :src="`/${item.image}`"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.category }} {{ item.brand ? `| ${item.brand}` : '' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
                <v-text-field v-else
                              label="Item name"
                              hint="Item purchased."
                              @change="update"
                              persistent-hint
                              :rules="[v => !!v || 'Please enter item name']"
                              v-model="value.item"
                              required>
                </v-text-field>
              </v-col>

              <v-col v-if="value.category === 'Purchase'" cols="12" md="6">
                <v-checkbox
                  label="Update store inventory"
                  persistent-hint
                  @change="updateItemState"
                  v-model="value.updateStoreInventory"
                  required
                ></v-checkbox>
              </v-col>

              <v-col v-if="value.category === 'Purchase'" cols="12" md="6">
                <v-text-field
                  type="number"
                  label="Quantity"
                  hint="Item quantity."
                  @change="update"
                  persistent-hint
                  :rules="[v => !!v || 'Please enter item quantity']"
                  v-model="value.quantity"
                  required
                ></v-text-field>
              </v-col>

              <v-col v-if="value.category === 'Purchase'" cols="12" md="6">
                <v-text-field
                  type="number"
                  label="Price"
                  hint="Item price."
                  @change="update"
                  persistent-hint
                  :rules="[v => !!v || 'Please enter item price']"
                  v-model="value.price"
                  required
                ></v-text-field>
              </v-col>

              <v-col v-if="value.category === 'Salary'" cols="12">
                <v-select
                  label="Employee*"
                  hint="Employee name."
                  persistent-hint
                  :items="types"
                  @change="update"
                  v-model="value.employee"
                  item-value="name"
                  item-text="name"
                  :rules="[v => !!v || 'Please select an employee.']"
                  required>
                </v-select>
              </v-col>

              <v-col cols="12" v-if="value.category !== 'Salary'" >
                <v-text-field
                  label="Invoice number"
                  hint="Invoice number."
                  @change="update"
                  v-model="value.invoiceNumber"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="value.category !== 'Salary'" >
                <v-file-input
                  accept="image/*"
                  label="Proof of payment"
                  @change="update"
                  v-model="value.attachment"
                  hint="Upload proof of payment"
                  prepend-icon=""
                  persistent-hint/>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Total amount*"
                  hint="Total amount incurred"
                  persistent-hint
                  prefix="₦"
                  @change="update"
                  :rules="[v => !!v || 'Please enter an amount.']"
                  type="number"
                  v-model="value.amount"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Description"
                  :clearable="isEditMode"
                  filled
                  no-resize
                  @change="update"
                  v-model="value.description"
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
        <v-btn color="primary darken-1" tile @click="save">{{ actionTitle }}</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      absolute
    >
      An error occurred while {{ isEditMode ? 'editing' : 'creating' }} expense.
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
      selectedFarm: '',
      selectedPen: '',
      batches: [],
      showSnackbar: false,
      items: [],
      editMode: false
    };
  },
  props: {
    errored: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
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
    farmLocations: {
      type: Array,
      default: () => [],
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    isEditMode() {
      return !this.value.id || this.editMode;
    },
    actionTitle() {
      if (this.editMode) {
        if (this.value.id) return 'Update expense';
        return 'Edit expense';
      }
      if (this.value.id) return 'Edit expense';
      return 'Save expense';
    },
    snackbar: {
      get() {
        return this.errored;
      },
      set(state) {
        this.$emit('update:errored', state);
      }
    },
    batch: {
      get() {
        return this.value.batch;
      },
      set(batch) {
        this.value.batch = batch.batchId;
        this.update();
      }
    },
    houses() {
      const filteredFarm = this.farmLocations.filter((farm) => farm.id === this.value.farm)[0];
      return filteredFarm ? filteredFarm.houses : [];
    }
  },
  methods: {
    update() {
      this.$emit('input', this.value);
    },
    updateItemState() {
      this.value.item = '';
      this.update();
    },
    changeCategory() {
      this.getItems();
      this.update();
    },
    updateBatchList() {
      axios.get(`/batches?house=${this.value.house}`)
        .then(({ data }) => {
          this.batches = data;
        });
    },
    getItems() {
      axios.get('/items')
        .then(({ data }) => {
          this.items = data.filter((item) => !item.brand || !item.brand.toLowerCase().includes('bhammy'));
        });
    },
    cancel() {
      if (this.editMode) { this.editMode = false; return; }
      this.$emit('cancel', true);
      this.$refs.form.reset();
      this.value.id = null;
    },
    save() {
      if (!this.editMode && !this.isEditMode) { this.editMode = true; return; }
      if (this.isEditMode && this.$refs.form.validate()) {
        if (!this.value.id) {
          const formData = new FormData();
          Object.entries(this.value)
            .forEach((data) => {
              formData.append(data[0], data[1]);
            });
          this.$emit('save', formData);
        } else {
          this.$emit('save', this.value);
        }
      }
    }
  },
  created() {
    axios.get('/batches')
      .then(({ data }) => {
        this.batches = data;
      });
    this.getItems();
  }
};
</script>
