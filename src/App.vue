<template>
  <v-app>
    <TopNavigation/>

    <section class="content">
        <transition name="slide-fade" appear mode="out-in">
          <router-view class="main__content"/>>
        </transition>
      </section>
  </v-app>
</template>

<script>
import TopNavigation from '@/components/TopNavigation.vue';

export default {
  name: 'App',
  components: {
    TopNavigation
  },
  data: () => ({
    //
  }),
};
</script>

<style scoped>
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
