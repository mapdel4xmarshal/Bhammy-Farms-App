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
              :value="dateRangeText"
              dense
              label="Date"
              autocomplete="false"
              clearable
              @click:clear="clearDate"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" range>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="date = [] && updateDate()">All</v-btn>
            <v-btn color="primary" @click="updateDate">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="5">
        <v-autocomplete
          v-model="batch"
          label="Batch"
          persistent-hint
          required
          dense
          chips
          small-chips
          multiple
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

    <v-toolbar class="pa-0" color="transparent elevation-0" dense>
      <v-spacer/>
      <v-btn-toggle
        dense
        rounded
        class="pr-0"
        v-model="mode"
        mandatory
      >
        <v-btn small>
          Summary
        </v-btn>
        <v-btn small>
          Breakdown
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>

    <div class="summary-container">
      <v-row v-if="!mode">
        <v-col>
          <metric-card title="Eggs Produced" :value="totalEggs" unit="crates" img="img/egg.png"/>
        </v-col>

        <v-col>
          <metric-card title="Birds" :value="totalBirds" unit="birds" img="img/hen.png"/>
        </v-col>

        <v-col>
          <metric-card title="Feeds Consumed" :value="totalFeeds" unit="kg" img="img/feed.png"/>
        </v-col>

        <v-col>
          <metric-card title="Morality" :value="totalMortality" unit="bird(s)" img="img/dead.png"/>
        </v-col>
      </v-row>
      <v-row v-else>
        <template v-for="(value, type) in eggTypes">
          <v-col :key="type">
            <metric-card :title="type" :value="value / 30" unit="crates" img="img/egg.png"/>
          </v-col>
        </template>
        <template v-for="(value, type) in feedTypes">
          <v-col :key="type">
            <metric-card :title="type" :value="value / 25" unit="bags" img="img/feed.png"/>
          </v-col>
        </template>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="productions"
      no-data-text="No productions available."
      multi-sort
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.eggs="{ item }">
        {{ (item.eggs / item.eggPackagingSize ).toFixed(2) }}
      </template>

      <template v-slot:item.eggCount="{ item }">
        {{ item.eggs | normalizeNumber }}
      </template>

      <template v-slot:item.profit="{ item }">
        <strong :style="{color: item.profit < 0? 'red' : 'green'}">
          ₦{{ Math.abs(item.profit) | normalizeNumber }} </strong>
      </template>

      <template v-slot:item.actions="{ item }">
        <TableAction id="EggCollection"
                     :item="item"
                     :edit-item="''"
                     :delete-item="confirmDelete"
        />
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Deleting a production record?
        </v-card-title>

        <v-card-text>
          The selected production record will be permanently removed from the system.
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            depressed
            @click="deleteItem"
          >
            Delete record
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
    >
      {{ message }}
      <v-btn
        :color="snackbarColor"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </section>
</template>

<script>
import axios from '../plugins/axios';
import ROUTES from '../router/routeNames';
import MetricCard from '../components/MetricCard.vue';
import TableAction from '../components/TableAction.vue';

export default {
  name: 'Production',
  data() {
    return {
      dialog: false,
      selectedId: '',
      snackbar: false,
      snackbarColor: 'red',
      message: '',
      productions: [],
      totalFeeds: 0,
      totalEggs: 0,
      totalMortality: 0,
      totalBirds: 0,
      batches: [],
      dateMenu: false,
      date: [],
      mode: 0,
      eggTypes: {},
      feedTypes: {},
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
        { text: 'Eggs', value: 'eggCount' },
        { text: 'Production %', value: 'productionPercent' },
        { text: 'Feed (kg)', value: 'feeds' },
        { text: 'Feed/animal (g)', value: 'feedPerAnimal' },
        { text: 'Mortality', value: 'mortality' },
        { text: 'Mortality %', value: 'mortalityRate' },
        { text: 'Est. Profit', value: 'profit' },
        { text: '', value: 'actions' }
      ]
    };
  },
  components: {
    MetricCard,
    TableAction
  },
  computed: {
    dateRangeText() {
      return this.date && this.date.length > 0 ? this.date.join(' ~ ') : [];
    }
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    },
    clearDate() {
      this.defaultDate();
      this.getProduction();
    },
    async defaultDate() {
      const endDate = new Date().getTime();
      const startDate = endDate - 5184000000; // 60 days
      this.date = [];
      await this.$nextTick(() => {
        this.date = [
          new Date(endDate).toISOString().split('T')[0],
          new Date(startDate).toISOString().split('T')[0]
        ];
      });
    },
    getProduction() {
      const filters = ['isActive=1'];

      if (this.batch) filters.push(`batchId=${this.batch.map((batch) => batch.batchId).join()}`);
      if (this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date.length === 2) {
        this.date.sort((a, b) => a.localeCompare(b));
        filters.push(`after=${this.date[0]}&before=${this.date[1]}`);
      }
      axios.get(`/productions?${filters.join('&')}`)
        .then(({ data }) => {
          this.productions = data;
          this.computeSummary(data);
        });
    },
    getBatches() {
      axios.get('/batches?status=active')
        .then(({ data }) => {
          this.batches = data;
        });
    },
    deleteItem() {
      axios.delete(`/productions/${this.selectedId}`)
        .then(({ data }) => {
          if (data.error) {
            this.snackbar = true;
            this.message = data.error;
          } else {
            this.successAlert();
            this.message = 'Production record deleted successfully.';
            this.getProduction();
          }
        })
        .catch(({ response: { data } }) => {
          this.errorAlert();
          this.message = data;
        })
        .finally(() => {
          this.dialog = false;
        });
    },
    successAlert() {
      this.snackbar = true;
      this.snackbarColor = 'green';
    },
    errorAlert() {
      this.snackbar = true;
      this.snackbarColor = 'red';
    },
    confirmDelete(record, { id }) {
      this.selectedId = id;
      this.dialog = true;
    },
    computeSummary(productions) {
      this.totalFeeds = 0;
      this.totalEggs = 0;
      this.totalMortality = 0;
      this.totalBirds = 0;
      this.eggTypes = {};
      this.feedTypes = {};
      const flockMap = new Map();
      productions.forEach((production) => {
        this.totalFeeds += production.feeds;
        this.totalEggs += Number.parseFloat(production.eggs / production.eggPackagingSize);

        this.totalMortality += production.mortality;
        flockMap.set(production.batch, production.initialPopulation);
        this.processTypes(production);
      });

      this.totalEggs = this.totalEggs.toFixed(2);

      this.totalBirds = Array.from(flockMap.values())
        .reduce((totalFlock, flock) => totalFlock + flock, 0) - this.totalMortality;
    },
    processTypes(production) {
      production.eggTypes.forEach((type) => {
        if (!this.eggTypes[type.name]) this.eggTypes[type.name] = 0;
        this.eggTypes[type.name] += +type.quantity;
      });

      production.feedTypes.forEach((type) => {
        if (!this.feedTypes[type.name]) this.feedTypes[type.name] = 0;
        this.feedTypes[type.name] += +type.quantity;
      });
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
    this.defaultDate();
    this.getBatches();
  },
  activated() {
    this.getProduction();
  }
};
</script>

<style lang="scss">
  .table-cursor tbody tr:hover {
    cursor: pointer;
  }

  .summary-container {
    max-height: 100px;
    margin-top: 10px;
    margin-bottom: 30px;
    overflow: auto;
  }
</style>
