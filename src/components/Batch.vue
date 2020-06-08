<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable>
    <v-card>
      <v-card-title>New Batch</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>           {{ suppliers }}
              <v-col>
                <v-select
                  label="Farm"
                  hint="Farm location"
                  persistent-hint
                  return-object
                  required
                  v-model="farm"
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
                  :disabled="farm === ''"
                  item-text="name"
                  item-value="name"
                  :items="farm.houses"
                ></v-select>
              </v-col>

              <v-col>
                <v-select
                  label="Breed"
                  hint="Strain of the flock."
                  persistent-hint
                  :items="breeds"
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
                  v-model="supplier"
                  label="Supplier"
                  hint="Supplier of the flock."
                  persistent-hint
                  required
                  clearable
                  :items="suppliers"
                  item-text="name"
                  item-value="name"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar color="primary" tile>
                      <span class="white--text">AM</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-text-field
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
                  label="Initial stock"
                  hint="Total number of birds purchased or moved-in."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Current stock"
                  hint="Initial stock minus moralities."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Initial age"
                  hint="Age of the flock at move in date."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Cost/bird"
                  hint="Cost of purchasing a bird."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Amount"
                  hint="Cost of purchasing the flock."
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Note"
                  clearable
                  filled
                  no-resize
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
import { mapGetters } from 'vuex';
import { ACTION_TYPES, GETTER_TYPES } from '../store/types';
import { BATCH_GETTER_TYPES, BATCH_ACTION_TYPES } from '../store/modules/batch/types';


export default {
  name: 'Batch',
  data() {
    return {
      farm: '',
      supplier: ''
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
      suppliers: GETTER_TYPES.SUPPLIERS
    })
  },
  methods: {
    update() {
      this.$emit('update', false);
    }
  },
  created() {
    this.$store.dispatch(BATCH_ACTION_TYPES.GET_BREEDS);
    this.$store.dispatch(ACTION_TYPES.GET_SUPPLIERS);
  }
};
</script>
