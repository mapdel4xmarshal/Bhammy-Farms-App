<template>
  <div id="sidebar" :class="{'hide-menu' : !sharedProp.sidebarVisible}">
    <nav-button v-for="(section, index) in sections"
                :key="section.name"
                :btnName="section.name"
                :className="section.iconClass"
                :navButtonIndex="index"
                :route="section.route"
                :isActive="selectedNavIndex == index"
                @navButtonClicked="navigateToPage">
    </nav-button>
  </div>
</template>

<script>
import NavigationButton from './sidebar/NavigationButton';
import { sharedParams } from '../main';

export default {
  name: 'SideBarContainer',
  data() {
    return {
      sections: [{ name: 'Dashboard', route: '/', iconClass: 'dashboard3.png' },
        { name: 'Productions', route: '/production', iconClass: 'production.png' },
        { name: 'Sales', route: '/sales', iconClass: 'sales.png' },
        { name: 'Expenditure', route: '/dashboard', iconClass: 'expenditure.png' },
        { name: 'Activities', route: '/dashboard', iconClass: 'activity-2.png' },
        { name: 'Store', route: '/dashboard', iconClass: 'store.png' },
        { name: 'Settings', route: '/dashboard', iconClass: 'settings.png' }],
      selectedNavIndex: sharedParams.selectedPageIndex,
      sharedProp: sharedParams,
    };
  },
  components: {
    navButton: NavigationButton,
  },
  methods: {
    navigateToPage(event) {
      this.selectedNavIndex = event.navButtonIndex;
      this.sharedProp.selectedPageIndex = event.navButtonIndex;
      this.sharedProp.currentPage = event.component;
      this.sharedProp.currentPageName = event.navButtonName;
      this.sharedProp.sidebarVisible = false;

      this.$router.push({ path: event.route });
      console.log('navigateToPage', event);
    },
  },
  created() {
    console.log(this.$route);
    this.sections.forEach((section, index) => {
      if (this.$route.path.startsWith(section.route)) {
        this.selectedNavIndex = index;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
  @import "../scss/_variables";

  #sidebar{
    height: 100%;
    background-color: var(--sidebar-bg-color);
    max-width: $sidebar-desktop-width;
    width: $sidebar-mobile-width;
    display: block;
    position: absolute;
    margin-right: 2px;
    margin-top: 2px;
    padding: 2px 0;
    float:left;
    left: 0;
    -webkit-transition: all 500ms ease;
    -moz-transition: all 500ms ease;
    transition: all 500ms cubic-bezier(0.5,-0.25, 0.25, 1.5);
    -o-transition: all 300ms cubic-bezier(0.5,-0.25, 0.25, 1.5); /* Opera */
    -webkit-box-shadow: 0px 2px 3px 0px #9e9e9e8f;
    -moz-box-shadow: 0px 2px 3px 0px #9e9e9e8f;
    box-shadow: 0px 2px 3px 0px #9e9e9e8f;
    z-index: 1;
  }

  .hide-menu{
    left: -100px !important;
  }

  @media only screen and (min-width: 800px) {
    #sidebar{
      width: $sidebar-desktop-width;
      position: relative;
    }

    .hide-menu{
      width: $sidebar-mobile-width !important;
      left: 0 !important;
    }
  }

</style>
