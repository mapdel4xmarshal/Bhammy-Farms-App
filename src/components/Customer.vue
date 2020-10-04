<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>New Customer</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  label="Title"
                  hint="Customer's title."
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select a title.']"
                  v-model="value.title"
                  :items="['Mr.', 'Mrs.', 'Miss', 'Alhaji', 'Alhaja', 'Not applicable']"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Gender"
                  hint="Customer's gender."
                  persistent-hint
                  required
                  v-model="value.gender"
                  :rules="[v => !!v || 'Please select a gender.']"
                  :items="['Male', 'Female', 'Unknown']"
                ></v-select>
              </v-col>

              <v-col>
                <v-text-field
                  label="Name"
                  hint="Customer's Fullname."
                  persistent-hint
                  :rules="[v => !!v || 'Please enter Fullname.']"
                  required
                  autocomplete="off"
                  v-model="value.name"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Address"
                  clearable
                  v-model="value.address"
                  :rules="[v => !!v || 'Please enter customer\'s address.']"
                  hint="Customer's address excluding the state."
                  autocomplete="off"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="value.state"
                  label="State"
                  hint="Customer's state."
                  autocomplete="off"
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
                  autocomplete="off"
                  :rules="[v => !!v || 'Please enter a valid phone number.']"
                  persistent-hint
                  required
                  v-model="value.phone"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Alt Phone"
                  hint="Customer's alternative phone."
                  autocomplete="off"
                  persistent-hint
                  required
                  v-model="value.altPhone"
                  type="phone"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Email"
                  hint="Customer's email address."
                  autocomplete="off"
                  persistent-hint
                  required
                  v-model="value.email"
                  type="email"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-slider
                  :tick-labels="['Bad', 'Fair', 'Good', 'V.Good', 'Excellent']"
                  v-model="value.rating"
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
                  v-model="value.comment"
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
    value: {
      type: Object
    },
    active: {
      type: Boolean,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    update(state) {
      this.$emit('update', state);
    },
    createCustomer() {
      if (this.$refs.form.validate()) {
        const id = this.editMode ? this.value.id : '';
        axios[this.editMode ? 'patch' : 'post'](`/parties/customers/${id}`, this.value)
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
