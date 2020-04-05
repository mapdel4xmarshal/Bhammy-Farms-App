<template>
    <v-sheet
      class="mx-auto"
    >
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">Production</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-apps</v-icon>
        </v-btn>

        <v-btn rounded color="primary" @click="createNew">
          Add new
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

        <v-card-title>
      <v-select
        :items="productionTypes"
        label="Production type"
        dense
      ></v-select>

      <v-menu
        v-model="dateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Date"
            prepend-icon="mdi-event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="dateMenu = false"></v-date-picker>
      </v-menu>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        width='100'
      ></v-text-field>
    </v-card-title>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="['calories', 'fat']"
    :sort-desc="[false, true]"
    multi-sort
    :search="search"
    class="elevation-1"
  ></v-data-table>
    </v-sheet>
</template>

<script>
import ROUTES from '../router/routeNames';

export default {
  name: 'Production',
  data() {
    return {
      dateMenu: false,
      date: null,
      search: '',
      productionTypes: [
        'Eggs',
        'Fish',
        'Chicks',
        'Hatchery'
      ],
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Batch', value: 'batch' },
        { text: 'Type', value: 'type' },
        { text: 'Total', value: 'total' },
        { text: 'Feed (kg)', value: 'feed' },
        { text: 'Mortality', value: 'mortalities' },
        { text: 'Age (days)', value: 'age' },
        { text: 'Mortality ratio', value: 'mortalityRatio' },
        { text: 'Feed per animal (g)', value: 'feedPerAnimal' },
        { text: 'State', value: 'state' },
      ],
      items: [
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          type: 'Chicks',
          total: 5780,
          feed: 240,
          mortalities: 4,
          age: 168,
          mortalityRatio: '0.2%',
          feedPerAnimal: 24,
          state: 'Active'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          total: 5780,
          type: 'Fish',
          feed: 240,
          mortalities: 4,
          age: 168,
          mortalityRatio: '0.2%',
          feedPerAnimal: 24,
          state: 'Active'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          total: 5780,
          feed: 240,
          type: 'Layers',
          mortalities: 4,
          age: 168,
          mortalityRatio: '0.2%',
          feedPerAnimal: 24,
          state: 'Active'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          total: 5780,
          type: 'Layers',
          feed: 240,
          mortalities: 4,
          age: 168,
          mortalityRatio: '0.2%',
          feedPerAnimal: 24,
          state: 'Completed'
        },
      ]
    };
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    }
  }
};
</script>
