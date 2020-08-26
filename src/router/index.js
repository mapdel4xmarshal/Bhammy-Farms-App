import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../store';
import { ACTION_TYPES } from '../store/types';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = await store.dispatch(ACTION_TYPES.GET_USER);
  if (user) next();
  else window.location.href = `/api/v1/login?returnTo=${window.location.href}`;
});

export default router;
