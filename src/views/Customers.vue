<template>
  <section>
    <customer :active="newCustomer" @update="newCustomer = false"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Customers</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="newCustomer = true">
        New Customer
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          v-model="search"
          width='100'
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      multi-sort
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.rating="{ item }">
        <v-rating
          :value="item.rating"
          background-color="orange lighten-3"
          color="orange"
          dense
          medium
          readonly
          half-increments
        ></v-rating>
      </template>
    </v-data-table>

  </section>
</template>

<script>
import ROUTES from '../router/routeNames';
import Customer from '../components/Customer.vue';

export default {
  name: 'Customers',
  components: { Customer },
  data() {
    return {
      dateMenu: false,
      newCustomer: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Name', value: 'name', width: '40%' },
        { text: 'Address', value: 'address' },
        { text: 'State', value: 'state' },
        { text: 'Phone', value: 'phone' },
        { text: 'Total orders', value: 'orderTotal' },
        { text: 'Rating', value: 'rating' }
      ],
      items: [
        {
          id: 'AJG-001',
          name: 'Mrs. Semira Bolanle',
          address: '123 Eiyenkorin road, Oloko',
          phone: '09088888708',
          state: 'Ilorin',
          orderTotal: '1290',
          rating: 4.5
        },
      ]
    };
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    }
  }
};
</script>
