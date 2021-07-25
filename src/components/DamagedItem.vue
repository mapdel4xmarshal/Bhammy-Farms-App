<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>Add Damaged Item</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-container>
            <v-row>
              <v-col v-if="errorMessage" class="error--text subtitle-1" cols="12">
                <strong>ERROR - </strong> {{ errorMessage }}
              </v-col>
              <v-col cols="6">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="damagedItem.date"
                      clearable
                      label="Date*"
                      hint="Date."
                      :rules="[v => !!v || 'Please enter a date.']"
                      readonly
                      persistent-hint
                      v-on="on"
                      @click:clear="damagedItem.date = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="damagedItem.date"
                    @change="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  label="Name"
                  hint="Item name."
                  persistent-hint
                  :rules="[v => !!v || 'Please select an damagedItem.']"
                  v-model="selectedItem"
                  item-value="id"
                  item-text="name"
                  return-object
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
              </v-col>

              <v-col cols="6">
                <v-text-field
                  type="number"
                  label="Quantity"
                  hint="Quantity"
                  :suffix="`(${selectedItem.unit || 'unit'})`"
                  :rules="[v => !!v || 'Please input item quantity.']"
                  v-model="damagedItem.quantity"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-autocomplete
                  label="Damage type"
                  hint="Severity of the damages."
                  persistent-hint
                  :rules="[v => !!v || 'Please select damage type.']"
                  v-model="damagedItem.damageType"
                  :items="['Crack', 'Wastage', 'Other']"
                  required
                ></v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Description"
                  clearable
                  no-resize
                  rows="4"
                  v-model="damagedItem.description"
                  hint="Description / Note."
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
        <v-btn color="primary darken-1" tile @click="addItem" :loading="isLoading">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '../plugins/axios';
import { GETTER_TYPES } from '../store/types';

export default {
  name: 'DamagedItem',
  data() {
    return {
      formValid: false,
      items: [],
      itemCategories: [],
      damagedItem: { date: new Date().toISOString().split('T')[0] },
      selectedItem: {},
      isLoading: false,
      errorMessage: null,
      dateMenu: false
    };
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    itemUnit() {
      const filteredItem = this.items.filter((item) => item.id === this.damagedItem.id)[0] || {};
      return filteredItem.packagingMetric;
    }
  },
  methods: {
    getItems() {
      axios.get('items')
        .then(({ data }) => {
          this.items = data.map((item) => {
            const itemCopy = { ...item };
            itemCopy.category = itemCopy.category.replace(/\b[a-z]/g, (match) => match.toUpperCase());
            return itemCopy;
          });
        });
    },
    cancel() {
      this.errorMessage = null;
      this.$emit('cancel', true);
    },
    addItem() {
      this.errorMessage = null;
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        console.log(this.selectedItem);
        axios.post('damaged-items', {
          ...this.damagedItem,
          locationId: this.$store.getters[GETTER_TYPES.SELECTED_FARM_LOCATION].id,
          itemId: this.selectedItem.id,
          itemName: this.selectedItem.name
        })
          .then(({ data }) => {
            this.$emit('success', data);
          })
          .catch(({ response: { data } }) => {
            this.errorMessage = data.error;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  },
  created() {
    this.getItems();
  }
};
</script>
