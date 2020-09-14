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

    <v-row class="mt-3">
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="batch"
          label="Batch"
          persistent-hint
          required
          dense
          no-data-text="No batch available"
          clearable
          return-object
          :items="batches"
          item-text="name"
          item-value="name"
          @change="getProduction"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.farm }} Farm | {{ item.house }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          v-model="menu"
          :return-value.sync="date"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateRangeText"
              dense
              label="Date"
              autocomplete="false"
              clearable
              @click:clear="date = null && getProduction"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" range>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="updateDate">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3">
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
        <metric-card title="Eggs Produced" :value="totalEggs" unit="crates" img="img/egg.png"/>
      </v-col>

      <v-col cols="12" md="3">
        <metric-card title="Birds" :value="totalBirds" unit="birds" img="img/hen.png"/>
      </v-col>

      <v-col cols="12" md="3">
        <metric-card title="Feeds Consumed" :value="totalFeeds" unit="kg" img="img/feed.png"/>
      </v-col>

      <v-col cols="12" md="3">
        <metric-card title="Morality" :value="totalMortality" unit="bird(s)" img="img/dead.png"/>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="productions"
      no-data-text="No production available."
      multi-sort
      :search="search"
      class="elevation-1 table-cursor"
      @click:row="selectProduction"
    >
      <template v-slot:item.eggs="{ item }">
        {{ Number.parseInt(item.eggs / item.eggPackagingSize ) }}
      </template>

      <template v-slot:item.profit="{ item }">
        <strong :style="{color: item.profit < 0? 'red' : 'green'}">
          ₦{{ Math.abs(item.profit) | normalizeNumber }} </strong>
      </template>
    </v-data-table>
  </section>
</template>

<script>
import axios from '../plugins/axios';
import ROUTES from '../router/routeNames';
import MetricCard from '../components/MetricCard.vue';

export default {
  name: 'Production',
  data() {
    return {
      productions: [],
      totalFeeds: 0,
      totalEggs: 0,
      totalMortality: 0,
      totalBirds: 0,
      batches: [],
      dateMenu: false,
      date: [],
      menu: false,
      search: '',
      batch: '',
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Batch', value: 'batch' },
        { text: 'Type', value: 'type' },
        { text: 'Population', value: 'flockCount' },
        { text: 'Eggs (crates)', value: 'eggs' },
        { text: 'Production %', value: 'productionPercent' },
        { text: 'Feed (kg)', value: 'feeds' },
        { text: 'Feed/animal (g)', value: 'feedPerAnimal' },
        { text: 'Mortality', value: 'mortality' },
        { text: 'Mortality %', value: 'mortalityRate' },
        { text: 'Est. Profit', value: 'profit' },
      ]
    };
  },
  components: {
    MetricCard
  },
  computed: {
    dateRangeText() {
      return this.date && this.date.length > 0 ? this.date.join(' ~ ') : [];
    }
  },
  methods: {
    selectProduction(data) {
      this.$router.push({ name: ROUTES.PRODUCTION, params: { id: data.id } });
    },
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    },
    getProduction() {
      const filters = [];
      if (this.batch) filters.push(`batchId=${this.batch.batchId}`);
      if (this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);
      axios.get(`/productions?${filters.join('&')}`)
        .then(({ data }) => {
          this.productions = data;
          this.computeSummary(data);
        });
    },
    getBatches() {
      axios.get('/batches')
        .then(({ data }) => {
          this.batches = data;
        });
    },
    computeSummary(productions) {
      this.totalFeeds = 0;
      this.totalEggs = 0;
      this.totalMortality = 0;
      this.totalBirds = 0;
      const flockMap = new Map();
      productions.forEach((production) => {
        this.totalFeeds += production.feeds;
        this.totalEggs += Number.parseInt(production.eggs / production.eggPackagingSize, 10);
        this.totalMortality += production.mortality;
        flockMap.set(production.batch, production.initialPopulation);
      });

      this.totalBirds = Array.from(flockMap.values())
        .reduce((totalFlock, flock) => totalFlock + flock, 0) - this.totalMortality;
    },
    updateDate() {
      this.$refs.menu.save(this.date);
      this.getProduction();
    },
    formatNumber(value, digits = 2) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits }).format(value);
    }
  },
  filters: {
    normalizeNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value);
    }
  },
  created() {
    this.getProduction();
    this.getBatches();
  }
};
</script>

<style lang="css">
  .table-cursor tbody tr:hover {
    cursor: pointer;
  }
</style>
