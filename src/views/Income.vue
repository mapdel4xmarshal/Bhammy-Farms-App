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
              v-model="dateRangeText"
              label="Date"
              autocomplete="false"
              clearable
              @click:clear="date = null && getInvoices()"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" range landscape>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="updateDate">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
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
  computed: {
    dateRangeText() {
      return this.date && this.date.length > 0 ? this.date.join(' ~ ') : [];
    }
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.INCOME_DETAIL, params: { id: 'new' } });
    },
    getInvoices() {
      const filters = [];
      if (this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);

      axios.get(`/invoices?${filters.join('&')}`)
        .then(({ data }) => {
          this.invoices = data;
        });
    },
    updateDate() {
      this.$refs.menu.save(this.date);
      this.getInvoices();
    },
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
