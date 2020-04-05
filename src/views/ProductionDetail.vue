<template>
  <section>
      <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Egg collection
          <template v-slot:actions>
            <v-icon color="primary">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-divider></v-divider>
        <v-expansion-panel-content>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Size</th>
                  <th class="text-left">Quantity</th>
                  <th class="text-left">Damaged</th>
                  <th class="text-left">Damaged %</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(egg, index) in eggcollection" :key="index">
                  <td>
                    {{ egg.size }}
                  </td>
                  <td>
                    <v-edit-dialog
                    > {{ egg.quantity }}
                      <template v-slot:input>
                        <v-text-field
                          label="Edit"
                          single-line
                          counter
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                    </td>
                  <td>{{ egg.damaged }}</td>
                  <td>{{ (egg.damaged * 100) / egg.quantity}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          Feed
          <template v-slot:actions>
            <v-icon color="teal">mdi-check</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          Mortalities
          <template v-slot:actions>
            <v-icon color="error">mdi-alert-circle</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>Small</v-col>
            <v-col>Medium</v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          Treatment
          <template v-slot:actions>
            <v-icon color="error">mdi-alert-circle</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          Vaccination
          <template v-slot:actions>
            <v-icon color="error">mdi-alert-circle</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          Egg Weight
          <template v-slot:actions>
            <v-icon color="error">mdi-alert-circle</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>
</template>

<script>

export default {
  name: 'ProductionDetail',
  data() {
    return {
      eggcollection: [
        { size: 'small', quantity: 290, damaged: 20 },
        { size: 'medium', quantity: 780, damaged: 10 },
        { size: 'large', quantity: 10, damaged: 0 },
      ],
      date: null,
      trip: {
        name: '',
        location: null,
        start: null,
        end: null,
      },
      locations: ['Australia', 'Barbados', 'Chile', 'Denmark', 'Equador', 'France'],
    };
  }
};
</script>
