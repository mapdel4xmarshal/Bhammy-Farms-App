<template>
    <section>
      <v-toolbar flat dense color="transparent">
        <v-toolbar-title>Production</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn tile color="primary" @click="createNew">
          Add new
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-row>
        <v-col cols="12" md="2">
          <v-select
            :items="productionTypes"
            label="Production type"
            dense
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">

          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateRangeText"
                dense
                label="Date"
                autocomplete="false"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="menu2 = false" range></v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="2">
          <v-text-field
            append-icon="mdi-magnify"
            label="Search"
            dense
            v-model="search"
            width='100'
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="3">
          <metric-card/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card/>
        </v-col>
      </v-row>
    <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="['calories', 'fat']"
    :sort-desc="[false, true]"
    multi-sort
    :search="search"
    class="elevation-1"
  ></v-data-table>
    </section>
</template>

<script>
import ROUTES from '../router/routeNames';
import MetricCard from '../components/MetricCard.vue';

export default {
  name: 'Production',
  data() {
    return {
      dateMenu: false,
      date: [],
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
          batch: 'OLO-P001-B01',
          total: 5780,
          type: 'Broiler',
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
  components: {
    MetricCard
  },
  computed: {
    dateRangeText() {
      return this.date.join(' ~ ');
    }
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    }
  }
};
</script>
