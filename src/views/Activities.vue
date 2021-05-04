<template>
  <section>
    <activity :active="newActivity"
              :farm-locations="farmLocations"
              @save="handleSave"
              @cancel="newActivity = false"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Activities</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="newActivity = true">
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
      :items="activities"
      no-data-text="No activities available."
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.description="{ item }">
        {{ item.description }}
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
    >
      Activity created successfully.
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
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import { GETTER_TYPES } from '../store/types';
import ROUTES from '../router/routeNames';
import Activity from '../components/Activity.vue';

export default {
  name: 'Activities',
  components: { Activity },
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS
    })
  },
  data() {
    return {
      dateMenu: false,
      newActivity: false,
      snackbar: false,
      date: null,
      search: '',
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Farm', value: 'location.name' },
        { text: 'Category', value: 'category' },
        { text: 'Description', value: 'description', width: '35%' },
      ],
      activities: []
    };
  },
  methods: {
    getActivities() {
      axios.get('activities')
        .then(({ data }) => {
          this.activities = data;
        });
    },
    createNew() {
      this.$router.push({ name: ROUTES.NEW_PRODUCTION });
    },
    handleSave() {
      this.snackbar = true;
      this.newActivity = false;
      this.getActivities();
    }
  },
  created() {
    this.getActivities();
  },
  filters: {
    truncate(string) {
      return string && string.length > 40 ? `${string.substring(0, 37)}...` : string;
    }
  }
};
</script>
