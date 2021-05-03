<template>
  <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            :items="medicaments"
            auto-select-first
            clearable
            no-data-text="No medicaments found."
            label="Medicament*"
            return-object
            item-text="name"
            :rules="[v => !!v || 'Select a Medicament.']"
            v-model="value.medicament"
            required
          >
            <template v-slot:item="{ item, on }">
              <v-list-item v-on="on" dense color="primary">
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.brand }} | {{ item.description | truncate }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Medicament Batch No."
            v-model="value.medicamentBatchNo"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="8">
          <v-text-field
            label="Dosage per bird"
            type="number"
            v-model="value.dosage"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            label="Dosage unit"
            type="number"
            :items="dosageUnit"
            v-model="value.dosageUnit"
          ></v-select>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Total dosage*"
            type="number"
            required
            :rules="totalDosageRules"
            v-model="value.totalDosage"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="No of birds"
            type="number"
            required
            v-model="value.noOfBirds"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-select
            label="Medication method*"
            :items="medicationMethods"
            required
            :rules="[v => !!v || 'Select a Medication method.']"
            v-model="value.medicationMethod"
          ></v-select>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Administered by*"
            required
            :rules="[v => !!v || 'Administered by is required.']"
            v-model="value.administeredBy"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-textarea
            label="Reason / Description"
            type="number"
            filled
            rows="3"
            required
            v-model="value.reason"
            @keyup.enter.native="$emit('enter', true)"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'Medication',
  data() {
    return {
      medicaments: [],
      dosageRules: this.commonRules('Dosage'),
      noOfBirdsRules: this.commonRules('No of birds'),
      totalDosageRules: this.commonRules('Total dosage'),
      medicationMethods: [
        'Intraocular (Eye Drop)',
        'Beak Dipping',
        'Subcutaneous Injection',
        'Intramuscular Injection',
        'Wing Web Prick',
        'Drinking Water',
        'Dosing Pump',
        'Spray',
        'Feed'
      ],
      dosageUnit: [
        'ml/animal',
        'g/bird',
        'g/kg feed',
        'ml/l water',
        'g/l water'
      ]
    };
  },
  props: ['value'],
  methods: {
    update() {
      this.$emit('input', this.value);
    },
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.value.medicament = '';
      this.$refs.form.reset();
    },
    commonRules(name) {
      return [
        (v) => !!v || `Please enter ${name.toLowerCase()}.`,
        (v) => v >= 0 || `${name} should be zero (0) or more.`
      ];
    },
    getMedicaments() {
      axios.get('/items?category=medicament')
        .then(({ data }) => {
          this.medicaments = data;
        });
    }
  },
  filters: {
    truncate(string = '') {
      if (string && string.length > 50) {
        return `${string.substring(0, 50)}...`;
      }
      return string;
    }
  },
  created() {
    this.getMedicaments();
  }
};
</script>
