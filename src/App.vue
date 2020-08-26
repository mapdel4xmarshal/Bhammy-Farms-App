<template>
  <v-app class="overflow-hidden app-container">
    <v-app-bar app clipped-left
      hide-on-scroll
      scroll-off-screen
      :elevation="1"
      color="#fff"
    >
      <v-app-bar-nav-icon
        v-if="$mq.phone"
        @click="drawer = !drawer"
      />
      <v-divider v-if="$mq.phone" vertical class="mr-2"></v-divider>
      <div class="header__container">
        <img src="img/Logofull.png" width="100"/>

        <v-menu :offset-y="true" bottom rounded="0">
          <template v-slot:activator="{ on, attrs }">
            <div class="justify-end">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-avatar>
                  <v-img :src="user.picture"></v-img>
                </v-list-item-avatar>
                <v-list-item-title v-if="!$mq.phone">{{ user.displayName || user.name }}</v-list-item-title>
              <v-icon small class="ml-1">mdi-chevron-down</v-icon>
            </v-list-item>
            </div>
          </template>

          <v-list>
            <v-list-item :href="logoutUrl">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
      :mini-variant.sync="mini"
      :permanent="!$mq.phone"
      :mini-variant-width="70"
      >
        <v-list dense nav light>
          <v-list-item class="px-2">
            <v-btn
              icon
              @click.stop="mini = !mini"
            >
              <v-icon v-if="!mini">mdi-chevron-left</v-icon>
              <v-icon v-else>mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item>

          <v-divider class="mb-2"/>

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

      <v-main>
        <v-container fluid class="overflow-y-auto main__content">
          <transition name="slide-fade" appear mode="out-in">
            <router-view/>
        </transition>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from './plugins/axios';
import ROUTES from './router/routeNames';
import { ACTION_TYPES, GETTER_TYPES } from './store/types';

export default {
  name: 'App',
  data: () => ({
    smallScreen: false,
    drawer: true,
    items: [
      { title: ROUTES.DASHBOARD, icon: 'mdi-monitor', to: ROUTES.DASHBOARD },
      { title: ROUTES.PRODUCTION, icon: 'mdi-chart-timeline', to: ROUTES.PRODUCTION },
      { title: ROUTES.FEEDS, icon: 'mdi-sack', to: ROUTES.FEEDS },
      { title: ROUTES.EXPENSES, icon: 'mdi-trending-down', to: ROUTES.EXPENSES },
      { title: ROUTES.INCOME, icon: 'mdi-currency-ngn', to: ROUTES.INCOME },
      { title: ROUTES.ACTIVITIES, icon: 'mdi-chart-line-variant', to: ROUTES.ACTIVITIES },
      { title: ROUTES.BATCHES, icon: 'mdi-factory', to: ROUTES.BATCHES },
      { title: ROUTES.CUSTOMERS, icon: 'mdi-account-multiple-outline', to: ROUTES.CUSTOMERS },
      { title: ROUTES.STORE, icon: 'mdi-silo', to: ROUTES.STORE }
    ],
    mini: true,
  }),
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS,
      user: GETTER_TYPES.USER
    }),
    logoutUrl() {
      return `/api/v1/logout?returnTo=${window.location.href}`;
    }
  },
  methods: {
    checkAuth() {
      return axios.get('user')
        .then(({ data }) => {
          console.log(data);
          this.user = data;
        })
        .catch(() => {
          window.location.href = `/api/v1/login?returnTo=${window.location.href}`;
        });
    }
  },
  mounted() {
    this.$store.dispatch(ACTION_TYPES.GET_FARM_LOCATIONS);
  },
  beforeRouteEnter(to, from, next) {
    this.checkAuth().then(next);
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

  .header__container {
    display: grid;
    align-items: center;
    width: 100%;
    grid-template-columns: 150px auto;
  }

  .justify-end {
    justify-self: end;
    border-left: 1px solid #E0E0E0;
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
