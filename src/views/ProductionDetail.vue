<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>New Production</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" tile @click="createNew">
        Save
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>
    <v-card-actions>
      <span class="headline">Eggs collected</span>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="addItem('EggCollection')"
      >
        Add item
      </v-btn>
    </v-card-actions>
    <v-data-table
      disable-sort
      hide-default-footer
      :headers="eggCollectionHeaders"
      :items="eggCollection"
      class="elevation-1"
    >
    </v-data-table>

    <v-card-actions>
      <span class="headline">Feed consumed</span>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="addItem('FeedConsumed')"
      >
        Add item
      </v-btn>
    </v-card-actions>
    <v-data-table
      disable-sort
      hide-default-footer
      :headers="feedConsumed.headers"
      :items="feedConsumed.data"
      class="elevation-1"
    ></v-data-table>

    <v-card-actions>
      <span class="headline">Mortality</span>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="addItem('Mortality')"
      >
        Add item
      </v-btn>
    </v-card-actions>
    <v-data-table
      disable-sort
      hide-default-footer
      :headers="mortality.headers"
      :items="mortality.data"
      class="elevation-1"
    ></v-data-table>

    <v-card-actions>
      <span class="headline">Water consumed</span>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
          @click="addItem('WaterConsumed')"
      >
        Add item
      </v-btn>
    </v-card-actions>
    <v-data-table
      disable-sort
      hide-default-footer
      :headers="waterConsumed.headers"
      :items="waterConsumed.data"
      class="elevation-1"
    ></v-data-table>

    <v-textarea
      clearable
      label="Note"
      rows="2"
      value="Attendant notes"
    ></v-textarea>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>{{ activeSection }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <component :is="activeSection"/>
        </v-card-text>
        <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import EggCollection from '../components/EggCollection.vue';
import FeedConsumed from '../components/FeedConsumed.vue';
import Mortality from '../components/Mortality.vue';
import WaterConsumed from '../components/WaterConsumed.vue';

export default {
  name: 'ProductionDetail',
  data() {
    return {
      activeSection: '',
      dialog: false,
      panel: [0, 1, 2, 3],
      eggCollection: [
        {
          size: 'small', quantity: 290, damaged: 20, total: 310, damagedPercent: 8.2
        },
        {
          size: 'medium', quantity: 780, damaged: 10, total: 790, damagedPercent: 8.2
        },
        {
          size: 'large', quantity: 10, damaged: 0, total: 10, damagedPercent: 8.2
        }
      ],
      eggCollectionHeaders: [
        {
          text: 'Size',
          align: 'start',
          value: 'size',
        },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Damaged', value: 'damaged' },
        { text: 'Damaged %', value: 'damagedPercent' },
        { text: 'Total', value: 'total' },
        { text: '', value: '' },
      ],
      feedConsumed: {
        headers: [
          { text: 'Type', align: 'start', value: 'type' },
          { text: 'Quantity (kg)', value: 'quantity' },
          { text: 'Cost per (kg)', value: 'cost' },
          { text: '', value: '' },
        ],
        data: [
          { type: 'Layer Mash', quantity: 290 },
          { type: 'Grower Mash', quantity: 780 }
        ]
      },
      waterConsumed: {
        headers: [
          { text: 'Quantity (ltr)', value: 'quantity' },
          { text: 'Water / Bird (ml)', value: 'waterPerBird' },
          { text: '', value: '' },
        ],
        data: [
          { waterPerBird: 750, quantity: 2000 }
        ]
      },
      mortality: {
        headers: [
          { text: 'Number of birds', align: 'start', value: 'count' },
          { text: 'Time', value: 'time' },
          { text: 'Reason', value: 'reason' },
          { text: '', value: '' },
        ],
        data: [
          { count: 2, reason: 'Prolapse', time: '07:15 AM' },
          { count: 1, reason: 'Suffocation', time: '07:15 AM' },
          { count: 2, reason: 'Crushed', time: '07:15 AM' },
          { count: 2, reason: 'Predator', time: '07:15 AM' },
          { count: 2, reason: 'Dead', time: '07:15 AM' },
          { count: 2, reason: 'Disease ', time: '07:15 AM' },
        ]
      },
      date: null,
      trip: {
        name: '',
        location: null,
        start: null,
        end: null,
      },
      locations: ['Australia', 'Barbados', 'Chile', 'Denmark', 'Equador', 'France'],
    };
  },
  components: {
    EggCollection,
    FeedConsumed,
    Mortality,
    WaterConsumed
  },
  methods: {
    addItem(section) {
      this.activeSection = section;
      this.dialog = true;
    }
  }
};
</script>
