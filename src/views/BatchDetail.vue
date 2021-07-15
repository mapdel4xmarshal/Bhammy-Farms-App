<template>
  <v-sheet color="transparent">
    <Batch :active="editBatch" @update="handleBatchEvent" title="Edit Batch" v-model="batch"/>
    <div class="d-flex header mb-2" no-gutters>
      <div class="mr-auto">
        <v-btn tile text class="pl-0" color="primary" :to="{ name: batchesRoute }">
          <v-icon>mdi-chevron-left</v-icon> Back
        </v-btn>
      </div>
      <div class="ml-auto">
        <v-btn tile color="primary" @click="editBatch = true" disabled>
          <v-icon small class="mr-1">mdi-pencil</v-icon>Edit
        </v-btn>
      </div>
    </div>
    <v-divider/>
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
        mandatory
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
              <div class="pt-1 pb-1">
                <span class="caption text-uppercase" style="color: #727272">{{ item.name }}</span>
                <br>
                <span class="body-1">{{ item.value }}</span>
              </div>
              <v-divider vertical v-if="index < batchInfo.length - 1" class="ml-5 mr-5"/>
            </div>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>
    <transition name="fade" mode="out-in">
      <v-row v-if="!mode" key="1">
        <v-col cols="12" md="3">
          <metric-card title="Eggs Produced" :value="totalEggs" :digits="0" unit="crates" img="/img/egg.png"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Birds" :value="batch.currentStock" :digits="0" unit="birds" img="/img/hen.png"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Feeds Consumed" :value="totalFeeds" :digits="0" unit="kg" img="/img/feed.png"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Morality" :value="totalMortality" :digits="0" unit="bird(s)" img="/img/dead.png"/>
        </v-col>
      </v-row>
      <v-row v-else key="2">
        <v-col cols="12" md="3">
          <metric-card title="Egg sale" :value="eggSales" value-prefix="₦"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Feed costs" :value="feedCosts" value-prefix="₦"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Other expenses" :value="totalExpenses" value-prefix="₦"/>
        </v-col>

        <v-col cols="12" md="3">
          <metric-card title="Total profit" :value="profit" value-prefix="₦"/>
        </v-col>
      </v-row>
    </transition>
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
            <v-card outlined tile>
            <chart
              :series="[weekData, productionData, temperatureData, expectedProductionData]"
              legend-enabled
              name="production"></chart>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[weekData, eggsData]"
                   name="Eggs"
                   unit=""
                   :y-axis-label-formatter="chartFormatter" y-axis-unit="crates"></chart>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[weekData, feedsData]" name="Feeds" y-axis-unit="kg"></chart>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[weekData, populationData]" name="Mortality"></chart>
          </v-tab-item>
          <v-tab-item>
            <chart :series="[weekData, waterData]" name="Water" y-axis-unit="l"></chart>
          </v-tab-item>
        </v-tabs>
      </v-col>
      <v-col cols="12" md="3">
        <v-card-title class="subtitle-1 pl-0 pb-1">Treatment history</v-card-title>
        <v-card outlined height="400" class="overflow-y-auto pa-1" color="transparent" tile>
          <v-alert
            v-for="(treatment, date) in treatments" :key="date"
            color="primary"
            border="left"
            elevation="1"
            colored-border
            icon="mdi-medical-bag"
          >
            <v-chip small>
              {{ date }}
            </v-chip>
            <div v-for="(item, index) in treatment" :key="index">
              <div :key="index">
                <strong class="text-uppercase body-2">{{ item.type }}</strong><br>
                <span class="caption" v-if="item.vaccineName">{{ item.vaccineName }}, {{ item.vaccineBrand }}</span>
                <span class="caption" v-else>{{ item.medicamentName }}, {{ item.medicamentBrand }}</span><br>
                <span class="caption">DOSAGE - {{ item.totalDosage }}</span><br>
                <span class="caption" v-if="item.note">REASON - {{ item.note }}</span>
                <v-divider
                  class="my-4"
                  v-if="index < treatment.length - 1"
                ></v-divider>
              </div>
            </div>
          </v-alert>
          <div class="d-flex justify-center pa-5 caption" v-if="!Object.keys(treatments).length">
              No treatments found.
          </div>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-tabs
            background-color="transparent"
            color="primary accent-4"
            show-arrows
          >
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab>Production</v-tab>
            <v-tab>Eggs</v-tab>
            <v-tab>Feeds</v-tab>

            <v-tab-item>
              <v-data-table
                :headers="headers"
                :items="productions"
                no-data-text="No production record found."
                class="elevation-1 table-cursor"
              >
                <template v-slot:item.eggs="{ item }">
                  {{ (item.eggs / item.eggPackagingSize).toFixed(2) }}
                </template>
                <template v-slot:item.batchAge="{ item: { batchAge } }">
                  {{ ~~(batchAge / 7) }}
                </template>
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
            </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="eggInsightHeaders"
              :items="eggInsights"
              no-data-text="No egg records found."
              class="elevation-1 table-cursor"
            >
              <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in eggInsightHeaders">
                <span v-if="header.value !== 'date' && header.value !== 'week'" :key="header.text">
                  <span v-if="item[header.value]">
                    {{ item[header.value] | formatNumber }} creates
                  </span>
                  <span v-else>&mdash;</span>
                </span>
                <span v-else :key="header.text">{{ item[header.value] }}</span>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="feedInsightHeaders"
              :items="feedInsights"
              no-data-text="No feed records found."
              class="elevation-1 table-cursor"
            >
              <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in feedInsightHeaders">
                <span v-if="header.value !== 'date' && header.value !== 'week'" :key="header.text">
                  <span v-if="item[header.value]">
                    {{ item[header.value] | formatNumber }} bags
                  </span>
                  <span v-else>&mdash;</span>
                </span>
                <span v-else :key="header.text">{{ item[header.value] }}</span>
              </template>
            </v-data-table>
          </v-tab-item>
          </v-tabs>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import axios from '../plugins/axios';
