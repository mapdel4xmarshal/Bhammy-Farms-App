<template>
  <div>
    <item
      :data="selectedItem"
      :edit-mode="itemEditMode"
      :show.sync="showItemDialog"
    />

    <!-- <div class="scroll-section">
     <div class="invoice-details">
       <span class="title">
         Invoice details
       </span>
       <div style="width: 100%;">
         <div id="invoice-id">
           <label for="invoice-date">Invoice#</label>
           <span>INVOICE# 23542</span>
         </div>

         <div id="invoice-status">
           <label for="payment-date">Status</label>
           <span class="draft">new</span>
           <input type="date" v-model="invoice.paymentDate">
         </div>

         <div id="invoice-date">
           <label for="invoice-date">Invoice date</label>
           <input type="date" v-model="invoice.invoiceDate">
           <span>JUNE 29, 2019</span>
         </div>

         <div id="payment-date">
           <label for="payment-date">Payment date</label>
           <input type="date" v-model="invoice.paymentDate">
           <span>JUNE 29, 2019</span>
         </div>

       </div>
     </div>

     <div class="customer-info">
       <strong class="title">
         Customer
       </strong>
       <div class="customer" @click="showFullCustomerDetails = !showFullCustomerDetails">
         <strong>Mr Bamidele Mapayi</strong>
         <div v-if="!showFullCustomerDetails">
           House 24, Mandate Estate. <br>
           Ilorin.<br>
           080730000000
         </div>
         <div style="margin: auto; text-align: center;">
           <font-awesome-icon v-if="showFullCustomerDetails" icon="angle-down"></font-awesome-icon>
           <font-awesome-icon v-else icon="angle-up"></font-awesome-icon>
         </div>
         <span id="edit">
           <font-awesome-icon icon="edit"></font-awesome-icon>
         </span>
       </div>
     </div>

     <div class="items-title"><strong>Items</strong></div>
     <div class="items__container">
       <custom-table :records="invoice.items"
                     :title="'Items'"
                     :clickHandler="itemClickHandler"
                     :headers="itemsHeader">
       </custom-table>

       <button style="margin:10px 0;">+ New Item</button>

     </div>

     <div class="invoice-footer">
       <div id="invoice-summary">
         <strong class="summary-title">Net total</strong>
         <strong class="value">₦37,098</strong>

         <span class="summary-title">Discount</span>
         <span class="value">&mdash;</span>

         <strong id="total" class="summary-title">TOTAL</strong>
         <strong class="value summary-total">₦67,098</strong>
       </div>
       <div id="comment">
         <textarea>Comment...</textarea>
       </div>
     </div>
     <br>
     <small>
       <strong>Last Modified </strong> by Emmanuel on 19-11-2019
     </small>
   </div>-->

    <section class="invoice">
      <app-page-header :has-search="false">
        <template v-slot:controls>
          <v-btn
            rounded
            :loading="savingInvoice"
            :disabled="savingInvoice"
            color="primary"
            @click="savingInvoice = !savingInvoice"
          >
            Save invoice
          </v-btn>
        </template>

        <template v-slot:title>
          <h2>INVOICE# 23542</h2>
        </template>
      </app-page-header>

      <div class="invoice__detail">
        <div class="invoice__detail--left">
          <v-select
            :items="['Ajegunle', 'Ote Town']"
            label="Farm"
          />

          <v-select
            :items="[]"
            label="Solo field"
          />

          <div>
            <v-menu
              v-model="showPaymentDatePicker"
              :close-on-content-click="false"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="invoice.paymentDate"
                  label="Invoice date"
                  v-on="on"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker v-model="invoice.paymentDate" @input="showPaymentDatePicker = false"/>
            </v-menu>
          </div>

          <div>
            <v-menu
              v-model="showPaymentDatePicker"
              :close-on-content-click="false"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="invoice.paymentDate"
                  label="Payment date"
                  v-on="on"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker v-model="invoice.paymentDate" @input="showPaymentDatePicker = false"/>
            </v-menu>
          </div>
        </div>
        <div class="invoice__detail--right">
          <add-customer @update="updateCustomer"/>
          <customer-detail :customer="customer"/>
        </div>
      </div>

      <div class="items__title"><strong>Items</strong></div>
      <div v-if="invoice.items.length > 0" class="items__container">
        <custom-table :records="invoice.items"
                      :title="'Items'"
                      :clickHandler="editItem"
                      :headers="itemsHeader">
        </custom-table>

        <div class="items__add-item">
          <v-btn
            :disabled="savingInvoice"
            rounded
            outlined
            color="primary"
            @click="addItem">
            + Add item
          </v-btn>
        </div>

        <div class="invoice__footer">
          <textarea class="invoice__comment">Comment...</textarea>
          <div class="invoice__summary">
            <strong>Net total</strong>
            <strong>₦37,098</strong>

            <span>Discount</span>
            <span>&mdash;</span>

            <strong id="total">TOTAL</strong>
            <strong class="value summary-total">₦67,098</strong>
          </div>
        </div>
        <br>
        <small>
          <strong>Last Modified </strong> by Emmanuel on 19-11-2019
        </small>
      </div>

      <v-card v-else class="items__container--empty">
        <br>
        No items yet.
        <p>Start adding items to your invoice now.</p>
        <v-btn
          :disabled="savingInvoice"
          rounded
          outlined
          color="primary"
          @click="addItem">
          + Add item
        </v-btn>
      </v-card>
    </section>
  </div>
