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
          bankName: 'Access Bank Plc',
          cbnCode: 44,
          shortCode: 'ABP'
        },
        {
          bankName: 'Access Bank Plc (Diamond)',
          cbnCode: 63,
          shortCode: 'DBP'
        },
        {
          bankName: 'Ecobank Nigeria',
          cbnCode: 50,
          shortCode: 'ECO'
        },
        {
          bankName: 'Enterprise Bank Plc',
          cbnCode: 84,
          shortCode: 'ENB'
        },
        {
          bankName: 'Fidelity Bank Plc',
          cbnCode: 70,
          shortCode: 'FBP'
        },
        {
          bankName: 'First Bank of Nigeria Plc',
          cbnCode: 11,
          shortCode: 'FBN'
        },
        {
          bankName: 'First City Monument Bank',
          cbnCode: 214,
          shortCode: 'FCMB'
        },
        {
          bankName: 'Guaranty Trust Bank Plc',
          cbnCode: 58,
          shortCode: 'GTB'
        },
        {
          bankName: 'Heritage Bank',
          cbnCode: 30,
          shortCode: 'HBP'
        },
        {
          bankName: 'Jaiz Bank',
          cbnCode: 301,
          shortCode: 'JAIZ'
        },
        {
          bankName: 'Keystone Bank Ltd',
          cbnCode: 82,
          shortCode: 'KSB'
        },
        {
          bankName: 'Mainstreet Bank Plc',
          cbnCode: 14,
          shortCode: 'MSB'
        },
        {
          bankName: 'Polaris Bank',
          cbnCode: 76,
          shortCode: 'SKYE'
        },
        {
          bankName: 'Stanbic IBTC Plc',
          cbnCode: 39,
          shortCode: 'STANBIC'
        },
        {
          bankName: 'Sterling Bank Plc',
          cbnCode: 232,
          shortCode: 'SBP'
        },
        {
          bankName: 'Union Bank Nigeria Plc',
          cbnCode: 32,
          shortCode: 'UBN'
        },
        {
          bankName: 'United Bank for Africa Plc',
          cbnCode: 33,
          shortCode: 'UBA'
        },
        {
          bankName: 'Unity Bank Plc',
          cbnCode: 215,
          shortCode: 'UNITY'
        },
        {
          bankName: 'WEMA Bank Plc',
          cbnCode: 35,
          shortCode: 'WEMA'
        },
        {
          bankName: 'Zenith Bank International',
          cbnCode: 57,
          shortCode: 'ZIB'
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
