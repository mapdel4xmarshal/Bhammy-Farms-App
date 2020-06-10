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
    suppliers: [],
    sources: []
  },
  mutations: {
    [MUTATION_TYPES.SET_FARM_LOCATIONS](state, locations) {
      state.farmLocations = locations;
      state.houses = [].concat(...locations.map((location) => location.houses));
    },
    [MUTATION_TYPES.SET_SUPPLIERS](state, suppliers) {
      state.suppliers = suppliers.map((supplier) => {
        const newSupplier = supplier;
        newSupplier.initials = newSupplier.name.match(/\b(\w)/g).join('').toUpperCase();
        return newSupplier;
      });
    },
    [MUTATION_TYPES.SET_SOURCES](state, sources) {
      state.sources = sources.map((source) => {
        const newSource = source;
        newSource.initials = newSource.name.match(/\b(\w)/g).join('').toUpperCase();
        return newSource;
      });
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
      axios.get('/parties/suppliers')
        .then(({ data }) => {
          commit(MUTATION_TYPES.SET_SUPPLIERS, data);
        });
    },
    [ACTION_TYPES.GET_SOURCES]({ commit }) {
      axios.get('/parties/sources')
        .then(({ data }) => {
          commit(MUTATION_TYPES.SET_SOURCES, data);
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
    [GETTER_TYPES.SOURCES](state) {
      return state.sources;
    }
  },
  modules: {
    batch
  }
});
