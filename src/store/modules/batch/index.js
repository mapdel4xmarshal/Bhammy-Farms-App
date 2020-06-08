import { BATCH_ACTION_TYPES, BATCH_GETTER_TYPES, BATCH_MUTATION_TYPES } from './types';
import axios from '../../../plugins/axios';

const batchState = {
  breeds: []
};

const actions = {
  [BATCH_ACTION_TYPES.GET_BREEDS]({ commit }) {
    return axios.get('/batches/breeds')
      .then(({ data }) => {
        console.log(data);
        commit(BATCH_MUTATION_TYPES.SET_BREEDS, data);
      });
  }
};

const getters = {
  [BATCH_GETTER_TYPES.BREEDS](state) {
    return state.breeds;
  }
};

const mutations = {
  [BATCH_MUTATION_TYPES.SET_BREEDS](state, breeds) {
    state.breeds = breeds;
  }
};

export default {
  state: batchState,
  actions,
  getters,
  mutations,
};
