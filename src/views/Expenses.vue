<template>
  <section>
    <expense :active="newExpense"
             v-model="expense"
             :errored.sync="errored"
             @cancel="resetExpense"
             @save="addExpense"
             :types="expenseTypes"
             :title="title"
             ref="form"
             :farm-locations="farmLocations"
             :suppliers="suppliers"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="createExpense">
        New Expense
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="3">
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          v-model="menu"
          :return-value.sync="date"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="dateRangeText"
              label="Date"
              autocomplete="false"
              clearable
              @click:clear="resetDate"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" range>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="updateDate">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          label="Expense category"
          hide-details
          :items="['Purchase', 'Service']"
          v-model="category"
          clearable
          @change="changeCategory"
          @click:clear="resetCategory"
          return-object
          required
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          label="Expense type"
          :items="expenseTypes"
          hide-details
          item-text="name"
          item-value="name"
          clearable
          v-model="type"
          @change="getExpenses"
          @click:clear="type = null"
          required
        >
        </v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3">
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          hide-details
          v-model="search"
          width='100'
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-0 mb-3">
      <v-col cols="12" md="4" sm="6" lg="4">
        <v-card class="ma-auto elevation-1" height="100">
          <v-card-text class="pb-0">Purchase expenses</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ purchaseExpenses | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6" lg="4">
        <v-card class="ma-auto elevation-1" height="100">
          <v-card-text class="pb-0">Service expenses</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ serviceExpenses | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6" lg="4">
        <v-card class="ma-auto elevation-1" height="100">
          <v-card-text class="pb-0">Total expenses</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ totalExpenses | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <div class="spacer"></div>
    <v-data-table
      :headers="headers"
      :items="expenses"
      no-data-text="No expenses found. Please add one."
      :search="search"
      class="elevation-1 table-cursor"
      @click:row="selectExpense"
    >
      <template v-slot:item.provider="{ item }">
        {{ item.provider ? item.provider : '—' }}
      </template>
      <template v-slot:item.itemName="{ item }">
        {{ item.itemName ? item.itemName : '—' }}
      </template>
      <template v-slot:item.amount="{ item }">
        ₦{{ item.amount | formatNumber }}
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
      menu: false,
      date: null,
      errored: false,
      expense: {
        category: '',
        type: '',
        farm: '',
        pen: null,
        updateStoreInventory: true
      },
      search: '',
      snackbar: false,
      category: '',
      type: '',
      title: '',
      busy: false,
      purchaseExpenses: 0,
      serviceExpenses: 0,
      totalExpenses: 0,
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Farm', value: 'farmName' },
        { text: 'Pen', value: 'houseName' },
        { text: 'Category', value: 'category' },
        { text: 'Item', value: 'itemName' },
        { text: 'Provider', value: 'provider' },
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
    }),
    dateRangeText() {
      return this.date && this.date.length > 0 ? this.date.join(' ~ ') : null;
    }
  },
  methods: {
    resetExpense() {
      this.newExpense = false;
      this.$refs.form.reset();
    },
    createExpense() {
      this.newExpense = true;
      this.title = 'New Expense';
    },
    addExpense(expense) {
      const { id } = expense;
      if (this.busy) return;
      this.busy = true;
      axios[id ? 'patch' : 'post'](`expenses${id ? `/${id}` : ''}`, expense)
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
          this.$refs.form.reset();
          this.expense = {
            category: '',
            type: '',
            farm: '',
            pen: null,
            updateStoreInventory: true
          };
          this.busy = false;
        });
    },
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    },
    resetDate() {
      this.date = [];
      this.getExpenses();
    },
    changeCategory() {
      this.getExpenses();
    },
    resetCategory() {
      this.category = null;
    },
    getExpenses() {
      const filters = [];
      if (this.date && this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date && this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);
      if (this.category) filters.push(`category=${this.category}`);
      if (this.type) filters.push(`type=${this.type}`);

      this.purchaseExpenses = 0;
      this.serviceExpenses = 0;
      this.totalExpenses = 0;

      axios.get(`/expenses?${filters.join('&')}`)
        .then(({ data }) => {
          this.expenses = data.map((expense) => {
            const newExpense = expense;
            newExpense.amount = Number(newExpense.amount);
            newExpense.house = newExpense.house || '―';
            if (newExpense.category === 'Purchase') this.purchaseExpenses += newExpense.amount;
            if (newExpense.category === 'Service') this.serviceExpenses += newExpense.amount;
            this.totalExpenses += newExpense.amount;
            return newExpense;
          });
        });
    },
    getTypes() {
      axios.get('expenses/types')
        .then(({ data }) => {
          this.expenseTypes = data;
        });
    },
    updateDate() {
      this.$refs.menu.save(this.date);
      this.getExpenses();
    },
    selectExpense(expense) {
      this.newExpense = true;
      this.expense = { ...expense, attachment: null };
      this.expense.updateStoreInventory = !Number.isNaN(expense.item);
      this.title = 'View Expense';
    }
  },
  created() {
    this.getExpenses();
    this.getTypes();
    this.$store.dispatch(ACTION_TYPES.GET_SUPPLIERS);
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    }
  }
};
</script>
<style>
  .spacer {
    height: 10px;
  }
  .table-cursor tbody tr:hover {
    cursor: pointer;
  }
</style>
