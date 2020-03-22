const routes = [{
  path: '/',
  name: 'Dashboard',
  component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
},
{
  path: '/activities',
  name: 'Activities',
  component: () => import(/* webpackChunkName: "activities" */ '../views/Activities.vue')
},
{
  path: '/batches',
  name: 'Batches',
  component: () => import(/* webpackChunkName: "batches" */ '../views/Batches.vue'),
},
{
  path: '/expenses',
  name: 'Expenses',
  component: () => import(/* webpackChunkName: "expenses" */ '../views/Batches.vue'),
},
{
  path: '/income',
  name: 'Income',
  component: () => import(/* webpackChunkName: "income" */ '../views/Income.vue'),
},
{
  path: '/production',
  name: 'Production',
  component: () => import(/* webpackChunkName: "production" */ '../views/Production.vue'),
},
{
  path: '/reminders',
  name: 'Reminders',
  component: () => import(/* webpackChunkName: "report" */ '../views/Reminders.vue'),
},
{
  path: '/report',
  name: 'Report',
  component: () => import(/* webpackChunkName: "report" */ '../views/Report.vue'),
},
{
  path: '/reports',
  name: 'Reports',
  component: () => import(/* webpackChunkName: "reports" */ '../views/Reports.vue'),
},
{
  path: '/store',
  name: 'Store',
  component: () => import(/* webpackChunkName: "store" */ '../views/Store.vue'),
}
];

export default routes;
