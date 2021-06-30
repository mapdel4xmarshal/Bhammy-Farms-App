const template = `
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" :style="style">
      <path d="M0.999969 0.999981L5.02265 5.02266C5.12114 5.12117 5.23807 5.19932 5.36676 5.25263C5.49546 5.30595 5.6334 5.33339 5.7727 5.33339C5.912 5.33339 6.04993 5.30595 6.17863 5.25263C6.30732 5.19932 6.42425 5.12117 6.52274 5.02266L8.20447 3.34094C8.30296 3.24243 8.41989 3.16428 8.54858 3.11096C8.67728 3.05765 8.81521 3.03021 8.95452 3.03021C9.09382 3.03021 9.23175 3.05765 9.36045 3.11096C9.48914 3.16428 9.60607 3.24243 9.70456 3.34094L14.2575 7.89392" :stroke="color" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11.2878 8.95453H15V5.24241" :stroke="color" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

export default {
  data() {

  },
  computed: {
    style() {
      return ({
        transform: `scaleY(${this.invert ? -1 : 1}`
      });
    }
  },
  props: {
    color: {
      type: String,
      default: '#BD2C0D'
    },
    invert: {
      type: Boolean,
      default: false
    }
  },
  template
};
