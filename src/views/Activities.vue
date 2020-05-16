<template>
  <section>
    <activity :active="newExpense" @update="newExpense = false"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="newExpense = true">
        New Activity
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
      :headers="headers"
      :items="items"
      multi-sort
      :search="search"
      class="elevation-1"
    ></v-data-table>

  </section>
</template>

<script>
import ROUTES from '../router/routeNames';
import Activity from '../components/Activity.vue';

export default {
  name: 'Activities',
  components: { Activity },
  data() {
    return {
      dateMenu: false,
      newExpense: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Farm/Batch', value: 'batch' },
        { text: 'Category', value: 'category' },
        { text: 'Occurrence', value: 'occurrence' },
        { text: 'Description', value: 'description' },
      ],
      items: [
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Vaccination',
          description: 'This is a sample description...',
          occurrence: 'Recurring'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Medication',
          description: '...',
          occurrence: 'One time'
        },
        {
          date: '2020-02-02',
          batch: 'AJG-P001-B01',
          category: 'Deworming',
          description: 'This is another sample',
          occurrence: 'Bi-weekly'
        }
      ]
    };
  },
  methods: {
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    }
  }
};
</script>
