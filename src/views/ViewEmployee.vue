<template>
  <section>
    <v-toolbar flat dense color="transparent" class="mt-2">
      <v-btn tile text class="pl-0" color="primary" to="/employees">
        <v-icon>mdi-chevron-left</v-icon> Back
      </v-btn>
      <v-spacer/>
      <v-btn text color="primary" class="mr-2" @click="dialog = loanDialog = true">Loan</v-btn>
      <v-expand-transition>
        <v-menu offset-y rounded="0" :nudge-bottom="2">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              tile
              v-bind="attrs"
              v-on="on"
            >
              Pay Salary
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="paySalary" :loading="paymentInProgress" link>
              <v-list-item-title>Pay current</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title>Pay arrears</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-expand-transition>
    </v-toolbar>
    <v-dialog v-model="dialog" persistent scrollable max-width="800px" :fullscreen="$mq.phone">
      <v-card v-if="loanDialog">
        <v-card-title>Loan request</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <loan-request ref="loan" v-model="loan" @save="addLoan" @cancel="cancelLoan"/>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-title>Payment detail</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <payment-info v-model="bankDetail"
                        @save="updateBankDetail"
                        :loading="busy"
                        :error="accountError"
                        @cancel="resetBankDetail"/>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-slide-group multiple show-arrows>
          <v-slide-item
            v-for="(item, index) in employeeInfo"
            :key="index"
          >
            <div style="display: flex;">
              <div class="pt-1 pb-1">
                <span class="caption text-uppercase" style="color: #727272">{{ item.name }}</span>
                <br>
                <span class="body-1">{{ item.value }}</span>
              </div>
              <v-divider vertical v-if="index < employeeInfo.length - 1" class="ml-5 mr-5"/>
            </div>
          </v-slide-item>
        </v-slide-group>
      </v-col>
      <v-col cols="12" md="4" lg="3" class="pt-6">
        <v-card class="justify-center">
          <v-card-title class="justify-center pa-6 pb-0">
            <v-avatar color="primary" size="150">
              <v-img :src="avatar"></v-img>
            </v-avatar>
          </v-card-title>
          <v-card-title class="justify-center pa-2" no-gutter>
            {{ employee.name }}&nbsp;&nbsp;
          </v-card-title>
          <v-card-subtitle class="justify-center center pt-1">
            {{ employee.position }} | <v-chip x-small> {{ employeeState}}</v-chip>
          </v-card-subtitle>
          <div style="text-align: center;" class="mb-2">
            <v-btn rounded outlined color="primary" icon class="ma-0 mr-1" @click="editBankDetail">
              <v-icon>mdi-bank-plus</v-icon></v-btn>
            <v-btn color="primary" icon outlined class="m-0 ml-1" @click="editProfile">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="show = !show"
            >
              <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>

              <v-card-text>
                <v-list-item>
                  <v-list-item-content>
                    <strong class="caption">Phone number</strong>
                    <span class="subtitle-2">{{ employee.phone }}</span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="employee.altPhone">
                  <v-list-item-content>
                    <strong class="caption">Alt. Phone number</strong>
                    <span class="subtitle-2">{{ employee.altPhone }}</span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="employee.email">
                  <v-list-item-content>
                    <strong class="caption">Email address</strong>
                    <span class="subtitle-2">{{ employee.email }}</span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <strong class="caption">Address</strong>
                    <span class="subtitle-2">{{ employee.address }},
                 {{ employee.state }}</span>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
        <h4 class="h4 mt-7 pb-2">
          Vacation / Absences
        </h4>
        <v-card>
          <v-date-picker
            :events="absenceEvents"
            full-width
            no-title
            :event-color="absenceEventColors"
            @click:date="absenceEvent"
          ></v-date-picker>
          <v-dialog
            width="500"
            v-model="showVacationMenu"
            :fullscreen="$mq.phone"
          >
            <v-card class="ma-auto" max-width="500">
              <v-card-title>Leave request</v-card-title>
              <v-divider></v-divider>
              <v-form ref="leaveForm">
                <v-row class="ma-4 mt-0">
                  <v-col cols="12">
                    <v-text-field
                      label="Start date"
                      hint="Leave start date."
                      autocomplete="off"
                      persistent-hint
                      readonly
                      required
                      v-model="absences.startDate"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Days"
                      hint="No of days to be out of office"
                      autocomplete="off"
                      persistent-hint
                      required
                      type="number"
                      v-model="absences.days"
                      :rules="[v => !!v || 'Please enter days.']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      label="Type"
                      hint="Leave type"
                      autocomplete="off"
                      persistent-hint
                      required
                      :items="['Vacation', 'Unapproved']"
                      v-model="absences.type"
                      :rules="[v => !!v || 'Please select leave type.']"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      label="Remark"
                      clearable
                      rows="2"
                      filled
                      no-resize
                      v-model="absences.comment"
                      hint="Notable information about this leave."
                      persistent-hint
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
              <v-card-actions class="pa-7 pt-1 pb-4">
                <v-btn text @click="showVacationMenu = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn tile color="primary" @click="requestLeave">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
      <v-col cols="12" :md="$mq.tablet ? 12 : 8" sm="12" lg="9">
        <v-row>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100" outlined>
              <v-card-text class="pb-0">Unpaid salary</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ employee.unPaidSalary | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100" outlined>
              <v-card-text class="pb-0">Unpaid loan</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ employee.unPaidLoan | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100" outlined>
              <v-card-text class="pb-0">Loans till date</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ employee.totalLoan | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" sm="6" lg="3">
            <v-card class="ma-auto" height="100" outlined>
              <v-card-text class="pb-0">Salaries till date</v-card-text>
              <v-card-title class="pt-1 display-1 text-md-h5 text-lg-h5">
                ₦ {{ employee.paidSalary | formatNumber }}</v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-tabs background-color="transparent">
              <v-tab>Salaries</v-tab>
              <v-tab>Loans</v-tab>
              <v-tab-item>
                <v-data-table
                  :headers="salaryHeaders"
                  :items="employee.salaries"
                  no-data-text="No salaries found."
                  class="elevation-1"
                >
                  <template v-slot:item.amount="{ item }">
                    ₦{{ item.amount | formatNumber }}
                  </template>
                  <template v-slot:item.loanPaidAmount="{ item }">
                    ₦{{ item.loanPaidAmount | formatNumber }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip small
                            :class="`caption text-uppercase ${
                            item.status === 'processing' ? 'black--text' : 'white--text'}`"
                            :color="salaryColors[item.status]">
                      {{ item.status }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>
                <v-data-table
                  :headers="loanHeaders"
                  :items="employee.deductibles"
                  no-data-text="No loans found."
                  class="elevation-1"
                >
                  <template v-slot:item.amount="{ item }">
                    ₦{{ item.amount | formatNumber }}
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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
import PaymentInfo from '../components/PaymentInfo.vue';
import ROUTES from '../router/routeNames';
import LoanRequest from '../components/LoanRequest.vue';

export default {
  name: 'ViewEmployee',
  components: { LoanRequest, PaymentInfo },
  data() {
    return {
      absences: {},
      loanDialog: false,
      paymentInProgress: false,
      dialog: false,
      busy: false,
      show: false,
      vacation: false,
      message: '',
      snackbar: false,
      employee: {
        bankDetail: {},
        absences: {}
      },
      absenceEvents: [],
      salaryHeaders: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'paymentDate',
        },
        { text: 'Period start', value: 'periodStart' },
        { text: 'Period end', value: 'periodEnd' },
        { text: 'Amount', value: 'amount' },
        { text: 'Loan paid', value: 'loanPaidAmount' },
        { text: 'Status', value: 'status' }
      ],
      loanHeaders: [
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        { text: 'Due start', value: 'dueDate' },
        { text: 'Type', value: 'type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Comment', value: 'comment' }
      ],
      showVacationMenu: false,
      x: 0,
      y: 0,
      absenceEventColors: {},
      tab: 0,
      salaryColors: {
        processing: 'gray',
        success: 'green',
        failed: 'red'
      },
      employeeInfo: [],
      daysOff: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      totalSalary: 0,
      totalLoan: 0,
      unpaidLoan: 0,
      unpaidSalary: 0,
      accountError: '',
      bankDetail: {},
      loan: {}
    };
  },
  methods: {
    requestLeave() {
      if (this.$refs.leaveForm.validate()) {
        this.absences.endDate = new Date(new Date(this.absences.startDate)
          .getTime() + ((this.absences.days - 1) * 86400000))
          .toISOString().substr(0, 10);
        axios.post(`/employees/${this.employee.id}/leave`, this.absences)
          .then(() => {
            this.message = 'Vacation added successfully';
            this.snackbar = true;
            this.showVacationMenu = false;
            this.$refs.leaveForm.reset();
            this.getEmployee();
          })
          .catch(({ response }) => {
            this.message = response.data.message;
            this.snackbar = true;
          });
      }
    },
    cancelLoan() {
      this.dialog = false;
      this.loanDialog = false;
    },
    editProfile() {
      this.$router.push({ name: ROUTES.EDIT_EMPLOYEE });
    },
    resetBankDetail(oldValue) {
      this.dialog = false;
      this.accountError = null;
      this.bankDetail = { ...oldValue };
    },
    editBankDetail() {
      this.dialog = true;
      this.bankDetail = { ...this.employee.bankDetail };
    },
    getEmployee() {
      axios.get(`/employees/${this.$route.params.id}`)
        .then(({ data }) => {
          this.employee = data;
          if (!data.bankDetail) this.employee.bankDetail = {};
          const { bankDetail } = data;
          this.bankDetail = bankDetail;
          this.employee.salaries.reverse();

          this.curateEmployeeInfo(data);

          data.absences.forEach((absence) => {
            const end = new Date(absence.end_date);
            const arr = [];

            for (const dt = new Date(absence.start_date); dt <= end; dt.setDate(dt.getDate() + 1)) {
              const date = new Date(dt).toISOString().substr(0, 10);
              arr.push(date);
              this.absenceEventColors[date] = absence.type === 'unapproved' ? 'red' : 'green';
            }
            this.absenceEvents.push(...arr);
          });
        });
    },
    curateEmployeeInfo(employee) {
      this.employeeInfo = [
        { name: 'Employee date', value: employee.employmentDate },
        { name: 'Day off', value: this.daysOff[employee.dayOff] },
        { name: 'Department', value: employee.department },
        { name: 'Date of birth', value: employee.dateOfBirth },
        { name: 'Gender', value: employee.gender },
        { name: 'Farm', value: this.getFarm(employee.farm).name || '—' },
        { name: 'House', value: this.getHouse(employee.houseId, employee.farm) || '—' },
        { name: 'Level', value: employee.isManager ? 'Manager' : 'Staff' },
        { name: 'Salary', value: `₦${this.$options.filters.formatNumber(employee.salary)}` }
      ];
    },
    getFarm(id) {
      return this.farmLocations.find((farm) => farm.id === id) || {};
    },
    getHouse(id, farmId) {
      const farm = this.getFarm(farmId);
      return id ? farm.houses.find((house) => house.id === id).name : null;
    },
    absenceEvent(date) {
      if (!this.absenceEvents.includes(date)) {
        this.showVacationMenu = true;
        this.absences.startDate = date;
      }
    },
    updateBankDetail() {
      this.busy = true;
      this.accountError = '';
      const { bankCode } = this.bankDetail;
      const bankDetail = { ...this.bankDetail, ...{ bankCode: bankCode.toString().padStart(3, 0) } };
      axios[this.employee.bankDetail.id ? 'patch' : 'post'](`/employees/${this.employee.id}/bank-detail`, bankDetail)
        .then(() => {
          this.dialog = false;
          this.message = 'Bank detail updated successfully';
          this.snackbar = true;
          this.getEmployee();
        })
        .catch(({ response }) => {
          this.accountError = response.data.message;
        })
        .finally(() => {
          this.busy = false;
        });
    },
    paySalary() {
      if (this.paymentInProgress) return;
      this.paymentInProgress = true;
      axios.post(`/employees/${this.employee.id}/process-payment`, {})
        .then(() => {
          this.message = 'Salary payment in progress';
          this.snackbar = true;
          this.getEmployee();
        })
        .catch(({ response }) => {
          this.message = response.data.message;
          this.snackbar = true;
        })
        .finally(() => {
          this.paymentInProgress = false;
        });
    },
    addLoan() {
      axios.post(`/employees/${this.employee.id}/loan`, this.loan)
        .then(() => {
          this.message = 'Loan added successfully';
          this.snackbar = true;
          this.dialog = false;
          this.loanDialog = false;
          this.$refs.loan.reset();
          this.getEmployee();
        })
        .catch(({ response }) => {
          this.message = response.data.message;
          this.snackbar = true;
        });
    }
  },
  computed: {
    ...mapGetters({
      farmLocations: GETTER_TYPES.FARM_LOCATIONS
    }),
    avatar() {
      const avatar = this.employee.avatar || 'img/user.png';
      return `../${avatar}`;
    },
    employeeState() {
      return this.employee.isActive ? 'Active' : 'Inactive';
    }
  },
  created() {
    this.getEmployee();
  },
  filters: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
    }
  }
};
</script>

<style scoped>

</style>
