<template>
  <section>
    <expense :active="newExpense"
             :errored.sync="errored"
             @cancel="newExpense = false"
             @save="addExpense"
             :types="expenseTypes"
             :farm-locations="farmLocations"
             :suppliers="suppliers"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="newExpense = true">
        New Expense
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="2">
        <v-select
          label="Expense category"
          hide-details
          :items="['Purchase', 'Service']"
          return-object
          required
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          label="Expense type"
          :items="expenseTypes"
          hide-details
          item-text="name"
          item-value="name"
          return-object
          required
        >
        </v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          hide-details
          v-model="search"
          width='100'
        ></v-text-field>
      </v-col>
    </v-row>
    <div class="spacer"></div>
    <v-data-table
      :headers="headers"
      :items="expenses"
      multi-sort
      no-data-text="No expenses found. Please add one."
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.amount="{ item }">
        ₦{{ item.amount }}
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
    >
      Expense created successfully.
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
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import { ACTION_TYPES, GETTER_TYPES } from '../store/types';
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
      errored: false,
      search: '',
      snackbar: false,
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Farm', value: 'farm' },
        { text: 'Pen', value: 'house' },
        { text: 'Batch', value: 'batch' },
        { text: 'Type', value: 'type' },
        { text: 'Category', value: 'category' },
        { text: 'Amount', value: 'amount' }
      ],
      expenses: [],
      expenseTypes: []
    };
  },
  computed: {
    ...mapGetters({
      suppliers: GETTER_TYPES.SUPPLIERS,
      farmLocations: GETTER_TYPES.FARM_LOCATIONS
    })
  },
  methods: {
    addExpense(expense) {
      axios.post('expenses', expense)
        .then(({ data }) => {
          if (data) {
            this.snackbar = true;
            this.newExpense = false;
            this.errored = false;
          }
        })
        .catch(() => {
          this.errored = true;
        })
        .finally(() => {
          this.getExpenses();
        });
    },
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    },
    getExpenses() {
      axios.get('expenses')
        .then(({ data }) => {
          this.expenses = data;
        });
    },
    getTypes() {
      axios.get('expenses/types')
        .then(({ data }) => {
          this.expenseTypes = data;
        });
    }
  },
  created() {
    this.getExpenses();
    this.getTypes();
    this.$store.dispatch(ACTION_TYPES.GET_SUPPLIERS);
  }
};
</script>
<style>
  .spacer {
    height: 10px;
  }
</style>
