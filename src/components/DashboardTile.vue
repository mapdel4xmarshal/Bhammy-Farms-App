<template>
  <v-card
    class="mx-auto text-center"
  >
    <div>
      <v-sheet color="#7f277510">
        <v-sparkline
          :value="value"
          color="#7f2775"
          height="150"
          padding="24"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item">
            {{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
    </div>

    <v-card-text>
      <div class="tile__title font-weight-thin">{{ title }}</div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-chip-group
        active-class="primary text--accent-4"
        mandatory
        v-model="selection"
        @change="$emit('update', selection)"
      >
        <v-chip v-for="duration in durations"
                :key="duration"
                :value="duration">{{ duration }} days</v-chip>
      </v-chip-group>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DashboardTile',
  data: () => ({
    selection: 7,
    durations: [3, 7, 15]
  }),
  props: ['value', 'title']
};
</script>

<style>
  .tile__title {
    font-size: 1.7rem !important;
    font-weight: 400;
    line-height: 2.5rem;
    letter-spacing: 0.0073529412em !important;
    font-family: "Roboto", sans-serif !important;
  }
</style>
