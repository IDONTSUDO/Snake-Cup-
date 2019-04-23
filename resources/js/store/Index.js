import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import userdata from './user/userdata.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    userdata,
  },
});