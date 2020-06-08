import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../plugins/axios';
import batch from './modules/batch';
import { MUTATION_TYPES, GETTER_TYPES, ACTION_TYPES } from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    farmLocations: [],
    houses: {},
    suppliers: []
  },
  mutations: {
    [MUTATION_TYPES.SET_FARM_LOCATIONS](state, locations) {
      state.farmLocations = locations;
      state.houses = [].concat(...locations.map((location) => location.houses));
    },
    [MUTATION_TYPES.SET_SUPPLIERS](state, suppliers) {
      state.suppliers = suppliers;
    }
  },
  actions: {
    [ACTION_TYPES.GET_FARM_LOCATIONS]({ commit }) {
      axios.get('/locations')
        .then(({ data }) => {
          commit(MUTATION_TYPES.SET_FARM_LOCATIONS, data);
        });
    },
    [ACTION_TYPES.GET_SUPPLIERS]({ commit }) {
      axios.get('/suppliers')
        .then(({ data }) => {
          commit(MUTATION_TYPES.SET_SUPPLIERS, data);
        });
    }
  },
  getters: {
    [GETTER_TYPES.FARM_LOCATIONS](state) {
      return state.farmLocations;
    },
    [GETTER_TYPES.HOUSES](state) {
      return state.houses;
    },
    [GETTER_TYPES.SUPPLIERS](state) {
      return state.suppliers;
    },
  },
  modules: {
    batch
  }
});
