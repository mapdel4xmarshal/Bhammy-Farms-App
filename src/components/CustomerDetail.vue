<template>
  <div class="customer-detail" v-if="customer && customer.name">
    <v-avatar color="primary">
      <span class="white--text headline">{{ avatarText }}</span>
    </v-avatar>
    <div>
      <strong>{{ customer.name }}</strong>
      <p>{{ customer.address }}</p>
      <p>{{ customer.phone }}</p>
    </div>
  </div>

  <div v-else class="customer-detail--empty">
    Select a customer or <a href="#">add</a> a new one.
  </div>
</template>

<script>
export default {
  name: 'CustomerDetail',
  props: {
    customer: {
      required: true
    }
  },
  computed: {
    avatarText() {
      const namesArray = this.customer.name.split(' ');
      if (namesArray.length === 1) return `${namesArray[0].charAt(0)}`;
      return `${namesArray[0].charAt(0)}${namesArray[namesArray.length - 1].charAt(0)}`;
    }
  }
};
</script>

<style scoped>
  .customer-detail{
    display: grid;
    grid-template-columns: 50px auto;
    grid-gap: 10px;
  }

  p {
    font-size: 12px;
    margin-bottom: 0;
  }

  .customer-detail--empty {
    text-align: center;
  }
</style>
