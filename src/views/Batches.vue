<template>
  <section>
    <Batch :active="newBatch" @update="handleBatchEvent"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>Batches</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn @click="createNew" color="primary" tile rounded>
        New Batch
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-row>
      <v-spacer></v-spacer>
      <v-col  cols="12" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          v-model="search"
          width='100'
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      no-results-text="No batch matching the search value found"
      :headers="headers"
      :items="items"
      :search="search"
      class="elevation-1"
      multi-sort
    ></v-data-table>
  </section>
</template>

<script>
import Batch from '../components/Batch.vue';

export default {
  name: 'Batches',
  components: { Batch },
  data() {
    return {
      newBatch: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'Batch Id',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {
          text: 'Move in date',
          value: 'moveInDate'
        },
        {
          text: 'Move out date',
          value: 'moveOutDate'
        },
        {
          text: 'Type',
          value: 'type'
        },
        {
          text: 'Breed',
          value: 'breed'
        },
        {
          text: 'Initial stock',
          value: 'initialStock'
        },
        {
          text: 'Current stock',
          value: 'currentStock'
        },
        {
          text: 'Move in age (Weeks)',
          value: 'moveInAge'
        },
        {
          text: 'Current age (Weeks)',
          value: 'currentAge'
        },
        {
          text: 'State',
          value: 'state'
        },
      ],
      items: [
        {
          moveInDate: '2020-02-02',
          id: 'AJG-P001-B01',
          type: 'Chicks',
          breed: 'Isa Brown',
          moveOutDate: '2019-02-02',
          initialStock: 4200,
          currentStock: 4190,
          moveInAge: 16,
          currentAge: 24,
          state: 'Active'
        }
      ]
    };
  },
  methods: {
    createNew() {
      this.newBatch = true;
    },
    handleBatchEvent(value) {
      this.newBatch = value;
    }
  }
};
</script>
