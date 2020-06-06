import { GETTER_TYPES } from './types';

const getters = {
  [GETTER_TYPES.AUTHENTICATED](state) {
    return state.authenticated;
  },
  [GETTER_TYPES.USER_INFO](state) {
    return state.userInfo;
  },
  [GETTER_TYPES.USER_ORGANIZATIONS](state) {
    return state.userInfo.organizations;
  },
  [GETTER_TYPES.USER_FIRST_NAME](state) {
    return state.userInfo.given_name;
  },
  [GETTER_TYPES.USER_AUTHORIZED_APPS](state) {
    return state.userInfo && state.userInfo.resource_access
      ? Object.keys(state.userInfo.resource_access).sort() : [];
  },
};

export default getters;
