<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>New Production</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="primary" class="spacer--right" to="/productions">cancel</v-btn>
      <v-btn color="primary" tile @click="saveProduction" v-if="validProduction">
        {{ actionButtonTitle }}
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
            hint="Farm where the flock is housed."
            persistent-hint
            return-object
            @change="updateBatchList"
            required
            :rules="[v => !!v || 'Please select a farm location.']"
            v-model="farm"
            item-text="name"
            item-value="name"
            :items="farmLocations"
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            label="Batch"
            hint="Flock/Batch this record applies to."
            persistent-hint
            required
            return-object
            v-model="production.batch"
            :disabled="!farm"
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
                  <v-row no-gutters align="center">
                    <v-col cols="12"><div :class="{'error-state': sectionErrors['eggs']}">
                      <v-icon :color="(sectionErrors['eggs'] && iconColor) || ''">
                        mdi-egg</v-icon> Eggs collected</div></v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="12" md="9">
                      <v-data-table
                        disable-sort
                        no-data-text="No eggs recorded."
                        hide-default-footer
                        :headers="eggCollectionHeaders"
                        :items="production.eggs"
                      >
                        <template v-slot:item.total="{ item }">
                          {{ +item.crates + +((+item.pieces / item.packagingSize).toFixed(2)) | formatNumber }} crates
                        </template>

                        <template v-slot:item.actions="{ item }">
                          <TableAction id="EggCollection"
                                       :item="item"
                                       :edit-item="editItem"
                                       :delete-item="deleteItem"
                          />
                        </template>
                      </v-data-table>
                      <v-btn
                        class="float-right mt-6"
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
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters align="center">
                    <v-col cols="4"><div :class="{'error-state': sectionErrors['feeds']}">
                      <v-icon :color="(sectionErrors['feeds'] && iconColor) || ''">mdi-barley</v-icon>
                      Feed consumed</div></v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="12" md="9">
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

                        <template v-slot:item.actions="{ item }">
                          <TableAction id="FeedConsumed"
                                       :item="item"
                                       :edit-item="editItem"
                                       :delete-item="deleteItem"
                          />
                        </template>
                      </v-data-table>

                      <v-btn
                        class="float-right mt-6"
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
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters align="center">
                    <v-col cols="12"><div :class="{'error-state': sectionErrors['water']}">
                      <v-icon :color="(sectionErrors['water'] && iconColor) || ''">
                        mdi-water</v-icon> Water consumed</div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="12" md="9">
                      <v-data-table
                        disable-sort
                        hide-default-footer
                        no-data-text="No water consumption recorded."
                        :headers="waterConsumedHeaders"
                        :items="production.water"
                      >
                        <template v-slot:item.waterPerBird="{ item }">
                          {{ (item.quantity * 1000) / production.batch.currentStock | formatNumber }}ml
                        </template>

                        <template v-slot:item.actions="{ item }">
                          <TableAction id="WaterConsumed"
                                       :item="item"
                                       :edit-item="editItem"
                                       :delete-item="deleteItem"
                          />
                        </template>
                      </v-data-table>
                      <v-btn
                        outlined
                        class="float-right mt-6"
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
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters align="center">
                    <v-col cols="12"><div :class="{'error-state': sectionErrors['mortality']}">
                      <v-icon>mdi-skull-crossbones</v-icon> Mortality</div></v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="12" md="9">
                      <v-data-table
                        disable-sort
                        hide-default-footer
                        no-data-text="No mortality recorded."
                        :headers="mortalityHeaders"
                        :items="production.mortality"
                      >
                        <template v-slot:item.actions="{ item }">
                          <TableAction id="Mortality"
                                       :item="item"
                                       :edit-item="editItem"
                                       :delete-item="deleteItem"
                          />
                        </template>
                      </v-data-table>

                      <v-btn
                        class="float-right mt-6"
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
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters align="center">
                    <v-col cols="4"><v-icon>mdi-medical-bag</v-icon> Medication</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-data-table
                    disable-sort
                    hide-default-footer
                    no-data-text="No medication recorded."
                    :headers="medicationHeaders"
                    :items="production.medications"
                  >
                    <template v-slot:item.actions="{ item }">
                      <TableAction id="Medication"
                                   :item="item"
                                   :edit-item="editItem"
                                   :delete-item="deleteItem"
                      />
                    </template>
                  </v-data-table>
                  <v-btn
                    outlined
                    class="float-right mt-6"
                    color="primary"
                    tile
                    @click="addItem('Medication')"
                  >
                    Add item
                  </v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters align="center">
                    <v-col cols="4"><v-icon>mdi-needle</v-icon> Vaccination</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-data-table
                    disable-sort
                    hide-default-footer
                    no-data-text="No vaccination recorded."
                    :headers="vaccinationHeaders"
                    :items="production.vaccinations"
                  >
                    <template v-slot:item.actions="{ item }">
                      <TableAction id="Vaccination"
                                   :item="item"
                                   :edit-item="editItem"
                                   :delete-item="deleteItem"
                      />
                    </template>
                  </v-data-table>

                  <v-btn
                    outlined
                    class="float-right mt-6"
                    color="primary"
                    tile
                    @click="addItem('Vaccination')"
                  >
                    Add item
                  </v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters align="center">
                    <v-col cols="4"><v-icon>mdi-note-text</v-icon> Note</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col md="12" cols="12">
                      <v-textarea
                        clearable
                        label="Attendant notes"
                        v-model="production.note"
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
                 :loading="saving"
                 @click="saveProduction"
                 tile>
            {{ actionButtonTitle }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="dialog" persistent scrollable max-width="600px" :fullscreen="$mq.phone">
      <v-card>
        <v-card-title>{{ sectionNames[activeSection].title }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <component :is="activeSection" v-model="sectionData" :ref="activeSection" @enter="updateSectionData"/>
        </v-card-text>
        <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="primary darken-1" tile @click="updateSectionData">Add item</v-btn>
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
        :color="!validProduction? 'red' : 'blue'"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
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
import TableAction from '../components/TableAction.vue';

export default {
  name: 'ProductionDetail',
  data() {
    return {
      selectedFarm: '',
      saving: false,
      message: '',
      snackbar: false,
      batchList: [],
      iconColor: '',
      validProduction: false,
      sectionErrors: {},
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
          key: 'name',
          title: 'Eggs collected'
        },
        FeedConsumed: {
          id: 'feeds',
          key: 'name',
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
          key: 'vaccine',
          title: 'Vaccination'
        },
        Medication: {
          id: 'medications',
          key: 'medicament',
          title: 'Medication'
        }
      },
      sectionData: {},
      dateMenu: false,
      activeSection: 'EggCollection',
      dialog: false,
      eggCollectionHeaders: [
        {
          text: 'Size',
          align: 'start',
          value: 'name',
        },
        { text: 'Crates', value: 'crates' },
        { text: 'Pieces', value: 'pieces' },
        { text: 'Total', value: 'total' },
        { text: '', value: 'actions' }
      ],
      feedConsumedHeaders: [
        { text: 'Type', align: 'start', value: 'name' },
        { text: 'Bags (25kg)', value: 'bags' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Feed / bird', value: 'feedPerBird' },
        { text: '', value: 'actions' }
      ],
      waterConsumedHeaders: [
        { text: 'Quantity (ltr)', value: 'quantity' },
        { text: 'Water / Bird (ml)', value: 'waterPerBird' },
        { text: '', value: 'actions', width: '160px' }
      ],
      mortalityHeaders: [
        { text: 'Number of birds', align: 'start', value: 'count' },
        { text: 'Time', value: 'time' },
        { text: 'Reason', value: 'reason' },
        { text: '', value: 'actions' }
      ],
      vaccinationHeaders: [
        { text: 'Vaccine', value: 'vaccine.name' },
        { text: 'Vaccine batch no.', value: 'vaccineBatchNo' },
        { text: 'Total dosage', value: 'totalDosage' },
        { text: 'Method', value: 'vaccinationMethod' },
        { text: 'Administered by', value: 'administeredBy' },
        { text: 'Reason', value: 'reason' },
        { text: '', value: 'actions', width: '160px' }
      ],
      medicationHeaders: [
        { text: 'Medicament', value: 'medicament.name' },
        { text: 'Medicament batch no.', value: 'medicamentBatchNo' },
        { text: 'Total dosage', value: 'totalDosage' },
        { text: 'Method', value: 'medicamentMethod' },
        { text: 'Administered by', value: 'administeredBy' },
        { text: 'Reason', value: 'reason' },
        { text: '', value: 'actions', width: '160px' }
      ]
    };
  },
  components: {
    TableAction,
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
    }),
    farm: {
      set(farm) {
        this.selectedFarm = farm;
      },
      get() {
        return !this.selectedFarm ? this.updateBatchList() && this.farmLocations[1] : this.selectedFarm;
      }
    },
    actionButtonTitle() {
      let title = 'Save production';
      if (this.$mq.phone) title = 'Save';
      return this.validProduction ? title : 'Continue';
    },
    batches() {
      return this.batchList.filter((batch) => batch.farm === this.farm.name);
    }
  },
  methods: {
    updateBatchList() {
      this.batchList = [];
      return axios.get('/batches?status=active')
        .then(({ data }) => {
          this.batchList = data;
        });
    },
    addItem(section) {
      this.activeSection = section;
      this.dialog = true;
    },
    editItem(section, item) {
      this.activeSection = section;
      this.sectionData = item;
      this.dialog = true;
    },
    deleteItem(section, item) {
      this.activeSection = section;
      const sectionInfo = this.sectionNames[section];

      const itemIndex = this.production[sectionInfo.id].indexOf(item);
      this.production[sectionInfo.id].splice(itemIndex, 1);
    },
    saveProduction() {
      if (this.validProduction && !this.saving) {
        if (this.validateSections()) {
          this.saving = true;
          axios.post('productions', this.formatProduction())
            .then(() => {
              this.$router.push('/productions');
            })
            .catch(({ response: data }) => {
              this.message = data.error || data.data.message || data.data.error;
              this.snackbar = true;
            })
            .finally(() => {
              this.saving = false;
            });
        }
      } else if (this.$refs.form.validate()) {
        this.validateProductionDay();
      }
    },
    formatProduction() {
      return {
        date: this.production.date,
        note: this.production.note,
        batchId: this.production.batch.batchId,
        eggs: this.production.eggs.map((egg) => ({ id: egg.id, quantity: egg.quantity })),
        feeds: this.production.feeds.map((feed) => ({ id: feed.id, quantity: feed.quantity })),
        water: this.production.water.reduce((totalWater, water) => Number.parseInt(water.quantity, 10) + totalWater, 0),
        mortality: this.production.mortality.map((mortality) => ({
          time: mortality.time,
          reason: mortality.reason,
          count: mortality.count,
          comment: mortality.comment
        })),
        vaccinations: this.production.vaccinations,
        medications: this.production.medications
      };
    },
    validateProductionDay() {
      axios.get(`productions?date=${this.production.date}&batchId=${this.production.batch.batchId}`)
        .then(({ data }) => {
          this.validProduction = data.length === 0;
          if (!this.validProduction) {
            this.message = 'Production record for the selected date and batch already exists.';
            this.snackbar = true;
          }
        })
        .catch(() => {
          this.validProduction = false;
        });
    },
    updateSectionData() {
      if (this.$refs[this.activeSection].validate()) {
        const sectionInfo = this.sectionNames[this.activeSection];

        this.sectionErrors[sectionInfo.id] = false;

        const itemIndex = this.itemIndex(this.production[sectionInfo.id], this.sectionData, sectionInfo.key);

        if (itemIndex === -1) this.production[sectionInfo.id].push(JSON.parse(JSON.stringify(this.sectionData)));
        else this.production[sectionInfo.id][itemIndex] = JSON.parse(JSON.stringify(this.sectionData));

        this.production[sectionInfo.id] = [...this.production[sectionInfo.id]];
        this.$refs[this.activeSection].reset();
        this.sectionData = {};
        this.dialog = false;
      }
    },
    itemIndex(items, item, key) {
      return items.findIndex((itm) => itm[key] === item[key]);
    },
    today() {
      const date = new Date();
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()
        .toString().padStart(2, '0')}`;
    },
    validateSections() {
      let isValid = true;
      this.iconColor = '';
      this.sectionErrors = {};

      ['eggs', 'feeds', 'water'].forEach((section) => {
        if (this.production[section].length === 0) {
          this.sectionErrors[section] = true;
          isValid = false;
          this.iconColor = '#ff5252';
        }
      });

      return isValid;
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

  .error-state {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    color: #ff5252;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>