</template>

<script>
import CustomTable from '@/components/common/CustomTable';
import Item from './Item';
import AppPageHeader from '../common/AppPageHeader';
import ButtonPill from '../common/ButtonPill';
import AddCustomer from '../common/AddCustomer';
import CustomerDetail from '../common/CustomerDetail';

export default {
  name: 'NewInvoice',
  data() {
    return {
      customer: {},
      savingInvoice: false,
      showPaymentDatePicker: false,
      invoice: {
        paymentDate: '',
        invoiceDate: '',
        items: [
          {
            id: 1,
            name: 'Jumbo Sized Egg',
            price: '850',
            quantity: 100,
            discount: '0.00',
            total: 85000,
            size: 'Jumbo',
            type: 'Egg',
          },
          {
            id: 2,
            name: 'Medium Sized Egg',
            price: '750',
            quantity: 100,
            discount: '0.00',
            total: 75000,
            size: 'Medium',
            type: 'Egg',
          },
          {
            id: 3,
            name: 'Pullet Sized Egg',
            price: '600',
            quantity: 100,
            discount: '0.00',
            total: 60000,
            size: 'Pullet',
            type: 'Egg',
          },
        ],
      },
      showFullCustomerDetails: false,
      itemsHeader: [
        {
          label: 'SKU', id: 'id', width: '5%', breakPoint: 'medium',
        },
        { label: 'Name', id: 'name', width: '50%' },
        {
          label: 'Price',
          id: 'price',
          representedAs(record) {
            return `₦${record.price}`;
          },
        },
        { label: 'Qty', id: 'quantity' },
        {
          label: 'Disc.',
          id: 'discount',
          breakPoint: 'medium',
          representedAs(record) {
            return `₦${record.discount}`;
          },
        },
        {
          label: 'Total',
          id: 'amount',
          representedAs(record) {
            return `₦${record.total}`;
          },
        },
      ],
      showItemDialog: false,
      selectedItem: {},
      itemEditMode: false,
      show: true,
    };
  },
  components: {
    CustomerDetail,
    AddCustomer,
    ButtonPill,
    AppPageHeader,
    Item,
    CustomTable,
  },
  methods: {
    editItem(item) {
      this.showItemDialog = true;
      this.selectedItem = item;
      this.itemEditMode = true;
    },
    addItem() {
      this.showItemDialog = true;
      this.selectedItem = {};
      this.itemEditMode = false;
    },
    updateCustomer(customer) {
      this.customer = customer;
    },
  },
  created() {
    const currentDate = new Date().toISOString().split('T')[0];
    this.invoice.invoiceDate = currentDate;
    this.invoice.paymentDate = currentDate;
    this.invoice.id = new Date().getTime();
  },
};
</script>

<style lang="scss" scoped>
  @import "../../scss/global.scss";

  .invoice__footer {
    display: grid;
    grid-template-columns: 100%;
    grid-gap: 10px;
    flex: 1;

    @include respond-to(tablet) {
      grid-template-columns: 3fr minmax(200px, 1.5fr);
    }
  }

  .invoice__detail {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &--left {
      display: grid;
      grid-template-columns: 2fr 2fr;
      grid-column-gap: 20px;
      flex: 1 1 100%;
    }

    &--right {
      flex: 1 1 100%;
    }

    @include respond-to(tablet) {
      &--left {
        flex: 1 1 45%;
        margin-right: 20px;
      }

      &--right {
        flex: 1 1 45%;
        margin-left: 20px;
      }
    }
  }

  .invoice__summary {
    background-color: #e1e1e1;
    display: grid;
    grid-gap: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;

    > :nth-child(even) {
      justify-self: end;
    }
  }

  .invoice__comment {
    border: 1px dashed rgb(128, 128, 128);
    background-color: transparent;
    color: #808080;
    padding: 5px;
    resize: none;
  }

  .items__add-item {
    display: flex;
    margin: 10px;
    flex-direction: row-reverse;
  }

  .items__container--empty {
    text-align: center;
    margin-bottom: 50px;
  }
</style>
