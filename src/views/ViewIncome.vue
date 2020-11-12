<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-btn text color="primary" class="spacer--right" to="/income"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" tile rounded disabled>
        Edit Income
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-row class="mt-4">
      <v-col cols="12">
        <h1 class="display-1">Invoice
          <v-chip x-small class="text-uppercase">{{ invoice.paymentStatus }}</v-chip>
        </h1>
        <span class="subtitle-1" style="color: #858585">#INV-000{{invoice.id}}</span>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col md="5" style="text-align: left;">
            <span class="body-2 text-uppercase" style="color: #727272">farm</span><br>
            <span class="body-2 text-uppercase" style="color: #727272">fulfilment status</span><br>
            <span class="body-2 text-uppercase" style="color: #727272">invoice date</span><br>
            <span class="body-2 text-uppercase" style="color: #727272">payment date</span><br>
          </v-col>
          <v-divider vertical/>
          <v-col cols="6" :style="{'text-align' : `${$mq.phone ? 'right' : 'left'}`}">
            <span class="body-1 text-uppercase">{{ invoice.farmLocation }}</span><br>
            <span class="body-1">{{ invoice.fulfilmentStatus }}</span><br>
            <span class="body-1">{{ invoice.invoiceDate }}</span><br>
            <span class="body-1">{{ invoice.paymentDate }}</span><br>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer/>
      <v-col cols="12" md="4">
        <h3>Bill to:</h3>
       <v-card outlined class="pa-3">
         <customer-detail :customer="invoice.customer"/>
       </v-card>
      </v-col>
      <v-col cols="12">
        <v-data-table
          class="item__table"
          :headers="headers"
          :items="invoice.items"
          disable-sort
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.name="{ item }">
            <v-list dense class="pa-0" color="transparent">
              <v-list-item two-line class="pa-0">
                <v-list-item-avatar tile>
                  <v-img :src="`/../${item.thumbnail}`"/>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle class="caption">
                    {{ item.category }} | {{ item.brand }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
          <template v-slot:item.quantity="{ item }">
            {{ item.quantity / item.packagingSize | toMoney }} {{ item.packagingMetric }}
          </template>
          <template v-slot:item.amount="{ item }">
            ₦{{ item.price * (item.quantity / item.packagingSize) | toMoney }}
          </template>
          <template v-slot:item.discount="{ item }">
            ₦{{ item.discount | toMoney }}
          </template>
          <template v-slot:item.price="{ item }">
            ₦{{ item.price | toMoney }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <span>{{ invoice.notes }}</span>
      </v-col>
      <v-col cols="12" md="4">
        <div class="income__summary">
          <span>Total</span>
          <span>₦{{(invoice.amount + +invoice.discount) | toMoney}}</span>
          <span>Discount</span>
          <span>₦{{invoice.discount | toMoney}}</span>
          <strong>Total</strong>
          <strong>₦{{ invoice.amount | toMoney}}</strong>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import axios from '../plugins/axios';
import CustomerDetail from '../components/CustomerDetail.vue';

export default {
  name: 'ViewIncome',
  components: { CustomerDetail },
  data() {
    return {
      invoice: {},
      headers: [
        {
          text: 'SKU',
          align: 'start',
          value: 'id'
        },
        { text: 'Item name', value: 'name', width: '50%' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price' },
        { text: 'Discount', value: 'discount' },
        { text: 'Amount', value: 'amount' }
      ],
    };
  },
  methods: {
    getInvoice() {
      axios.get(`/invoices/${this.$route.params.id}`)
        .then(({ data }) => {
          this.invoice = data;
        });
    }
  },
  filters: {
    toMoney(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    }
  },
  created() {
    this.getInvoice();
  }
};
</script>

<style scoped>
  .item__table {
    margin-top: 30px;
  }

  .item__action {
    padding: 10px;
  }

  .income__summary {
    background-color: #e1e1e1;
    display: grid;
    grid-gap: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
  }

  .income__summary > :nth-child(even) {
    justify-self: end;
  }
</style>
