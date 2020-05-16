<template>
  <header>
    <div class="menu-icon">
      <img src="../../assets/images/menu2.png" alt="" @click="toggleSideBar">
    </div>
    <farm-selector class="header__farm-selector"/>

    <div class="right-section">
      <div><font-awesome-icon icon="envelope" color="#757575"></font-awesome-icon></div>
      <div><font-awesome-icon icon="bell" color="#757575"></font-awesome-icon></div>
      <app-profile></app-profile>
    </div>
  </header>
</template>

<script>
import { sharedParams } from '../../main';
import Profile from '../common/Profile';
import FarmSelector from '../FarmSelector';

export default {
  name: 'HeaderBar',
  data() {
    return {
    };
  },
  methods: {
    toggleSideBar() {
      this.sharedProp.sidebarVisible = !this.sharedProp.sidebarVisible;
    },
  },
  created() {
    this.sharedProp = sharedParams;
  },
  components: {
    FarmSelector,
    appProfile: Profile,
  },
};
</script>

<style lang="scss" scoped>
  @import '../../scss/variables';

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

  .header__farm-selector {
    width: 180px;
    margin-right: auto !important;
  }

  .menu-icon {
    display: inline-block;
    padding: 10px;
    cursor: pointer;
  }

  .menu-icon img {
    width: 25px;
    height: 28px;
  }

  .right-section {
    line-height: 3;
    padding: 0 10px;
    color: #2b2b2b;
    display: inline-grid;
    max-width: 350px;
    grid-template-columns: 50px 50px auto;
    grid-auto-rows: $header-height;
    align-items: center;
    cursor: pointer;
  }

  .right-section > div {
    border-left: 1px solid #EEEEEE;
    text-align: center;
  }
</style>
