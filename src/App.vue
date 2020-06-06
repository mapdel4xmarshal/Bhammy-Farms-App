<template>
  <v-app class="overflow-hidden app-container">
    <v-app-bar app clipped-left
      hide-on-scroll
      scroll-off-screen
      :elevation="1"
      color="#fff"
      dense
    >
      <v-app-bar-nav-icon
        v-if="$mq.phone"
        @click="drawer = !drawer"/>
        <farm-selector :locations="farmLocations"/>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-bell</v-icon>
        </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
      :mini-variant.sync="mini"
      :permanent="!$mq.phone"
      :mini-variant-width="70"
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-title>Bamidele Mapayi</v-list-item-title>

          <v-btn
            icon
            @click.stop="mini = !mini"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav light>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="{name: item.to}"
            active-class="primary--text"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-content>
        <v-container fluid class="overflow-y-auto main__content">
          <transition name="slide-fade" appear mode="out-in">
            <router-view/>
        </transition>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import ROUTES from './router/routeNames';
import FarmSelector from './components/FarmSelector.vue';
import { ACTION_TYPES, GETTER_TYPES } from './store/types';

export default {
  name: 'App',
  components: { FarmSelector },
  data: () => ({
    smallScreen: false,
    drawer: true,
    items: [
      { title: ROUTES.DASHBOARD, icon: 'mdi-monitor', to: ROUTES.DASHBOARD },
      { title: ROUTES.PRODUCTION, icon: 'mdi-chart-timeline', to: ROUTES.PRODUCTION },
      { title: ROUTES.ACTIVITIES, icon: 'mdi-chart-line-variant', to: ROUTES.ACTIVITIES },
      { title: ROUTES.BATCHES, icon: 'mdi-factory', to: ROUTES.BATCHES },
      { title: ROUTES.EXPENSES, icon: 'mdi-trending-down', to: ROUTES.EXPENSES },
      { title: ROUTES.INCOME, icon: 'mdi-currency-ngn', to: ROUTES.INCOME },
      { title: ROUTES.REPORTS, icon: 'mdi-finance', to: ROUTES.REPORTS },
      { title: ROUTES.STORE, icon: 'mdi-silo', to: ROUTES.STORE },
      { title: ROUTES.CUSTOMERS, icon: 'mdi-account-multiple-outline', to: ROUTES.CUSTOMERS },
      { title: 'Employees', icon: 'mdi-account-outline', to: ROUTES.EMPLOYEES },
      { title: ROUTES.SCHEDULES, icon: 'mdi-calendar-check-outline', to: ROUTES.SCHEDULES },
      { title: ROUTES.SETTINGS, icon: 'mdi-cogs', to: ROUTES.SETTINGS }
    ],
    mini: true,
  }),
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS
    })
  },
  mounted() {
    this.$store.dispatch(ACTION_TYPES.GET_FARM_LOCATIONS);
  }
};
</script>

<style>
  body {
    height: 100vh;
    overflow: hidden;
  }

  .app-container {
    background-color: #F5F5F5 !important;
  }

  .main__content {
    width: 100%;
    height: calc(100vh - 60px);
  }

  .slide-fade-enter-active {
    transition: all .4s ease-in-out;
  }

  .slide-fade-leave-active {
    transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  section .v-toolbar__content {
    padding: 0 !important;
  }

  .spacer--right {
    margin-right: 10px;
  }
</style>
