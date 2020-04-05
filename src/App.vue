<template>
  <v-app class="overflow-hidden app-container">
    <v-app-bar app clipped-left
      hide-on-scroll
      scroll-off-screen
      :elevation="1"
    >
      <v-app-bar-nav-icon
        v-if="$mq.phone"
        @click="drawer = !drawer"/>
        <v-toolbar-title>Title</v-toolbar-title>
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
            exact
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
import ROUTES from './router/routeNames';

export default {
  name: 'App',
  data: () => ({
    smallScreen: false,
    drawer: true,
    items: [
      { title: ROUTES.DASHBOARD, icon: 'mdi-monitor', to: ROUTES.DASHBOARD },
      { title: ROUTES.PRODUCTION, icon: 'mdi-chart-timeline', to: ROUTES.PRODUCTION },
      { title: ROUTES.ACTIVITIES, icon: 'mdi-chart-line-variant', to: ROUTES.ACTIVITIES },
      { title: ROUTES.BATCH, icon: 'mdi-factory', to: ROUTES.BATCH },
      { title: ROUTES.EXPENSES, icon: 'mdi-account', to: ROUTES.EXPENSES },
      { title: ROUTES.INCOME, icon: 'mdi-cash-usd', to: ROUTES.INCOME },
      { title: ROUTES.REPORTS, icon: 'mdi-finance', to: ROUTES.REPORTS },
      { title: ROUTES.STORE, icon: 'mdi-silo', to: ROUTES.STORE },
      { title: ROUTES.SCHEDULES, icon: 'mdi-calendar-check-outline', to: ROUTES.SCHEDULES },
      { title: ROUTES.SETTINGS, icon: 'mdi-cogs', to: ROUTES.SETTINGS }
    ],
    mini: true,
  })
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
    padding: 20px 30px;
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
</style>
