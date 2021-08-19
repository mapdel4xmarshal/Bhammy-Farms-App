<template>
  <v-virtual-scroll
    :bench="5"
    :items="treatments"
    height="500"
    item-height="25"
  >
    <template v-slot:default="{ item }">
      <div class="treatment" :key="item.id">
        <span class="treatment__date">{{ item.date }}</span>
        <div>
          <span class="treatment__name">{{ item.vaccineName || item.medicamentName }}</span>
          <span class="treatment__dose">{{ item.totalDosage }}</span>
        </div>
      </div>
    </template>
  </v-virtual-scroll>
</template>

<script>
export default {
  name: 'Treatments',
  props: {
    treatments: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.treatment {
  display: grid;
  grid-template-columns: max-content auto;
  grid-column-gap: 20px;
  font-size: 13px;
  color: #000000;

  & > div {
    display: flex;
    justify-content: space-between;
  }

  &__date {
    font-style: normal;
    font-weight: 200;
  }

  &__name, &__dose {
    font-style: normal;
    font-weight: normal;
  }
}
</style>
