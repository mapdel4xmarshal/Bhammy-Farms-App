<template>
  <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Time*"
            type="time"
            required
            v-model="value.time"></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="No of dead birds*"
            type="number"
            required
            v-model="value.count"
            :rules="deadBirdRules"></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-select
            :items="reasons"
            label="Reason / Cause of Death*"
            :rules="[v => !!v || 'Select a reason.']"
            v-model="value.reason"
            required
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-textarea label="Comment"
                      v-model="value.comment"
                      @keyup.enter.native="$emit('enter', true)"></v-textarea>
        </v-col>
      </v-row>
    </v-form>
</template>

<script>
export default {
  name: 'Mortality',
  data() {
    return {
      reasons: ['Pecking', 'Prolapse', 'Suffocation', 'Crushed', 'Predator', 'Disease', 'Sick', 'Unknown', 'Other'],
      deadBirdRules: [
        (v) => !!v || 'Please enter no of dead birds.',
        (v) => v >= 0 || 'Mortality should be zero (0) or more.'
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
      this.$refs.form.reset();
    }
  }
};
</script>
