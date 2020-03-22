<template>
  <header>hhh
  </header>
</template>

<script>
export default {
  name: 'TopNavigation',
  data() {
    return {
    };
  },
  methods: {
  },
  components: {
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/_variables';

  header {
    height: $header-height;
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    color: white;
    -webkit-box-shadow: 0 1px 3px -2px #77777761;
    box-shadow: 0 1px 3px -2px #77777761;
    -moz-box-shadow: 0 1px 3px -2px #77777761;
  }
</style>
