<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>New Production</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="primary" class="spacer--right">cancel</v-btn>
      <v-btn color="primary" tile @click="createNew">
        Save
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-row>
      <v-col>
        <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4">Eggs collected</v-col>
              <v-col
                cols="8"
                class="text--secondary"
              >
                <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select trip destination
              </span>
                  <span
                    v-else
                    key="1"
                  >
                {{ trip.location }}
              </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="8">
                <v-data-table
                  disable-sort
                  hide-default-footer
                  :headers="eggCollectionHeaders"
                  :items="eggCollection"
                >
                </v-data-table>
              </v-col>

              <v-divider
                vertical
                class="mx-4"
              ></v-divider>

              <v-col cols="3" class="caption">
                <ul>
                  <li>Add an egg collection record by clicking on "Add item".</li>
                  <li>You can add multiple records for this batch/flock, for the selected date.
                    This can be the different grades of eggs or eggs collected at different times of the day.</li>
                </ul>
                <br>
                <a href="javascript:void(0)">Learn more</a>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click="addItem('EggCollection')"
              >
                Add item
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4">Feed consumed</v-col>
              <v-col
                cols="8"
                class="text--secondary"
              >
                <v-fade-transition leave-absolute>
                  <span v-if="open">When do you want to travel?</span>
                  <v-row
                    v-else
                    no-gutters
                    style="width: 100%"
                  >
                    <v-col cols="6">Start date: {{ trip.start || 'Not set' }}</v-col>
                    <v-col cols="6">End date: {{ trip.end || 'Not set' }}</v-col>
                  </v-row>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="8">
                <v-data-table
                  disable-sort
                  hide-default-footer
                  :headers="feedConsumed.headers"
                  :items="feedConsumed.data"
                ></v-data-table>
              </v-col>

              <v-divider
                vertical
                class="mx-4"
              ></v-divider>

              <v-col cols="3" class="caption">
                <ul>
                  <li>Add a feeding record record by clicking on "Add item".</li>
                  <li>You can add multiple records for this batch/flock, for the selected date.
                    This can be the different grades of eggs or eggs collected at different times of the day.</li>
                </ul>
                <br>
                <a href="javascript:void(0)">Learn more</a>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click="addItem('FeedConsumed')"
              >
                Add item
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4">Mortality</v-col>
              <v-col
                cols="8"
                class="text--secondary"
              >
                <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select trip destination
              </span>
                  <span
                    v-else
                    key="1"
                  >
                {{ trip.location }}
              </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="8">
                <v-data-table
                  disable-sort
                  hide-default-footer
                  :headers="mortality.headers"
                  :items="mortality.data"
                ></v-data-table>
              </v-col>

              <v-divider
                vertical
                class="mx-4"
              ></v-divider>

              <v-col cols="3" class="caption">
                <ul>
                  <li>Add an egg collection record by clicking on "Add item".</li>
                  <li>You can add multiple records for this batch/flock, for the selected date.
                    This can be the different grades of eggs or eggs collected at different times of the day.</li>
                </ul>
                <br>
                <a href="javascript:void(0)">Learn more</a>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click="addItem('Mortality')"
              >
                Add item
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4">Water consumed</v-col>
              <v-col
                cols="8"
                class="text--secondary"
              >
                <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select trip destination
              </span>
                  <span
                    v-else
                    key="1"
                  >
                {{ trip.location }}
              </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="8">
                <v-data-table
                  disable-sort
                  hide-default-footer
                  :headers="waterConsumed.headers"
                  :items="waterConsumed.data"
                ></v-data-table>
              </v-col>

              <v-divider
                vertical
                class="mx-4"
              ></v-divider>

              <v-col cols="3" class="caption">
                <ul>
                  <li>Add an egg collection record by clicking on "Add item".</li>
                  <li>You can add multiple records for this batch/flock, for the selected date.
                    This can be the different grades of eggs or eggs collected at different times of the day.</li>
                </ul>
                <br>
                <a href="javascript:void(0)">Learn more</a>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click="addItem('WaterConsumed')"
              >
                Add item
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4">Vaccination</v-col>
              <v-col
                cols="8"
                class="text--secondary"
              >
                <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select trip destination
              </span>
                  <span
                    v-else
                    key="1"
                  >
                {{ trip.location }}
              </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="8">
                <v-data-table
                  disable-sort
                  hide-default-footer
                  :headers="mortality.headers"
                  :items="mortality.data"
                ></v-data-table>
              </v-col>

              <v-divider
                vertical
                class="mx-4"
              ></v-divider>

              <v-col cols="3" class="caption">
                <ul>
                  <li>Add an egg collection record by clicking on "Add item".</li>
                  <li>You can add multiple records for this batch/flock, for the selected date.
                    This can be the different grades of eggs or eggs collected at different times of the day.</li>
                </ul>
                <br>
                <a href="javascript:void(0)">Learn more</a>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click="addItem('Mortality')"
              >
                Add item
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4">Medication</v-col>
              <v-col
                cols="8"
                class="text--secondary"
              >
                <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select trip destination
              </span>
                  <span
                    v-else
                    key="1"
                  >
                {{ trip.location }}
              </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="8">
                <v-data-table
                  disable-sort
                  hide-default-footer
                  :headers="mortality.headers"
                  :items="mortality.data"
                ></v-data-table>
              </v-col>

              <v-divider
                vertical
                class="mx-4"
              ></v-divider>

              <v-col cols="3" class="caption">
                <ul>
                  <li>Add an egg collection record by clicking on "Add item".</li>
                  <li>You can add multiple records for this batch/flock, for the selected date.
                    This can be the different grades of eggs or eggs collected at different times of the day.</li>
                </ul>
                <br>
                <a href="javascript:void(0)">Learn more</a>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click="addItem('Mortality')"
              >
                Add item
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4">Note</v-col>
                <v-col
                  cols="8"
                  class="text--secondary"
                >
                  <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select trip destination
              </span>
                    <span
                      v-else
                      key="1"
                    >
                {{ trip.location }}
              </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row no-gutters>
                <v-col cols="8">
                  <v-textarea
                    clearable
                    label="Note"
                    value="Attendant notes"
                  ></v-textarea>
                </v-col>

                <v-divider
                  vertical
                  class="mx-4"
                ></v-divider>

                <v-col cols="3" class="caption">
                  <ul>
                    <li>Add an egg collection record by clicking on "Add item".</li>
                    <li>You can add multiple records for this batch/flock, for the selected date.
                      This can be the different grades of eggs or eggs collected at different times of the day.</li>
                  </ul>
                  <br>
                  <a href="javascript:void(0)">Learn more</a>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
      </v-expansion-panels>
      </v-col>
    </v-row>

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
