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
      <v-col cols="12" md="2">
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
      :items-per-page="-1"
      class="elevation-1 table-cursor"
      @click:row="selectBatch"
      no-data-text="No batch available, please add a batch."
      multi-sort
    ></v-data-table>

    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
    >
      Batch created.
      <v-btn
        color="blue"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </section>
</template>

<script>
import axios from '../plugins/axios';
import ROUTES from '../router/routeNames';
import Batch from '../components/Batch.vue';

export default {
  name: 'Batches',
  components: { Batch },
  data() {
    return {
      snackbar: false,
      batches: [],
      newBatch: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'Batch name',
          align: 'start',
          sortable: true,
          value: 'name',
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
          text: 'Status',
          value: 'status'
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
          this.batches = data.map((batch) => {
            const moveInAge = Number.parseInt(batch.moveInAge / 7, 10);
            const currentAge = Number.parseInt(batch.currentAge / 7, 10);
            return { ...batch, moveInAge, currentAge };
          });
        });
    },
    handleBatchEvent(state) {
      this.snackbar = state;
      this.newBatch = false;

      if (state) this.getBatches();
    },
    selectBatch(batch) {
      this.$router.push({ name: ROUTES.BATCH_DETAIL, params: { id: batch.batchId } });
    }
  },
  mounted() {
    this.getBatches();
  }
};
</script>
