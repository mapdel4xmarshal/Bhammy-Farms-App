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

    <v-toolbar class="pa-0" color="transparent elevation-0" dense>
      <v-spacer/>
      <v-btn-toggle
        dense
        rounded
        class="pr-0"
        v-model="mode"
        mandatory
      >
        <v-btn small>
          Items sold
        </v-btn>
        <v-btn small>
          Payment status
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-row class="mt-0 mb-3" v-if="!mode">
      <v-col v-for="(summary, index) in incomeSummary" :key="index" class="pa-1">
        <v-card outlined>
          <v-list dense>
            <v-list-item>
              <v-list-item-avatar size="60">
                <v-img :src="`/${summary.thumbnail}`"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="caption text-uppercase" style="color: rgb(114, 114, 114);">
                  {{ summary.itemName }}</v-list-item-title>
                <span class="body-2">{{ summary.quantityText }}</span>
                <v-list-item-title class="title">
                  <strong>₦{{ summary.itemAmount | formatNumber }}</strong>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-0 mb-3" v-else>
      <v-col cols="12" md="6" sm="6" lg="3" class="pa-1">
        <v-card class="ma-auto" height="100" outlined>
          <v-card-text class="pb-0">Paid orders</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ paidAmount | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6" lg="3" class="pa-1">
        <v-card class="ma-auto" height="100" outlined>
          <v-card-text class="pb-0">Unpaid orders</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ unpaidAmount | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6" lg="3" class="pa-1">
        <v-card class="ma-auto" height="100" outlined>
          <v-card-text class="pb-0">Partial orders</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            ₦ {{ partialAmount | formatNumber }}</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6" lg="3" class="pa-1">
        <v-card class="ma-auto" height="100" outlined>
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
      class="elevation-1 table-cursor"
      @click:row="selectInvoice"
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
import pluralize from 'pluralize';
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
      mode: 0,
      totalAmount: 0,
      unpaidAmount: 0,
      paidAmount: 0,
      partialAmount: 0,
      incomeSummary: [],
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
    selectInvoice(invoice) {
      this.$router.push({ name: ROUTES.INCOME_DETAIL, params: { id: invoice.id } });
    },
    createNew() {
      this.$router.push({ name: ROUTES.NEW_INCOME, params: { id: 'new' } });
    },
    resetDate() {
      this.date = [];
      this.getInvoices();
    },
    updatePaymentStatus() {
      this.getInvoices();
      this.getInvoiceSummary();
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
    getInvoiceSummary() {
      const filters = [];
      if (this.date && this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date && this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);
      if (this.paymentStatus) filters.push(`paymentStatus=${this.paymentStatus}`);
      this.incomeSummary = [];

      axios.get(`/invoices/summary?${filters.join('&')}`)
        .then(({ data }) => {
          this.incomeSummary = data.map((_summary) => {
            const summary = { ..._summary };
            const quantity = +summary.quantity / +summary.packagingSize;
            summary.quantityText = `${Intl.NumberFormat('en-US').format(quantity)}
            ${pluralize(summary.packagingMetric, quantity)}`;
            return summary;
          });
        });
    },
    updateDate() {
      this.$refs.menu.save(this.date);
      this.getInvoiceSummary();
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
    this.getInvoiceSummary();
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

    .table-cursor tbody tr:hover {
      cursor: pointer;
    }
  }
</style>
