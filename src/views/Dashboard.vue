<template>
    <section class="dashboard">
      <v-card
        class="mx-auto"
        max-width="400"
      >
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="headline">San Francisco</v-list-item-title>
            <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-text>
          <v-row align="center">
            <v-col class="display-3" cols="6">
              23&deg;C
            </v-col>
            <v-col cols="6">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sun.png"
                alt="Sunny image"
                width="92"
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>

        <v-sparkline
          :labels="labels"
          :value="value"
          color="white"
          line-width="2"
          padding="16"
        ></v-sparkline>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text>Full Report</v-btn>
        </v-card-actions>
      </v-card>
    </section>
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

      this.heartbeats = Array.from({ length: 20 }, this.heartbeat);

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
