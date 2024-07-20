<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
        <input autocomplete="off" name="hidden" type="text" style="display:none;">
        <v-row>
          <v-col cols="12" v-if="error">
            <v-alert type="error" dense dismissible>{{ error }}</v-alert>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              label="Bank name*"
              hint="Name of the financial institution."
              persistent-hint
              required
              :rules="[v => !!v || 'Please choose a bank.']"
              v-model="value.bankCode"
              item-text="bankName"
              item-value="cbnCode"
              @change="value.accountNumber && getAccountName()"
              :items="bankCodes"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Account number"
              hint="Account number."
              persistent-hint
              v-model="value.accountNumber"
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
              :loading="isLoadingAccountName"
              v-model="value.accountName"
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
              v-model="value.intermediaryId"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-btn text class="float-left mt-6" @click="cancel">
        cancel
      </v-btn>
      <v-btn
        class="float-right mt-6"
        color="primary"
        tile
        :loading="loading"
        @click="save"
      >
        {{ buttonTitle }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'PaymentInfo',
  data() {
    return {
      cache: {},
      accountError: '',
      valid: false,
      isLoadingAccountName: false,
      bankCodes: [
        {
          bankName: '9mobile 9Payment Service Bank',
          cbnCode: 120001
        },
        {
          bankName: 'Abbey Mortgage Bank',
          cbnCode: 801
        },
        {
          bankName: 'Above Only MFB',
          cbnCode: 51204
        },
        {
          bankName: 'Abulesoro MFB',
          cbnCode: 51312
        },
        {
          bankName: 'Access Bank',
          cbnCode: 44
        },
        {
          bankName: 'Access Bank (Diamond)',
          cbnCode: 63
        },
        {
          bankName: 'Accion Microfinance Bank',
          cbnCode: 602
        },
        {
          bankName: 'Ahmadu Bello University Microfinance Bank',
          cbnCode: 50036
        },
        {
          bankName: 'Airtel Smartcash PSB',
          cbnCode: 120004
        },
        {
          bankName: 'AKU Microfinance Bank',
          cbnCode: 51336
        },
        {
          bankName: 'ALAT by WEMA',
          cbnCode: null
        },
        {
          bankName: 'Amju Unique MFB',
          cbnCode: 50926
        },
        {
          bankName: 'AMPERSAND MICROFINANCE BANK',
          cbnCode: 51341
        },
        {
          bankName: 'Aramoko MFB',
          cbnCode: 50083
        },
        {
          bankName: 'ASO Savings and Loans',
          cbnCode: 401
        },
        {
          bankName: 'Astrapolaris MFB LTD',
          cbnCode: null
        },
        {
          bankName: 'Bainescredit MFB',
          cbnCode: 51229
        },
        {
          bankName: 'Banc Corp Microfinance Bank',
          cbnCode: 50117
        },
        {
          bankName: 'Bowen Microfinance Bank',
          cbnCode: 50931
        },
        {
          bankName: 'Branch International Financial Services Limited',
          cbnCode: null
        },
        {
          bankName: 'Carbon',
          cbnCode: 565
        },
        {
          bankName: 'CASHCONNECT MFB',
          cbnCode: 865
        },
        {
          bankName: 'CEMCS Microfinance Bank',
          cbnCode: 50823
        },
        {
          bankName: 'Chanelle Microfinance Bank Limited',
          cbnCode: 50171
        },
        {
          bankName: 'Citibank Nigeria',
          cbnCode: 23
        },
        {
          bankName: 'Consumer Microfinance Bank',
          cbnCode: 50910
        },
        {
          bankName: 'Corestep MFB',
          cbnCode: 50204
        },
        {
          bankName: 'Coronation Merchant Bank',
          cbnCode: 559
        },
        {
          bankName: 'County Finance Limited',
          cbnCode: null
        },
        {
          bankName: 'Crescent MFB',
          cbnCode: 51297
        },
        {
          bankName: 'Dot Microfinance Bank',
          cbnCode: 50162
        },
        {
          bankName: 'Ecobank Nigeria',
          cbnCode: 50
        },
        {
          bankName: 'Ekimogun MFB',
          cbnCode: 50263
        },
        {
          bankName: 'Ekondo Microfinance Bank',
          cbnCode: 98
        },
        {
          bankName: 'Eyowo',
          cbnCode: 50126
        },
        {
          bankName: 'Fairmoney Microfinance Bank',
          cbnCode: 51318
        },
        {
          bankName: 'Fidelity Bank',
          cbnCode: 70
        },
        {
          bankName: 'Firmus MFB',
          cbnCode: 51314
        },
        {
          bankName: 'First Bank of Nigeria',
          cbnCode: 11
        },
        {
          bankName: 'First City Monument Bank',
          cbnCode: 214
        },
        {
          bankName: 'FirstTrust Mortgage Bank Nigeria',
          cbnCode: 107
        },
        {
          bankName: 'FLOURISH MFB',
          cbnCode: 50315
        },
        {
          bankName: 'FSDH Merchant Bank Limited',
          cbnCode: 501
        },
        {
          bankName: 'Gateway Mortgage Bank LTD',
          cbnCode: 812
        },
        {
          bankName: 'Globus Bank',
          cbnCode: 103
        },
        {
          bankName: 'GoMoney',
          cbnCode: 100022
        },
        {
          bankName: 'Goodnews Microfinance Bank',
          cbnCode: 50739
        },
        {
          bankName: 'Greenwich Merchant Bank',
          cbnCode: 562
        },
        {
          bankName: 'Guaranty Trust Bank',
          cbnCode: 58
        },
        {
          bankName: 'Hackman Microfinance Bank',
          cbnCode: 51251
        },
        {
          bankName: 'Hasal Microfinance Bank',
          cbnCode: 50383
        },
        {
          bankName: 'Heritage Bank',
          cbnCode: 30
        },
        {
          bankName: 'HopePSB',
          cbnCode: 120002
        },
        {
          bankName: 'Ibile Microfinance Bank',
          cbnCode: 51244
        },
        {
          bankName: 'Ikoyi Osun MFB',
          cbnCode: 50439
        },
        {
          bankName: 'Ilaro Poly Microfinance Bank',
          cbnCode: 50442
        },
        {
          bankName: 'Infinity MFB',
          cbnCode: 50457
        },
        {
          bankName: 'Jaiz Bank',
          cbnCode: 301
        },
        {
          bankName: 'Kadpoly MFB',
          cbnCode: 50502
        },
        {
          bankName: 'Keystone Bank',
          cbnCode: 82
        },
        {
          bankName: 'Kredi Money MFB LTD',
          cbnCode: 50200
        },
        {
          bankName: 'Kuda Bank',
          cbnCode: 50211
        },
        {
          bankName: 'Lagos Building Investment Company Plc.',
          cbnCode: 90052
        },
        {
          bankName: 'Links MFB',
          cbnCode: 50549
        },
        {
          bankName: 'Living Trust Mortgage Bank',
          cbnCode: 31
        },
        {
          bankName: 'Lotus Bank',
          cbnCode: 303
        },
        {
          bankName: 'Mayfair MFB',
          cbnCode: 50563
        },
        {
          bankName: 'Mint MFB',
          cbnCode: 50304
        },
        {
          bankName: 'Moniepoint MFB',
          cbnCode: 50515
        },
        {
          bankName: 'MTN Momo PSB',
          cbnCode: 120003
        },
        {
          bankName: 'Optimus Bank Limited',
          cbnCode: 107
        },
        {
          bankName: 'Paga',
          cbnCode: 100002
        },
        {
          bankName: 'PalmPay',
          cbnCode: 999991
        },
        {
          bankName: 'Parallex Bank',
          cbnCode: 104
        },
        {
          bankName: 'Parkway - ReadyCash',
          cbnCode: 311
        },
        {
          bankName: 'Paycom (Opay)',
          cbnCode: 999992
        },
        {
          bankName: 'Peace Microfinance Bank',
          cbnCode: 50743
        },
        {
          bankName: 'Personal Trust MFB',
          cbnCode: 51146
        },
        {
          bankName: 'Petra Mircofinance Bank Plc',
          cbnCode: 50746
        },
        {
          bankName: 'Polaris Bank',
          cbnCode: 76
        },
        {
          bankName: 'Polyunwana MFB',
          cbnCode: 50864
        },
        {
          bankName: 'PremiumTrust Bank',
          cbnCode: 105
        },
        {
          bankName: 'Providus Bank',
          cbnCode: 101
        },
        {
          bankName: 'QuickFund MFB',
          cbnCode: 51293
        },
        {
          bankName: 'Rand Merchant Bank',
          cbnCode: 502
        },
        {
          bankName: 'Refuge Mortgage Bank',
          cbnCode: 90067
        },
        {
          bankName: 'Rigo Microfinance Bank Limited',
          cbnCode: 51286
        },
        {
          bankName: 'ROCKSHIELD MICROFINANCE BANK',
          cbnCode: 50767
        },
        {
          bankName: 'Rubies MFB',
          cbnCode: 125
        },
        {
          bankName: 'Safe Haven MFB',
          cbnCode: 51113
        },
        {
          bankName: 'Safe Haven Microfinance Bank Limited',
          cbnCode: 951113
        },
        {
          bankName: 'Shield MFB',
          cbnCode: 50582
        },
        {
          bankName: 'Solid Allianze MFB',
          cbnCode: 51062
        },
        {
          bankName: 'Solid Rock MFB',
          cbnCode: 50800
        },
        {
          bankName: 'Sparkle Microfinance Bank',
          cbnCode: 51310
        },
        {
          bankName: 'Stanbic IBTC Bank',
          cbnCode: 221
        },
        {
          bankName: 'Standard Chartered Bank',
          cbnCode: 68
        },
        {
          bankName: 'Stellas MFB',
          cbnCode: 51253
        },
        {
          bankName: 'Sterling Bank',
          cbnCode: 232
        },
        {
          bankName: 'Suntrust Bank',
          cbnCode: 100
        },
        {
          bankName: 'Supreme MFB',
          cbnCode: 50968
        },
        {
          bankName: 'TAJ Bank',
          cbnCode: 302
        },
        {
          bankName: 'Tanadi Microfinance Bank',
          cbnCode: 90560
        },
        {
          bankName: 'Tangerine Money',
          cbnCode: 51269
        },
        {
          bankName: 'TCF MFB',
          cbnCode: 51211
        },
        {
          bankName: 'Titan Bank',
          cbnCode: 102
        },
        {
          bankName: 'Titan Paystack',
          cbnCode: 100039
        },
        {
          bankName: 'U&C Microfinance Bank Ltd (U AND C MFB)',
          cbnCode: 50840
        },
        {
          bankName: 'Uhuru MFB',
          cbnCode: null
        },
        {
          bankName: 'Unaab Microfinance Bank Limited',
          cbnCode: 50870
        },
        {
          bankName: 'Unical MFB',
          cbnCode: 50871
        },
        {
          bankName: 'Unilag Microfinance Bank',
          cbnCode: 51316
        },
        {
          bankName: 'Union Bank of Nigeria',
          cbnCode: 32
        },
        {
          bankName: 'United Bank For Africa',
          cbnCode: 33
        },
        {
          bankName: 'Unity Bank',
          cbnCode: 215
        },
        {
          bankName: 'VFD Microfinance Bank Limited',
          cbnCode: 566
        },
        {
          bankName: 'Waya Microfinance Bank',
          cbnCode: 51355
        },
        {
          bankName: 'Wema Bank',
          cbnCode: 35
        },
        {
          bankName: 'Zenith Bank',
          cbnCode: 57
        },
        {
          bankName: 'Zenith Bank',
          cbnCode: 57
        }
      ]
    };
  },
  props: ['value', 'loading', 'error'],
  computed: {
    buttonTitle() {
      return this.value.intermediaryId ? 'Add bank detail' : 'Update bank detail';
    }
  },
  methods: {
    save() {
      this.$emit('update', this.value);
      this.$emit('save', this.value);
    },
    cancel() {
      this.$emit('cancel', this.cache);
    },
    getAccountName() {
      this.value.accountName = '';
      this.accountError = '';
      this.isLoadingAccountName = true;
      const bankCode = this.value.bankCode.toString().padStart(3, 0);
      axios.get(`/employees/bank/resolve?accountNumber=${this.value.accountNumber}&bankCode=${bankCode}`)
        .then(({ data }) => {
          if (data.status) {
            this.value.accountName = data.data.account_name;
          } else this.accountError = data.message;
        })
        .finally(() => {
          this.isLoadingAccountName = false;
        });
    }
  },
  created() {
    this.cache = JSON.parse(JSON.stringify(this.value));
  }
};
</script>

<style scoped>

</style>
