<template>
  <v-dialog v-model="active" persistent max-width="800px" scrollable :fullscreen="$mq.phone">
    <v-card>
      <v-card-title>New Feed Production</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="value.date"
                      clearable
                      label="Date*"
                      hint="Date incurred."
                      :rules="[v => !!v || 'Please enter a date.']"
                      readonly
                      persistent-hint
                      v-on="on"
                      @click:clear="value.date = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="value.date"
                    @change="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-select
                  label="Feed Type"
                  hint="Type of feed."
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select feed type.']"
                  v-model="value.type"
                  :items="feedTypes"
                  return-object
                  item-text="name"
                  item-value="name"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  label="Energy Level"
                  hint="Feed Energy Level"
                  persistent-hint
                  required
                  :rules="[v => !!v || 'Please select feed energy level.']"
                  v-model="value.energyLevel"
                  :items="['High', 'Medium', 'Low']"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-row style="background-color: #f5f5f5" class="mr-0 ml-0">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="value.ingredients"
                      :items="ingredients"
                      chips
                      color="blue-grey lighten-2"
                      label="Select ingredients"
                      hint="Feed ingredients"
                      persistent-hint
                      return-object
                      item-text="name"
                      item-value="name"
                      required
                      :rules="[v => !!v || 'Please select feed ingredients.']"
                      multiple
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          close
                          @click="data.select"
                          @click:close="remove(data.item)"
                        >
                          <v-avatar left>
                            <v-img :src="`/${data.item.image}`"></v-img>
                          </v-avatar>
                          {{ data.item.name }}
                        </v-chip>
                      </template>
                      <template v-slot:item="{ item }">
                        <v-list-item-avatar tile>
                          <v-img :src="`/${item.image}`"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ item.category }} {{ item.brand ? `| ${item.brand}` : '' }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <template v-for="ingredient in value.ingredients">
                    <v-col :key="ingredient.id">
                      <v-text-field v-model="ingredient.quantity"
                                    :label="`${ingredient.name}*`"
                                    hint="Quantity"
                                    type="number"
                                    :rules="[v => !!v || 'Please enter item quantity.']"
                                    persistent-hint
                                    :suffix="ingredient.unit"
                      />
                    </v-col>
                  </template>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="Remark"
                  clearable
                  no-resize
                  rows="2"
                  v-model="value.comment"
                  hint="Comment / remark."
                  persistent-hint
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary darken-1" text @click="$emit('close')">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" tile @click="createProduction">Save</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="snackbar"
    >
      {{ feedbackMessage }}
      <v-btn
        color="red"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'FeedProduction',
  data() {
    return {
      categories: ['ingredient', 'concentrate', 'feed additive', 'additive', 'feed ingredient'],
      valid: true,
      snackbar: false,
      dateMenu: false,
      ingredients: [],
      feedbackMessage: '',
      feedTypes: []
    };
  },
  props: {
    value: {
      type: Object
    },
    active: {
      type: Boolean,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    update() {
      this.$emit('update', this.value);
    },
    createProduction() {
      if (this.$refs.form.validate()) {
        const id = this.editMode ? this.value.id : '';
        axios[this.editMode ? 'patch' : 'post'](`/feed-productions/${id}`, this.value)
          .then(() => {
            this.$emit('save');
            this.$refs.form.reset();
          })
          .catch((response) => {
            this.feedbackMessage = response.data.error;
            this.snackbar = true;
          });
      }
    },
    getIngredients() {
      axios.get(`/items?category=${this.categories.join('&category=')}`)
        .then(({ data }) => {
          this.ingredients = data.map((ingredient) => {
            const ingredientCopy = { ...ingredient };
            delete ingredientCopy.quantity;
            return ingredientCopy;
          });
        });
    },
    getFeedTypes() {
      axios.get('/items?category=feed')
        .then(({ data }) => {
          this.feedTypes = data.filter((feed) => Boolean(feed.isProduced) === true);
        });
    },
    remove(item) {
      const index = this.value.ingredients.findIndex((ingredient) => ingredient.id === item.id);
      if (index >= 0) this.value.ingredients.splice(index, 1);
    }
  },
  created() {
    this.getIngredients();
    this.getFeedTypes();
  }
};
</script>
