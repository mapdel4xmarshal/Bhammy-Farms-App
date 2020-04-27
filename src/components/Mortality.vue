<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field label="No of birds*" type="number" required></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-select
          :items="['Peaking', 'Prolapse', 'Suffocation', 'Crushed', 'Predator', 'Disease', 'Dead']"
          label="Reason*"
          required
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-textarea label="Comment"></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>
