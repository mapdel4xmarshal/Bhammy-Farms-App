import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  authenticated: false,
  userInfo: {},
};

export default {
  state, actions, getters, mutations,
};
