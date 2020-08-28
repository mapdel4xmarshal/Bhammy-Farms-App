<template>
  <section>
    <store-item :active="newItem"
                :errored.sync="errored"
                @cancel="newItem = false"
                @save="addItem"/>
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
                hover
              >
                <v-img
                  height="250"
                  :src="item.image"
                ></v-img>

                <v-card-title>{{ item.name }}</v-card-title>

                <v-card-text>
                  <v-row no-gutters>
                    <v-col>
                      <strong class="item__prop">Bhammy</strong>
                      <small>Supplier</small>
                    </v-col>

                    <v-col>
                      <strong class="item__prop">₦{{ item.price }}</strong>
                      <small>Price</small>
                    </v-col>

                    <v-col>
                      <strong>{{ item.total }}</strong>
                      <small>Remaining</small>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider class="mx-4"></v-divider>

                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    color="primary"
                    text
                  >
                    Restock
                  </v-btn>
                </v-card-actions>
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
      An error occurred while adding item.
      <v-btn
        color="red"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

  </section>
</template>

<script>
import axios from '../plugins/axios';
import StoreItem from '../components/StoreItem.vue';

export default {
  components: { StoreItem },
  data: () => ({
    newItem: false,
    itemsPerPage: 20,
    snackbar: false,
    errored: false,
    search: '',
    items: []
  }),
  methods: {
    addItem(item) {
      axios.post('items', item)
        .then(({ data }) => {
          if (data) {
            this.snackbar = true;
            this.newItem = false;
            this.errored = false;
          }
        })
        .catch(() => {
          this.errored = true;
        })
        .finally(() => {
          this.getItems();
        });
    },
    getItems() {
      axios.get('items')
        .then(({ data }) => {
          this.items = data;
        });
    },
    createNew() {
      this.newItem = true;
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
