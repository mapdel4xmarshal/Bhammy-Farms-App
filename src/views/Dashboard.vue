<template>
  <v-row>
    <v-col cols="12" md="4">
      <dashboard-tile :value="eggsRecord"
                      @update="getEggs"
                      title="Production"
      />
    </v-col>
    <v-col cols="12" md="4">
      <dashboard-tile :value="feedsRecord"
                      @update="getFeeds"
                      title="Feeds"
      />
    </v-col>
    <v-col cols="12" md="4">
      <dashboard-tile :value="mortalityRecord"
                      @update="getMortality"
                      title="Mortality"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from '../plugins/axios';
import DashboardTile from '../components/DashboardTile.vue';

export default {
  name: 'Dashboard',
  data: () => ({
    eggsRecord: [],
    feedsRecord: [],
    mortalityRecord: []
  }),
  components: {
    DashboardTile
  },
  created() {
    this.getEggs();
    this.getFeeds();
    this.getMortality();
  },
  methods: {
    getEggs(day) {
      this.getProduction('eggs', day);
    },
    getFeeds(day) {
      this.getProduction('feeds', day);
    },
    getMortality(day) {
      this.getProduction('mortality', day);
    },
    getProduction(type, day = 7) {
      const filters = [];
      const after = new Date(new Date().setDate(new Date().getDate() - day)).toISOString().split('T')[0];
      filters.push(`after=${after}`);

      axios.get(`/productions?${filters.join('&')}`)
        .then(({ data }) => {
          const normalizedData = {};
          data.forEach((d) => {
            if (!normalizedData[d.date]) normalizedData[d.date] = 0;
            normalizedData[d.date] += d[type];
          });

          const values = Object.values(normalizedData).reverse();
          this[`${type}Record`] = [...Array(day - values.length).fill(0), ...values];
        });
    }
  }
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
