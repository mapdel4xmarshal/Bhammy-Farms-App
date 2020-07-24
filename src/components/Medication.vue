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
            :rules="[v => !!v || 'Select a Medicament.']"
            v-model="value.medicament"
            required
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="8">
          <v-text-field
            label="Dosage*"
            type="number"
            required
            :rules="dosageRules"
            v-model="value.dosage"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            label="Dosage unit*"
            type="number"
            :items="dosageUnit"
            required
            :rules="[v => !!v || 'Select a dosage unit.']"
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
            label="No of birds*"
            type="number"
            required
            :rules="noOfBirdsRules"
            v-model="value.noOfBirds"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-select
            label="Vaccination method*"
            :items="vaccinationMethods"
            required
            :rules="[v => !!v || 'Select a Vaccination method.']"
            v-model="value.vaccinationMethod"
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
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>
</template>

<script>
export default {
  name: 'Vaccination',
  data() {
    return {
      dosageRules: this.commonRules('Dosage'),
      noOfBirdsRules: this.commonRules('No of birds'),
      totalDosageRules: this.commonRules('Total dosage'),
      medicaments: ['Lasota', 'Gumboro', 'Neodox'],
      vaccinationMethods: [
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
      this.value.medicamentBatchNo = new Date().getTime();
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
    }
  }
};
</script>
