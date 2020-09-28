<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>Employees</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="$router.push({ name: newEmployeeRoute})">
        Add employee
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-data-iterator
      :items="employees"
      hide-default-header
      :search="search"
      :disable-pagination="true"
      hide-default-footer
    >
      <template v-slot:header>
        <v-row
          dark
          color="primary"
          class="mb-1"
        >
          <v-spacer/>
          <v-col cols="12" sm="4" md="3">
            <v-text-field
              append-icon="mdi-magnify"
              clearable
              hide-details
              label="Search"
              v-model="search"
              width='100'
            ></v-text-field>
          </v-col>
        </v-row>
      </template>

      <template v-slot:default="props">
        <v-container fluid>
          <div class="contents">
            <template
              v-for="item in props.items"
            >
              <v-card
                class="elevation-1 justify-center pt-2 pb-3"
                :hover="true"
                tile
                :key="item.id"
              >
                <v-card-text class="align-content-center center">
                  <v-avatar size="150px">
                    <v-img
                      :src="item.avatar || defaultImage"></v-img>
                  </v-avatar>
                  <v-card-title class="justify-center">
               <span style="color: #7f2775">
                 {{ item.name }}
               </span>
                  </v-card-title>
                  <v-card-subtitle>
                    {{ item.phone }}
                  </v-card-subtitle>
                  <v-chip small class=" text-uppercase">{{ item.role }}</v-chip>
                </v-card-text>
              </v-card>
            </template>
          </div>
        </v-container>
      </template>
    </v-data-iterator>
    <v-snackbar
      v-model="snackbar"
      absolute
    >
      Employee created successfully
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

export default {
  name: 'Employees',
  data() {
    return {
      newEmployeeRoute: ROUTES.EMPLOYEE,
      snackbar: false,
      newEmployee: false,
      search: '',
      errored: false,
      employee: {},
      employees: [],
      defaultImage: '/../img/user.png'
    };
  },
  methods: {
    getEmployees() {
      axios.get('/employees')
        .then(({ data }) => {
          this.employees = data;
        });
    }
  },
  created() {
    this.getEmployees();
  }
};
</script>

<style scoped>
  .contents {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 250px));
    grid-gap: 20px;
    justify-content: center;
  }
</style>
