<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>New Activity</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="activity.date"
                      clearable
                      label="Date*"
                      hint="Date incurred."
                      :rules="[v => !!v || 'Please enter a date.']"
                      readonly
                      persistent-hint
                      v-on="on"
                      @click:clear="activity.date = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="activity.date"
                    @change="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Farm*"
                  hint="Farm where the activity is incurred."
                  persistent-hint
                  return-object
                  required
                  :rules="[v => !!v || 'Please select a farm.']"
                  v-model="farm"
                  item-text="name"
                  item-value="name"
                  :items="farmLocations"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Pen"
                  hint="Pen where the activity is incurred."
                  persistent-hint
                  required
                  return-object
                  v-model="pen"
                  @blur="updateBatchList"
                  :disabled="selectedFarm === ''"
                  item-text="name"
                  item-value="name"
                  :items="selectedFarm.houses"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="Batch"
                  hint="Flock/Batch this activity applied to."
                  persistent-hint
                  required
                  return-object
                  v-model="batch"
                  :disabled="selectedPen === ''"
                  item-text="name"
                  no-data-text="No batch found."
                  item-value="name"
                  :items="batches"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Category*"
                  hint="Activity category."
                  persistent-hint
                  return-object
                  v-model="activity.category"
                  :rules="[v => !!v || 'Please input a category.']"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Description"
                  clearable
                  filled
                  no-resize
                  v-model="activity.description"
                  hint="Description of the activity or service."
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
        <v-btn color="primary darken-1" text @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" tile @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="showSnackbar"
      absolute
    >
      An error occurred while creating activity.
      <v-btn
        color="red"
        text
        @click="showSnackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'Activity',
  data() {
    return {
      dateMenu: false,
      valid: true,
      activity: {
        category: '',
        farm: '',
        pen: null
      },
      selectedFarm: '',
      selectedPen: '',
      batches: [],
      showSnackbar: false
    };
  },
  props: {
    active: {
      type: Boolean,
      required: true
    },
    farmLocations: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  computed: {
    snackbar: {
      get() {
        return this.errored;
      },
      set(state) {
        this.$emit('update:errored', state);
      }
    },
    farm: {
      get() {
        return this.selectedFarm;
      },
      set(farm = {}) {
        this.selectedFarm = farm;
        this.activity.farm = farm.id;
      }
    },
    pen: {
      get() {
        return this.selectedPen;
      },
      set(pen = {}) {
        this.selectedPen = pen;
        this.activity.pen = pen.id;
      }
    },
    batch: {
      get() {
        return this.activity.batch;
      },
      set(batch = {}) {
        this.activity.batch = batch.id;
      }
    }
  },
  methods: {
    updateBatchList() {
      axios.get(`/batches?house=${this.selectedPen.id}`)
        .then(({ data }) => {
          this.batches = data;
        });
    },
    cancel() {
      this.$emit('cancel', true);
    },
    save() {
      if (this.$refs.form.validate()) {
        axios.post('activities', this.activity)
          .then(({ data }) => {
            if (data) {
              this.$refs.form.reset();
              this.$emit('save', data);
            }
          })
          .catch(() => {
            this.showSnackbar = true;
          });
      }
    }
  }
};
</script>
