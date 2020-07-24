<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>New Production</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="primary" class="spacer--right">cancel</v-btn>
      <v-btn color="primary" tile @click="saveProduction" :disabled="!validProduction">
        Save production
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>
    <v-form ref="form">
      <v-row>
        <v-col cols="12" md="4">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            max-width="290"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="production.date"
                clearable
                label="Date*"
                hint="Production day."
                :rules="[v => !!v || 'Please select a valid production day.']"
                readonly
                persistent-hint
                v-on="on"
                @click:clear="production.date = null"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="production.date"
              @change="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            label="Farm*"
            hint="Farm where the expense is incurred."
            persistent-hint
            return-object
            @blur="updateBatchList"
            required
            :rules="[v => !!v || 'Please select a farm location.']"
            v-model="production.farm"
            item-text="name"
            item-value="name"
            :items="farmLocations"
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            label="Batch"
            hint="Flock/Batch this expense applied to."
            persistent-hint
            required
            return-object
            v-model="production.batch"
            :disabled="!production.farm"
            item-text="name"
            no-data-text="No batch found."
            :rules="[v => !!v || 'Please select a batch.']"
            item-value="name"
            :items="batches"
          ></v-select>
        </v-col>

        <v-slide-y-reverse-transition
          class="py-0"
          tag="v-col"
        >
          <v-col v-if="validProduction">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Eggs collected</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-data-table
                        disable-sort
                        no-data-text="No eggs recorded."
                        hide-default-footer
                        :headers="eggCollectionHeaders"
                        :items="production.eggs"
                      >
                        <template v-slot:item.total="{ item }">
                          {{ +item.crates + +((+item.pieces / 30).toFixed(2)) | formatNumber }} crates
                        </template>
                      </v-data-table>
                      <v-btn
                        class="float-right"
                        outlined
                        tile
                        color="primary"
                        @click="addItem('EggCollection')"
                      >
                        Add item
                      </v-btn>
                    </v-col>

                    <v-divider
                      vertical
                      class="mx-4"
                    ></v-divider>

                    <v-col cols="3" class="subtitle-2">
                      <ul>
                        <li>Add an egg collection record by clicking on "Add item".</li>
                        <li>You can add multiple records for this batch/flock, for the selected date.
                          This can be the different grades of eggs or eggs collected at different times of the day.</li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Feed consumed</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-data-table
                        disable-sort
                        hide-default-footer
                        :headers="feedConsumedHeaders"
                        no-data-text="No feed recorded."
                        :items="production.feeds"
                      >
                        <template v-slot:item.feedPerBird="{ item }">
                          {{ (item.quantity / production.batch.currentStock) * 1000 | formatNumber }}g
                        </template>
                        <template v-slot:item.quantity="{ item }">
                          {{ item.quantity | formatNumber }}kg
                        </template>
                      </v-data-table>

                      <v-btn
                        class="float-right"
                        outlined
                        tile
                        color="primary"
                        @click="addItem('FeedConsumed')"
                      >
                        Add item
                      </v-btn>
                    </v-col>

                    <v-divider
                      vertical
                      class="mx-4"
                    ></v-divider>

                    <v-col cols="3" class="subtitle-2">
                      <ul>
                        <li>Add a feeding record record by clicking on "Add item".</li>
                        <li>You can add multiple records for this batch/flock, for the selected date.
                          This can be the different grades of eggs or eggs collected at different times of the day.</li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Mortality</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-data-table
                        disable-sort
                        hide-default-footer
                        no-data-text="No mortality recorded."
                        :headers="mortalityHeaders"
                        :items="production.mortality"
                      ></v-data-table>

                      <v-btn
                        class="float-right"
                        outlined
                        color="primary"
                        tile
                        @click="addItem('Mortality')"
                      >
                        Add item
                      </v-btn>
                    </v-col>

                    <v-divider
                      vertical
                      class="mx-4"
                    ></v-divider>

                    <v-col cols="3" class="subtitle-2">
                      <ul>
                        <li>Record a mortality by clicking on "Add item".</li>
                        <li>You can add multiple records for this batch/flock, for the selected date.
                          This can be the different mortality recorded at different times of the day.</li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Water consumed</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-data-table
                        disable-sort
                        hide-default-footer
                        no-data-text="No water consumption recorded."
                        :headers="waterConsumedHeaders"
                        :items="production.water"
                      >
                        <template v-slot:item.waterPerBird="{ item }">
                          {{ (item.quantity / production.batch.currentStock) * 1000 | formatNumber }}ml
                        </template>
                      </v-data-table>
                      <v-btn
                        outlined
                        class="float-right"
                        color="primary"
                        tile
                        @click="addItem('WaterConsumed')"
                      >
                        Add item
                      </v-btn>
                    </v-col>

                    <v-divider
                      vertical
                      class="mx-4"
                    ></v-divider>

                    <v-col cols="3" class="subtitle-2">
                      <ul>
                        <li>Record water consumed by clicking on "Add item".</li>
                        <li>You can add multiple records for this batch/flock, for the selected date.</li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Medication</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-data-table
                        disable-sort
                        hide-default-footer
                        no-data-text="No medication recorded."
                        :headers="medicationHeaders"
                        :items="production.medication"
                      ></v-data-table>
                      <v-btn
                        outlined
                        class="float-right"
                        color="primary"
                        tile
                        @click="addItem('Medication')"
                      >
                        Add item
                      </v-btn>
                    </v-col>

                    <v-divider
                      vertical
                      class="mx-4"
                    ></v-divider>

                    <v-col cols="3" class="subtitle-2">
                      <ul>
                        <li>Add an egg collection record by clicking on "Add item".</li>
                        <li>You can add multiple records for this batch/flock, for the selected date.
                          This can be the different grades of eggs or eggs collected at different times of the day.</li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Vaccination</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-data-table
                        disable-sort
                        hide-default-footer
                        no-data-text="No vaccination recorded."
                        :headers="vaccinationHeaders"
                        :items="production.vaccinations"
                      ></v-data-table>
                      <v-btn
                        outlined
                        class="float-right"
                        color="primary"
                        tile
                        @click="addItem('Vaccination')"
                      >
                        Add item
                      </v-btn>
                    </v-col>

                    <v-divider
                      vertical
                      class="mx-4"
                    ></v-divider>

                    <v-col cols="3" class="subtitle-2">
                      <ul>
                        <li>Add an egg collection record by clicking on "Add item".</li>
                        <li>You can add multiple records for this batch/flock, for the selected date.
                          This can be the different grades of eggs or eggs collected at different times of the day.</li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Note</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col md="12" cols="12">
                      <v-textarea
                        clearable
                        label="Attendant notes"
                        :rows="3"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-slide-y-reverse-transition>

        <v-col cols="12">
          <v-btn color="primary"
                 class="float-right"
                 @click="saveProduction"
                 tile>
            {{ validProduction? 'Save production' : 'Continue' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="dialog" persistent scrollable max-width="600px" :fullscreen="$mq.phone">
      <v-card>
        <v-card-title>{{ sectionNames[activeSection].title }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <component :is="activeSection" v-model="sectionData" :ref="activeSection"/>
        </v-card-text>
        <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="primary darken-1" tile @click="updateSectionData">Add item</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import { GETTER_TYPES } from '../store/types';
import EggCollection from '../components/EggCollection.vue';
import FeedConsumed from '../components/FeedConsumed.vue';
import Mortality from '../components/Mortality.vue';
import WaterConsumed from '../components/WaterConsumed.vue';
import Vaccination from '../components/Vaccination.vue';
import Medication from '../components/Medication.vue';

export default {
  name: 'ProductionDetail',
  data() {
    return {
      validProduction: false,
      production: {
        date: this.today(),
        eggs: [],
        feeds: [],
        water: [],
        mortality: [],
        vaccinations: [],
        medications: [],
        note: ''
      },
      sectionNames: {
        EggCollection: {
          id: 'eggs',
          key: 'size',
          title: 'Eggs collected'
        },
        FeedConsumed: {
          id: 'feeds',
          key: 'type',
          title: 'Feed consumed'
        },
        Mortality: {
          id: 'mortality',
          key: 'reason',
          title: 'Mortality'
        },
        WaterConsumed: {
          id: 'water',
          key: 'quantity',
          title: 'Water consumed'
        },
        Vaccination: {
          id: 'vaccinations',
          key: 'vaccineBatchNo',
          title: 'Vaccination'
        },
        Medication: {
          id: 'Medications',
          key: 'medicamentBatchNo',
          title: 'Medication'
        }
      },
      batches: [],
      sectionData: {},
      dateMenu: false,
      activeSection: 'EggCollection',
      dialog: false,
      eggCollectionHeaders: [
        {
          text: 'Size',
          align: 'start',
          value: 'size',
        },
        { text: 'Crates', value: 'crates' },
        { text: 'Pieces', value: 'pieces' },
        { text: 'Total', value: 'total' }
      ],
      feedConsumedHeaders: [
        { text: 'Type', align: 'start', value: 'type' },
        { text: 'Bags (25kg)', value: 'bags' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Feed / bird', value: 'feedPerBird' }
      ],
      waterConsumedHeaders: [
        { text: 'Quantity (ltr)', value: 'quantity' },
        { text: 'Water / Bird (ml)', value: 'waterPerBird' },
        { text: '', value: '' },
      ],
      mortalityHeaders: [
        { text: 'Number of birds', align: 'start', value: 'count' },
        { text: 'Time', value: 'time' },
        { text: 'Reason', value: 'reason' },
        { text: '', value: '' },
      ],
      vaccinationHeaders: [
        { text: 'Vaccine', value: 'vaccine' },
        { text: 'Vaccine batch no.', value: 'vaccineBatchNo' },
        { text: 'Dosage/bird', value: 'dosage' },
        { text: 'Total dosage', value: 'totalDosage' },
        { text: 'Method', value: 'vaccinationMethod' },
        { text: 'Administered by', value: 'administeredBy' },
        { text: 'Reason', value: 'reason' },
      ],
      medicationHeaders: [
        { text: 'Medicament', value: 'medicament' },
        { text: 'Medicament batch no.', value: 'medicamentBatchNo' },
        { text: 'Dosage/bird', value: 'dosage' },
        { text: 'Total dosage', value: 'totalDosage' },
        { text: 'Method', value: 'medicamentMethod' },
        { text: 'Administered by', value: 'administeredBy' },
        { text: 'Reason', value: 'reason' },
      ]
    };
  },
  components: {
    EggCollection,
    FeedConsumed,
    Mortality,
    WaterConsumed,
    Vaccination,
    Medication
  },
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS
    })
  },
  methods: {
    updateBatchList() {
      axios.get('/batches?status=active')
        .then(({ data }) => {
          this.batches = data;
        });
    },
    addItem(section) {
      this.activeSection = section;
      this.dialog = true;
    },
    saveProduction() {
      if (this.validProduction) axios.post();
      else this.validProduction = this.$refs.form.validate();
    },
    updateSectionData() {
      if (this.$refs[this.activeSection].validate()) {
        const sectionInfo = this.sectionNames[this.activeSection];
        const itemIndex = this.itemIndex(this.production[sectionInfo.id], this.sectionData, sectionInfo.key);

        if (itemIndex === -1) this.production[sectionInfo.id].push(JSON.parse(JSON.stringify(this.sectionData)));
        else this.production[sectionInfo.id][itemIndex] = JSON.parse(JSON.stringify(this.sectionData));

        this.production[sectionInfo.id] = [...this.production[sectionInfo.id]];
        this.$refs[this.activeSection].reset();
        this.dialog = false;
      }
    },
    itemIndex(items, item, key) {
      return items.findIndex((itm) => itm[key] === item[key]);
    },
    today() {
      const date = new Date();
      return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate()
        .toString().padStart(2, '0')}`;
    }
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    },
    pad(value) {
      return value.toString().padStart(4, '0');
    }
  },
};
</script>

<style>
  .float-right {
    float: right;
  }
</style>
