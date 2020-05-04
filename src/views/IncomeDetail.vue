<template>
  <section>
    <income :active="addItem" @update="addItem = false"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">New Income</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="primary" class="spacer--right">cancel</v-btn>
      <v-btn tile color="primary" @click="save">
        Save invoice
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <v-menu
        ref="invoiceDateMenu"
        v-model="invoiceDateMenu"
        :close-on-content-click="false"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="invoiceDate"
            label="Invoice date"
            hint="Invoice date"
            persistent-hint
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="invoiceDate" no-title @input="invoiceDateMenu = false"></v-date-picker>
      </v-menu>
        <v-menu
          ref="paymentDateMenu"
          v-model="paymentDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="paymentDate"
              label="Payment date"
              hint="Payment date"
              persistent-hint
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="paymentDate" no-title @input="paymentDateMenu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          v-model="customer"
          :items="customers"
          return-object
          color="primary"
          label="Customer"
          item-text="name"
          item-value="name"
          clearable
          @click:clear="resetCustomer"
        >
        </v-autocomplete>
        <customer-detail :customer="customer"/>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table
        class="item__table"
        :headers="headers"
        :items="items"
        disable-sort
        disable-pagination
        hide-default-footer
      ></v-data-table>
      <v-card-actions>
      </v-card-actions>
    </v-card>

    <v-row justify="end" class="item__action">
      <v-btn outlined color="primary" text @click="addItem = true">Add item</v-btn>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-textarea
          outlined
          height="100px"
          label="Note"
          hint="Note"
          persistent-hint
        ></v-textarea>
      </v-col>
      <v-col cols="12" md="4">
        <div class="income__summary">
          <span>Total</span>
          <span>₦12,000.00</span>
          <span>Discount</span>
          <span>₦0.00</span>
          <strong>Total</strong>
          <strong>₦12,000.00</strong>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import CustomerDetail from '../components/CustomerDetail.vue';
import Income from '../components/IncomeItem.vue';

export default {
  name: 'IncomeDetail',
  components: { Income, CustomerDetail },
  data() {
    return {
      addItem: false,
      invoiceDateMenu: false,
      paymentDateMenu: false,
      paymentDate: '',
      invoiceDate: '',
      customer: {},
      customers: [
        { name: 'Semira Bolanle', address: 'House 35 Test Address', phone: '080900099988' },
        { name: 'Mrs Bolanle', address: 'House 35 Test Address', phone: '080900099988' },
        { name: 'Mummy Ramadan', address: 'House 35 Test Address', phone: '080900099988' },
        { name: 'Mummy Baraka', address: 'House 35 Test Address', phone: '080900099988' },
        { name: 'Edo Egg', address: 'House 35 Test Address', phone: '080900099988' },
        { name: 'Ogele Egg', address: 'House 35 Test Address', phone: '080900099988' },
      ],
      headers: [
        {
          text: 'SKU',
          align: 'start',
          value: 'id'
        },
        { text: 'Item name', value: 'name', width: '65%' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price' },
        { text: 'Discount', value: 'discount' },
        { text: 'Amount', value: 'totalAmount' },
      ],
      items: [
        {
          id: '212',
          name: 'Large sized egg',
          quantity: 127,
          totalAmount: '₦5780',
          price: '₦800',
          discount: '₦50'
        },
        {
          id: '121',
          name: 'Medium sized egg',
          quantity: 100,
          totalAmount: '₦672',
          price: '₦700',
          discount: '₦50'
        }
      ]
    };
  },
  methods: {
    save() {

    },
    resetCustomer() {
      this.customer = {};
    }
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
