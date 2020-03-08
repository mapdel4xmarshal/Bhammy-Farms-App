<template>
  <div>
    <v-autocomplete
      v-model="customer"
      :disabled="isUpdating"
      :items="customers"
      color="primary"
      return-object
      open-on-clear
      clearable
      label="Customer"
      item-text="name"
      item-value="name"
      @change="$emit('update', customer)"
      @click:clear="customer = {}"
    >
      <template v-slot:selection="data">
        {{ data.item.name }}
      </template>

      <template v-slot:item="data">
        <template>
          <v-list-item-avatar>
            <img v-if="data.item.avatar.length > 0" :src="data.item.avatar">
            <v-icon v-else light size="50" color="#ccc">mdi-account</v-icon>
          </v-list-item-avatar>

          <div>
            <div class="add-customer__title" v-html="data.item.name"></div>
            <div class="add-customer__sub-title" v-html="data.item.address"></div>
          </div>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'AddCustomer',
  data() {
    return {
      customers: [
        {
          id: 1,
          name: 'Bamidele Mapayi',
          address: '1234 Waterloo Street West, ON',
          telephone: '08073290111',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        {
          id: 2,
          name: 'Emmanuel Mapayi',
          address: '1234 Waterloo Street West, ON',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        {
          id: 3, name: 'Mapayi', address: '1234 Waterloo Street West, ON', avatar: '',
        }],
      customer: '',
      isUpdating: false,
    };
  },
};
</script>

<style lang="scss" scoped>
  .add-customer__title {
    margin-bottom: 2px;
    font-size: 1rem;
    line-height: 1.2;
  }

  .add-customer__sub-title {
    color: rgba(0,0,0,.54);
    line-height: 1.2;
    font-size: .875rem;
  }
</style>
