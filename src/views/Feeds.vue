<template>
  <section>
    <feed-production v-model="production" :active="showDialog" @close="showDialog = false" @save="feedSaved"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Feed mill</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="showDialog = true">
        Add feed
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-row>
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
              label="Date"
              autocomplete="false"
              clearable
              @click:clear="resetDate"
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
          v-model="search"
          width='100'
        ></v-text-field>
      </v-col>
    </v-row>

    <v-toolbar class="pa-0" color="transparent elevation-0" dense>
      <div class="ml-2">
        <v-btn icon outlined color="primary" small>
          <v-icon small>mdi-calculator</v-icon>
        </v-btn>
        <span class="caption text-uppercase ml-2">Cost estimator</span>
      </div>
      <v-spacer/>
      <v-btn-toggle
        dense
        rounded
        class="pr-0"
        v-model="mode"
        mandatory
      >
        <v-btn small>
          Ingredients
        </v-btn>
        <v-btn small>
          Production
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-row class="mt-0 mb-3 mr-0 ml-0" v-if="mode === 0">
      <v-col v-for="(summary, index) in itemSummary" :key="index" class="pa-1">
        <v-card outlined>
          <v-list dense>
            <v-list-item>
              <v-list-item-avatar tile size="70">
                <v-img :src="`/${summary.thumbnail}`"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="caption text-uppercase text-no-wrap" style="color: rgb(114, 114, 114);">
                  {{ summary.name }}</v-list-item-title>
                <span class="body-2 text-no-wrap">
                  ₦{{ summary.minPrice | formatNumber}}&nbsp;&mdash;&nbsp;₦{{ summary.maxPrice | formatNumber}}</span>
                <v-list-item-title class="title" style="line-height: unset;">
                  <strong>{{ summary.quantity | formatNumber }} {{ summary.unit }}</strong>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-0 mb-3 mr-0 ml-0" v-else>
      <v-col class="pa-1" v-for="feed in feedsSummary" :key="feed.name">
        <v-card class="ma-auto" height="100" outlined>
          <v-card-text class="pb-0 text-uppercase">{{ feed.name }}</v-card-text>
          <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
            {{ feed.quantity | formatNumber }} kg</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      no-data-text="No feeds produced."
      :headers="headers"
      :items="feeds"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.concentrate="{ item }">
        {{ item.concentrate.quantity | formatNumber }} {{ item.concentrate.unit }}
      </template>
      <template v-slot:item.wheatOffal="{ item }">
        {{ item.wheatOffal.quantity | formatNumber }} {{ item.wheatOffal.unit }}
      </template>
      <template v-slot:item.maize="{ item }">
        {{ item.maize.quantity | formatNumber }} {{ item.maize.unit }}
      </template>
      <template v-slot:item.toxinBinder="{ item }">
        {{ item.toxinBinder.quantity | formatNumber }} {{ item.toxinBinder.unit }}
      </template>
      <template v-slot:item.summary.totalAmount="{ item }">
        ₦{{ item.summary.totalAmount | formatNumber }}
      </template>
      <template v-slot:item.summary.quantity="{ item }">
        {{ item.summary.quantity | formatNumber }}
      </template>
      <template v-slot:item.quantity.bag="{ item }">
        {{ (item.summary.quantity / 25) | formatNumber }}
      </template>
      <template v-slot:item.summary.costPerUnit="{ item }">
        ₦{{ item.summary.costPerUnit | formatNumber }}
      </template>
      <template v-slot:item.costPerBag="{ item }">
        ₦{{ (item.summary.costPerUnit * 25) | formatNumber }}
      </template>
      <template v-slot:item.actions="{ item }">
        <TableAction id="feed"
                     :item="item"
                     :edit-item="''"
                     :delete-item="confirmDelete"
        />
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
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
    <v-dialog
      v-model="dialog"
      max-width="450"
    >
      <v-card>
        <v-card-title class="headline">
          Deleting a feed production record?
        </v-card-title>

        <v-card-text>
          The selected feed production record will be permanently removed from the system.
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
  </section>
</template>
<script>
import FeedProduction from '@/components/FeedProduction.vue';
import TableAction from '@/components/TableAction.vue';
import axios from '../plugins/axios';

export default {
  name: 'FeedMill',
  components: { FeedProduction, TableAction },
  data() {
    return {
      dialog: false,
      dateMenu: false,
      snackbar: false,
      showDialog: false,
      message: '',
      snackbarColor: 'blue',
      date: null,
      search: '',
      menu: false,
      production: {},
      feedsSummary: [],
      mode: 0,
      feeds: [],
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        {
          text: 'Type',
          sortable: true,
          value: 'type.name',
        },
        { text: 'Energy Level', value: 'energyLevel' },
        {
          text: 'Maize',
          sortable: true,
          value: 'maize',
        },
        {
          text: 'Concentrate',
          sortable: true,
          value: 'concentrate',
        },
        {
          text: 'Wheatoffal',
          sortable: true,
          value: 'wheatOffal',
        },
        {
          text: 'Toxin binder',
          sortable: true,
          value: 'toxinBinder',
        },
        {
          text: 'Quantity (Kg)',
          sortable: true,
          value: 'summary.quantity',
        },
        { text: 'Quantity (Bag)', value: 'quantity.bag' },
        { text: 'Cost / Kg', value: 'summary.costPerUnit' },
        { text: 'Cost / Bag', value: 'costPerBag' },
        { text: 'Total Amount', value: 'summary.totalAmount', align: 'end' },
        { text: '', value: 'actions' },
      ],
      itemSummary: []
    };
  },
  computed: {
    dateRangeText() {
      return this.date && this.date.length > 0 ? this.date.join(' ~ ') : null;
    }
  },
  methods: {
    updateDate() {
      this.$refs.menu.save(this.date);
      this.getProduction();
    },
    resetDate() {
      this.date = [];
      this.getProduction();
    },
    feedSaved() {
      this.successAlert();
      this.showDialog = false;
      this.message = 'Feed production created successfully';
      this.getProduction();
    },
    deleteItem() {
      axios.delete(`/feed-productions/${this.selectedId}`)
        .then(({ data }) => {
          if (data.error) {
            this.errorAlert();
            this.message = data.error;
          } else {
            this.successAlert();
            this.message = 'Feed production record deleted successfully.';
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
      this.snackbarColor = 'blue';
    },
    errorAlert() {
      this.snackbar = true;
      this.snackbarColor = 'red';
    },
    confirmDelete(record, { id }) {
      this.selectedId = id;
      this.dialog = true;
    },
    getProduction() {
      const filters = [];
      if (this.date && this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date && this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);

      axios.get(`/feed-productions?${filters.join('&')}`)
        .then(({ data }) => {
          this.feeds = data.records;
          this.itemSummary = data.summary.ingredients;
          this.feedsSummary = data.summary.feeds;
        });
    }
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    }
  },
  created() {
    this.getProduction();
  }
};
</script>
