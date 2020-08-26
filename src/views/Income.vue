<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Income</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="createNew">
        Add Income
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
      no-data-text="No invoices available."
      :headers="headers"
      :items="invoices"
      multi-sort
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.status="{ item }">
        <v-chip class="payment-status"
                pill
                :class="{[`payment-status--${item.paymentStatus}`]: true}" outlined="">{{ item.paymentStatus }}</v-chip>
      </template>
      <template v-slot:item.amount="{ item }">
        ₦{{ item.amount | formatNumber }}
      </template>
      <template v-slot:item.id="{ item }">
        {{ item.id | pad }}
      </template>
    </v-data-table>

  </section>
</template>

<script>
import axios from '../plugins/axios';
import ROUTES from '../router/routeNames';

export default {
  name: 'Income',
  data() {
    return {
      invoices: [],
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
          text: 'Invoice Date',
          sortable: true,
          value: 'invoiceDate',
        },
        {
          text: 'Payment Date',
          sortable: true,
          value: 'paymentDate',
        },
        { text: 'Farm', value: 'farmLocation' },
        { text: 'Customer', value: 'customerName' },
        { text: 'Amount', value: 'amount' },
        { text: 'Payment Status', value: 'status', align: 'end' },
      ]
    };
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.INCOME_DETAIL, params: { id: 'new' } });
    },
    getInvoices() {
      axios.get('/invoices')
        .then(({ data }) => {
          this.invoices = data;
        });
    }
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    },
    pad(value) {
      return value.toString().padStart(4, '0');
    }
  },
  created() {
    this.getInvoices();
  }
};
</script>

<style lang="scss">
  .payment-status {
    text-transform: uppercase;

    &--paid {
      border-color: green !important;
    }

    &--unpaid {
      border-color: crimson !important;
    }

    &--partial {
      border-color: #2b2b2b !important;
    }
  }
</style>
