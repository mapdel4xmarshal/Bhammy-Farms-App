<template>
  <v-sheet color="transparent">
    <div class="d-flex header" no-gutters>
      <div class="mr-auto">
        <v-btn tile text class="pl-0" color="primary" :to="{ name: batchesRoute }">
          <v-icon>mdi-chevron-left</v-icon> Back
        </v-btn>
      </div>
      <div class="ml-auto">
        <v-btn tile color="primary">
          <v-icon small class="mr-1">mdi-pencil</v-icon>Edit
        </v-btn>
      </div>
    </div>
    <v-toolbar class="mt-4 pa-0" color="transparent elevation-0">
      <v-toolbar-title class="display-1">{{ batch.name }}
        <sup class="subtitle-1"><v-chip small>{{ batch.status }}</v-chip></sup>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn-toggle
        dense
        rounded
        class="pr-0"
        v-model="mode"
      >
        <v-btn>
          Performance
        </v-btn>
        <v-btn>
          Finance
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-row>
      <v-col cols="12">
        <v-slide-group multiple show-arrows>
          <v-slide-item
            v-for="(item, index) in batchInfo"
            :key="index"
          >
            <div style="display: flex;">
              <div class="pl-5 pr-5 pt-1 pb-1">
                <span class="caption text-uppercase" style="color: #727272">{{ item.name }}</span>
                <br>
                <span class="body-1">{{ item.value }}</span>
              </div>
              <v-divider vertical v-if="index < batchInfo.length - 1"/>
            </div>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <metric-card title="Eggs Produced" :value="`${totalEggs} crates`" img="/img/egg.png"/>
      </v-col>

      <v-col cols="12" md="3">
        <metric-card title="Birds" :value="`${totalBirds} birds`" img="/img/hen.png"/>
      </v-col>

      <v-col cols="12" md="3">
        <metric-card title="Feeds Consumed" :value="`${totalFeeds} kg`" img="/img/feed.png"/>
      </v-col>

      <v-col cols="12" md="3">
        <metric-card title="Morality" :value="`${totalMortality} bird(s)`" img="/img/dead.png"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9">
        <v-tabs
          background-color="transparent"
          color="primary accent-4"
          show-arrows
        >
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab>Production</v-tab>
          <v-tab>Eggs</v-tab>
          <v-tab>Feed</v-tab>
          <v-tab>Mortality</v-tab>
          <v-tab>Water</v-tab>

          <v-tab-item>
            <chart
              :series="[productionData, temperatureData, humidityData, expectedProductionData]"
              legend-enabled
              name="production"></chart>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[eggsData]" name="Eggs"></chart>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[feedsData]" name="Feeds"></chart>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[populationData]" name="Feeds"></chart>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[waterData]" name="Feeds"></chart>
          </v-tab-item>
        </v-tabs>
      </v-col>
      <v-col cols="12" md="3">
        <v-card-title class="subtitle-1 pl-0 pb-1">Treatment history</v-card-title>
        <v-card outlined height="380">
          <v-list three-line>
            <template>
              <v-list-item>
                <v-list-item-avatar>
                  AUG, 20
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Lasota</v-list-item-title>
                  <v-list-item-subtitle>Reduction in production and weak egg shell.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
            </template>
            <template>
              <v-list-item>
                <v-list-item-avatar>
                  AUG, 20
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Lasota</v-list-item-title>
                  <v-list-item-subtitle>Reduction in production and weak egg shell.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
            </template>
            <template>
              <v-list-item>
                <v-list-item-avatar>
                  AUG, 21
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Lasota</v-list-item-title>
                  <v-list-item-subtitle>Reduction in production and weak egg shell.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
            </template>
            <template>
              <v-list-item>
                <v-list-item-avatar>
                  AUG, 22
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Miavit</v-list-item-title>
                  <v-list-item-subtitle>Post vaccination requirements.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="productions"
          no-data-text="No production record found."
          class="elevation-1 table-cursor"
        >
          <template v-slot:item.amount="{ item }">
            ₦{{ item.amount | formatNumber }}
          </template>
          <template v-slot:item.humidity="{ item }">
            <span v-if="item.humidity">
              {{ item.humidity }}%
            </span>
            <span v-else>&mdash;</span>
          </template>
          <template v-slot:item.temperature="{ item }">
            <span v-if="item.temperature">
              {{ item.temperature }}°C
            </span>
            <span v-else>&mdash;</span>
          </template>
          <template v-slot:item.profit="{ item }">
            <span :style="{color: item.profit < 0? 'red' : 'green'}">
              ₦{{ Math.abs(item.profit) | formatNumber }} </span>
          </template>
          <template v-slot:item.climateEffect.effect="{ item }">
            <span v-if="item.climateEffect.effect">
              {{ item.climateEffect.effect }}
            </span>
            <span v-else>&mdash;</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import axios from '../plugins/axios';
