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
                <v-select
                  :items="itemCategories"
                  return-object
                  v-model="item.category"
                  :rules="[v => !!v || 'Please select an item.']"
                  label="Name"
                  hint="Item name"
                  persistent-hint
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  :items="this.items[this.item.category]"
                  label="Size"
                  v-model="itemSize"
                  :disabled="!item.category"
                  :rules="[v => !!v || 'Please select a size.']"
                  return-object
                  item-text="size"
                  item-value="size"
                  hint="Item size"
                  persistent-hint
                ></v-select>
              </v-col>

              <v-col>
                <v-text-field
                  type="number"
                  label="Quantity"
                  hint="Quantity"
                  :suffix="itemUnit"
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
      return this.item.category ? `${this.items[this.item.category][0].unit}(s)` : '';
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
    update() {
      this.$emit('update', false);
    },
    getItems() {
      axios.get('items?groupBy=category')
        .then(({ data }) => {
          this.itemCategories = Object.keys(data);
          this.items = this.normalizeItems(data);
        });
    },
    normalizeItems(itemsObject) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [category, items] of Object.entries(itemsObject)) {
        // eslint-disable-next-line no-param-reassign
        itemsObject[category] = items.map((item) => {
          const newItem = item;
          newItem.size = item.size[0].toUpperCase() + item.size.slice(1);
          return newItem;
        });
      }
      return itemsObject;
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
