<template>
  <section class="mb-10">
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>{{ title }} Employee</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="cancel">close</v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <div class="d-flex justify-center center ma-auto mt-4">
      <v-card>
        <v-col cols="12" style="text-align: left;">
          <span class="caption text-h6 pl-3">General information</span>
        </v-col>
        <v-divider/>
        <v-form ref="detailForm" v-model="valid" lazy-validation style="max-width: 1000px;">
          <v-row class="pa-6">
            <v-col cols="12" md="" class="pt-8 pl-2 pr-2">
              <v-row no-gutters>
                <v-col cols="12" class="center justify-center">
                  <v-avatar size="150">
                    <v-img :src="imageUrl"/>
                  </v-avatar>
                  <div class="mt-2">
                    <v-btn
                      color="primary"
                      class="text-none"
                      rounded
                      small
                      depressed
                      :loading="isSelecting"
                      @click="onButtonClick"
                    >
                      <v-icon left>
                        mdi-camera
                      </v-icon>
                      {{ buttonText }}
                    </v-btn>
                    <input
                      ref="uploader"
                      class="d-none"
                      type="file"
                      accept="image/*"
                      @change="onFileChanged"
                    >
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Fullname*"
                    hint="Employee's Fullname."
                    persistent-hint
                    :rules="[v => !!v || 'Please enter Fullname.']"
                    required
                    autocomplete="off"
                    v-model="employee.name"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    label="Gender*"
                    hint="Employee's gender."
                    persistent-hint
                    required
                    v-model="employee.gender"
                    :rules="[v => !!v || 'Please select a gender.']"
                    :items="['Male', 'Female', 'Unknown']"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu
                    v-model="dobMenu"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="employee.dateOfBirth"
                        clearable
                        label="Date of birth*"
                        hint="Employee's DOB."
                        :rules="[v => !!v || 'Please select a date.']"
                        readonly
                        persistent-hint
                        v-on="on"
                        @click:clear="employee.dateOfBirth = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="employee.dateOfBirth"
                      @change="dobMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Address*"
                    clearable
                    v-model="employee.address"
                    :rules="[v => !!v || 'Please enter employee\'s address.']"
                    hint="Customer's address excluding the state."
                    autocomplete="off"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="employee.state"
                    label="State*"
                    hint="Employee's state."
                    autocomplete="off"
                    persistent-hint
                    required
                    :rules="[v => !!v || 'Please select a state.']"
                    clearable
                    return-object
                    :items="states"
                    item-text="name"
                    item-value="name"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Phone*"
                    hint="Employee's phone number.."
                    autocomplete="off"
                    :rules="[v => !!v || 'Please enter a valid phone number.']"
                    persistent-hint
                    required
                    v-model="employee.phone"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Alt Phone"
                    hint="Employee's alternative phone."
                    autocomplete="off"
                    persistent-hint
                    required
                    v-model="employee.altPhone"
                    type="phone"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Email"
                    hint="Employee's email address."
                    autocomplete="off"
                    persistent-hint
                    required
                    v-model="employee.email"
                    type="email"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="mt-6"/>
          <v-col cols="12" style="text-align: left;">
            <span class="caption text-h6 pl-3">Employment information</span>
          </v-col>
          <v-sheet color="#f5f5f5" class="pl-6 pr-6">
            <v-row no-gutters>
              <v-col cols="12">
                <input autocomplete="off" name="hidden" type="text" style="display:none;">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="dateMenu"
                      :close-on-content-click="false"
                      max-width="290"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="employee.employmentDate"
                          clearable
                          label="Employment date*"
                          hint="Employment start date."
                          :rules="[v => !!v || 'Please enter employee date.']"
                          readonly
                          persistent-hint
                          v-on="on"
                          @click:clear="employee.employmentDate = null"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="employee.employmentDate"
                        @change="dateMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Position / Role*"
                      hint="Employee's role / position."
                      :rules="[v => !!v || 'Please enter item unit.']"
                      v-model="employee.position"
                      persistent-hint
                      :search-input.sync="positionSearch"
                      :items="roles"
                      required
                    >
                      <template v-slot:no-data>
                        <v-list-item
                          ripple
                          @click="addNewPosition"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{ positionSearch }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Location*"
                      hint="Farm location where employee is employed."
                      persistent-hint
                      required
                      :rules="[v => !!v || 'Please select a farm location.']"
                      v-model="employee.location"
                      item-text="name"
                      item-value="id"
                      :items="farmLocations"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Pen"
                      hint="Pen where the employee is assigned."
                      persistent-hint
                      required
                      v-model="employee.house"
                      item-text="name"
                      item-value="id"
                      :items="houses"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="level"
                      label="Seniority level"
                      persistent-hint
                      hint="Employee's experience level"
                      :items="['Staff', 'Manager']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Department*"
                      hint="Department."
                      :rules="[v => !!v || 'Please select / input a department.']"
                      v-model="employee.department"
                      persistent-hint
                      :search-input.sync="departmentSearch"
                      :items="departments"
                      required
                    >
                      <template v-slot:no-data>
                        <v-list-item
                          ripple
                          @click="addNewDepartment"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{ departmentSearch }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="number"
                      label="Salary"
                      prefix="₦"
                      hint="Employee's compensation."
                      persistent-hint
                      :rules="[v => !!v || 'Please enter the appropriate salary.']"
                      v-model="employee.salary"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="dayOff"
                      clearable
                      label="Day off*"
                      hint="Employee's vacation day."
                      :rules="[v => !!v || 'Please select a vacation day.']"
                      persistent-hint
                      :items="days"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Remark"
                      clearable
                      filled
                      rows="2"
                      no-resize
                      v-model="employee.comment"
                      hint="Remark."
                      persistent-hint
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
        </v-form>
        <v-card-actions>
          <v-btn
            class="ma-6"
            text
            color="primary"
            @click="cancel"
          >
            close
          </v-btn>
          <v-spacer/>
          <v-btn
            class="ma-6"
            tile
            color="primary"
            :loading="busy"
            @click="saveEmployeeDetail"
          >
            {{ buttonTitle }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
    >
      {{ message }}
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

export default {
  name: 'Employee',
  data() {
    return {
      busy: false,
      message: 'New employee created.',
      step: 1,
      snackbar: false,
      states: [
        'Abia',
        'Adamawa',
        'Akwa Ibom',
        'Anambra',
        'Bauchi',
        'Bayelsa',
        'Benue',
        'Borno',
        'Cross River',
        'Delta',
        'Ebonyi',
        'Edo',
        'Ekiti',
        'Enugu',
        'FCT - Abuja',
        'Gombe',
        'Imo',
        'Jigawa',
        'Kaduna',
        'Kano',
        'Katsina',
        'Kebbi',
        'Kogi',
        'Kwara',
        'Lagos',
        'Nasarawa',
        'Niger',
        'Ogun',
        'Ondo',
        'Osun',
        'Oyo',
        'Plateau',
        'Rivers',
        'Sokoto',
        'Taraba',
        'Yobe',
        'Zamfara'
      ],
      image: '',
      employee: {},
      positionSearch: '',
      departmentSearch: '',
      departments: [],
      sections: [0, 1, 2],
      dobMenu: false,
      dateMenu: false,
      valid: true,
      attachment: '',
      roles: [],
      defaultButtonText: 'upload picture',
      selectedFile: null,
      isSelecting: false,
      selectedPen: null,
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    };
  },
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS
    }),
    dayOff: {
      set(day) {
        this.employee.dayOff = this.days.indexOf(day);
      },
      get() {
        return this.days[this.employee.dayOff];
      }
    },
    houses() {
      const selectedLocation = this.farmLocations.filter((location) => location.id === this.employee.location);
      return selectedLocation && selectedLocation.length > 0 ? selectedLocation[0].houses : [];
    },
    buttonText() {
      return this.selectedFile ? String(this.selectedFile.name).substring(0, 20) : this.defaultButtonText;
    },
    title() {
      return this.$route.params.id ? 'Edit' : 'New';
    },
    buttonTitle() {
      return this.employee.id ? 'Update Employee' : 'Create Employee';
    },
    imageUrl() {
      return this.selectedFile
        ? URL.createObjectURL(this.selectedFile) : `/${this.employee.avatar || '../img/user.png'}`;
    },
    level: {
      set(level) {
        this.employee.isManager = Boolean(['Staff', 'Manager'].indexOf(level));
      },
      get() {
        return ['Staff', 'Manager'][+this.employee.isManager];
      }
    }
  },
  methods: {
    cancel() {
      if (this.employee.id) this.$router.push(`/employees/${this.employee.id}`);
      else this.$router.push('/employees');
    },
    addNewPosition() {
      this.roles.push(this.positionSearch);
      this.employee.position = this.positionSearch;
    },
    addNewDepartment() {
      this.departments.push(this.departmentSearch);
      this.employee.department = this.departmentSearch;
    },
    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener('focus', () => {
        this.isSelecting = false;
      }, { once: true });

      this.$refs.uploader.click();
    },
    onFileChanged(e) {
      [this.selectedFile] = e.target.files;
      this.employee.thumbnail = this.selectedFile;
    },
    saveEmployeeDetail() {
      if (!this.busy && this.$refs.detailForm.validate()) {
        this.busy = true;
        const formData = new FormData();
        const employee = { ...this.employee };
        Object.entries(employee).forEach((data) => {
          formData.append(data[0], data[1]);
        });

        const url = `/employees/${employee.id ? employee.id : ''}`;
        axios[employee.id ? 'patch' : 'post'](url, formData)
          .then(() => {
            this.snackbar = true;
            this.message = employee.id ? 'Employee updated' : 'New employee created';
          })
          .catch(({ response }) => {
            this.message = response.data.message;
          })
          .finally(() => {
            this.busy = false;
          });
      }
    },
    getRoles() {
      axios.get('/employees/roles')
        .then(({ data }) => {
          this.roles = data;
        });
    },
    getDepartments() {
      axios.get('/employees/departments')
        .then(({ data }) => {
          this.departments = data;
        });
    },
    getEmployee() {
      axios.get(`/employees/${this.$route.params.id}`)
        .then(({ data }) => {
          this.employee = data;
        });
    }
  },
  created() {
    this.getRoles();
    this.getDepartments();
    if (this.$route.params.id) {
      this.getEmployee();
    }
  }
};
</script>
<style>
  .v-icon--left {
    margin-right: 8px;
  }
</style>
