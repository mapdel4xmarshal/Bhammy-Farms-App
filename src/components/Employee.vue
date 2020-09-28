<template>
  <section class="mb-10">
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>New Employee</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$router.push('/employees')">cancel</v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <div class="d-flex justify-center center ma-auto mt-4">
      <v-expansion-panels v-model="sections" style="max-width: 1000px;" multiple>
        <v-expansion-panel v-if="!showBankDetails">
          <v-expansion-panel-header class="pl-6 pr-6 pb-0 pt-0">
            <v-row align="center" no-gutters>
              <v-col cols="12">
                <span class="caption text-h6">General information</span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider/>
            <v-form ref="detailForm" v-model="valid" lazy-validation>
              <v-row no-gutters>
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
                <span class="caption text-h6">Employment information</span>
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
                          v-model="employee.level"
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
                          :rules="[v => !!v || 'Please select / inpout a department.']"
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
                          v-model="employee.dayOff"
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
                            v-model="employee.remark"
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
            <v-btn
              class="float-right mt-6"
              tile
              color="primary"
              :loading="busy"
              @click="saveEmployeeDetail"
            >
              Create employee
            </v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="showBankDetails">
          <v-expansion-panel-header>
            <v-row align="center" no-gutters>
              <v-col cols="12">
                <span class="caption text-h6">Payment information</span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider/>
            <v-row no-gutters>
              <v-col cols="12">
                <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
                  <input autocomplete="off" name="hidden" type="text" style="display:none;">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        label="Bank name*"
                        hint="Name of the financial institution."
                        persistent-hint
                        required
                        :rules="[v => !!v || 'Please choose a bank.']"
                        v-model="bankDetails.bankCode"
                        item-text="bankName"
                        item-value="cbnCode"
                        @change="bankDetails.accountNumber && getAccountName()"
                        :items="bankCodes"
                      ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        label="Account number"
                        hint="Account number."
                        persistent-hint
                        v-model="bankDetails.accountNumber"
                        @blur="getAccountName"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        label="Account name"
                        hint="Account name."
                        persistent-hint
                        readonly
                        disabled
                        :loading="isLoadingAccountName"
                        v-model="bankDetails.accountName"
                        :error-messages="accountError"
                        :error="!!accountError"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        label="Reference Id"
                        hint="Reference Id."
                        persistent-hint
                        readonly
                        disabled
                        v-model="bankDetails.referenceId"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
                <v-btn text class="float-left mt-6" @click="$router.push('/employees')">
                  skip
                </v-btn>
                <v-btn
                  class="float-right mt-6"
                  color="primary"
                  tile
                  :loading="busy"
                  @click="addBankDetail"
                >
                  Add bank detail
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
import ROUTES from '../router/routeNames';

