<template>
  <v-app>
    <TopNavigation/>
    <section class="main">
      <v-card
        elevation="1"
      >
        <v-navigation-drawer
        v-model="drawer"
        :mini-variant.sync="mini"
        bottom
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
      </v-card>
        <transition name="slide-fade" appear mode="out-in">
          <router-view class="main__content"/>
        </transition>
      </section>
  </v-app>
</template>

<script>
import TopNavigation from '@/components/TopNavigation.vue';
import ROUTES from './router/routeNames';

export default {
  name: 'App',
  components: {
    TopNavigation
  },
  data: () => ({
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
  }),
};
</script>

<style>

  .main {
    height: 100%;
    display: flex;
    width: 100%;
  }

  .main__content {
     width: 100%;
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
