<template>
  <section>
    <damaged-item v-if="showForm" :active="showForm" @success="onCreate" @cancel="showForm = false"/>
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title class="grey--text">Damaged Items</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="createNew">
        Add Damaged Item
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="3">
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
          v-model="menu"
          :return-value.sync="date"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="dateRangeText"
              label="Date"
              autocomplete="off"
              clearable
              @click:clear="resetDate"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" range>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="updateDate">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          label="Damage type"
          v-model="damageType"
          clearable
          @change="updateDamageItemType"
          @click:clear="resetDamageItemType"
          :items="['Crack', 'Expired', 'Wastage', 'Other']"
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3">
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          v-model="search"
          width='100'
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-0 mb-3">
      <v-col v-for="(summary, index) in summaries" :key="index" class="pa-3">
        <v-card outlined>
          <v-list>
            <v-list-item>
              <v-list-item-avatar size="60">
                <v-img :src="`/${summary.thumbnail}`"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="caption text-uppercase" style="color: rgb(114, 114, 114);">
                  {{ summary.name }}</v-list-item-title>
                <span class="body-2">{{ summary.total | formatNumber }} {{ summary.unit }}</span>
                <v-list-item-title class="title">
                  <strong>₦{{ summary.totalAmount | formatNumber }}</strong>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      no-data-text="No damaged items to display."
      :headers="headers"
      :items="damagedItems"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.quantity="{ item }">
        {{ item.quantity }} ({{ item.item.unit }})
      </template>
      <template v-slot:item.cost="{ item }">
        ₦{{ item.cost | formatNumber }}
      </template>
      <template v-slot:item.id="{ item }">
        {{ item.id | pad }}
      </template>
      <template v-slot:item.actions="{ item }">
        <TableAction id="feed"
                     :item="item"
                     :edit-item="''"
                     :delete-item="confirmDelete"
        />
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
    >
      {{ message }}
      <v-btn
        :color="snackbarColor"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="450"
    >
      <v-card>
        <v-card-title class="headline">
          Deleting a damaged item?
        </v-card-title>

        <v-card-text>
          The selected item will be permanently removed from the system.
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            depressed
            @click="deleteItem"
          >
            Delete record
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import axios from '../plugins/axios';
import TableAction from '../components/TableAction.vue';
import DamagedItem from '../components/DamagedItem.vue';

export default {
  name: 'Income',
  data() {
    return {
      dialog: false,
      snackbar: false,
      message: '',
      snackbarColor: 'blue',
      damagedItems: [],
      dateMenu: false,
      date: null,
      search: '',
      damageType: null,
      menu: false,
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
          width: '5%'
        },
        {
          text: 'Date',
          sortable: true,
          value: 'date',
          align: 'start',
          width: '110px'
        },
        { text: 'Name', value: 'item.name', align: 'start' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Amount', value: 'cost' },
        { text: 'Damage type', value: 'damageType' },
        { text: '', value: 'actions', align: 'end' }
      ],
      showForm: false,
      summaries: {}
    };
  },
  components: { TableAction, DamagedItem },
  computed: {
    dateRangeText() {
      return this.date && this.date.length > 0 ? this.date.join(' ~ ') : null;
    }
  },
  methods: {
    createNew() {
      this.showForm = true;
    },
    resetDate() {
      this.date = [];
      this.getDamagedItems();
    },
    updateDamageItemType() {
      this.getDamagedItems();
    },
    resetDamageItemType() {
      this.damageType = null;
    },
    getDamagedItems() {
      const filters = [];
      if (this.date && this.date.length === 1) filters.push(`date=${this.date[0]}`);
      if (this.date && this.date.length === 2) filters.push(`after=${this.date[0]}&before=${this.date[1]}`);
      if (this.damageType) filters.push(`damageType=${this.damageType}`);

      this.summaries = {};

      axios.get(`/damaged-items?${filters.join('&')}`)
        .then(({ data }) => {
          this.damagedItems = data.map((item) => {
            const newItem = { ...item };
            newItem.cost = (item.amount / item.item.packagingSize) * item.quantity;

            this.curateSummary(item);
            return newItem;
          });
        });
    },
    curateSummary(record) {
      if (!this.summaries[record.item.id]) {
        this.summaries[record.item.id] = { total: 0, totalAmount: 0, ...record.item };
      }

      this.summaries[record.item.id].total += Number(record.quantity);
      this.summaries[record.item.id].totalAmount
        += (Number(record.quantity) * (record.amount / record.item.packagingSize));
    },
    updateDate() {
      this.$refs.menu.save(this.date);
      this.getDamagedItems();
    },
    deleteItem() {
      axios.delete(`/damaged-items/${this.selectedId}`)
        .then(({ data }) => {
          if (data.error) {
            this.snackbar = true;
            this.message = data.error;
          } else {
            this.successAlert();
            this.message = 'Invoice deleted successfully.';
            this.getDamagedItems();
          }
        })
        .catch(({ response: { data } }) => {
          this.errorAlert();
          this.message = data;
        })
        .finally(() => {
          this.dialog = false;
        });
    },
    successAlert(message) {
      this.snackbar = true;
      this.snackbarColor = 'blue';
      if (message) this.message = message;
    },
    errorAlert() {
      this.snackbar = true;
      this.snackbarColor = 'red';
    },
    confirmDelete(record, { id }) {
      this.selectedId = id;
      this.dialog = true;
    },
    onCreate() {
      this.showForm = false;
      this.successAlert('Damaged item added!');
      this.getDamagedItems();
    }
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    },
    pad(value) {
      return value.toString().padStart(4, '0');
    }
  },
  activated() {
    this.getDamagedItems();
  }
};
</script>

<style lang="scss">
  .payment-status {
    text-transform: uppercase;

    &--paid {
      border-color: green !important;
    }

    &--unpaid {
      border-color: crimson !important;
    }

    &--partial {
      border-color: #2b2b2b !important;
    }

    .table-cursor tbody tr:hover {
      cursor: pointer;
    }
  }
</style>
