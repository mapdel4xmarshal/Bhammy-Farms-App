<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-card
        class="mx-auto text-center"
      >
        <div>
          <v-sheet color="#7f277510">
            <v-sparkline
              :value="value"
              color="#7f2775"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">
                ${{ item.value }}
              </template>
            </v-sparkline>
          </v-sheet>
        </div>

        <v-card-text>
          <div class="display-1 font-weight-thin">Feed Last 7 days</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-chip-group
            active-class="primary text--accent-4"
            mandatory
          >
            <v-chip>Today</v-chip>
            <v-chip>Yesterday</v-chip>
            <v-chip>7 days</v-chip>
            <v-chip>1 month</v-chip>
            <v-chip>3 months</v-chip>
          </v-chip-group>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card
        class="mx-auto text-center"
      >
        <div>
          <v-sheet color="#7f277510">
            <v-sparkline
              :value="value"
              color="#7f2775"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">
                ${{ item.value }}
              </template>
            </v-sparkline>
          </v-sheet>
        </div>

        <v-card-text>
          <div class="display-1 font-weight-thin">Sales Last 7 days</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-chip-group
            active-class="primary text--accent-4"
            mandatory
          >
            <v-chip>Today</v-chip>
            <v-chip>Yesterday</v-chip>
            <v-chip>7 days</v-chip>
            <v-chip>1 month</v-chip>
            <v-chip>3 months</v-chip>
          </v-chip-group>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card
        class="mx-auto text-center"
      >
        <div>
          <v-sheet color="#7f277510">
            <v-sparkline
              :value="value"
              color="#7f2775"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">
                ${{ item.value }}
              </template>
            </v-sparkline>
          </v-sheet>
        </div>

        <v-card-text>
          <div class="display-1 font-weight-thin">Production Last 7 days</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-chip-group
            active-class="primary text--accent-4"
            mandatory
          >
            <v-chip>Today</v-chip>
            <v-chip>Yesterday</v-chip>
            <v-chip>7 days</v-chip>
            <v-chip>1 month</v-chip>
            <v-chip>3 months</v-chip>
          </v-chip-group>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const exhale = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: 'Dashboard',
  data: () => ({
    checking: false,
    labels: [
      '12am',
      '3am',
      '6am',
      '9am',
      '12pm',
      '3pm',
      '6pm',
      '9pm',
    ],
    value: [
      200,
      675,
      410,
      390,
      310,
      460,
      250,
      240,
    ],
  }),
  created() {
    this.takePulse(false);
  },

  methods: {
    heartbeat() {
      return Math.ceil(Math.random() * (120 - 80) + 80);
    },
    async takePulse(inhale = true) {
      this.checking = true;

      // eslint-disable-next-line no-unused-expressions
      inhale && await exhale(1000);

      this.checking = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
</style>

<style>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
</style>
