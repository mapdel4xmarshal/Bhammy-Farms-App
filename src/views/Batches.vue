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
      :items="batches"
      :search="search"
      class="elevation-1"
      multi-sort
    ></v-data-table>
  </section>
</template>

<script>
import axios from 'axios';
import Batch from '../components/Batch.vue';

export default {
  name: 'Batches',
  components: { Batch },
  data() {
    return {
      batches: [],
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
          text: 'Category',
          value: 'category'
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
      ]
    };
  },
  methods: {
    createNew() {
      this.newBatch = true;
    },
    getBatches() {
      axios.get('batches')
        .then(({ data }) => {
          this.batches = data;
        });
    },
    handleBatchEvent(value) {
      this.newBatch = value;
    }
  },
  mounted() {
    this.getBatches();
  }
};
</script>
