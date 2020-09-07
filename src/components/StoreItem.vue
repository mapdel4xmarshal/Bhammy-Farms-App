<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>{{ title }} Item</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Name*"
                  hint="Item name."
                  persistent-hint
                  v-model="value.name"
                  :rules="[v => !!v || 'Please enter item name.']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  label="Category*"
                  hint="Item category."
                  persistent-hint
                  v-model="value.category"
                  :search-input.sync="categorySearch"
                  :items="itemCategories"
                  :rules="[v => !!v || 'Please select a category.']"
                  required
                >
                  <template v-slot:no-data>
                    <v-list-item
                      ripple
                      @click="addNewCategory"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ categorySearch }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  label="Brand*"
                  hint="Item brand."
                  persistent-hint
                  v-model="value.brand"
                  :search-input.sync="brandSearch"
                  :items="itemBrands"
                  :rules="[v => !!v || 'Please select item brand.']"
                  required
                >
                  <template v-slot:no-data>
                    <v-list-item
                      ripple
                      @click="addNewBrand"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ brandSearch }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Size*"
                  hint="Item size."
                  persistent-hint
                  v-model="value.size"
                  :rules="[v => !!v || 'Please enter item size.']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  type="number"
                  label="Quantity*"
                  hint="Item quantity."
                  :rules="[v => !!v || 'Please enter item quantity.']"
                  persistent-hint
                  v-model="value.quantity"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  label="Unit / Metric*"
                  hint="Item measurement metric. i.e kg, ml etc"
                  :rules="[v => !!v || 'Please enter item unit.']"
                  v-model="value.unit"
                  persistent-hint
                  :search-input.sync="unitSearch"
                  :items="itemUnits"
                  required
                >
                  <template v-slot:no-data>
                    <v-list-item
                      ripple
                      @click="addNewUnit"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ unitSearch }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12" v-if="!value.id">
                <v-file-input
                  accept="image/*"
                  label="Image / Thumbnail*"
                  :rules="[v => !!v || 'Please upload item thumbnail.']"
                  v-model="value.thumbnail"
                  hint="Item image"
                  prepend-icon=""
                  persistent-hint/>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Price*"
                  hint="Cost of the item."
                  persistent-hint
                  prefix="₦"
                  :rules="[v => !!v || 'Please enter item price.']"
                  type="number"
                  v-model="value.price"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Description"
                  clearable
                  filled
                  no-resize
                  v-model="value.description"
                  hint="Description of the item."
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
        <v-btn color="primary darken-1" tile @click="save">{{ buttonTitle }}</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      absolute
    >
      {{ message }}
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
  name: 'StoreItem',
  data() {
    return {
      dateMenu: false,
      valid: true,
      brandSearch: '',
      categorySearch: '',
      unitSearch: '',
      itemBrands: [],
      message: '',
      itemCategories: [],
      itemUnits: [],
      attachment: '',
      showSnackbar: false
    };
  },
  props: {
    errored: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      required: true
    },
    value: {
      type: Object
    }
  },
  computed: {
    title() {
      return this.value.id ? 'Edit' : 'New';
    },
    buttonTitle() {
      return this.value.id ? 'Update item' : 'Save item';
    },
    snackbar: {
      get() {
        return this.errored;
      },
      set(state) {
        this.$emit('update:errored', state);
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
    addNewBrand() {
      this.itemBrands.push(this.brandSearch);
      this.value.brand = this.brandSearch;
    },
    addNewUnit() {
      this.itemUnits.push(this.unitSearch);
      this.value.unit = this.unitSearch;
    },
    addNewCategory() {
      this.itemCategories.push(this.categorySearch);
      this.value.category = this.categorySearch;
    },
    cancel() {
      this.$emit('cancel', true);
    },
    getItemBrands() {
      axios.get('/items/brands')
        .then(({ data }) => {
          this.itemBrands = data.map((item) => item.brand);
        });
    },
    getItemCategories() {
      axios.get('/items/categories')
        .then(({ data }) => {
          this.itemCategories = data;
        });
    },
    getItemUnits() {
      axios.get('/items/units')
        .then(({ data }) => {
          this.itemUnits = data;
        });
    },
    save() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();
        Object.entries(this.value).forEach((data) => {
          formData.append(data[0], data[1]);
        });
        this.addItem(formData);
      }
    },
    addItem(item) {
      const id = item.get('id');
      const editMode = !!id;
      const path = editMode ? `/${id}` : '';
      axios[editMode ? 'patch' : 'post'](`items${path}`, item)
        .then(({ data }) => {
          if (data) {
            this.$refs.form.reset();
            this.$emit('save', item);
          }
        })
        .catch(({ response: { data: { error } } }) => {
          this.snackbar = true;
          this.message = error;
        });
    },
  },
  created() {
    this.getItemBrands();
    this.getItemCategories();
    this.getItemUnits();
  }
};
</script>