import ROUTES from '../router/routeNames';
import MetricCard from '../components/MetricCard.vue';
import Chart from '../components/Chart.vue';

export default {
  name: 'BatchDetail',
  data() {
    return {
      batchesRoute: ROUTES.BATCHES,
      batch: {},
      mode: 0,
      date: [],
      expense: 0,
      profit: 0,
      income: 0,
      totalFeeds: 0,
      totalEggs: 0,
      totalMortality: 0,
      totalBirds: 0,
      productions: [],
      initialPopulation: 0,
      batchInfo: [],
      productionData: this.baseData('Production'),
      eggsData: this.baseData('Egg'),
      feedsData: this.baseData('Feed'),
      waterData: this.baseData('Water'),
      populationData: this.baseData('Population'),
      humidityData: this.baseData('Humidity', '#37878f'),
      temperatureData: this.baseData('Temperature', '#616161'),
      expectedProductionData: this.baseData('Projected Production', '#8f8f8f'),
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Eggs (crates)', value: 'eggs' },
        { text: 'Production %', value: 'productionPercent' },
        { text: 'Expectancy', value: 'expectancy' },
        { text: 'Feed (kg)', value: 'feeds' },
        { text: 'Feed/animal (g)', value: 'feedPerAnimal' },
        { text: 'Mortality', value: 'mortality' },
        { text: 'Temperature', value: 'temperature' },
        { text: 'Humidity', value: 'humidity' },
        { text: 'Climate effect', value: 'climateEffect.effect' },
        { text: 'Est. Profit', value: 'profit' },
      ]
    };
  },
  components: { Chart, MetricCard },
  methods: {
    baseData(name, color = '#7f2775') {
      return {
        name,
        type: 'areaspline',
        color,
        fillOpacity: 0.1,
        data: []
      };
    },
    getProduction() {
      const filters = [];
      filters.push(`batchId=${this.$route.params.id}`);
      if (this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);

      axios.get(`/productions?${filters.join('&')}`)
        .then(({ data }) => {
          this.productions = data;
          this.computeSummary(data);
        });
    },
    getBatch() {
      axios.get(`/batches/${this.$route.params.id}`)
        .then(({ data }) => {
          this.batch = data;
          this.batchInfo = [
            { name: 'Farm', value: data.farm },
            { name: 'House', value: data.house },
            { name: 'Type', value: data.category },
            { name: 'Breed', value: data.breed },
            { name: 'Move in date', value: data.moveInDate },
            { name: 'Move out date', value: data.moveOutDate },
            { name: 'Source', value: data.sourceName },
            { name: 'Cost per bird', value: `₦${this.$options.filters.formatNumber(data.costPerUnit)}` },
            { name: 'Move in age', value: `${parseInt(+data.moveInAge / 7, 10)} weeks` },
            { name: 'Move in count', value: `${this.$options.filters.formatNumber(data.initialStock, 0)} birds` },
            { name: 'Current age', value: `${parseInt(+data.currentAge / 7, 10)} weeks` },
            { name: 'Move in cost', value: `₦${this.$options.filters.formatNumber(data.totalCost, 0)}` },
          ];
        });
    },
    computeSummary(productions) {
      this.totalFeeds = 0;
      this.totalEggs = 0;
      this.totalMortality = 0;
      this.totalBirds = 0;

      const productionCopy = [...productions].reverse();
      productionCopy.forEach((production) => {
        this.totalFeeds += production.feeds;
        this.totalEggs += Number.parseInt(production.eggs / 30, 10);
        this.totalMortality += production.mortality;
        this.initialPopulation = production.initialPopulation;
        this.curateChartData(production);
      });

      this.totalFeeds = this.$options.filters.formatNumber(this.totalFeeds, 0);
      this.totalEggs = this.$options.filters.formatNumber(this.totalEggs, 0);
      this.totalMortality = this.$options.filters.formatNumber(this.totalMortality, 0);
      this.totalBirds = this.$options.filters.formatNumber(this.initialPopulation - this.totalMortality, 0);
    },
    curateChartData(production) {
      const date = new Date(production.date).getTime();
      this.productionData.data.push({ x: date, y: production.productionPercent });
      this.eggsData.data.push({ x: date, y: production.eggs });
      this.feedsData.data.push({ x: date, y: production.feeds });
      this.populationData.data.push({ x: date, y: production.mortality });
      this.waterData.data.push({ x: date, y: production.water });
      this.humidityData.data.push({ x: date, y: production.humidity });
      this.temperatureData.data.push({ x: date, y: production.temperature });
      this.expectedProductionData.data.push({ x: date, y: production.expectancy });
    }
  },
  filters: {
    formatNumber(value, digits = 2) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits }).format(value);
    }
  },
  mounted() {
    this.getProduction();
    this.getBatch();
  }
};
</script>

<style>
 .v-toolbar__content {
   padding-left: 0 !important;
   padding-right: 0 !important;
 }
</style>
