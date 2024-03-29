import ROUTES from './routeNames';

const routes = [
  {
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
    path: '/batches/:id',
    name: ROUTES.BATCH_DETAIL,
    component: () => import(/* webpackChunkName: "batches" */ '../views/BatchDetail.vue'),
  },
  {
    path: '/customers',
    name: ROUTES.CUSTOMERS,
    component: () => import(/* webpackChunkName: "customers" */ '../views/Customers.vue'),
  },
  {
    path: '/customers/:id',
    name: ROUTES.CUSTOMER_DETAIL,
    component: () => import(/* webpackChunkName: "customers" */ '../views/CustomerDetail.vue'),
  },
  {
    path: '/employees/new',
    name: ROUTES.EMPLOYEE,
    component: () => import(/* webpackChunkName: "employees" */ '../components/Employee.vue'),
  },
  {
    path: '/employees/:id',
    name: ROUTES.VIEW_EMPLOYEE,
    component: () => import(/* webpackChunkName: "employees" */ '../views/ViewEmployee.vue'),
  },
  {
    path: '/employees/:id/edit',
    name: ROUTES.EDIT_EMPLOYEE,
    component: () => import(/* webpackChunkName: "employees" */ '../components/Employee.vue'),
  },
  {
    path: '/employees',
    name: ROUTES.EMPLOYEES,
    component: () => import(/* webpackChunkName: "employees" */ '../views/Employees.vue'),
  },
  {
    path: '/expenses',
    name: ROUTES.EXPENSES,
    component: () => import(/* webpackChunkName: "expenses" */ '../views/Expenses.vue'),
  },
  {
    path: '/feedmill',
    name: ROUTES.FEEDS,
    component: () => import(/* webpackChunkName: "expenses" */ '../views/Feeds.vue'),
  },
  {
    path: '/income',
    name: ROUTES.INCOME,
    component: () => import(/* webpackChunkName: "income" */ '../views/Income.vue'),
  },
  {
    path: '/income/new',
    name: ROUTES.NEW_INCOME,
    component: () => import(/* webpackChunkName: "income" */ '../views/IncomeDetail.vue'),
  },
  {
    path: '/income/:id',
    name: ROUTES.INCOME_DETAIL,
    component: () => import(/* webpackChunkName: "income" */ '../views/ViewIncome.vue'),
  },
  {
    path: '/income/:id/edit',
    name: ROUTES.EDIT_INCOME,
    component: () => import(/* webpackChunkName: "income" */ '../views/IncomeDetail.vue'),
  },
  {
    path: '/productions',
    name: ROUTES.PRODUCTIONS,
    component: () => import(/* webpackChunkName: "production" */ '../views/Productions.vue'),
  },
  {
    path: '/production/new',
    name: ROUTES.NEW_PRODUCTION,
    component: () => import(/* webpackChunkName: "production" */ '../views/ProductionDetail.vue'),
  },
  {
    path: '/productions/:id',
    name: ROUTES.PRODUCTION,
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
  },
  {
    path: '/damages',
    name: ROUTES.DAMAGES,
    component: () => import(/* webpackChunkName: "damages" */ '../views/Damages.vue'),
  },
];

export default routes;
