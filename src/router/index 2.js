import HelloWorld from '../components/Home.vue';
import Sales from '../components/sales/Sales.vue';
import InvoiceRecords from '../components/sales/InvoiceList.vue';
import NewInvoice from '../components/sales/Invoice.vue';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: HelloWorld,
  },
  {
    path: '/production',
    name: 'production',
    component: HelloWorld,
  },
  {
    path: '/sales',
    name: 'sales',
    components: {
      default: Sales,
    },
    children: [
      {
        path: '',
        name: 'allSales',
        component: InvoiceRecords,
      },
      {
        path: 'new',
        name: 'newSale',
        component: NewInvoice,
      },
    ],
  },
  {
    path: '*',
    name: 'redirection',
    redirect: { name: 'dashboard' },
  },
];

export default routes;
