<template>
  <section>
    <store-item v-model="item"
                :active="newItem"
                :errored.sync="errored"
                @cancel="newItem = false"
                @save="saved"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>Inventory</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="createNew">
         New item
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-container fluid>
      <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        hide-default-header
        :search="search"
      >
        <template v-slot:header>
          <v-row
            dark
            color="primary"
            class="mb-1"
          >
            <v-spacer/>
            <v-col cols="12" sm="4" md="3">
              <v-text-field
                append-icon="mdi-magnify"
                clearable
                hide-details
                label="Search"
                v-model="search"
                width='100'
              ></v-text-field>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.name"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                class="mx-auto"
                max-width="350"
                min-width="250"
                :hover="true"
                @click="editItem(item)"
              >
                <v-img
                  height="250"
                  :src="item.image"
                ></v-img>

                <v-card-title>{{ item.name }}</v-card-title>

                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="5">
                      <strong class="item__prop" v-if="item.brand">{{ item.brand }}</strong>
                      <strong class="item__prop" v-else>―</strong>
                      <small>Brand / Supplier</small>
                    </v-col>

                    <v-col cols="3">
                      <strong class="item__prop">₦{{ item.price }}</strong>
                      <small>Price</small>
                    </v-col>

                    <v-col cols="4">
                      <strong class="item__prop">
                        {{ item.remaining }}</strong>
                      <small>Remaining</small>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>

    <v-snackbar
      v-model="snackbar"
      absolute
    >
      {{ message }}
      <v-btn
        color="blue"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

  </section>
</template>

<script>
import pluralize from 'pluralize';
import axios from '../plugins/axios';
import StoreItem from '../components/StoreItem.vue';

export default {
  components: { StoreItem },
  data: () => ({
    newItem: false,
    itemsPerPage: 15,
    snackbar: false,
    errored: false,
    search: '',
    message: '',
    items: [],
    item: {
      category: '',
      name: '',
      unit: '',
      image: null,
    },
    showItemInfo: false
  }),
  methods: {
    saved() {
      this.newItem = false;
      this.snackbar = true;
      this.message = this.item.id ? 'Item updated successfully' : 'Item added successfully';
      this.getItems();
    },
    getItems() {
      axios.get('items')
        .then(({ data }) => {
          this.items = data.map((item) => {
            const newItem = { ...item };
            if (+newItem.quantity < +newItem.packagingSize && newItem.quantity >= 0) {
              newItem.quantity = Number(newItem.quantity);
              newItem.remaining = `${this.formatNumber(newItem.quantity)} ${pluralize(newItem.unit, newItem.quantity)}`;
            } else {
              const remaining = +newItem.quantity / +newItem.packagingSize;
              newItem.remaining = `${this.formatNumber(remaining)} ${pluralize(newItem.packagingMetric, remaining)}`;
            }
            return newItem;
          });
        });
    },
    createNew() {
      this.newItem = true;
    },
    editItem(selectedItem) {
      this.item = { ...selectedItem };
      this.item.unit = this.item.unit.replace(/\b[a-z]/g, (match) => match.toUpperCase());
      this.newItem = true;
    },
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format((value).toFixed(2));
    }
  },
  created() {
    this.getItems();
  }
};
</script>

<style scoped>
  .item__prop {
    display: block;
  }
</style>
