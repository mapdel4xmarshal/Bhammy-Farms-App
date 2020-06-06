import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../plugins/axios';
import { MUTATION_TYPES, GETTER_TYPES, ACTION_TYPES } from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    farmLocations: []
  },
  mutations: {
    [MUTATION_TYPES.SET_FARM_LOCATIONS](state, locations) {
      state.farmLocations = locations;
    }
  },
  actions: {
    [ACTION_TYPES.GET_FARM_LOCATIONS]({ commit }) {
      axios.get('/locations')
        .then(({ data }) => {
          console.log(data);
          commit(MUTATION_TYPES.SET_FARM_LOCATIONS, data);
        });
    }
  },
  getters: {
    [GETTER_TYPES.FARM_LOCATIONS](state) {
      return state.farmLocations;
    }
  },
});
