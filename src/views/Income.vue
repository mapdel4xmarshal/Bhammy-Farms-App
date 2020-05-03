<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Income</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="createNew">
        Add new
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
  name: 'Income',
  data() {
    return {
      dateMenu: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Farm/Batch', value: 'batch' },
        { text: 'Customer', value: 'customer' },
        { text: 'Status', value: 'status' },
        { text: 'Amount (₦)', value: 'amount' },
      ],
      items: [
        {
          id: '0001',
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          status: 'Paid',
          amount: 5780,
          customer: 'Mrs Semirat'
        },
        {
          id: '0001',
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          status: 'Paid',
          amount: 5780,
          customer: 'Mrs Semirat'
        },
        {
          id: '0001',
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          status: 'Paid',
          amount: 5780,
          customer: 'Mrs Semirat'
        },
        {
          id: '0001',
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          status: 'Paid',
          amount: 5780,
          customer: 'Mrs Semirat'
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
