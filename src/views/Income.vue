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
          label="Payment status"
          v-model="paymentStatus"
          clearable
          @change="updatePaymentStatus"
          @click:clear="resetPaymentStatus"
          :items="['Paid', 'Partial', 'Unpaid']"
        ></v-select>
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
    <v-row class="mt-0 mb-3">
      <v-col cols="12" md="6" sm="6" lg="3">
        <v-card class="ma-auto elevation-1" height="100">
          <v-card-text class="pb-0">Paid orders</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ paidAmount | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6" lg="3">
        <v-card class="ma-auto elevation-1" height="100">
          <v-card-text class="pb-0">Unpaid orders</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ unpaidAmount | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6" lg="3">
        <v-card class="ma-auto elevation-1" height="100">
          <v-card-text class="pb-0">Partial orders</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ partialAmount | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6" lg="3">
        <v-card class="ma-auto elevation-1" height="100">
          <v-card-text class="pb-0">Total Amount</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ totalAmount | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      no-data-text="No invoices available."
      :headers="headers"
      :items="invoices"
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
      paymentStatus: null,
      menu: false,
      totalAmount: 0,
      unpaidAmount: 0,
      paidAmount: 0,
      partialAmount: 0,
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
      return this.date && this.date.length > 0 ? this.date.join(' ~ ') : null;
    }
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.INCOME_DETAIL, params: { id: 'new' } });
    },
    resetDate() {
      this.date = [];
      this.getInvoices();
    },
    updatePaymentStatus() {
      this.getInvoices();
    },
    resetPaymentStatus() {
      this.paymentStatus = null;
    },
    getInvoices() {
      const filters = [];
      if (this.date && this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date && this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);
      if (this.paymentStatus) filters.push(`paymentStatus=${this.paymentStatus}`);

      this.totalAmount = 0;
      this.paidAmount = 0;
      this.unpaidAmount = 0;
      this.partialAmount = 0;

      axios.get(`/invoices?${filters.join('&')}`)
        .then(({ data }) => {
          this.invoices = data;
          data.forEach((invoice) => {
            this.totalAmount += Number(invoice.amount);
            if (invoice.paymentStatus === 'paid') this.paidAmount += Number(invoice.amount);
            if (invoice.paymentStatus === 'unpaid') this.unpaidAmount += Number(invoice.amount);
            if (invoice.paymentStatus === 'partial') this.partialAmount += Number(invoice.amount);
          });
        });
    },
    updateDate() {
      this.$refs.menu.save(this.date);
      this.getInvoices();
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
