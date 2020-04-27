<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-select
          :items="['Layer mash', 'Grower mash', 'Chick mash', 'Broiler mash']"
          label="Type*"
          required
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-text-field label="Quantity*" type="number" required></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
