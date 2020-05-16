<template>
  <section>
    <expense :active="newExpense" @update="newExpense = false"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="newExpense = true">
        New Expense
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
  name: 'Expenses',
  components: { Expense },
  data() {
    return {
      dateMenu: false,
      newExpense: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Farm/Batch', value: 'batch' },
        { text: 'Type', value: 'type' },
        { text: 'Category', value: 'category' },
        { text: 'Amount', value: 'amount' },
      ],
      items: [
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Transport',
          amount: '₦5780',
          type: 'Purchases'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Medication',
          amount: '₦5780',
          type: 'Services'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Salaries',
          amount: '₦5677',
          type: 'Services'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Feed',
          amount: '₦234',
          type: 'Services'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Construction/Repairs',
          amount: '₦1000',
          type: 'Services'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Fuel',
          amount: '₦1000',
          type: 'Purchases'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Other',
          amount: '₦600',
          type: 'Purchases'
        }
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
