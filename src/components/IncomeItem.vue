<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>Add Item</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  label="Name"
                  hint="Item name."
                  persistent-hint
                  :rules="[v => !!v || 'Please select an item.']"
                  v-model="item"
                  item-value="id"
                  item-text="name"
                  return-object
                  :items="items"
                  @change="updateQuantity"
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

              <v-col>
                <v-text-field
                  type="number"
                  label="Quantity"
                  hint="Quantity"
                  :suffix="item.packagingMetric"
                  :rules="[v => !!v || 'Please input item quantity.']"
                  v-model="item.quantity"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  disabled
                  prefix="₦"
                  label="Price"
                  :value="item.price"
                  hint="Item price"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  label="Discount"
                  v-model="item.discount"
                  prefix="₦"
                  hint="Discount applied"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="['Overall', 'Per item']"
                  label="Discount type"
                  :value="item.discountType"
                  v-model="item.discountType"
                  :disabled="!item.discount"
                  :rules="[v => !!v && item.discount > 0 ||  !item.discount || 'Please select discount type.']"
                  hint="Discount type"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary darken-1" text @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" tile @click="addItem">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '../plugins/axios';

const DISCOUNT_TYPES = {
  PER_ITEM: 'Per item',
  OVERALL: 'Overall'
};

export default {
  name: 'Income',
  data() {
    return {
      formValid: false,
      items: [],
      itemCategories: [],
      item: { discountType: DISCOUNT_TYPES.PER_ITEM },
      discountTypes: Object.values(DISCOUNT_TYPES)
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
      const filteredItem = this.items.filter((item) => item.id === this.item.id)[0] || {};
      return filteredItem.packagingMetric;
    },
    itemSize: {
      get() {
        return this.item.size;
      },
      set(item) {
        this.item = item;
      }
    }
  },
  methods: {
    updateQuantity() {
      this.item.quantity = '';
    },
    update() {
      this.$emit('update', false);
    },
    getItems() {
      axios.get('items?isProduced=true')
        .then(({ data }) => {
          this.items = data.map((item) => {
            const itemCopy = { ...item };
            itemCopy.category = itemCopy.category.replace(/\b[a-z]/g, (match) => match.toUpperCase());
            return itemCopy;
          });
        });
    },
    cancel() {
      this.$emit('cancel', true);
    },
    addItem() {
      try {
        if (this.$refs.form.validate()) {
          if (!this.item.discount) this.item.discount = 0;
          else if (this.item.discountType === 'Per item') this.item.discount *= this.item.quantity;
          this.item.amount = (this.item.price * this.item.quantity) - this.item.discount;
          this.$emit('addItem', { ...this.item });
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  created() {
    this.getItems();
  }
};
</script>

<style scoped>

</style>
