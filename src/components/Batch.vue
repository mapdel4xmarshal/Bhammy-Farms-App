<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>New Batch</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  label="Farm"
                  hint="Farm location"
                  persistent-hint
                  return-object
                  required
                  :rules="[v => !!v || 'Please select a farm.']"
                  v-model="batch.farm"
                  item-text="name"
                  item-value="name"
                  :items="farmLocations"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Pen"
                  hint="Farm house where the flock will be raised."
                  persistent-hint
                  required
                  return-object
                  v-model="batch.pen"
                  :rules="[v => !!v || 'Please select a pen/house.']"
                  :disabled="batch.farm === ''"
                  item-text="name"
                  item-value="name"
                  :items="batch.farm.houses"
                ></v-select>
              </v-col>

              <v-col>
                <v-select
                  label="Breed"
                  hint="Strain of the flock."
                  persistent-hint
                  :items="breeds"
                  return-object
                  v-model="batch.breed"
                  :rules="[v => !!v || 'Please select a breed.']"
                  item-text="name"
                  item-value="name"
                  required
                >
                  <template v-slot:item="{ item, on }">
                    <v-list-item v-on="on" dense color="primary">
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.type }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="batch.supplier"
                  label="Supplier"
                  hint="Supplier of the flock."
                  persistent-hint
                  required
                  clearable
                  return-object
                  :rules="[v => !!v || 'Please select a supplier.']"
                  :items="suppliers"
                  item-text="name"
                  item-value="name"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar color="primary" tile>
                      <span class="white--text">{{ item.initials }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="batch.source"
                  label="Source"
                  hint="Hatchery where flock is raised."
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select a source.']"
                  clearable
                  return-object
                  :items="sources"
                  item-text="name"
                  item-value="name"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar color="primary" tile>
                      <span class="white--text">{{ item.initials }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-menu
                  v-model="moveInDateMenu"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="batch.moveInDate"
                      clearable
                      label="Move in date"
                      hint="Date when flock was moved to the pen."
                      readonly
                      persistent-hint
                      v-on="on"
                      @click:clear="batch.moveInDate = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="batch.moveInDate"
                    @change="moveInDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-menu
                  v-model="moveOutDateMenu"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="batch.moveOutDate"
                      clearable
                      label="Move out date"
                      hint="Projected move out date."
                      readonly
                      persistent-hint
                      v-on="on"
                      @click:clear="batch.moveOutDate = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="batch.moveOutDate"
                    @change="moveOutDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Initial stock"
                  hint="Total number of birds purchased or moved-in."
                  persistent-hint
                  :rules="[v => !!v || 'Please enter initial stock count.']"
                  required
                  v-model="batch.initialStock"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Current stock"
                  hint="Initial stock minus moralities."
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please enter current stock count.']"
                  v-model="batch.currentStock"
                  min-value="0"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Initial age"
                  hint="Age of the flock at move in date."
                  suffix="days"
                  :rules="[v => !!v || 'Please enter a valid age.']"
                  v-model="batch.initialAge"
                  type="number"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Cost/bird"
                  hint="Cost of purchasing a bird."
                  persistent-hint
                  prefix="₦"
                  :rules="[v => !!v || 'Please enter a cost/bird value.']"
                  v-model="batch.costPerBird"
                  type="number"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Amount"
                  hint="Cost of purchasing the flock."
                  persistent-hint
                  prefix="₦"
                  :rules="[v => !!v || 'Please enter an amount.']"
                  type="number"
                  v-model="batch.amount"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Note"
                  clearable
                  filled
                  no-resize
                  v-model="batch.note"
                  hint="Notable information about the flock."
                  persistent-hint
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary darken-1" text @click="update(false)">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" tile @click="createBatch">Save</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar"
    >
      {{ feedbackMessage }}
      <v-btn
        color="red"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import { ACTION_TYPES, GETTER_TYPES } from '../store/types';
import { BATCH_GETTER_TYPES, BATCH_ACTION_TYPES } from '../store/modules/batch/types';


export default {
  name: 'Batch',
  data() {
    return {
      valid: true,
      snackbar: false,
      feedbackMessage: '',
      moveInDateMenu: false,
      moveOutDateMenu: false,
      batch: {
        farm: '',
        supplier: '',
        source: '',
        amount: '',
        pen: null,
        breed: null,
        note: '',
        costPerBird: '',
        initialAge: '',
        initialStock: '',
        currentStock: '',
        moveInDate: new Date().toISOString().substr(0, 10),
        moveOutDate: new Date(new Date().getTime() + (31556952000 * 1.5)).toISOString().substr(0, 10)
      }
    };
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS,
      breeds: BATCH_GETTER_TYPES.BREEDS,
      suppliers: GETTER_TYPES.SUPPLIERS,
      sources: GETTER_TYPES.SOURCES
    })
  },
  methods: {
    update(state) {
      this.$emit('update', state);
    },
    createBatch() {
      if (this.$refs.form.validate()) {
        const {
          farm, supplier, source, breed, pen, ...otherValues
        } = this.batch;
        axios.post('/batches', {
          farmId: farm.id,
          supplierId: supplier.id,
          sourceId: source.id,
          breedId: breed.id,
          houseId: pen.id,
          ...otherValues
        })
          .then(() => {
            this.update(true);
            this.$ref.form.reset();
          })
          .catch(({ response: { data } }) => {
            this.feedbackMessage = data.error;
          })
          .finally(() => {
            this.snackbar = true;
          });
      }
    }
  },
  created() {
    this.$store.dispatch(BATCH_ACTION_TYPES.GET_BREEDS);
    this.$store.dispatch(ACTION_TYPES.GET_SUPPLIERS);
    this.$store.dispatch(ACTION_TYPES.GET_SOURCES);
  }
};
</script>
