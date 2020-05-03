<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable>
    <v-card>
      <v-card-title>New Batch</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col
              >
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  label="Farm"
                  hint="Farm location"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Pen"
                  hint="Farm house where the flock will be raised."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col
              >
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  label="Breed"
                  hint="Strain of the flock."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Supplier"
                  hint="Supplier of the flock."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Source"
                  hint="Hatchery where flock is raised."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  label="Move in date"
                  hint="Date when flock was moved to the pen."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Move out date"
                  hint="Projected move out date."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  label="Initial stock"
                  hint="Total number of birds purchased or moved-in."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Current stock"
                  hint="Initial stock minus moralities."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  label="Initial age"
                  hint="Age of the flock at move in date."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Cost/bird"
                  hint="Cost of purchasing a bird."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Amount"
                  hint="Cost of purchasing the flock."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="email"
                  :rules="emailRules"
                  label="Note"
                  clearable
                  filled
                  no-resize=""
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
        <v-btn color="primary darken-1" text @click="update">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" tile @click="update">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Batch',
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    update() {
      this.$emit('update', false);
    }
  }
};
</script>

<style scoped>

</style>