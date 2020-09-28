<template>
  <section>
    <income :active="showItemDialog" @cancel="showItemDialog = false" @addItem="addItem" v-if="showItemDialog"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">New Invoice</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="primary" class="spacer--right" @click="$router.push('/income')">cancel</v-btn>
      <v-btn tile color="primary" @click="save" :loading="busy">
        Save invoice
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-form ref="invoiceForm" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12">
              <v-select
                label="Farm"
                hint="Farm location"
                persistent-hint
                return-object
                required
                :rules="[v => !!v || 'Please select a farm.']"
                v-model="farm"
                item-text="name"
                item-value="name"
                :items="farmLocations"
              ></v-select>
            </v-col>
            <v-col cols="6">
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
                  :rules="[v => !!v || 'Please select invoice date.']"
                  persistent-hint
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="invoiceDate" no-title @input="invoiceDateMenu = false"></v-date-picker>
            </v-menu>
            </v-col>
            <v-col cols="6">
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
                  :rules="[v => !!v || 'Please select payment date.']"
                  hint="Payment date"
                  persistent-hint
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="paymentDate" no-title @input="paymentDateMenu = false"></v-date-picker>
            </v-menu>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Payment status"
                hint="Invoice's payment status."
                persistent-hint
                :items="['Paid', 'Partial', 'Unpaid']"
                return-object
                v-model="paymentStatus"
                :rules="[v => !!v || 'Please select a payment status.']"
                item-text="name"
                item-value="name"
                required>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                label="Fulfilment status"
                hint="Invoice's fulfilment status."
                persistent-hint
                :items="['Fulfilled', 'Partially fulfilled', 'Unfulfilled']"
                return-object
                v-model="fulfilmentStatus"
                :rules="[v => !!v || 'Please select a fulfilment status.']"
                item-text="name"
                item-value="name"
                required>
              </v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-col>
            <v-autocomplete
            v-model="customer"
            :items="customers"
            return-object
            required
            color="primary"
            no-data-text="No customers available."
            :rules="[v => !!v || 'Please select a customer.']"
            label="Customer"
            item-text="name"
            item-value="name"
            clearable
            @click:clear="resetCustomer"
          >
          </v-autocomplete>
          </v-col>
          <customer-detail :customer="customer"/>
        </v-col>
      </v-row>
    </v-form>
    <v-card>
      <v-data-table
        class="item__table"
        :headers="headers"
        :items="items"
        disable-sort
        disable-pagination
        no-data-text="No item selected. Please add an item."
        hide-default-footer
      >
        <template v-slot:item.amount="{ item }">
          ₦{{ item.amount | toMoney }}
        </template>
        <template v-slot:item.discount="{ item }">
          ₦{{ item.discount | toMoney }}
        </template>
        <template v-slot:item.price="{ item }">
          ₦{{ item.price | toMoney }}
        </template>
      </v-data-table>
      <v-card-actions>
      </v-card-actions>
    </v-card>

    <v-row justify="end" class="item__action">
      <v-btn outlined color="primary" text @click="showItemDialog = true; itemIndex = items.length">Add item</v-btn>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-textarea
          outlined
          height="100px"
          v-model="notes"
          label="Note"
          hint="Note"
          persistent-hint
        ></v-textarea>
      </v-col>
      <v-col cols="12" md="4">
        <div class="income__summary">
          <span>Total</span>
          <span>₦{{(totalAmount + discount) | toMoney}}</span>
          <span>Discount</span>
          <span>₦{{discount | toMoney}}</span>
          <strong>Total</strong>
          <strong>₦{{ totalAmount | toMoney}}</strong>
        </div>
      </v-col>
    </v-row>
    <v-row justify="end" class="item__action">
      <v-btn tile color="primary" @click="save" :loading="busy">
        Save invoice
      </v-btn>
    </v-row>
    <v-snackbar
      v-model="snackbar">
      {{ feedbackMessage }}
      <v-btn
        color="red"
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
import CustomerDetail from '../components/CustomerDetail.vue';
import Income from '../components/IncomeItem.vue';
import { GETTER_TYPES } from '../store/types';

export default {
  name: 'IncomeDetail',
  components: { Income, CustomerDetail },
  data() {
    return {
      busy: false,
      farm: {},
      feedbackMessage: '',
      snackbar: false,
      totalAmount: 0,
      discount: 0,
      showItemDialog: false,
      itemIndex: 0,
      invoiceDateMenu: false,
      paymentDateMenu: false,
      fulfilmentStatus: 'Fulfilled',
      paymentStatus: 'Unpaid',
      paymentDate: '',
      invoiceDate: '',
      notes: '',
      customer: null,
      customers: [],
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
        { text: 'Amount', value: 'amount' },
      ],
      items: []
    };
  },
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS,
    })
  },
  methods: {
    save() {
      if (!this.busy && this.$refs.invoiceForm.validate()) {
        this.busy = true;
        axios.post('/invoices', {
          farmLocation: this.farm.id,
          paymentDate: this.paymentDate,
          invoiceDate: this.invoiceDate,
          customerId: this.customer.id,
          paymentStatus: this.paymentStatus,
          fulfilmentStatus: this.fulfilmentStatus,
          notes: this.notes,
          items: this.items.map((item) => {
            const newItem = { ...item };
            /* todo: refactor logic */
            if (newItem.category.toLowerCase() === 'egg') {
              newItem.quantity *= 30;
            }
            return newItem;
          })
        })
          .then(() => {
            this.$router.push('/income');
          })
          .catch(({ response: { data } }) => {
            this.snackbar = true;
            this.feedbackMessage = data.error;
          })
          .finally(() => {
            this.busy = false;
          });
      }
    },
    getCustomers() {
      axios.get('/parties/customers')
        .then(({ data }) => {
          this.customers = data;
        });
    },
    addItem(item) {
      this.showItemDialog = false;
      this.items.splice(this.itemIndex, 1, item);
      this.calculateValues();
    },
    calculateValues() {
      this.totalAmount = 0;
      this.discount = 0;
      this.items.forEach((item) => {
        this.discount += (+item.discount);
        this.totalAmount += item.amount;
      });

      return this.item;
    },
    resetCustomer() {
      this.customer = {};
    }
  },
  filters: {
    toMoney(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    }
  },
  created() {
    this.getCustomers();
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