import ROUTES from '../router/routeNames';
import MetricCard from '../components/MetricCard.vue';
import Chart from '../components/Chart.vue';
import Batch from '../components/Batch.vue';

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
      eggSales: 0,
      feedCosts: 0,
      totalExpenses: 0,
      initialPopulation: 0,
      batchInfo: [],
      editBatch: false,
      productionData: this.baseData('Production', '-'),
      eggsData: this.baseData('Egg', 'crate'),
      feedsData: this.baseData('Feed', 'bag'),
      waterData: this.baseData('Water', 'liter'),
      populationData: this.baseData('Population', 'bird'),
      temperatureData: this.baseData('Temperature', '°C', 'rgba(97,97,97,0.49)'),
      expectedProductionData: this.baseData('Projected Production', '%', '#8f8f8f'),
      weekData: this.baseData('Age', 'Week', 'transparent', false, { yAxis: 1 }),
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Week', value: 'batchAge' },
        { text: 'Flock', value: 'flockCount' },
        { text: 'Production %', value: 'productionPercent' },
        { text: 'Eggs (crates)', value: 'eggs' },
        { text: 'Expectancy', value: 'expectancy' },
        { text: 'Feed (kg)', value: 'feeds' },
        { text: 'Feed/animal (g)', value: 'feedPerAnimal' },
        { text: 'Mortality', value: 'mortality' },
        { text: 'Temperature', value: 'temperature' },
        { text: 'Humidity', value: 'humidity' },
        { text: 'Climate effect', value: 'climateEffect.effect' },
        { text: 'Est. Profit', value: 'profit' },
      ],
      treatments: {},
      eggInsights: [],
      feedInsights: [],
      feedInsightHeaders: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        {
          text: 'Week',
          sortable: true,
          value: 'week',
        }
      ],
      eggInsightHeaders: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        {
          text: 'Week',
          sortable: true,
          value: 'week',
        }]
    };
  },
  components: { Batch, Chart, MetricCard },
  methods: {
    chartFormatter() {
      return function () {
        return this.value > 999
          ? `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(this.value / 1000)}k` : this.value;
      };
    },
    handleBatchEvent(state) {
      this.snackbar = state;
      this.editBatch = false;

      if (state) this.updateSections();
    },
    baseData(name, unit, color = '#7f2775', showInLegend = true, options = {}) {
      return {
        name: `${name} [${unit}]`,
        type: 'areaspline',
        color,
        fillOpacity: 0.1,
        data: [],
        showInLegend,
        ...options
      };
    },
    getTreatments() {
      axios.get(`/batches/${this.$route.params.id}/treatments`)
        .then(({ data }) => {
          this.treatments = data;
        });
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
    getBatchProduction() {
      axios.get(`/batches/${this.$route.params.id}/productions`)
        .then(({ data }) => {
          const uniqueHeaders = {};
          let week;
          data.forEach((production, index) => {
            let info = {};
            // eslint-disable-next-line no-bitwise
            week = ~~(production.batchAge / 7);

            this.eggInsights.push({
              date: production.date,
              week
            });

            this.feedInsights.push({
              date: production.date,
              week
            });

            production.items.forEach((item) => {
              info = { ...item };
              const category = info.category.toLowerCase();
              if (!uniqueHeaders[category]) {
                uniqueHeaders[category] = {};
              }

              uniqueHeaders[category][info.name] = {
                text: info.name,
                value: info.name
              };
              this[`${category}Insights`][index][info.name] = +(info.quantity / info.packagingSize).toFixed(2);
            });
          });
          this.eggInsightHeaders = [...this.eggInsightHeaders, ...Object.values(uniqueHeaders.egg)];
          this.feedInsightHeaders = [...this.feedInsightHeaders, ...Object.values(uniqueHeaders.feed)];
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
            { name: 'Move in cost', value: `₦${this.$options.filters.formatNumber(data.totalCost, 0)}` }
          ];
        });
    },
    getIncomeSummary() {
      this.eggSales = 0;
      this.feedCosts = 0;
      this.totalExpenses = 0;

      axios.get(`/batches/${this.$route.params.id}/income-summary`)
        .then(({ data }) => {
          data.forEach((item) => {
            if (item.category.toLowerCase() === 'egg') this.eggSales = item.amount;
            if (item.category.toLowerCase() === 'feed') this.feedCosts = item.amount;
            if (item.category.toLowerCase() === 'expense') this.totalExpenses = item.amount;
          });
          this.profit = this.eggSales - this.feedCosts - this.totalExpenses;
        });
    },
    computeSummary(productions) {
      this.totalFeeds = 0;
      this.totalEggs = 0;
      this.totalMortality = 0;

      const productionCopy = [...productions].reverse();
      productionCopy.forEach((production) => {
        this.totalFeeds += production.feeds;
        this.totalEggs += Number.parseInt(production.eggs / production.eggPackagingSize, 10);
        this.totalMortality = production.cumulativeMortality;
        this.initialPopulation = production.initialPopulation;
        this.curateChartData(production);
      });
    },
    curateChartData(production) {
      const date = new Date(production.date).getTime();
      this.productionData.data.push({ x: date, y: production.productionPercent });
      this.eggsData.data.push({ x: date, y: +(production.eggs / production.eggPackagingSize).toFixed(2) });
      this.feedsData.data.push({ x: date, y: +(production.feeds / +production.feedPackagingSize).toFixed(2) });
      this.populationData.data.push({ x: date, y: production.mortality });
      this.waterData.data.push({ x: date, y: production.water });
      this.temperatureData.data.push({ x: date, y: production.temperature });
      this.expectedProductionData.data.push({ x: date, y: production.expectancy });
      // eslint-disable-next-line no-bitwise
      this.weekData.data.push({ x: date, y: ~~(production.batchAge / 7) });
    },
    updateSections() {
      this.getProduction();
      this.getBatch();
      this.getTreatments();
      this.getIncomeSummary();
      this.getBatchProduction();
    }
  },
  filters: {
    formatNumber(value, digits = 2) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits }).format(value);
    }
  },
  mounted() {
    this.updateSections();
  }
};
</script>

<style>
 .v-toolbar__content {
   padding-left: 0 !important;
   padding-right: 0 !important;
 }

 .fade-enter-active, .fade-leave-active {
   transition: opacity 250ms;
 }
 .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
   opacity: 0.2;
 }
</style>
