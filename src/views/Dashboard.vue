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

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-send</v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>23 km/h</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-cloud-download</v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>48%</v-list-item-subtitle>
        </v-list-item>

        <v-slider
          v-model="time"
          :max="6"
          :tick-labels="labels"
          class="mx-4"
          ticks
        ></v-slider>

        <v-list class="transparent">
          <v-list-item
            v-for="item in forecast"
            :key="item.day"
          >
            <v-list-item-title>{{ item.day }}</v-list-item-title>

            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-subtitle class="text-right">
              {{ item.temp }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text>Full Report</v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        class="mt-4 mx-auto"
        max-width="400"
      >
        <v-sheet
          class="v-sheet--offset mx-auto"
          color="cyan"
          elevation="12"
          max-width="calc(100% - 32px)"
        >
          <v-sparkline
            :labels="labels"
            :value="value"
            color="white"
            line-width="2"
            padding="16"
          ></v-sparkline>
        </v-sheet>

        <v-card-text class="pt-0">
          <div class="title font-weight-light mb-2">User Registrations</div>
          <div class="subheading font-weight-light grey--text">Last Campaign Performance</div>
          <v-divider class="my-2"></v-divider>
          <v-icon
            class="mr-2"
            small
          >
            mdi-clock
          </v-icon>
          <span class="caption grey--text font-weight-light">last registration 26 minutes ago</span>
        </v-card-text>
      </v-card>
      <v-card
        class="mx-auto"
        color="grey lighten-4"
        max-width="600"
      >
        <v-card-title>
          <v-icon
            :color="checking ? 'red lighten-2' : 'indigo'"
            class="mr-12"
            size="64"
            @click="takePulse"
          >
            mdi-heart-pulse
          </v-icon>
          <v-row align="start">
            <div class="caption grey--text text-uppercase">
              Heart rate
            </div>
            <div>
          <span
            class="display-2 font-weight-black"
            v-text="avg || '—'"
          ></span>
              <strong v-if="avg">BPM</strong>
            </div>
          </v-row>

          <v-spacer></v-spacer>

          <v-btn icon class="align-self-start" size="28">
            <v-icon>mdi-arrow-right-thick</v-icon>
          </v-btn>
        </v-card-title>

        <v-sheet color="transparent">
          <v-sparkline
            :key="String(avg)"
            :smooth="16"
            :gradient="['#f72047', '#ffd200', '#1feaea']"
            :line-width="3"
            :value="heartbeats"
            auto-draw
            stroke-linecap="round"
          ></v-sparkline>
        </v-sheet>
      </v-card>
    </section>
</template>

<script>
const exhale = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: 'Dashboard',
  data: () => ({
    checking: false,
    heartbeats: [],
    time: 0,
    forecast: [
      { day: 'Tuesday', icon: 'mdi-white-balance-sunny', temp: '24\xB0/12\xB0' },
      { day: 'Wednesday', icon: 'mdi-white-balance-sunny', temp: '22\xB0/14\xB0' },
      { day: 'Thursday', icon: 'mdi-cloud', temp: '25\xB0/15\xB0' },
    ],
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
  computed: {
    avg() {
      const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0);
      const { length } = this.heartbeats;

      if (!sum && !length) return 0;

      return Math.ceil(sum / length);
    },
  },

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
