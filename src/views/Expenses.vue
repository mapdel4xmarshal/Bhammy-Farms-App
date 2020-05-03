<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="createNew">
        New Expenses
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

export default {
  name: 'Expenses',
  data() {
    return {
      dateMenu: false,
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
        { text: 'Category', value: 'category' },
        { text: 'Type', value: 'type' },
        { text: 'Amount (₦)', value: 'amount' },
      ],
      items: [
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Transport',
          amount: 5780,
          type: 'One time'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Medication',
          amount: 5780,
          type: 'Recurring'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Salaries',
          amount: 5677,
          type: 'Recurring'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Feed',
          amount: 234,
          type: 'Recurring'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Construction/Repairs',
          amount: 1000,
          type: 'Recurring'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Fuel',
          amount: 1000,
          type: 'One time'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Other',
          amount: 600,
          type: 'One time'
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
