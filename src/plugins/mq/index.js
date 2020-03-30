import Vue from 'vue';
import MQ from 'vue-match-media/src';

Vue.use(MQ);

export default {
  phone: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1024px)'
};