export default {
  name: 'Employee',
  data() {
    return {
      busy: false,
      message: 'New employee created.',
      step: 1,
      snackbar: false,
      accountError: '',
      showBankDetails: false,
      isLoadingAccountName: false,
      imageUrl: '/../img/user.png',
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
      bankDetails: {},
      positions: [],
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
      bankCodes: [
        {
          bankName: 'Access Bank Plc',
          cbnCode: '044',
          shortCode: 'ABP'
        },
        {
          bankName: 'Access Bank Plc (Diamond)',
          cbnCode: '063',
          shortCode: 'DBP'
        },
        {
          bankName: 'Ecobank Nigeria',
          cbnCode: '050',
          shortCode: 'ECO'
        },
        {
          bankName: 'Enterprise Bank Plc',
          cbnCode: '084',
          shortCode: 'ENB'
        },
        {
          bankName: 'Fidelity Bank Plc',
          cbnCode: '070',
          shortCode: 'FBP'
        },
        {
          bankName: 'First Bank of Nigeria Plc',
          cbnCode: '011',
          shortCode: 'FBN'
        },
        {
          bankName: 'First City Monument Bank',
          cbnCode: 214,
          shortCode: 'FCMB'
        },
        {
          bankName: 'Guaranty Trust Bank Plc',
          cbnCode: '058',
          shortCode: 'GTB'
        },
        {
          bankName: 'Heritage Bank',
          cbnCode: '030',
          shortCode: 'HBP'
        },
        {
          bankName: 'Jaiz Bank',
          cbnCode: 301,
          shortCode: 'JAIZ'
        },
        {
          bankName: 'Keystone Bank Ltd',
          cbnCode: '082',
          shortCode: 'KSB'
        },
        {
          bankName: 'Mainstreet Bank Plc',
          cbnCode: '014',
          shortCode: 'MSB'
        },
        {
          bankName: 'Polaris Bank',
          cbnCode: '076',
          shortCode: 'SKYE'
        },
        {
          bankName: 'Stanbic IBTC Plc',
          cbnCode: '039',
          shortCode: 'STANBIC'
        },
        {
          bankName: 'Sterling Bank Plc',
          cbnCode: 232,
          shortCode: 'SBP'
        },
        {
          bankName: 'Union Bank Nigeria Plc',
          cbnCode: '032',
          shortCode: 'UBN'
        },
        {
          bankName: 'United Bank for Africa Plc',
          cbnCode: '033',
          shortCode: 'UBA'
        },
        {
          bankName: 'Unity Bank Plc',
          cbnCode: 215,
          shortCode: 'UNITY'
        },
        {
          bankName: 'WEMA Bank Plc',
          cbnCode: '035',
          shortCode: 'WEMA'
        },
        {
          bankName: 'Zenith Bank International',
          cbnCode: '057',
          shortCode: 'ZIB'
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS
    }),
    houses() {
      const selectedLocation = this.farmLocations.filter((location) => location.id === this.employee.location);
      return selectedLocation && selectedLocation.length > 0 ? selectedLocation[0].houses : [];
    },
    buttonText() {
      return this.selectedFile ? String(this.selectedFile.name).substring(0, 20) : this.defaultButtonText;
    },
    title() {
      return this.employee.id ? 'Edit' : 'New';
    },
    buttonTitle() {
      return this.employee.id ? 'Update item' : 'Save item';
    }
  },
  methods: {
    addBankDetail() {
      this.busy = true;
      axios.post('/employees/bank-detail', this.bankDetails)
        .then(() => {
          this.$router.push({ name: ROUTES.EMPLOYEES });
        })
        .catch(({ response }) => {
          this.snackbar = true;
          this.message = response.data.message;
        })
        .finally(() => {
          this.busy = false;
        });
    },
    getAccountName() {
      this.bankDetails.accountName = '';
      this.accountError = '';
      this.isLoadingAccountName = true;
      axios.get(`/employees/bank/resolve?accountNumber=${this.bankDetails.accountNumber
      }&bankCode=${this.bankDetails.bankCode}`)
        .then(({ data }) => {
          if (data.status) {
            this.bankDetails.accountName = data.data.account_name;
          } else this.accountError = data.message;
        })
        .finally(() => {
          this.isLoadingAccountName = false;
        });
    },
    addNewPosition() {
      this.positions.push(this.positionSearch);
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
      this.imageUrl = URL.createObjectURL(this.selectedFile);
    },
    saveEmployeeDetail() {
      if (!this.busy && this.$refs.detailForm.validate()) {
        this.busy = true;
        const formData = new FormData();
        const employee = { ...this.employee };
        employee.level = +(this.employee.level === 'Manager');
        employee.dayOff = this.days.indexOf(employee.dayOff);
        Object.entries(employee).forEach((data) => {
          formData.append(data[0], data[1]);
        });

        axios.post('/employees', formData)
          .then(({ data }) => {
            this.bankDetails.employeeId = data.employee_id;
            this.snackbar = true;
            this.showBankDetails = true;
            this.message = 'New employee created.';
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
    }
  },
  created() {
    this.getRoles();
    this.getDepartments();
  }
};
</script>
<style>
  .v-icon--left {
    margin-right: 8px;
  }
</style>
