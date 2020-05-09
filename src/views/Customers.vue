<template>
  <section>
    <expense :active="newExpense" @update="newExpense = false"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Customers</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="newExpense = true">
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
    ></v-data-table>

  </section>
</template>

<script>
import ROUTES from '../router/routeNames';
import Expense from '../components/Expense.vue';

export default {
  name: 'Customers',
  components: { Expense },
  data() {
    return {
      dateMenu: false,
      newExpense: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Name', value: 'name', width: '45%' },
        { text: 'Address', value: 'address' },
        { text: 'Phone', value: 'phone' },
        { text: 'State', value: 'state' },
        { text: 'Total orders', value: 'orderTotal' }
      ],
      items: [
        {
          id: 'AJG-001',
          name: 'Mrs. Semira Bolanle',
          address: '123 Eiyenkorin road, Oloko',
          phone: '₦5780',
          state: 'Purchases',
          orderTotal: 'Purchases',
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
