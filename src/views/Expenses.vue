<template>
  <section>
    <header>
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">Expenses</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn rounded color="primary" @click="createNew">
          Add Expenses
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
    </header>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="['calories', 'fat']"
      :sort-desc="[false, true]"
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
