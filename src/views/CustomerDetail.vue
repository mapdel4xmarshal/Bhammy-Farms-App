<template>
  <v-sheet color="transparent">
    <customer :active="edit" @update="customerUpdated" v-model="customer" :edit-mode="true"/>
    <div class="d-flex header" no-gutters>
       <div class="mr-auto">
         <v-btn tile text class="pl-0" color="primary" to="/customers">
           <v-icon>mdi-chevron-left</v-icon> Back
         </v-btn>
       </div>
       <div class="ml-auto">
         <v-dialog
                   v-model="showDialog"
                   width="600px"
                   v-if="$mq.phone || $mq.tablet"
                   allow-overflow
                   transition="slide-x-reverse-transition"
         >
           <template v-slot:activator="{ on }">
             <v-btn class="mx-2" icon dark color="primary" v-on="on">
               <v-icon large>mdi-account-circle</v-icon>
             </v-btn>
           </template>

           <customer-card :customer="customer" @edit="edit = true"/>
         </v-dialog>
       </div>
     </div>
    <v-row>
      <v-col cols="12" md="4" lg="3" v-if="!$mq.phone && !$mq.tablet" class="pt-6">
        <customer-card :customer="customer" @edit="edit = true"/>
      </v-col>
      <v-col cols="12" :md="$mq.tablet ? 12 : 8" sm="12" lg="9">
        <v-row>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100">
              <v-card-text class="pb-0">Paid orders</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ paidAmount | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100">
              <v-card-text class="pb-0">Unpaid orders</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ unpaidAmount | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100">
              <v-card-text class="pb-0">Partial orders</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ partialAmount | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100">
              <v-card-text class="pb-0">Total Amount</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ totalAmount | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12">
            <chart :options="chartOptions"></chart>
          </v-col>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="customer.invoices"
              no-data-text="No orders found."
              class="elevation-1 table-cursor"
            >
              <template v-slot:item.amount="{ item }">
                ₦{{ item.amount | formatNumber }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
    >
      Customer updated successfully.
      <v-btn
        color="blue"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-sheet>
</template>

<script>
import { Chart } from 'highcharts-vue';
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import { GETTER_TYPES } from '../store/types';
import Customer from '../components/Customer.vue';
import CustomerCard from '../components/CustomerCard.vue';

export default {
  name: 'CustomerDetail',
  data() {
    return {
      snackbar: false,
      showDialog: false,
      customer: {},
      chartData: {},
      totalAmount: 0,
      unpaidAmount: 0,
      paidAmount: 0,
      partialAmount: 0,
      edit: false,
      chartOptions: {
        chart: {
          backgroundColor: 'transparent',
          spacingTop: 30
        },
        title: false,
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          labels: {
            /* eslint-disable-next-line object-shorthand */
            formatter: function () {
              return `₦${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(this.value / 1000)}k`;
            }
          },
          title: false
        },
        series: [{
          name: 'Amount',
          type: 'areaspline',
          color: '#7f2775',
          fillOpacity: 0.1,
          data: [{ x: new Date(), y: 0 }]
        }]
      },
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Date', value: 'invoiceDate' },
        { text: 'Payment status', value: 'paymentStatus' },
        { text: 'Amount', value: 'amount' }]
    };
  },
  components: { CustomerCard, Chart, Customer },
  computed: {
    ...mapGetters({
      user: GETTER_TYPES.USER
    })
  },
  methods: {
    getCustomer() {
      axios.get(`/parties/customers/${this.$route.params.id}`)
        .then(({ data }) => {
          this.customer = data;
          this.chartData = [];
          this.totalAmount = 0;
          this.paidAmount = 0;
          this.unpaidAmount = 0;
          this.partialAmount = 0;
          this.customer.altPhone = this.customer.altPhone || '―';
          this.customer.invoices.sort((i1, i2) => new Date(i2.invoiceDate) - new Date(i1.invoiceDate));
          this.customer.invoices = data.invoices.map((invoice) => {
            /* eslint-disable prefer-destructuring */
            const newInvoice = { ...invoice };
            newInvoice.invoiceDate = invoice.invoiceDate.split('T')[0];
            newInvoice.paymentStatus = newInvoice.paymentStatus.toUpperCase();
            if (!this.chartData[invoice.invoiceDate]) {
              this.chartData[invoice.invoiceDate] = {
                x: new Date(invoice.invoiceDate).getTime(),
                y: Number(newInvoice.amount)
              };
            } else this.chartData[invoice.invoiceDate].y += Number(newInvoice.amount);
            this.chartOptions.series[0].data = Object.values(this.chartData).reverse();
            newInvoice.amount = Number(newInvoice.amount);
            this.totalAmount += newInvoice.amount;
            if (newInvoice.paymentStatus === 'PAID') this.paidAmount += newInvoice.amount;
            if (newInvoice.paymentStatus === 'UNPAID') this.unpaidAmount += newInvoice.amount;
            if (newInvoice.paymentStatus === 'PARTIAL') this.partialAmount += newInvoice.amount;
            return newInvoice;
          });
        });
    },
    customerUpdated(state) {
      this.snackbar = state;
      this.edit = false;
      this.showDialog = false;
      this.getCustomer();
    }
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    }
  },
  created() {
    this.getCustomer();
  }
};
</script>

<style scoped>
  .header {
    width: 100%;
  }
</style>
