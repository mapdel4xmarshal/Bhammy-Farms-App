<template>
  <section>
    <store-item :active="newItem" @update="newItem = false"/>
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
            <v-col cols="12" sm="4" md="3">
              <v-select
              v-model="sortBy"
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            </v-col>
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
                class="mx-auto"
                max-width="350"
                min-width="250"
                hover
              >
                <v-img
                  height="250"
                  :src="item.img"
                ></v-img>

                <v-card-title>{{ item.name }}</v-card-title>

                <v-card-text>
                  <v-row no-gutters>
                    <v-col>
                      <strong class="item__prop">Bhammy</strong>
                      <small>Supplier</small>
                    </v-col>

                    <v-col>
                      <strong class="item__prop">₦12,000</strong>
                      <small>Price</small>
                    </v-col>

                    <v-col>
                      <v-progress-linear
                        :value="((item.total * 100)/item.fillLevel).toFixed(2)"
                        :color="item.total? 'green' : '#e50f1b'"
                        :background-opacity="item.total? 0.35 : 1"
                        height="20"
                      >
                        <template>
                          <small><strong>{{ item.total }}/{{ item.fillLevel }}({{ item.unit }})</strong></small>
                        </template>
                      </v-progress-linear>
                      <small>Remaining</small>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider class="mx-4"></v-divider>

                <v-card-actions>
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
import StoreItem from '../components/StoreItem.vue';

export default {
  components: { StoreItem },
  data: () => ({
    newItem: false,
    itemsPerPage: 20,
    items: [
      {
        name: 'Finished feed',
        img: 'https://avianaquamiser.com/images/img/20120514chickenfeed.jpg',
        total: 20,
        fillLevel: 100,
        supplier: 'In house',
        brand: 'Bhammy Farms',
        unit: 'kg'
      },
      {
        name: 'Lasota',
        img: 'https://vetvaco.com.vn/uploaded/san-pham/LASOTA/La_new.jpg',
        total: 1,
        fillLevel: 3,
        supplier: 'Aromokeye',
        brand: 'NHC',
        unit: 'ml'
      },
      {
        name: 'Corn',
        img: 'https://img1.goodfon.com/wallpaper/big/9/3e/bag-beans-corn.jpg',
        total: 4.5,
        fillLevel: 13.5,
        supplier: 'In house',
        brand: 'Alhaji Corn',
        unit: 'tns'
      },
      {
        name: 'Layer concentrate (Hybrid)',
        img: 'https://hybridfeeds.com/wp-content/uploads/2018/09/12.jpg',
        total: 20,
        fillLevel: 100,
        supplier: 'In house',
        brand: 'Bhammy Farms'
      },
      {
        name: 'Grower concentrate (Hybrid)',
        img: 'https://www.afrimash.com/wp-content/uploads/2019/02/Grower-concentrate.jpg',
        total: 20,
        fillLevel: 100,
        supplier: 'In house',
        brand: 'Bhammy Farms'
      },
      {
        name: 'Chick Mash Feed',
        img: 'https://www.afrimash.com/wp-content/uploads/2019/05/New-Project-1-6.jpg',
        total: 20,
        fillLevel: 100,
        supplier: 'In house',
        brand: 'Bhammy Farms'
      },
      {
        name: 'Plastic crates',
        img: 'https://images.yaoota.com/NVWQ4T76kydBUKxc0J35f2D8Jng=/trim/yaootaweb-production-ng/media/crawledproductimages/ca53a6deb861381aa93323f2e97e2f6b43da489b.jpg',
        total: 20,
        fillLevel: 100,
        supplier: 'In house',
        brand: 'Bhammy Farms'
      },
      {
        name: 'Paper crates',
        img: 'https://www.theroachcafe.com/wp-content/uploads/2015/12/eggcrate.jpg',
        total: 20,
        fillLevel: 100,
        supplier: 'In house',
        brand: 'Bhammy Farms'
      }
    ]
  }),
  methods: {
    createNew() {
      this.newItem = true;
      console.log(this.$vuetify.breakpoint);
    }
  }
};
</script>

<style scoped>
  .item__prop {
    display: block;
  }
</style>
