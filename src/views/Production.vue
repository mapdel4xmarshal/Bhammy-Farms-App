<template>
    <section>
      <v-toolbar flat dense color="transparent">
        <v-toolbar-title>Production</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn tile color="primary" @click="createNew">
          New Production
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
            <v-date-picker v-model="date" @input="menu2 = false" range landscape></v-date-picker>
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
          <metric-card title="Total Eggs Produced" value="12,898 crates" img="https://ya-webdesign.com/transparent250_/whiter-egg.png"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Total Flocks" value="12,898 birds" img="https://i.ya-webdesign.com/images/hen-vector-drawing-16.png"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Feeds Consumed" value="324,223 tonnes" img="https://cdn5.vectorstock.com/i/1000x1000/54/99/bag-of-wheat-thin-line-icon-farming-agriculture-vector-20105499.jpg"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Moralities" value="120 birds" img="https://thumbs.dreamstime.com/b/dead-bones-line-illustration-icon-white-background-signs-symbols-can-be-used-web-logo-mobile-app-ui-ux-172929843.jpg"/>
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
