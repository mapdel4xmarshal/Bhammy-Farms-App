import ROUTES from './routeNames';

const routes = [{
  path: '/dashboard',
  name: ROUTES.DASHBOARD,
  alias: '/',
  component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
},
{
  path: '/activities',
  name: ROUTES.ACTIVITIES,
  component: () => import(/* webpackChunkName: "activities" */ '../views/Activities.vue')
},
{
  path: '/batches',
  name: ROUTES.BATCH,
  component: () => import(/* webpackChunkName: "batches" */ '../views/Batches.vue'),
},
{
  path: '/batches',
  name: ROUTES.BATCHES,
  component: () => import(/* webpackChunkName: "batches" */ '../views/Batches.vue'),
},
{
  path: '/customers',
  name: ROUTES.CUSTOMERS,
  component: () => import(/* webpackChunkName: "batches" */ '../views/Customers.vue'),
},
{
  path: '/expenses',
  name: ROUTES.EXPENSES,
  component: () => import(/* webpackChunkName: "expenses" */ '../views/Expenses.vue'),
},
{
  path: '/income',
  name: ROUTES.INCOME,
  component: () => import(/* webpackChunkName: "income" */ '../views/Income.vue'),
},
{
  path: '/income/:id',
  name: ROUTES.INCOME_DETAIL,
  component: () => import(/* webpackChunkName: "income" */ '../views/IncomeDetail.vue'),
},
{
  path: '/production',
  name: ROUTES.PRODUCTION,
  component: () => import(/* webpackChunkName: "production" */ '../views/Production.vue'),
},
{
  path: '/production/new',
  name: ROUTES.NEW_PRODUCTION,
  component: () => import(/* webpackChunkName: "production" */ '../views/ProductionDetail.vue'),
},
{
  path: '/schedules',
  name: ROUTES.SCHEDULES,
  component: () => import(/* webpackChunkName: "reminders" */ '../views/Reminders.vue'),
},
{
  path: '/report',
  name: ROUTES.REPORT,
  component: () => import(/* webpackChunkName: "report" */ '../views/Report.vue'),
},
{
  path: '/reports',
  name: ROUTES.REPORTS,
  component: () => import(/* webpackChunkName: "reports" */ '../views/Reports.vue'),
},
{
  path: '/store',
  name: ROUTES.STORE,
  component: () => import(/* webpackChunkName: "store" */ '../views/Store.vue'),
},
{
  path: '/settings',
  name: ROUTES.SETTINGS,
  component: () => import(/* webpackChunkName: "store" */ '../views/Settings.vue'),
}
];

export default routes;
