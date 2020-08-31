<template>
  <section>
    <customer :active="newCustomer" @update="customerCreated" v-model="customer"/>
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
      <v-col cols="12" md="3">
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
      :items="customers"
      no-data-text="No customers available."
      :search="search"
      class="elevation-1 table-cursor"
      @click:row="selectCustomer"
    >
      <template v-slot:item.orderTotal="{ item }">
        {{ item.invoices.length }}
      </template>

      <template v-slot:item.rating="{ item }">
        <v-rating
          :value="item.rating + 1"
          background-color="orange lighten-3"
          color="orange"
          dense
          medium
          readonly
          half-increments
        ></v-rating>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
    >
      Customer created successfully.
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
import axios from '../plugins/axios';
import ROUTES from '../router/routeNames';
import Customer from '../components/Customer.vue';

export default {
  name: 'Customers',
  components: { Customer },
  data() {
    return {
      dateMenu: false,
      customer: {},
      snackbar: false,
      newCustomer: false,
      customers: [],
      date: null,
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Name', value: 'name', width: '20%' },
        { text: 'Address', value: 'address', width: '20%' },
        { text: 'State', value: 'state' },
        { text: 'Phone', value: 'phone' },
        { text: 'Total orders', value: 'orderTotal' },
        { text: 'Rating', value: 'rating' }]
    };
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    },
    getCustomers() {
      axios.get('/parties/customers')
        .then(({ data }) => {
          this.customers = data;
        });
    },
    customerCreated(state) {
      this.newCustomer = false;
      this.snackbar = state;
      this.getCustomers();
    },
    selectCustomer(customer) {
      this.$router.push({ name: ROUTES.CUSTOMER_DETAIL, params: { id: customer.id } });
    },
  },
  created() {
    this.getCustomers();
  }
};
</script>
<style lang="css">
  .table-cursor tbody tr:hover {
    cursor: pointer;
  }
</style>
