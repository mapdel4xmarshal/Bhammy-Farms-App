<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
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
                  hint="Customer's title."
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select a title.']"
                  v-model="customer.title"
                  :items="['Mr.', 'Mrs.', 'Miss', 'Alhaji', 'Alhaja', 'Not applicable']"
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
                  v-model="customer.firstName"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Lastname"
                  hint="Customer's Lastname."
                  persistent-hint
                  :rules="[v => !!v || 'Please enter Lastname.']"
                  required
                  v-model="customer.lastName"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Address"
                  clearable
                  v-model="customer.address"
                  :rules="[v => !!v || 'Please enter customer\'s address.']"
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
                  label="Phone"
                  hint="Customer's phone number.."
                  :rules="[v => !!v || 'Please enter a valid phone number.']"
                  persistent-hint
                  required
                  v-model="customer.phone"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Alt Phone"
                  hint="Customer's alternative phone."
                  persistent-hint
                  required
                  v-model="customer.altPhone"
                  type="phone"
                ></v-text-field>
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
                <v-slider
                  :tick-labels="['Bad', 'Fair', 'Good', 'V.Good', 'Excellent']"
                  v-model="customer.rating"
                  dense
                  hide-details
                  min="0"
                  max="4"
                  ticks="always"
                  tick-size="5"
                >
                  <template v-slot:thumb-label="props">
                    <h1>{{ ['🙁', '😐', '🙂', '😊', '😍'][props.value] }}</h1>
                  </template>
                </v-slider>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Remark"
                  clearable
                  filled
                  no-resize
                  v-model="customer.remark"
                  hint="Notable information about this customer."
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
        <v-btn color="primary darken-1" tile @click="createCustomer">Save</v-btn>
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
    createCustomer() {
      if (this.$refs.form.validate()) {
        axios.post('/parties/customers', this.customer)
          .then(() => {
            this.update(true);
            this.$refs.form.reset();
          })
          .catch((response) => {
            this.feedbackMessage = response.data.error;
          })
          .finally(() => {
            this.snackbar = true;
          });
      }
    }
  }
};
</script>

<style>
  .v-slider__tick-label {
    font-size: 11px !important;
  }
</style>
