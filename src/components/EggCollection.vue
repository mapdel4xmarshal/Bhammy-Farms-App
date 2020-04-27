<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-select
          :items="['Big', 'Medium', 'Small', 'Pullet']"
          label="Size*"
          required
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-text-field label="Quantity*" required></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field label="Crack*" type="number" required></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
