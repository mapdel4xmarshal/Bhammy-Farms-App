<template>
  <v-menu
    bottom
    offset-y
    :close-on-content-click="false"
    class="mx-auto elevation-0"
  >
    <template v-slot:activator="{ on }">
      <div
        v-on="on"
        v-ripple
        class="farm-selector"
      >
        <div class="farm-selector__title">Ajegunle Farm</div>
        <small>Pen 1</small>
      </div>
    </template>
      <v-list flat>
        <v-list-item>
          <v-text-field dense filled outlined hide-details/>
        </v-list-item>
        <v-divider/>
        <v-list-group
          v-for="farm in farms"
          :key="farm.name"
          v-model="farm.active"
          no-action
          prepend-icon="mdi-barn"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="farm.name"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="unit in farm.units"
            :key="unit.name"
            @click="selectFarm"
          >
            <v-list-item-content>
              <v-list-item-title v-text="unit.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'FarmSelector',
  data() {
    return {
      farms: [
        {
          id: 100, name: 'Ajegunle', units: [{ name: 'Pen 1' }], active: true
        },
        {
          id: 101, name: 'Oloko', units: [{ name: 'Pen 1' }], active: false
        }
      ],
      menu: false
    };
  },
  methods: {
    selectFarm() {}
  }
};
</script>

<style lang="scss" scoped>
  @import "../scss/variables";

  .farm-selector {
    display: inline-flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    margin: auto 0;
    padding-left: 10px;
    color: #000;
    border-right: 1px solid #EEEEEE;
    position: relative;
    text-align: left;
    height: 100%;
    cursor: pointer;
    background-color: #fff;
    width: 180px;

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
