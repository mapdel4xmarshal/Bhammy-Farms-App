<template>
  <section>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>Employees</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn tile color="primary">
        Add employee
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <v-data-iterator
      :items="employees"
      hide-default-header
      :search="search"
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
                :key="item.name"
              >
                <v-card-text class="align-content-center center">
                  <v-avatar size="150px">
                    <v-img
                      :src="item.image"></v-img>
                  </v-avatar>
                  <v-card-title class="justify-center">
               <span style="color: #7f2775">
                 {{ item.name }}
               </span>
                  </v-card-title>
                  <v-card-subtitle>
                    {{ item.phone }}
                  </v-card-subtitle>
                  <v-chip small class=" text-uppercase">{{ item.position }}</v-chip>
                </v-card-text>
              </v-card>
            </template>
          </div>
        </v-container>
      </template>
    </v-data-iterator>
  </section>
</template>

<script>
export default {
  name: 'Employees',
  data() {
    return {
      search: '',
      employees: [
        {
          name: 'Test employee',
          image: 'https://image.shutterstock.com/image-photo/portrait-sexy-smiling-male-model-260nw-439389172.jpg',
          position: 'Pen Attendant',
          phone: '08073290177'
        },
        {
          name: 'Bamidele employee',
          image: 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          position: 'Pen Attendant',
          phone: '08073290177'
        },
        {
          name: 'employee employee',
          image: '/img/user.png',
          position: 'Manager',
          phone: '08073290177'
        },
        {
          name: 'employee employee',
          image: '/img/user.png',
          position: 'Manager',
          phone: '08073290177'
        },
        {
          name: 'employee employee',
          image: '/img/user.png',
          position: 'Manager',
          phone: '08073290177'
        },
        {
          name: 'employee employee',
          image: '/img/user.png',
          position: 'Security',
          phone: '08073290177'
        },
        {
          name: 'employee employee',
          image: '/img/user.png',
          position: 'Driver',
          phone: '08073290177'
        }
      ]
    };
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
