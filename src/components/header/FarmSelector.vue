<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="slide-y-transition"
      :bottom="true"
    >
      <template v-slot:activator="{ on }">
        <div
          color="indigo"
          dark
          v-on="on"
          v-ripple
          class="farm-selector"
        >
          <div class="farm-selector__title">Ajegunle Farm</div>
          <small>Pen 1</small>
        </div>
      </template>
      <v-card
        class="mx-auto"
        width="200"
      >
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>home</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Ajegunle</v-list-item-title>
          </v-list-item>

          <v-list-group
            prepend-icon="account_circle"
            value="true"
          >
            <template v-slot:activator>
              <v-list-item-title>Users</v-list-item-title>
            </template>

            <v-list-group
              no-action
              sub-group
              value="true"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Admin</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(farm, i) in farms"
                :key="i"
                link
              >
                <v-list-item-title v-text="farm.name"></v-list-item-title>
                <v-list-item-icon>
                  <v-icon v-text="farm.name"></v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-card>
      <!--<v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>John Leider</v-list-item-title>
              <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                :class="fav ? 'red&#45;&#45;text' : ''"
                icon
                @click="fav = !fav"
              >
                <v-icon>favorite</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable messages</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable hints</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" text @click="menu = false">Save</v-btn>
        </v-card-actions>
      </v-card>-->
    </v-menu>
  </div>


</template>

<script>
export default {
  name: 'FarmSelector',
  data() {
    return {
      farms: [
        { id: 100, name: 'Ajegunle', units: [] },
        { id: 101, name: 'Afon', units: [] },
      ],
      fav: true,
      menu: false,
      message: false,
      hints: true,
    };
  },
};
</script>

<style lang="scss" scoped>
  @import "../../scss/_variables";

  .farm-selector {
    display: inline-flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    margin: auto 0;
    padding-left: 10px;
    color: #000;
    border-left: 1px solid #EEEEEE;
    position: relative;
    text-align: left;
    height: 100%;
    cursor: pointer;
    background-color: #fff;
    width: 100%;

    &::after {
      content: '';
      position: absolute;
      right: 10px;
      border-top: 7px solid #000;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
    }

    &:hover {
      background-color: #F5F5F5;
    }
  }

  .farm-selector__title {
    font-size: $title-font-size;
  }
</style>
