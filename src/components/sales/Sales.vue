<template>
  <div>
    <transition name="slide-fade" appear mode="out-in">
      <router-view :invoices="invoices"></router-view>
      <router-view name="summary" />
    </transition>
  </div>

</template>

<script>
import InvoiceRow from './InvoiceList';
import ViewInvoice from './ViewInvoice';
import NewInvoice from './Invoice';
import ButtonPill from '../common/ButtonPill';
import AppPageHeader from '../common/AppPageHeader';

export default {
  name: 'sales',
  data() {
    return {
      invoiceSection: 1,
      selectedInvoiceData: {},
      invoices: [
        {
          id: 223,
          customerName: 'Mrs. Saliu Semira.',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 324099,
          paymentStatus: 'paid',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 2230,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 394099,
          paymentStatus: 'unpaid',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 2293,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: '1,394,990',
          paymentStatus: 'due',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 12293,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 394099,
          paymentStatus: 'partial',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 93,
          customerName: 'Mrs. Mapayi Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 1394099,
          paymentStatus: 'draft',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 2237,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 324099,
          paymentStatus: 'paid',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 22307,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 394099,
          paymentStatus: 'unpaid',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 22937,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: '1,394,990',
          paymentStatus: 'due',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 122937,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 394099,
          paymentStatus: 'partial',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 937,
          customerName: 'Mrs. Mapayi Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 1394099,
          paymentStatus: 'draft',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 2239,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 324099,
          paymentStatus: 'paid',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 22309,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 394099,
          paymentStatus: 'unpaid',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 22939,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: '1,394,990',
          paymentStatus: 'due',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 122939,
          customerName: 'Mrs. Saliu Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 394099,
          paymentStatus: 'partial',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
        {
          id: 939,
          customerName: 'Mrs. Mapayi Semira',
          description: '200 crates of Jumbo Eggs. 100 crates of pullets.',
          created: 'Jan. 24 2018',
          modified: 'Jan. 24 2018',
          amount: 1394099,
          paymentStatus: 'draft',
          items: [
            {
              id: 433, name: 'Medium size egg', price: 750, discount: 10, quantity: 100, total: 74000,
            },
            {
              id: 562, name: 'Jumbo size egg', price: 900, discount: 50, quantity: 100, total: 85000,
            },
            {
              id: 675, name: 'Pullet size egg', price: 600, discount: 0, quantity: 50, total: 30000,
            },
          ],
        },
      ],
    };
  },
  components: {
    appButtonPill: ButtonPill,
    appInvoiceRow: InvoiceRow,
    appViewInvoice: ViewInvoice,
    appNewInvoice: NewInvoice,
    appPageHeader: AppPageHeader,
  },
  methods: {
    viewInvoice(invoice) {
      console.log(invoice);
      this.invoiceSection = 3;
      this.selectedInvoiceData = invoice;
    },
  },
};
</script>

<style scoped>

  .scroll-section{
    overflow-y: auto;
    height: calc(100vh - 120px);
  }

  .action-menu{
    background-color: white;
    border-radius: 3px;
    /*padding: 10px 0;*/
    text-align: center;
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    position: relative;
    z-index: 19;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    //box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 0px 4px 5px -5px rgba(0,0,0,0.75);
  }

  .summary-box span{
    font-size: 10px;
  }

  .action-box{
    text-align: center;
    display: inline-block;
    border-right: 1px solid #808080;
    cursor: pointer;
    padding: 5px 0;
  }

  .action-box:hover{
    background-color: #eee;
  }

  .action-menu .action-box:last-child{
    border-right: none !important;
  }

  .action-box svg{
    font-size: 20px !important;
  }

  .action-box span{
    font-size: 14px;
    display: block;
  }

  #sales-header{
   /* margin-bottom: 10px;*/
  }

  input{
    width:100%
  }

  .imenu:after {
    content: '\2807';
    font-size: 15px;
  }
</style>
