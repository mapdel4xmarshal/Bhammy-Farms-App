<template>
  <section>
  <v-toolbar flat dense color="transparent">
    <v-toolbar-title>Inventory</v-toolbar-title>

    <v-spacer></v-spacer>
    <v-btn tile color="primary" @click="createNew">
       New item
    </v-btn>
  </v-toolbar>

  <v-divider></v-divider>

  <v-container fluid>
    <v-data-iterator
      :items="items"
      :sort-desc="sortDesc"
      :items-per-page.sync="itemsPerPage"
      hide-default-header
    >
      <template v-slot:header>
        <v-row
          dark
          color="primary"
          class="mb-1"
        >
          <v-col cols="3">
            <v-select
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="keys"
            prepend-inner-icon="mdi-magnify"
            label="Sort by"
          ></v-select>
          </v-col>
          <v-spacer/>
          <v-col cols="3">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          </v-col>
        </v-row>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              :loading="loading"
              class="mx-auto my-12"
              max-width="374"
              hover
            >
              <v-img
                height="250"
                :src="item.img"
              ></v-img>

              <v-card-title>{{ item.name }}</v-card-title>

              <v-card-text>

                <div class="my-4 subtitle-1">
                  $ • Italian, Cafe
                </div>

                <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus
                  patio seating.</div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-card-actions>
                <v-row>
                  <v-col>
                  <v-progress-linear
                    v-model="item.remaining"
                    :color="item.remaining? 'green' : '#e50f1b'"
                    :background-opacity="item.remaining? 0.35 : 1"
                    height="20"
                    reactive
                  >
                    <template v-slot="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                  </v-col>
                </v-row>
                <v-spacer/>
                <v-btn
                  color="primary"
                  text
                  @click="reserve"
                >
                  Restock
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
  </section>
</template>

<script>
export default {
  data: () => ({
    itemsPerPage: 20,
    items: [
      {
        name: 'Finished feed',
        img: 'https://avianaquamiser.com/images/img/20120514chickenfeed.jpg',
        remaining: 20
      },
      {
        name: 'Lasota',
        img: 'https://vetvaco.com.vn/uploaded/san-pham/LASOTA/La_new.jpg'
      },
      {
        name: 'Corn',
        img: 'https://img1.goodfon.com/wallpaper/big/9/3e/bag-beans-corn.jpg'
      },
      {
        name: 'Layer concentrate (Hybrid)',
        img: 'https://hybridfeeds.com/wp-content/uploads/2018/09/12.jpg'
      },
      {
        name: 'Grower concentrate (Hybrid)',
        img: 'https://www.afrimash.com/wp-content/uploads/2019/02/Grower-concentrate.jpg'
      },
      {
        name: 'Chick Mash Feed',
        img: 'https://www.afrimash.com/wp-content/uploads/2019/05/New-Project-1-6.jpg'
      },
      {
        name: 'Plastic crates',
        img: 'https://images.yaoota.com/NVWQ4T76kydBUKxc0J35f2D8Jng=/trim/yaootaweb-production-ng/media/crawledproductimages/ca53a6deb861381aa93323f2e97e2f6b43da489b.jpg'
      },
      {
        name: 'Paper crates',
        img: 'https://www.theroachcafe.com/wp-content/uploads/2015/12/eggcrate.jpg'
      }
    ]
  }),
  methods: {
    createNew() {
      console.log(this.$vuetify.breakpoint);
    }
  }
};
</script>
