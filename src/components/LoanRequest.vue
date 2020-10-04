<template>
  <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
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
                v-model="value.date"
                clearable
                label="Loan date*"
                hint="Date the loan was approved."
                :rules="[v => !!v || 'Please enter loan date.']"
                readonly
                persistent-hint
                @change="update"
                v-on="on"
                @click:clear="value.date = null"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="value.date"
              @change="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12">
          <v-menu
            v-model="dueDateMenu"
            :close-on-content-click="false"
            max-width="290"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="value.expiryDate"
                clearable
                label="Due date*"
                hint="Date the loan is due for payment."
                :rules="[v => !!v || 'Please enter loan due date.']"
                readonly
                persistent-hint
                @change="update"
                v-on="on"
                @click:clear="value.date = null"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="value.date"
              @change="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Amount"
            hint="Loan amount."
            autocomplete="off"
            persistent-hint
            required
            v-model="value.amount"
            type="email"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-textarea
            label="Remark"
            clearable
            rows="2"
            filled
            no-resize
            v-model="value.comment"
            hint="Notable information about this loan."
            persistent-hint
            required
          ></v-textarea>
        </v-col>
        <v-btn text color="primary">cancel</v-btn>
        <v-spacer/>
        <v-btn class="mr-3" color="primary">Save loan</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'LoanRequest',
  data() {
    return {
      dateMenu: false,
      valid: false,
      dueDateMenu: false
    };
  },
  props: {
    value: {
      type: Object
    }
  },
  methods: {
    update(state) {
      this.$emit('update', state);
    }
  }
};
</script>
