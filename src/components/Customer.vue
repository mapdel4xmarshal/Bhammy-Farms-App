<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable>
    <v-card>
      <v-card-title>New Customer</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  label="Title"
                  hint="title"
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select a title.']"
                  v-model="customer.title"
                  :items="['Mr.', 'Mrs', 'Miss', 'Alhaji', 'Alhaja', 'Not applicable']"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Gender"
                  hint="Customer's gender."
                  persistent-hint
                  required
                  v-model="customer.gender"
                  :rules="[v => !!v || 'Please select a gender.']"
                  :items="['Male', 'Female', 'Unknown']"
                ></v-select>
              </v-col>

              <v-col>
                <v-text-field
                  label="Firstname"
                  hint="Customer's Firstname."
                  persistent-hint
                  :rules="[v => !!v || 'Please enter Firstname.']"
                  required
                  v-model="customer.firstname"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Lastname"
                  hint="Customer's Lastname."
                  persistent-hint
                  :rules="[v => !!v || 'Please enter Lastname.']"
                  required
                  v-model="customer.lastname"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Address"
                  clearable
                  v-model="customer.address"
                  hint="Customer's address excluding the state."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="customer.state"
                  label="State"
                  hint="Customer's state."
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select a state.']"
                  clearable
                  return-object
                  :items="states"
                  item-text="name"
                  item-value="name"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Email"
                  hint="Customer's email address."
                  persistent-hint
                  required
                  v-model="customer.email"
                  type="email"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Initial age"
                  hint="Age of the flock at move in date."
                  suffix="days"
                  :rules="[v => !!v || 'Please enter a valid age.']"
                  v-model="customer.initialAge"
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
                  v-model="customer.costPerBird"
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
                  v-model="customer.amount"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Note"
                  clearable
                  filled
                  no-resize
                  v-model="customer.remark"
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
import axios from '../plugins/axios';
import { ACTION_TYPES } from '../store/types';
import { BATCH_ACTION_TYPES } from '../store/modules/batch/types';

export default {
  name: 'Customer',
  data() {
    return {
      valid: true,
      snackbar: false,
      feedbackMessage: '',
      customer: {},
      states: [
        'Abia',
        'Adamawa',
        'Akwa Ibom',
        'Anambra',
        'Bauchi',
        'Bayelsa',
        'Benue',
        'Borno',
        'Cross River',
        'Delta',
        'Ebonyi',
        'Edo',
        'Ekiti',
        'Enugu',
        'FCT - Abuja',
        'Gombe',
        'Imo',
        'Jigawa',
        'Kaduna',
        'Kano',
        'Katsina',
        'Kebbi',
        'Kogi',
        'Kwara',
        'Lagos',
        'Nasarawa',
        'Niger',
        'Ogun',
        'Ondo',
        'Osun',
        'Oyo',
        'Plateau',
        'Rivers',
        'Sokoto',
        'Taraba',
        'Yobe',
        'Zamfara'
      ]
    };
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  computed: {
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
