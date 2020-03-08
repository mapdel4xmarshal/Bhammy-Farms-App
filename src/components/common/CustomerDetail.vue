<template>
    <div class="customer-detail" v-if="customer.name">
      <v-avatar>
        <img v-if="customer.avatar.length > 0" :src="customer.avatar">
        <v-icon v-else light size="50" color="#ccc">mdi-account</v-icon>
      </v-avatar>
      <div>
        <strong>{{ customer.name }}</strong>
        <p>{{ customer.address }}</p>
        <p>{{ customer.telephone }}</p>
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
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
  .customer-detail{
    display: grid;
    grid-template-columns: 50px auto;
    grid-gap: 10px;
    margin-bottom: 30px;
  }

  p {
    font-size: 12px;
    margin-bottom: 0;
  }

  .customer-detail--empty {
    text-align: center;
    margin-bottom: 30px;
  }
</style>
