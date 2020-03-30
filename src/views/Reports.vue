<template>
  <div class="home">
     <v-toolbar color="primary" dark :max-height="60">
      <v-app-bar-nav-icon
      v-if="$mq.phone"
      @click="drawer = !drawer"/>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-toolbar>
      <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant.sync="mini"
      :permanent="!$mq.phone"
      :mini-variant-width="70"
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-title>Bamidele Mapayi {{ $mq.phone }}</v-list-item-title>

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
      <transition name="slide-fade" appear mode="out-in">
        <router-view class="main__content"/>
      </transition>
  </div>
</template>

<script>

export default {
  name: 'Reports',
  components: {
  },
};
</script>
