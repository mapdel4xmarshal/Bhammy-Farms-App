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
          cbnCode: '120001',
          bankName: '9 payment service Bank',
          shortCode: '9 Payment',
          institutioncbnCode: '120001'
        },
        {
          cbnCode: '050005',
          bankName: 'AAA FINANCE',
          shortCode: 'AAA FINANCE',
          institutioncbnCode: '050005'
        },
        {
          cbnCode: '090270',
          bankName: 'AB Microfinance bank',
          shortCode: 'AB MFB',
          institutioncbnCode: '090270'
        },
        {
          cbnCode: '070010',
          bankName: 'ABBEY MORTGAGE BANK',
          shortCode: 'ABBEY MORTGAGE BANK',
          institutioncbnCode: '070010'
        },
        {
          cbnCode: '090260',
          bankName: 'Above Only Microfinance bank',
          shortCode: 'ABOVE ONLY MFB',
          institutioncbnCode: '090260'
        },
        {
          cbnCode: '090197',
          bankName: 'ABU Microfinance bank',
          shortCode: 'ABU MFB',
          institutioncbnCode: '090197'
        },
        {
          cbnCode: '090424',
          bankName: 'Abucoop  Microfinance Bank',
          shortCode: 'Abucoop  MFB',
          institutioncbnCode: '090424'
        },
        {
          cbnCode: '090545',
          bankName: 'ABULESORO MICROFINANCE BANK LTD',
          shortCode: 'ABULESORO MICROFINANCE BANK LTD',
          institutioncbnCode: '090545'
        },
        {
          cbnCode: '090202',
          bankName: 'Accelerex network',
          shortCode: 'ACCELEREX MFB',
          institutioncbnCode: '090202'
        },
        {
          cbnCode: '044',
          bankName: 'Access Bank',
          shortCode: 'ACCESS',
          institutioncbnCode: '000014'
        },
        {
          cbnCode: '063',
          bankName: 'Access Bank Plc (Diamond)',
          shortCode: 'Access Bank Plc (Diamond)',
          institutioncbnCode: '000005'
        },
        {
          cbnCode: '100013',
          bankName: 'Access Money',
          shortCode: 'ACCESS MONEY',
          institutioncbnCode: '100013'
        },
        {
          cbnCode: '100052',
          bankName: 'Access Yello &amp; Beta',
          shortCode: 'ACCESS YELLO &amp;amp; BETA',
          institutioncbnCode: '100052'
        },
        {
          cbnCode: '090134',
          bankName: 'ACCION MFB',
          shortCode: 'ACCION MICROFINANCE',
          institutioncbnCode: '090134'
        },
        {
          cbnCode: '090483',
          bankName: 'Ada MFB',
          shortCode: 'ADA MFB',
          institutioncbnCode: '090483'
        },
        {
          cbnCode: '090160',
          bankName: 'Addosser MFBB',
          shortCode: 'ADDOSSER MICROFINANCE',
          institutioncbnCode: '090160'
        },
        {
          cbnCode: '090268',
          bankName: 'Adeyemi College Staff Microfinance bank',
          shortCode: 'ADEYEMI COLLEGE STAFF MFB',
          institutioncbnCode: '090268'
        },
        {
          cbnCode: '090155',
          bankName: 'ADVANS LA FAYETTE MFB',
          shortCode: 'ADVANS LA FAYETTE MFB',
          institutioncbnCode: '090155'
        },
        {
          cbnCode: '090292',
          bankName: 'Afekhafe MFB',
          shortCode: 'Afekhafe MFB',
          institutioncbnCode: '090292'
        },
        {
          cbnCode: '090518',
          bankName: 'Afemai Microfinance Bank',
          shortCode: 'Afemai Microfinance Bank',
          institutioncbnCode: '090518'
        },
        {
          cbnCode: '100028',
          bankName: 'AG MORTGAGE BANK PLC',
          shortCode: 'AG MORTGAGE BANK',
          institutioncbnCode: '100028'
        },
        {
          cbnCode: '090371',
          bankName: 'Agosasa MICROFINANCE BANK',
          shortCode: 'AGOSASA MFB',
          institutioncbnCode: '090371'
        },
        {
          cbnCode: '090531',
          bankName: 'Aku MFB',
          shortCode: 'Aku MFB',
          institutioncbnCode: '090531'
        },
        {
          cbnCode: '090561',
          bankName: 'AKUCHUKWU MICROFINANCE BANK LTD',
          shortCode: 'AKUCHUKWU MICROFINANCE BANK LTD',
          institutioncbnCode: '090561'
        },
        {
          cbnCode: '070025',
          bankName: 'Akwa savings &amp; Loans Limited',
          shortCode: 'Akwa savings &amp;amp; Loans Limited',
          institutioncbnCode: '070025'
        },
        {
          cbnCode: '090133',
          bankName: 'AL-BARKAH MFB',
          shortCode: 'AL-BARKAH MICROFINANCE',
          institutioncbnCode: '090133'
        },
        {
          cbnCode: '090259',
          bankName: 'Alekun Microfinance bank',
          shortCode: 'ALEKUN MFB',
          institutioncbnCode: '090259'
        },
        {
          cbnCode: '090297',
          bankName: 'Alert MFB',
          shortCode: 'ALERT MFB',
          institutioncbnCode: '090297'
        },
        {
          cbnCode: '090277',
          bankName: 'Alhayat MFB',
          shortCode: 'Alhayat MFB',
          institutioncbnCode: '090277'
        },
        {
          cbnCode: '090131',
          bankName: 'ALLWORKERS MFB',
          shortCode: 'ALLWORKERS MICROFINANCE',
          institutioncbnCode: '090131'
        },
        {
          cbnCode: '090169',
          bankName: 'Alphakapital MFB',
          shortCode: 'ALPHAKAPITAL MFB',
          institutioncbnCode: '090169'
        },
        {
          cbnCode: '090489',
          bankName: 'Alvana Microfinance Bank',
          shortCode: 'ALVANA MFB',
          institutioncbnCode: '090489'
        },
        {
          cbnCode: '090394',
          bankName: 'Amac Microfinance Bank',
          shortCode: 'AMAC MFB',
          institutioncbnCode: '090394'
        },
        {
          cbnCode: '090629',
          bankName: 'AMEGY MICROFINANCE BANK',
          shortCode: 'AMEGY MICROFINANCE BANK',
          institutioncbnCode: '090629'
        },
        {
          cbnCode: '090180',
          bankName: 'Amju MFB',
          shortCode: 'AMJU MFB',
          institutioncbnCode: '090180'
        },
        {
          cbnCode: '090116',
          bankName: 'AMML MFB',
          shortCode: 'AMML MICROFINANCE',
          institutioncbnCode: '090116'
        },
        {
          cbnCode: '090529',
          bankName: 'Ampersand Microfinance bank',
          shortCode: 'Ampersand Microfinance bank',
          institutioncbnCode: '090529'
        },
        {
          cbnCode: '090476',
          bankName: 'Anchorage MFB',
          shortCode: 'ANCHORAGE MFB',
          institutioncbnCode: '090476'
        },
        {
          cbnCode: '090469',
          bankName: 'Aniocha MFB',
          shortCode: 'ANIOCHA MFB',
          institutioncbnCode: '090469'
        },
        {
          cbnCode: '090376',
          bankName: 'Apple  MICROFINANCE BANK',
          shortCode: 'APPLE MFB',
          institutioncbnCode: '090376'
        },
        {
          cbnCode: '090307',
          bankName: 'Aramoko Microfinance Bank',
          shortCode: 'Aramoko Microfinance Bank',
          institutioncbnCode: '090307'
        },
        {
          cbnCode: '110011',
          bankName: 'ARCA PAYMENTS COMPANY LIMITED',
          shortCode: 'ARCA PAYMENTS',
          institutioncbnCode: '110011'
        },
        {
          cbnCode: '090282',
          bankName: 'Arise MFB',
          shortCode: 'Arise MFB',
          institutioncbnCode: '090282'
        },
        {
          cbnCode: '041',
          bankName: 'ASOSavings',
          shortCode: 'ASO',
          institutioncbnCode: '090001'
        },
        {
          cbnCode: '090544',
          bankName: 'ASPIRE MICROFINANCE BANK LTD',
          shortCode: 'ASPIRE MICROFINANCE BANK LTD',
          institutioncbnCode: '090544'
        },
        {
          cbnCode: '090287',
          bankName: 'Assets Matrix MFB',
          shortCode: 'Assets Matrix MFB',
          institutioncbnCode: '090287'
        },
        {
          cbnCode: '090473',
          bankName: 'ASSETS Microfinance Bank',
          shortCode: 'ASSETS MFB',
          institutioncbnCode: '090473'
        },
        {
          cbnCode: '090172',
          bankName: 'Astrapolis MFB',
          shortCode: 'ASTRAPOLIS MFB',
          institutioncbnCode: '090172'
        },
        {
          cbnCode: '090451',
          bankName: 'ATBU  Microfinance Bank',
          shortCode: 'ATBU  MFB',
          institutioncbnCode: '090451'
        },
        {
          cbnCode: '090264',
          bankName: 'Auchi Microfinance bank',
          shortCode: 'AUCHI MFB',
          institutioncbnCode: '090264'
        },
        {
          cbnCode: '090600',
          bankName: 'AVE MARIA MICROFINANCE BANK LTD',
          shortCode: 'AVE MARIA MICROFINANCE BANK LTD',
          institutioncbnCode: '090600'
        },
        {
          cbnCode: '090478',
          bankName: 'Avuenegbe MFB',
          shortCode: 'AVUENEGBE MFB',
          institutioncbnCode: '090478'
        },
        {
          cbnCode: '090633',
          bankName: 'Awacash Microfinance Bank',
          shortCode: 'Awacash Microfinance Bank',
          institutioncbnCode: '090633'
        },
        {
          cbnCode: '090540',
          bankName: 'Aztec Microfinance Bank',
          shortCode: 'Aztec Microfinance Bank',
          institutioncbnCode: '090540'
        },
        {
          cbnCode: '090188',
          bankName: 'Baines Credit MFB',
          shortCode: 'BAINES CREDIT MFB',
          institutioncbnCode: '090188'
        },
        {
          cbnCode: '090563',
          bankName: 'BALERA MICROFINANCE BANK LTD',
          shortCode: 'BALERA MICROFINANCE BANK LTD',
          institutioncbnCode: '090563'
        },
        {
          cbnCode: '090181',
          bankName: 'Balogun Fulani  Microfinance Bank',
          shortCode: 'Balogun Fulani  MFB',
          institutioncbnCode: '090181'
        },
        {
          cbnCode: '090326',
          bankName: 'Balogun Gambari MFB',
          shortCode: 'Balogun Gambari MFB',
          institutioncbnCode: '090326'
        },
        {
          cbnCode: '090425',
          bankName: 'Banex Microfinance Bank',
          shortCode: 'Banex MFB',
          institutioncbnCode: '090425'
        },
        {
          cbnCode: '090136',
          bankName: 'Baobab Microfinance Bank',
          shortCode: 'BAOBAB MICROFINANCE BANK',
          institutioncbnCode: '090136'
        },
        {
          cbnCode: '090316',
          bankName: 'Bayero MICROFINANCE BANK',
          shortCode: 'Bayero MFB',
          institutioncbnCode: '090316'
        },
        {
          cbnCode: '090127',
          bankName: 'BC Kash MFB',
          shortCode: 'BC KASH MICROFINANCE',
          institutioncbnCode: '090127'
        },
        {
          cbnCode: '090413',
          bankName: 'Benysta Microfinance Bank',
          shortCode: 'Benysta MFB',
          institutioncbnCode: '090413'
        },
        {
          cbnCode: '090615',
          bankName: 'Beststar MFB',
          shortCode: 'Beststar MFB',
          institutioncbnCode: '090615'
        },
        {
          cbnCode: '090538',
          bankName: 'Blue Investments Microfinance Bank',
          shortCode: 'Blue Investments Microfinance Bank',
          institutioncbnCode: '090538'
        },
        {
          cbnCode: '090117',
          bankName: 'Boctrust Microfinance Bank',
          shortCode: 'BOCTRUST MFBANK',
          institutioncbnCode: '090117'
        },
        {
          cbnCode: '090444',
          bankName: 'BOI MF Bank',
          shortCode: 'BOI MFB',
          institutioncbnCode: '090444'
        },
        {
          cbnCode: '090494',
          bankName: 'Boji Boji Microfinance Bank',
          shortCode: 'Boji Boji Microfinance Bank',
          institutioncbnCode: '090494'
        },
        {
          cbnCode: '090319',
          bankName: 'Bonghe Microfinance Bank',
          shortCode: 'Bonghe MFB',
          institutioncbnCode: '090319'
        },
        {
          cbnCode: '090395',
          bankName: 'Borgu MFB',
          shortCode: 'BORGU MFB',
          institutioncbnCode: '090395'
        },
        {
          cbnCode: '090508',
          bankName: 'Borno Renaissance Microfinance bank',
          shortCode: 'Borno Renaissance Microfinance bank',
          institutioncbnCode: '090508'
        },
        {
          cbnCode: '090501',
          bankName: 'Boromu Microfinance bank',
          shortCode: 'Boromu Microfinance bank',
          institutioncbnCode: '090501'
        },
        {
          cbnCode: '090454',
          bankName: 'Borstal Microfinance Bank',
          shortCode: 'Borstal MFB',
          institutioncbnCode: '090454'
        },
        {
          cbnCode: '090176',
          bankName: 'Bosak MFB',
          shortCode: 'BOSAK MFB',
          institutioncbnCode: '090176'
        },
        {
          cbnCode: '090148',
          bankName: 'Bowen MFB',
          shortCode: 'Bowen MFB',
          institutioncbnCode: '090148'
        },
        {
          cbnCode: '050006',
          bankName: 'Branch International Financial Services',
          shortCode: 'Branch International Financial Services',
          institutioncbnCode: '050006'
        },
        {
          cbnCode: '070015',
          bankName: 'Brent Mortgage Bank',
          shortCode: 'Brent Mortgage',
          institutioncbnCode: '070015'
        },
        {
          cbnCode: '090293',
          bankName: 'BRETHREN MICROFINANCE BANK',
          shortCode: 'BRETHREN MICROFINANCE BANK',
          institutioncbnCode: '090293'
        },
        {
          cbnCode: '090308',
          bankName: 'Brightway MFB',
          shortCode: 'BRIGHTWAY MFB',
          institutioncbnCode: '090308'
        },
        {
          cbnCode: '090568',
          bankName: 'BROADVIEW MICROFINANCE BANK LTD',
          shortCode: 'BROADVIEW MICROFINANCE BANK LTD',
          institutioncbnCode: '090568'
        },
        {
          cbnCode: '090512',
          bankName: 'BUBAYERO Microfinance Bank',
          shortCode: 'BUBAYERO Microfinance Bank',
          institutioncbnCode: '090512'
        },
        {
          cbnCode: '110021',
          bankName: 'Bud infrastructure Limited',
          shortCode: 'Bud infrastructure Limited',
          institutioncbnCode: '110021'
        },
        {
          cbnCode: '090509',
          bankName: 'CAPITALMETRIQ SWIFT MICROFINANCE BANK',
          shortCode: 'CAPITALMETRIQ SWIFT MICROFINANCE BANK',
          institutioncbnCode: '090509'
        },
        {
          cbnCode: '110023',
          bankName: 'Capricorn Digital',
          shortCode: 'Capricorn Digital',
          institutioncbnCode: '110023'
        },
        {
          cbnCode: '090445',
          bankName: 'Capstone MF Bank',
          shortCode: 'Capstone MFB',
          institutioncbnCode: '090445'
        },
        {
          cbnCode: '100026',
          bankName: 'CARBON',
          shortCode: 'CARBON',
          institutioncbnCode: '100026'
        },
        {
          cbnCode: '090472',
          bankName: 'CARETAKER Microfinance Bank',
          shortCode: 'CARETAKER MFB',
          institutioncbnCode: '090472'
        },
        {
          cbnCode: '090634',
          bankName: 'CASHBRIDGE MICROFINANCE BANK',
          shortCode: 'CASHBRIDGE MICROFINANCE BANK',
          institutioncbnCode: '090634'
        },
        {
          cbnCode: '090360',
          bankName: 'Cashconnect   MICROFINANCE BANK',
          shortCode: 'CASHCONNECT MFB',
          institutioncbnCode: '090360'
        },
        {
          cbnCode: '090498',
          bankName: 'Catland Microfinance Bank',
          shortCode: 'Catland MFB',
          institutioncbnCode: '090498'
        },
        {
          cbnCode: '090562',
          bankName: 'CEDAR MICROFINANCE BANK LTD',
          shortCode: 'CEDAR MICROFINANCE BANK LTD',
          institutioncbnCode: '090562'
        },
        {
          cbnCode: '317',
          bankName: 'Cellulant',
          shortCode: 'CELLULANT',
          institutioncbnCode: '100005'
        },
        {
          cbnCode: '110012',
          bankName: 'Cellulant PSSP',
          shortCode: 'Cellulant PSSP',
          institutioncbnCode: '110012'
        },
        {
          cbnCode: '090154',
          bankName: 'CEMCS MFB',
          shortCode: 'CEMCS MICROFINANCE',
          institutioncbnCode: '090154'
        },
        {
          cbnCode: '000028',
          bankName: 'Central Bank of Nigeria',
          shortCode: 'CENTRAL BANK OF NIGERIA',
          institutioncbnCode: '000028'
        },
        {
          cbnCode: '090397',
          bankName: 'Chanelle MicroFinance Bank',
          shortCode: 'CHANELLE MFB',
          institutioncbnCode: '090397'
        },
        {
          cbnCode: '090523',
          bankName: 'Chase Microfinance bank',
          shortCode: 'Chase Microfinance bank',
          institutioncbnCode: '090523'
        },
        {
          cbnCode: '090416',
          bankName: 'Chibueze Microfinance Bank',
          shortCode: 'Chibueze MFB',
          institutioncbnCode: '090416'
        },
        {
          cbnCode: '090141',
          bankName: 'Chikum Microfinance Bank',
          shortCode: 'Chikum MFB',
          institutioncbnCode: '090141'
        },
        {
          cbnCode: '090490',
          bankName: 'Chukwunenye  Microfinance Bank',
          shortCode: 'CHUKWUNENYE MFB',
          institutioncbnCode: '090490'
        },
        {
          cbnCode: '090480',
          bankName: 'Cintrust MFB',
          shortCode: 'CINTRUST MFB',
          institutioncbnCode: '090480'
        },
        {
          cbnCode: '090144',
          bankName: 'CIT Microfinance Bank',
          shortCode: 'CIT MFB',
          institutioncbnCode: '090144'
        },
        {
          cbnCode: '023',
          bankName: 'Citi Bank',
          shortCode: 'CITI',
          institutioncbnCode: '000009'
        },
        {
          cbnCode: '090343',
          bankName: 'Citizen Trust Microfinance Bank Ltd',
          shortCode: 'CITIZEN TRUST MFB',
          institutioncbnCode: '090343'
        },
        {
          cbnCode: '090511',
          bankName: 'Cloverleaf  MFB',
          shortCode: 'Cloverleaf  MFB',
          institutioncbnCode: '090511'
        },
        {
          cbnCode: '090254',
          bankName: 'CoalCamp Microfinance Bank',
          shortCode: 'CoalCamp MFB',
          institutioncbnCode: '090254'
        },
        {
          cbnCode: '090374',
          bankName: 'Coastline MICROFINANCE BANK',
          shortCode: 'COASTLINE MFB',
          institutioncbnCode: '090374'
        },
        {
          cbnCode: '090530',
          bankName: 'CONFIDENCE MICROFINANCE BANK LTD',
          shortCode: 'CONFIDENCE MICROFINANCE BANK LTD',
          institutioncbnCode: '090530'
        },
        {
          cbnCode: '090553',
          bankName: 'CONSISTENT TRUST MICROFINANCE BANK LTD',
          shortCode: 'CONSISTENT TRUST MICROFINANCE BANK LTD',
          institutioncbnCode: '090553'
        },
        {
          cbnCode: '090130',
          bankName: 'CONSUMER  MFB',
          shortCode: 'CONSUMER MICROFINANCE',
          institutioncbnCode: '090130'
        },
        {
          cbnCode: '070021',
          bankName: 'Cooperative Mortgage Bank',
          shortCode: 'Cooperative Mortgage Bank',
          institutioncbnCode: '070021'
        },
        {
          cbnCode: '090365',
          bankName: 'Corestep MICROFINANCE BANK',
          shortCode: 'CORESTEP MFB',
          institutioncbnCode: '090365'
        },
        {
          cbnCode: '559',
          bankName: 'Coronation',
          shortCode: 'CORONATION',
          institutioncbnCode: '060001'
        },
        {
          cbnCode: '050001',
          bankName: 'COUNTY FINANCE LTD',
          shortCode: 'COUNTY FINANCE LTD',
          institutioncbnCode: '050001'
        },
        {
          cbnCode: '070006',
          bankName: 'Covenant',
          shortCode: 'CONVENANT',
          institutioncbnCode: '070006'
        },
        {
          cbnCode: '090611',
          bankName: 'Creditville MFB',
          shortCode: 'Creditville MFB',
          institutioncbnCode: '090611'
        },
        {
          cbnCode: '090526',
          bankName: 'Crescent Microfinance bank',
          shortCode: 'Crescent Microfinance bank',
          institutioncbnCode: '090526'
        },
        {
          cbnCode: '090429',
          bankName: 'CrossRiver  Microfinance Bank',
          shortCode: 'CrossRiver  MFB',
          institutioncbnCode: '090429'
        },
        {
          cbnCode: '110017',
          bankName: 'CROWDFORCE',
          shortCode: 'CROWDFORCE',
          institutioncbnCode: '110017'
        },
        {
          cbnCode: '090414',
          bankName: 'Crutech  Microfinance Bank',
          shortCode: 'Crutech  MFB',
          institutioncbnCode: '090414'
        },
        {
          cbnCode: '050017',
          bankName: 'CS Advance',
          shortCode: 'CS Advance',
          institutioncbnCode: '050017'
        },
        {
          cbnCode: '110014',
          bankName: 'Cyberspace Limited',
          shortCode: 'Cyberspace',
          institutioncbnCode: '110014'
        },
        {
          cbnCode: '090596',
          bankName: 'DAL Microfinance Bank',
          shortCode: 'DAL Microfinance Bank',
          institutioncbnCode: '090596'
        },
        {
          cbnCode: '090391',
          bankName: 'Davodani  Microfinance Bank',
          shortCode: 'DAVODANI MFB',
          institutioncbnCode: '090391'
        },
        {
          cbnCode: '090167',
          bankName: 'Daylight Microfinance Bank',
          shortCode: 'DAYLIGHT MFB',
          institutioncbnCode: '090167'
        },
        {
          cbnCode: '070023',
          bankName: 'Delta Trust Mortgage bank',
          shortCode: 'Delta Trust Mortgage bank',
          institutioncbnCode: '070023'
        },
        {
          cbnCode: '050013',
          bankName: 'Dignity Finance',
          shortCode: 'Dignity Finance',
          institutioncbnCode: '050013'
        },
        {
          cbnCode: '090470',
          bankName: 'DOT MICROFINANCE BANK',
          shortCode: 'CHANGAN RTS MFB',
          institutioncbnCode: '090470'
        },
        {
          cbnCode: '090156',
          bankName: 'e-BARCs MFB',
          shortCode: 'E-BARCS MICROFINANCE',
          institutioncbnCode: '090156'
        },
        {
          cbnCode: '050016',
          bankName: 'E-Finance',
          shortCode: 'E-Finance',
          institutioncbnCode: '050016'
        },
        {
          cbnCode: '000033',
          bankName: 'e-Naira',
          shortCode: 'e-Naira',
          institutioncbnCode: '000033'
        },
        {
          cbnCode: '090294',
          bankName: 'Eagle Flight MFB',
          shortCode: 'EAGLE FLIGHT MFB',
          institutioncbnCode: '090294'
        },
        {
          cbnCode: '090427',
          bankName: 'EBSU MICROFINANCE Bank',
          shortCode: 'EBSU MFB',
          institutioncbnCode: '090427'
        },
        {
          cbnCode: '100030',
          bankName: 'Eco mobile',
          shortCode: 'ECOBANK XPRESS',
          institutioncbnCode: '100030'
        },
        {
          cbnCode: '050',
          bankName: 'Ecobank Bank',
          shortCode: 'ECOBANK',
          institutioncbnCode: '000010'
        },
        {
          cbnCode: '307',
          bankName: 'EcoMobile',
          shortCode: 'ECOBANK MOBILE',
          institutioncbnCode: '100008'
        },
        {
          cbnCode: '090310',
          bankName: 'Edfin MFB',
          shortCode: 'EDFIN MFB',
          institutioncbnCode: '090310'
        },
        {
          cbnCode: '090556',
          bankName: 'EGWAFIN MICROFINANCE BANK LTD',
          shortCode: 'EGWAFIN MICROFINANCE BANK LTD',
          institutioncbnCode: '090556'
        },
        {
          cbnCode: '090389',
          bankName: 'EK-Reliable Microfinance Bank',
          shortCode: 'EK-RELIABLE MFB',
          institutioncbnCode: '090389'
        },
        {
          cbnCode: '090552',
          bankName: 'EKIMOGUN MICROFINANCE BANK',
          shortCode: 'EKIMOGUN MICROFINANCE BANK',
          institutioncbnCode: '090552'
        },
        {
          cbnCode: '090097',
          bankName: 'Ekondo MFB',
          shortCode: 'EKONDO MICROFINANCE',
          institutioncbnCode: '090097'
        },
        {
          cbnCode: '090273',
          bankName: 'Emeralds MFB',
          shortCode: 'Emeralds MFB',
          institutioncbnCode: '090273'
        },
        {
          cbnCode: '090114',
          bankName: 'EMPIRE MFB',
          shortCode: 'EMPIRE MICROFINANCE',
          institutioncbnCode: '090114'
        },
        {
          cbnCode: '050012',
          bankName: 'Enco Finance',
          shortCode: 'Enco Finance',
          institutioncbnCode: '050012'
        },
        {
          cbnCode: '090539',
          bankName: 'Enrich Microfinance Bank',
          shortCode: 'Enrich Microfinance Bank',
          institutioncbnCode: '090539'
        },
        {
          cbnCode: '084',
          bankName: 'Enterprise Bank',
          shortCode: 'ENT BANK',
          institutioncbnCode: '000019'
        },
        {
          cbnCode: '090166',
          bankName: 'Eso-E Microfinance Bank',
          shortCode: 'ESO-E MFB',
          institutioncbnCode: '090166'
        },
        {
          cbnCode: '306',
          bankName: 'eTranzact',
          shortCode: 'E-TRANZACT',
          institutioncbnCode: '100006'
        },
        {
          cbnCode: '090304',
          bankName: 'Evangel MFB',
          shortCode: 'Evangel MFB',
          institutioncbnCode: '090304'
        },
        {
          cbnCode: '090332',
          bankName: 'Evergreen MICROFINANCE BANK',
          shortCode: 'Evergreen MFB',
          institutioncbnCode: '090332'
        },
        {
          cbnCode: '090572',
          bankName: 'EWT Microfinance Bank',
          shortCode: 'EWT Microfinance Bank',
          institutioncbnCode: '090572'
        },
        {
          cbnCode: '090328',
          bankName: 'Eyowo MICROFINANCE BANK',
          shortCode: 'Eyowo MFB',
          institutioncbnCode: '090328'
        },
        {
          cbnCode: '090551',
          bankName: 'FAIRMONEY MICROFINANCE BANK LTD',
          shortCode: 'FAIRMONEY MICROFINANCE BANK LTD',
          institutioncbnCode: '090551'
        },
        {
          cbnCode: '090330',
          bankName: 'FAME Microfinance Bank',
          shortCode: 'FAME MFB',
          institutioncbnCode: '090330'
        },
        {
          cbnCode: '050009',
          bankName: 'FAST CREDIT',
          shortCode: 'FAST CREDIT',
          institutioncbnCode: '050009'
        },
        {
          cbnCode: '090179',
          bankName: 'FAST MFB',
          shortCode: 'FAST MFB',
          institutioncbnCode: '090179'
        },
        {
          cbnCode: '911',
          bankName: 'FBN merchant Bank',
          shortCode: 'FBN MERCHANT BANK',
          institutioncbnCode: '060002'
        },
        {
          cbnCode: '214',
          bankName: 'FCMB',
          shortCode: 'FCMB',
          institutioncbnCode: '000003'
        },
        {
          cbnCode: '090409',
          bankName: 'FCMB BETA',
          shortCode: 'FCMB BETA',
          institutioncbnCode: '090409'
        },
        {
          cbnCode: '100031',
          bankName: 'FCMB Easy Account',
          shortCode: 'FCMB MOBILE',
          institutioncbnCode: '100031'
        },
        {
          cbnCode: '090398',
          bankName: 'Federal Polytechnic Nekede Microfinance Bank',
          shortCode: 'FED POLY NEKEDE MFB',
          institutioncbnCode: '090398'
        },
        {
          cbnCode: '090318',
          bankName: 'FEDERAL UNIVERSITY DUTSE  MICROFINANCE BANK',
          shortCode: 'FEDERAL UNIVERSITY DUTSE  MFB',
          institutioncbnCode: '090318'
        },
        {
          cbnCode: '090298',
          bankName: 'FederalPoly NasarawaMFB',
          shortCode: 'FEDERALPOLY NASARAWAMFB',
          institutioncbnCode: '090298'
        },
        {
          cbnCode: '090482',
          bankName: 'Fedeth MFB',
          shortCode: 'FEDETH MFB',
          institutioncbnCode: '090482'
        },
        {
          cbnCode: '314',
          bankName: 'FET',
          shortCode: 'FET',
          institutioncbnCode: '100001'
        },
        {
          cbnCode: '050002',
          bankName: 'FEWCHORE FINANCE COMPANY LIMITED',
          shortCode: 'FEWCHORE FINANCE COMPANY LIMITED',
          institutioncbnCode: '050002'
        },
        {
          cbnCode: '090153',
          bankName: 'FFS Microfinance Bank',
          shortCode: 'FFS MICROFINANCE',
          institutioncbnCode: '090153'
        },
        {
          cbnCode: '070026',
          bankName: 'FHA MORTGAGE BANK LTD',
          shortCode: 'FHA MORTGAGE BANK LTD',
          institutioncbnCode: '070026'
        },
        {
          cbnCode: '070',
          bankName: 'Fidelity Bank',
          shortCode: 'FIDELITY',
          institutioncbnCode: '000007'
        },
        {
          cbnCode: '100019',
          bankName: 'Fidelity Mobile',
          shortCode: 'FIDELITY MOBILE',
          institutioncbnCode: '100019'
        },
        {
          cbnCode: '090126',
          bankName: 'FidFund MFB',
          shortCode: 'FIDFUND MICROFINANCE',
          institutioncbnCode: '090126'
        },
        {
          cbnCode: '090507',
          bankName: 'FIMS MFB',
          shortCode: 'FIMS MFB',
          institutioncbnCode: '090507'
        },
        {
          cbnCode: '090111',
          bankName: 'FinaTrust Microfinance Bank',
          shortCode: 'FINATRUST MICROFINANCE',
          institutioncbnCode: '090111'
        },
        {
          cbnCode: '090400',
          bankName: 'Finca Microfinance Bank',
          shortCode: 'FINCA MFB',
          institutioncbnCode: '090400'
        },
        {
          cbnCode: '090366',
          bankName: 'Firmus MICROFINANCE BANK',
          shortCode: 'FIRMUS MFB',
          institutioncbnCode: '090366'
        },
        {
          cbnCode: '011',
          bankName: 'First Bank of Nigeria',
          shortCode: 'FBN',
          institutioncbnCode: '000016'
        },
        {
          cbnCode: '070014',
          bankName: 'First Generation Mortgage Bank',
          shortCode: 'First Generation Mortgage',
          institutioncbnCode: '070014'
        },
        {
          cbnCode: '090479',
          bankName: 'First Heritage MFB',
          shortCode: 'FIRST HERITAGE MFB',
          institutioncbnCode: '090479'
        },
        {
          cbnCode: '090285',
          bankName: 'First Option MFB',
          shortCode: 'First Option MFB',
          institutioncbnCode: '090285'
        },
        {
          cbnCode: '090164',
          bankName: 'First Royal Microfinance Bank',
          shortCode: 'FIRST ROYAL MICROFINANCE',
          institutioncbnCode: '090164'
        },
        {
          cbnCode: '413',
          bankName: 'First Trust Mortgage Bank Plc',
          shortCode: 'First Trust Mortgage Bank Plc',
          institutioncbnCode: '090107'
        },
        {
          cbnCode: '090575',
          bankName: 'FIRSTMIDAS MICROFINANCE BANK LTD',
          shortCode: 'FIRSTMIDAS MICROFINANCE BANK LTD',
          institutioncbnCode: '090575'
        },
        {
          cbnCode: '309',
          bankName: 'Firstmonie Wallet',
          shortCode: 'Firstmonie',
          institutioncbnCode: '100014'
        },
        {
          cbnCode: '090614',
          bankName: 'Flourish MFB',
          shortCode: 'Flourish MFB',
          institutioncbnCode: '090614'
        },
        {
          cbnCode: '090521',
          bankName: 'Foresight Microfinance bank',
          shortCode: 'Foresight Microfinance bank',
          institutioncbnCode: '090521'
        },
        {
          cbnCode: '50112',
          bankName: 'Fortis Microfinance Bank',
          shortCode: 'FORTIS M-BANK',
          institutioncbnCode: '070002'
        },
        {
          cbnCode: '308',
          bankName: 'FortisMobile',
          shortCode: 'FORTIS MOBILE',
          institutioncbnCode: '100016'
        },
        {
          cbnCode: '090486',
          bankName: 'Fotress Microfinance Bank',
          shortCode: 'FOTRESS MFB',
          institutioncbnCode: '090486'
        },
        {
          cbnCode: '501',
          bankName: 'FSDH',
          shortCode: 'FSDH',
          institutioncbnCode: '400001'
        },
        {
          cbnCode: '090145',
          bankName: 'Full range MFB',
          shortCode: 'Full range MFB',
          institutioncbnCode: '090145'
        },
        {
          cbnCode: '050010',
          bankName: 'FUNDQUEST FINANCIAL SERVICES',
          shortCode: 'FUNDQUEST FINANCIAL SERVICES',
          institutioncbnCode: '050010'
        },
        {
          cbnCode: '090438',
          bankName: 'Futminna Microfinance Bank',
          shortCode: 'Futminna MFB',
          institutioncbnCode: '090438'
        },
        {
          cbnCode: '090158',
          bankName: 'FUTO MFB',
          shortCode: 'FUTO MICROFINANCE',
          institutioncbnCode: '090158'
        },
        {
          cbnCode: '090582',
          bankName: 'Gabasawa MFB',
          shortCode: 'Gabasawa MFB',
          institutioncbnCode: '090582'
        },
        {
          cbnCode: '090591',
          bankName: 'Gabsyn MFB',
          shortCode: 'Gabsyn MFB',
          institutioncbnCode: '090591'
        },
        {
          cbnCode: '090484',
          bankName: 'Garki MFB',
          shortCode: 'GARKI MFB',
          institutioncbnCode: '090484'
        },
        {
          cbnCode: '090168',
          bankName: 'Gashua Microfinance Bank',
          shortCode: 'GASHUA MFB',
          institutioncbnCode: '090168'
        },
        {
          cbnCode: '070009',
          bankName: 'GATEWAY MORTGAGE BANK',
          shortCode: 'GATEWAY MORTGAGE BANK',
          institutioncbnCode: '070009'
        },
        {
          cbnCode: '090579',
          bankName: 'GBEDE Microfinance Bank',
          shortCode: 'GBEDE Microfinance Bank',
          institutioncbnCode: '090579'
        },
        {
          cbnCode: '090475',
          bankName: 'Giant Stride MFB',
          shortCode: 'GIANT STRIDE MFB',
          institutioncbnCode: '090475'
        },
        {
          cbnCode: '090621',
          bankName: 'GIDAUNIYAR ALHERI MICROFINANCE BANK',
          shortCode: 'GIDAUNIYAR ALHERI MICROFINANCE BANK',
          institutioncbnCode: '090621'
        },
        {
          cbnCode: '090632',
          bankName: 'Giginya MFB',
          shortCode: 'Giginya MFB',
          institutioncbnCode: '090632'
        },
        {
          cbnCode: '090411',
          bankName: 'GiGinya Microfinance Bank',
          shortCode: 'GiGinya MFB',
          institutioncbnCode: '090411'
        },
        {
          cbnCode: '090186',
          bankName: 'Girei MFB',
          shortCode: 'Girei MFB',
          institutioncbnCode: '090186'
        },
        {
          cbnCode: '090441',
          bankName: 'Giwa Microfinance Bank',
          shortCode: 'Giwa MFB',
          institutioncbnCode: '090441'
        },
        {
          cbnCode: '090639',
          bankName: 'GLOBAL INITIATIVE MFB',
          shortCode: 'GLOBAL INITIATIVE MFB',
          institutioncbnCode: '090639'
        },
        {
          cbnCode: '103',
          bankName: 'Globus Bank',
          shortCode: 'Globus Bank',
          institutioncbnCode: '000027'
        },
        {
          cbnCode: '090278',
          bankName: 'Glory MFB ',
          shortCode: 'GLORY MFB',
          institutioncbnCode: '090278'
        },
        {
          cbnCode: '090408',
          bankName: 'GMB Microfinance Bank',
          shortCode: 'GMB MFB',
          institutioncbnCode: '090408'
        },
        {
          cbnCode: '090574',
          bankName: 'GOLDMAN MICROFINANCE BANK LTD',
          shortCode: 'GOLDMAN MICROFINANCE BANK LTD',
          institutioncbnCode: '090574'
        },
        {
          cbnCode: '090586',
          bankName: 'GOMBE MICROFINANCE BANK LTD',
          shortCode: 'GOMBE MICROFINANCE BANK LTD',
          institutioncbnCode: '090586'
        },
        {
          cbnCode: '100022',
          bankName: 'GoMoney',
          shortCode: 'GOMONEY',
          institutioncbnCode: '100022'
        },
        {
          cbnCode: '090467',
          bankName: 'Good Neighbours Microfinance Bank',
          shortCode: 'Good Neighbours MFB',
          institutioncbnCode: '090467'
        },
        {
          cbnCode: '090495',
          bankName: 'Goodnews Microfinance Bank',
          shortCode: 'Goodnews Microfinance Bank',
          institutioncbnCode: '090495'
        },
        {
          cbnCode: '090122',
          bankName: 'GOWANS MFB',
          shortCode: 'GOWANS MICROFINANCE',
          institutioncbnCode: '090122'
        },
        {
          cbnCode: '090335',
          bankName: 'Grant Microfinance Bank',
          shortCode: 'Grant MFB',
          institutioncbnCode: '090335'
        },
        {
          cbnCode: '090550',
          bankName: 'GREEN ENERGY MICROFINANCE BANK LTD',
          shortCode: 'GREEN ENERGY MICROFINANCE BANK LTD',
          institutioncbnCode: '090550'
        },
        {
          cbnCode: '090599',
          bankName: 'Greenacres MFB',
          shortCode: 'Greenacres MFB',
          institutioncbnCode: '090599'
        },
        {
          cbnCode: '090178',
          bankName: 'GreenBank MFB',
          shortCode: 'GREENBANK MFB',
          institutioncbnCode: '090178'
        },
        {
          cbnCode: '090269',
          bankName: 'Greenville Microfinance bank',
          shortCode: 'GREENVILLE MFB',
          institutioncbnCode: '090269'
        },
        {
          cbnCode: '060004',
          bankName: 'Greenwich Merchant Bank',
          shortCode: 'Greenwich Merchant Bank',
          institutioncbnCode: '060004'
        },
        {
          cbnCode: '090195',
          bankName: 'Grooming Microfinance bank',
          shortCode: 'GROOMING MFB',
          institutioncbnCode: '090195'
        },
        {
          cbnCode: '058',
          bankName: 'GTBank Plc',
          shortCode: 'GTB',
          institutioncbnCode: '000013'
        },
        {
          cbnCode: '090385',
          bankName: 'GTI  Microfinance Bank',
          shortCode: 'GTI MFB',
          institutioncbnCode: '090385'
        },
        {
          cbnCode: '315',
          bankName: 'GTMobile',
          shortCode: 'GTB MOBILE',
          institutioncbnCode: '100009'
        },
        {
          cbnCode: '090500',
          bankName: 'Gwong Microfinance bank',
          shortCode: 'Gwong Microfinance bank',
          institutioncbnCode: '090500'
        },
        {
          cbnCode: '070017',
          bankName: 'Haggai Mortgage Bank Limited',
          shortCode: 'HAGGAI MORTGAGE BANK LIMITED',
          institutioncbnCode: '070017'
        },
        {
          cbnCode: '090291',
          bankName: 'Hala MFB',
          shortCode: 'Hala MFB',
          institutioncbnCode: '090291'
        },
        {
          cbnCode: '090121',
          bankName: 'HASAL MFB',
          shortCode: 'HASAL MICROFINANCE',
          institutioncbnCode: '090121'
        },
        {
          cbnCode: '090363',
          bankName: 'Headway MFB',
          shortCode: 'Headway MFB',
          institutioncbnCode: '090363'
        },
        {
          cbnCode: '324',
          bankName: 'Hedonmark',
          shortCode: 'HEDONMARK MOBILE',
          institutioncbnCode: '100017'
        },
        {
          cbnCode: '030',
          bankName: 'Heritage',
          shortCode: 'HERITAGE',
          institutioncbnCode: '000020'
        },
        {
          cbnCode: '090418',
          bankName: 'Highland Microfinance Bank',
          shortCode: 'Highland MFB',
          institutioncbnCode: '090418'
        },
        {
          cbnCode: '070024',
          bankName: 'HomeBase Mortgage',
          shortCode: 'HomeBase Mortgage',
          institutioncbnCode: '070024'
        },
        {
          cbnCode: '120002',
          bankName: 'HopePSB',
          shortCode: 'HopePSB',
          institutioncbnCode: '120002'
        },
        {
          cbnCode: '090598',
          bankName: 'IBA MFB',
          shortCode: 'IBA MFB',
          institutioncbnCode: '090598'
        },
        {
          cbnCode: '090439',
          bankName: 'IBETO  Microfinance Bank',
          shortCode: 'IBETO  MFB',
          institutioncbnCode: '090439'
        },
        {
          cbnCode: '090118',
          bankName: 'IBILE Microfinance Bank',
          shortCode: 'IBILE MICROFINANCE',
          institutioncbnCode: '090118'
        },
        {
          cbnCode: '090532',
          bankName: 'IBOLO MICORFINANCE BANK LTD',
          shortCode: 'IBOLO MICORFINANCE BANK LTD',
          institutioncbnCode: '090532'
        },
        {
          cbnCode: '090519',
          bankName: 'Ibom fadama Microfinance Bank',
          shortCode: 'Ibom fadama Microfinance Bank',
          institutioncbnCode: '090519'
        },
        {
          cbnCode: '090488',
          bankName: 'Ibu-Aje Microfinance',
          shortCode: 'Ibu-Aje Microfinance',
          institutioncbnCode: '090488'
        },
        {
          cbnCode: '090546',
          bankName: 'IJEBU-IFE MICROFINANCE BANK LTD',
          shortCode: 'IJEBU-IFE MICROFINANCE BANK LTD',
          institutioncbnCode: '090546'
        },
        {
          cbnCode: '090324',
          bankName: 'IKENNE MFB',
          shortCode: 'IKENNE MFB',
          institutioncbnCode: '090324'
        },
        {
          cbnCode: '090279',
          bankName: 'Ikire MFB',
          shortCode: 'Ikire MFB',
          institutioncbnCode: '090279'
        },
        {
          cbnCode: '090536',
          bankName: 'Ikoyi-Osun Microfinance Bank',
          shortCode: 'Ikoyi-Osun Microfinance Bank',
          institutioncbnCode: '090536'
        },
        {
          cbnCode: '090571',
          bankName: 'ILARO POLY MICROFINANCE BANK LTD',
          shortCode: 'ILARO POLY MICROFINANCE BANK LTD',
          institutioncbnCode: '090571'
        },
        {
          cbnCode: '090370',
          bankName: 'Ilisan MICROFINANCE BANK',
          shortCode: 'ILISAN MFB',
          institutioncbnCode: '090370'
        },
        {
          cbnCode: '090350',
          bankName: 'Illorin Microfinance Bank',
          shortCode: 'Illorin MFB',
          institutioncbnCode: '090350'
        },
        {
          cbnCode: '090430',
          bankName: 'Ilora Microfinance Bank',
          shortCode: 'Ilora MFB',
          institutioncbnCode: '090430'
        },
        {
          cbnCode: '090258',
          bankName: 'Imo Microfinance bank',
          shortCode: 'Imo MFB',
          institutioncbnCode: '090258'
        },
        {
          cbnCode: '090417',
          bankName: 'Imowo Microfinance Bank',
          shortCode: 'Imowo MFB',
          institutioncbnCode: '090417'
        },
        {
          cbnCode: '100024',
          bankName: 'Imperial Homes Mortgage Bank',
          shortCode: 'IMPERIAL HOMES MORTGAGE BANK',
          institutioncbnCode: '100024'
        },
        {
          cbnCode: '090157',
          bankName: 'Infinity MFB',
          shortCode: 'INFINITY MICROFINANCE',
          institutioncbnCode: '090157'
        },
        {
          cbnCode: '070016',
          bankName: 'Infinity trust  Mortgage Bank',
          shortCode: 'Infinity trust  Mortgage',
          institutioncbnCode: '070016'
        },
        {
          cbnCode: '100029',
          bankName: 'Innovectives Kesh',
          shortCode: 'Innovectives Kesh',
          institutioncbnCode: '100029'
        },
        {
          cbnCode: '090434',
          bankName: 'Insight Microfinance Bank',
          shortCode: 'Insight MFB',
          institutioncbnCode: '090434'
        },
        {
          cbnCode: '100027',
          bankName: 'Intellifin',
          shortCode: 'Intellifin',
          institutioncbnCode: '100027'
        },
        {
          cbnCode: '090386',
          bankName: 'Interland MFB',
          shortCode: 'Interland MFB',
          institutioncbnCode: '090386'
        },
        {
          cbnCode: '110010',
          bankName: 'Interswitch Financial Inclusion Services (IFIS)',
          shortCode: 'Interswitch FIS',
          institutioncbnCode: '110010'
        },
        {
          cbnCode: '090493',
          bankName: 'Iperu Microfinance Bank',
          shortCode: 'Iperu Microfinance Bank',
          institutioncbnCode: '090493'
        },
        {
          cbnCode: '090149',
          bankName: 'IRL Microfinance Bank',
          shortCode: 'IRL MFB',
          institutioncbnCode: '090149'
        },
        {
          cbnCode: '090377',
          bankName: 'ISALEOYO MICROFINANCE BANK',
          shortCode: 'ISALEOYO MFB',
          institutioncbnCode: '090377'
        },
        {
          cbnCode: '090428',
          bankName: 'Ishie  Microfinance Bank',
          shortCode: 'Ishie MFB',
          institutioncbnCode: '090428'
        },
        {
          cbnCode: '090584',
          bankName: 'ISLAND MICROFINANCE BANK LTD',
          shortCode: 'ISLAND MICROFINANCE BANK LTD',
          institutioncbnCode: '090584'
        },
        {
          cbnCode: '090353',
          bankName: 'Isuofia MFB',
          shortCode: 'Isuofia MFB',
          institutioncbnCode: '090353'
        },
        {
          cbnCode: '090578',
          bankName: 'IWADE MICROFINANCE BANK LTD',
          shortCode: 'IWADE MICROFINANCE BANK LTD',
          institutioncbnCode: '090578'
        },
        {
          cbnCode: '090570',
          bankName: 'IYAMOYE MICROFINANCE BANK LTD',
          shortCode: 'IYAMOYE MICROFINANCE BANK LTD',
          institutioncbnCode: '090570'
        },
        {
          cbnCode: '090337',
          bankName: 'IYERU OKIN MICROFINANCE BANK LTD',
          shortCode: 'IYERU OKIN MICROFINANCE BANK LTD',
          institutioncbnCode: '090337'
        },
        {
          cbnCode: '090620',
          bankName: 'Iyin Ekiti MFB',
          shortCode: 'Iyin Ekiti MFB',
          institutioncbnCode: '090620'
        },
        {
          cbnCode: '090421',
          bankName: 'Izon Microfinance Bank',
          shortCode: 'Izon MFB',
          institutioncbnCode: '090421'
        },
        {
          cbnCode: '301',
          bankName: 'JAIZ Bank',
          shortCode: 'JAIZ',
          institutioncbnCode: '000006'
        },
        {
          cbnCode: '090352',
          bankName: 'Jessefield Microfinance Bank',
          shortCode: 'Jessefield Microfinance Bank',
          institutioncbnCode: '090352'
        },
        {
          cbnCode: '402',
          bankName: 'JubileeLife',
          shortCode: 'JUBILEE',
          institutioncbnCode: '090003'
        },
        {
          cbnCode: '110008',
          bankName: 'Kadick Integration Limited',
          shortCode: 'Kadick Integration',
          institutioncbnCode: '110008'
        },
        {
          cbnCode: '090320',
          bankName: 'Kadpoly MICROFINANCE BANK',
          shortCode: 'Kadpoly MFB',
          institutioncbnCode: '090320'
        },
        {
          cbnCode: '090592',
          bankName: 'Kano Poly MFB',
          shortCode: 'Kano Poly MFB',
          institutioncbnCode: '090592'
        },
        {
          cbnCode: '090554',
          bankName: 'KAYVEE MICROFINANCE BANK',
          shortCode: 'KAYVEE MICROFINANCE BANK',
          institutioncbnCode: '090554'
        },
        {
          cbnCode: '090549',
          bankName: 'KC MICROFINANCE BANK',
          shortCode: 'KC MICROFINANCE BANK',
          institutioncbnCode: '090549'
        },
        {
          cbnCode: '090191',
          bankName: 'KCMB MFB',
          shortCode: 'KCMB MFB',
          institutioncbnCode: '090191'
        },
        {
          cbnCode: '303',
          bankName: 'Kegow',
          shortCode: 'CHAMS',
          institutioncbnCode: '100015'
        },
        {
          cbnCode: '100036',
          bankName: 'KEGOW(CHAMSMOBILE)',
          shortCode: 'KEGOW(CHAMSMOBILE)',
          institutioncbnCode: '100036'
        },
        {
          cbnCode: '090602',
          bankName: 'KENECHUKWU MICROFINANCE BANK',
          shortCode: 'KENECHUKWU MICROFINANCE BANK',
          institutioncbnCode: '090602'
        },
        {
          cbnCode: '082',
          bankName: 'Keystone Bank',
          shortCode: 'KEYSTONE',
          institutioncbnCode: '000002'
        },
        {
          cbnCode: '090487',
          bankName: 'Kingdom College  Microfinance Bank',
          shortCode: 'KINGDOM COLLEGE MFB',
          institutioncbnCode: '090487'
        },
        {
          cbnCode: '090606',
          bankName: 'KKU Microfinance Bank',
          shortCode: 'KKU Microfinance Bank',
          institutioncbnCode: '090606'
        },
        {
          cbnCode: '090299',
          bankName: 'Kontagora MFB',
          shortCode: 'KONTAGORA MFB',
          institutioncbnCode: '090299'
        },
        {
          cbnCode: '090617',
          bankName: 'Kopo Kope MFB',
          shortCode: 'Kopo Kope MFB',
          institutioncbnCode: '090617'
        },
        {
          cbnCode: '110022',
          bankName: 'Koraypay',
          shortCode: 'Koraypay',
          institutioncbnCode: '110022'
        },
        {
          cbnCode: '090380',
          bankName: 'Kredi Money Microfinance Bank',
          shortCode: 'Kredi Money MFB',
          institutioncbnCode: '090380'
        },
        {
          cbnCode: '090267',
          bankName: 'Kuda Microfinance Bank',
          shortCode: 'KUDIMONEY MFB',
          institutioncbnCode: '090267'
        },
        {
          cbnCode: '090450',
          bankName: 'Kwasu MF Bank',
          shortCode: 'Kwasu MF Bank',
          institutioncbnCode: '090450'
        },
        {
          cbnCode: '090422',
          bankName: 'Landgold  Microfinance Bank',
          shortCode: 'Landgold  MFB',
          institutioncbnCode: '090422'
        },
        {
          cbnCode: '090177',
          bankName: 'Lapo MFB',
          shortCode: 'LAPO MFB',
          institutioncbnCode: '090177'
        },
        {
          cbnCode: '090271',
          bankName: 'Lavender Microfinance bank',
          shortCode: 'LAVENDER MFB',
          institutioncbnCode: '090271'
        },
        {
          cbnCode: '070012',
          bankName: 'LBIC Mortgage Bank',
          shortCode: 'LBIC MORTGAGE',
          institutioncbnCode: '070012'
        },
        {
          cbnCode: '110044',
          bankName: 'Leadremit Limited',
          shortCode: 'Leadremit Limited',
          institutioncbnCode: '110044'
        },
        {
          cbnCode: '090372',
          bankName: 'Legend MICROFINANCE BANK',
          shortCode: 'LEGEND MFB',
          institutioncbnCode: '090372'
        },
        {
          cbnCode: '090420',
          bankName: 'Letshego  Microfinance Bank',
          shortCode: 'Letshego MFB',
          institutioncbnCode: '090420'
        },
        {
          cbnCode: '090557',
          bankName: 'LIFEGATE MICROFINANCE BANK LTD',
          shortCode: 'LIFEGATE MICROFINANCE BANK LTD',
          institutioncbnCode: '090557'
        },
        {
          cbnCode: '090477',
          bankName: 'Light Microfinance Bank',
          shortCode: 'LIGHT MFB',
          institutioncbnCode: '090477'
        },
        {
          cbnCode: '090435',
          bankName: 'Links  Microfinance Bank',
          shortCode: 'LINKS MFB',
          institutioncbnCode: '090435'
        },
        {
          cbnCode: '042',
          bankName: 'LIVINGTRUST MORTGAGE BANK',
          shortCode: 'LIVINGTRUST MORTGAGE BANK',
          institutioncbnCode: '070007'
        },
        {
          cbnCode: '090537',
          bankName: 'Lobrem Microfinance Bank',
          shortCode: 'Lobrem Microfinance Bank',
          institutioncbnCode: '090537'
        },
        {
          cbnCode: '000029',
          bankName: 'Lotus Bank',
          shortCode: 'Lotus Bank',
          institutioncbnCode: '000029'
        },
        {
          cbnCode: '090265',
          bankName: 'Lovonus Microfinance bank',
          shortCode: 'LOVONUS MFB',
          institutioncbnCode: '090265'
        },
        {
          cbnCode: '050015',
          bankName: 'Lukefield Finance Company Limited',
          shortCode: 'Lukefield Finance Company Limited',
          institutioncbnCode: '050015'
        },
        {
          cbnCode: '100035',
          bankName: 'M36',
          shortCode: 'M36',
          institutioncbnCode: '100035'
        },
        {
          cbnCode: '090623',
          bankName: 'Mab Allianz MFB',
          shortCode: 'Mab Allianz MFB',
          institutioncbnCode: '090623'
        },
        {
          cbnCode: '090603',
          bankName: 'Macrod MFB',
          shortCode: 'Macrod MFB',
          institutioncbnCode: '090603'
        },
        {
          cbnCode: '090605',
          bankName: 'MADOBI MFB',
          shortCode: 'MADOBI MFB',
          institutioncbnCode: '090605'
        },
        {
          cbnCode: '090323',
          bankName: 'Mainland MICROFINANCE BANK',
          shortCode: 'Mainland MFB',
          institutioncbnCode: '090323'
        },
        {
          cbnCode: '090171',
          bankName: 'Mainstreet MFB',
          shortCode: 'MAINSTREET MFB',
          institutioncbnCode: '090171'
        },
        {
          cbnCode: '090465',
          bankName: 'Maintrust MFB',
          shortCode: 'Maintrust MFB',
          institutioncbnCode: '090465'
        },
        {
          cbnCode: '090174',
          bankName: 'Malachy MFB',
          shortCode: 'MALACHY MFB',
          institutioncbnCode: '090174'
        },
        {
          cbnCode: '090410',
          bankName: 'Maritime Microfinance Bank',
          shortCode: 'Maritime MFB',
          institutioncbnCode: '090410'
        },
        {
          cbnCode: '090423',
          bankName: 'Mautech  Microfinance Bank',
          shortCode: 'Mautech MFB',
          institutioncbnCode: '090423'
        },
        {
          cbnCode: '070019',
          bankName: 'MayFresh Mortgage Bank',
          shortCode: 'MayFresh Mortgage Bank',
          institutioncbnCode: '070019'
        },
        {
          cbnCode: '090612',
          bankName: 'Medef MFB',
          shortCode: 'Medef MFB',
          institutioncbnCode: '090612'
        },
        {
          cbnCode: '090280',
          bankName: 'Megapraise Microfinance Bank',
          shortCode: 'Megapraise MFB',
          institutioncbnCode: '090280'
        },
        {
          cbnCode: '090432',
          bankName: 'Memphis Microfinance Bank',
          shortCode: 'Memphis MFB',
          institutioncbnCode: '090432'
        },
        {
          cbnCode: '090275',
          bankName: 'Meridian MFB',
          shortCode: 'Meridian MFB',
          institutioncbnCode: '090275'
        },
        {
          cbnCode: '090528',
          bankName: 'Mgbidi Microfinance Bank',
          shortCode: 'Mgbidi Microfinance Bank',
          institutioncbnCode: '090528'
        },
        {
          cbnCode: '090587',
          bankName: 'Microbiz MFB',
          shortCode: 'Microbiz MFB',
          institutioncbnCode: '090587'
        },
        {
          cbnCode: '110018',
          bankName: 'Microsystems Investment and Development Limited',
          shortCode: 'MICROSYSTEMS INVESTMENT',
          institutioncbnCode: '110018'
        },
        {
          cbnCode: '090113',
          bankName: 'MICROVIS MICROFINANCE BANK',
          shortCode: 'MICROVIS MFB',
          institutioncbnCode: '090113'
        },
        {
          cbnCode: '090192',
          bankName: 'Midland MFB',
          shortCode: 'Midland MFB',
          institutioncbnCode: '090192'
        },
        {
          cbnCode: '090607',
          bankName: 'MINJIBIR MICROFINANCE BANK',
          shortCode: 'MINJIBIR MICROFINANCE BANK',
          institutioncbnCode: '090607'
        },
        {
          cbnCode: '090281',
          bankName: 'MintFinex MFB',
          shortCode: 'MintFinex MFB',
          institutioncbnCode: '090281'
        },
        {
          cbnCode: '090455',
          bankName: 'MKOBO MICROFINANCE BANK LTD',
          shortCode: 'MKOBO MICROFINANCE BANK LTD',
          institutioncbnCode: '090455'
        },
        {
          cbnCode: '313',
          bankName: 'Mkudi',
          shortCode: 'MKUDI',
          institutioncbnCode: '100011'
        },
        {
          cbnCode: '090362',
          bankName: 'Molusi MICROFINANCE BANK',
          shortCode: 'MOLUSI MFB',
          institutioncbnCode: '090362'
        },
        {
          cbnCode: '120003',
          bankName: 'MoMo PSB',
          shortCode: 'MoMo Payment Service bank',
          institutioncbnCode: '120003'
        },
        {
          cbnCode: '090462',
          bankName: 'Monarch Microfinance Bank',
          shortCode: 'Monarch MFB',
          institutioncbnCode: '090462'
        },
        {
          cbnCode: '120005',
          bankName: 'Money Master PSB',
          shortCode: 'Money Master PSB',
          institutioncbnCode: '120005'
        },
        {
          cbnCode: '100020',
          bankName: 'MoneyBox',
          shortCode: 'MONEYBOX',
          institutioncbnCode: '100020'
        },
        {
          cbnCode: '090129',
          bankName: 'MONEYTRUST MFB',
          shortCode: 'MONEYTRUST MICROFINANCE',
          institutioncbnCode: '090129'
        },
        {
          cbnCode: '993',
          bankName: 'Moniepoint Microfinance Bank',
          shortCode: 'Moniepoint MFB',
          institutioncbnCode: '090405'
        },
        {
          cbnCode: '090448',
          bankName: 'Moyofade MF Bank',
          shortCode: 'Moyofade MFB',
          institutioncbnCode: '090448'
        },
        {
          cbnCode: '090392',
          bankName: 'Mozfin Microfinance Bank',
          shortCode: 'MOZFIN MFB',
          institutioncbnCode: '090392'
        },
        {
          cbnCode: '090190',
          bankName: 'Mutual Benefits MFB',
          shortCode: 'MUTUAL BENEFITS MFB',
          institutioncbnCode: '090190'
        },
        {
          cbnCode: '090151',
          bankName: 'Mutual Trust Microfinance Bank',
          shortCode: 'Mutual Trust MFB',
          institutioncbnCode: '090151'
        },
        {
          cbnCode: '090152',
          bankName: 'Nargata MFB',
          shortCode: 'Nargata MFB',
          institutioncbnCode: '090152'
        },
        {
          cbnCode: '090349',
          bankName: 'Nasarawa Microfinance bank',
          shortCode: 'Nasarawa Microfinance bank',
          institutioncbnCode: '090349'
        },
        {
          cbnCode: '090263',
          bankName: 'Navy Microfinance bank',
          shortCode: 'NAVY MFB',
          institutioncbnCode: '090263'
        },
        {
          cbnCode: '090128',
          bankName: 'Ndiorah MFB',
          shortCode: 'NDIORAH MICROFINANCE',
          institutioncbnCode: '090128'
        },
        {
          cbnCode: '090329',
          bankName: 'Neptune MICROFINANCE BANK',
          shortCode: 'NEPTUNE MFB',
          institutioncbnCode: '090329'
        },
        {
          cbnCode: '110025',
          bankName: 'NetApps Technology Limited',
          shortCode: 'NetApps Technology Limited',
          institutioncbnCode: '110025'
        },
        {
          cbnCode: '090378',
          bankName: 'NEW GOLDEN PASTURES MICROFINANCE BANK',
          shortCode: 'NEW GOLDEN PASTURES MFB',
          institutioncbnCode: '090378'
        },
        {
          cbnCode: '561',
          bankName: 'New Prudential Bank',
          shortCode: 'NEW PRUDENTIAL MORTGAGE BANK',
          institutioncbnCode: '090108'
        },
        {
          cbnCode: '090205',
          bankName: 'Newdawn Microfinance bank',
          shortCode: 'NEWDAWN MFB',
          institutioncbnCode: '090205'
        },
        {
          cbnCode: '050004',
          bankName: 'NEWEDGE FINANCE LTD',
          shortCode: 'NEWEDGE FINANCE LTD',
          institutioncbnCode: '050004'
        },
        {
          cbnCode: '110019',
          bankName: 'NIBSSUSSD PAYMENTS',
          shortCode: 'NIBSSUSSD',
          institutioncbnCode: '110019'
        },
        {
          cbnCode: '090459',
          bankName: 'Nice Microfinance Bank',
          shortCode: 'Nice MFB',
          institutioncbnCode: '090459'
        },
        {
          cbnCode: '090505',
          bankName: 'Nigeria PrisonsMicrofinance bank',
          shortCode: 'Nigeria PrisonsMicrofinance bank',
          institutioncbnCode: '090505'
        },
        {
          cbnCode: '999',
          bankName: 'NIP Virtual Bank',
          shortCode: 'NIBSS',
          institutioncbnCode: '999999'
        },
        {
          cbnCode: '090194',
          bankName: 'NIRSAL National microfinance bank',
          shortCode: 'NIRSAL MFB',
          institutioncbnCode: '090194'
        },
        {
          cbnCode: '110028',
          bankName: 'Nomba financial services Limited',
          shortCode: 'Nomba financial services Limited',
          institutioncbnCode: '110028'
        },
        {
          cbnCode: '637',
          bankName: 'NOVA MB',
          shortCode: 'NOVA MERCHANT BANK',
          institutioncbnCode: '060003'
        },
        {
          cbnCode: '100032',
          bankName: 'NOWNOW DIGITAL SYSTEMS LIMITED',
          shortCode: 'NOWNOW DIGITAL',
          institutioncbnCode: '100032'
        },
        {
          cbnCode: '522',
          bankName: 'NPF MicroFinance Bank',
          shortCode: 'NPF-MICROFINANCE',
          institutioncbnCode: '070001'
        },
        {
          cbnCode: '090535',
          bankName: 'Npolu-UST Microfinance Bank',
          shortCode: 'Npolu-UST Microfinance Bank',
          institutioncbnCode: '090535'
        },
        {
          cbnCode: '090628',
          bankName: 'Nsehe Microfinance Bank',
          shortCode: 'Nsehe Microfinance Bank',
          institutioncbnCode: '090628'
        },
        {
          cbnCode: '090491',
          bankName: 'Nsuk  Microfinance Bank',
          shortCode: 'Nsuk  Microfinance Bank',
          institutioncbnCode: '090491'
        },
        {
          cbnCode: '090516',
          bankName: 'Numo Microfinance bank',
          shortCode: 'Numo Microfinance bank',
          institutioncbnCode: '090516'
        },
        {
          cbnCode: '090399',
          bankName: 'Nwannegadi MFB',
          shortCode: 'Nwannegadi MFB',
          institutioncbnCode: '090399'
        },
        {
          cbnCode: '090437',
          bankName: 'Oakland Microfinance Bank',
          shortCode: 'Oakland MFB',
          institutioncbnCode: '090437'
        },
        {
          cbnCode: '090345',
          bankName: 'OAU MICROFINANCE BANK LTD',
          shortCode: 'OAU MICROFINANCE BANK LTD',
          institutioncbnCode: '090345'
        },
        {
          cbnCode: '090333',
          bankName: 'Oche MFB',
          shortCode: 'Oche MFB',
          institutioncbnCode: '090333'
        },
        {
          cbnCode: '090576',
          bankName: 'OCTOPUS MICROFINANCE BANK LTD',
          shortCode: 'OCTOPUS MICROFINANCE BANK LTD',
          institutioncbnCode: '090576'
        },
        {
          cbnCode: '090119',
          bankName: 'OHAFIA MFB',
          shortCode: 'OHAFIA MICROFINANCE',
          institutioncbnCode: '090119'
        },
        {
          cbnCode: '090626',
          bankName: 'OHHA Microfinance Bank',
          shortCode: 'OHHA Microfinance Bank',
          institutioncbnCode: '090626'
        },
        {
          cbnCode: '090527',
          bankName: 'Ojokoro Mfb',
          shortCode: 'Ojokoro Mfb',
          institutioncbnCode: '090527'
        },
        {
          cbnCode: '090565',
          bankName: 'OKE-ARO OREDEGBE MICROFINANCE BANK LTD',
          shortCode: 'OKE-ARO OREDEGBE MICROFINANCE BANK LTD',
          institutioncbnCode: '090565'
        },
        {
          cbnCode: '090161',
          bankName: 'Okpoga MFB',
          shortCode: 'OKPOGA MICROFINANCE',
          institutioncbnCode: '090161'
        },
        {
          cbnCode: '090272',
          bankName: 'Olabisi Onabanjo university Microfinance bank',
          shortCode: 'Olabisi Onabanjo university MFB',
          institutioncbnCode: '090272'
        },
        {
          cbnCode: '090404',
          bankName: 'Olowolagba Microfinance Bank',
          shortCode: 'Olowolagba MFB',
          institutioncbnCode: '090404'
        },
        {
          cbnCode: '090471',
          bankName: 'OLUCHUKWU Microfinance Bank',
          shortCode: 'OLUCHUKWU MFB',
          institutioncbnCode: '090471'
        },
        {
          cbnCode: '090295',
          bankName: 'Omiye MFB',
          shortCode: 'OMIYE MFB',
          institutioncbnCode: '090295'
        },
        {
          cbnCode: '100004',
          bankName: 'OPAY',
          shortCode: 'OPAY',
          institutioncbnCode: '100004'
        },
        {
          cbnCode: '107',
          bankName: 'OPTIMUS BANK',
          shortCode: 'OPTIMUS BANK',
          institutioncbnCode: '000036'
        },
        {
          cbnCode: '090492',
          bankName: 'Oraukwu  Microfinance Bank',
          shortCode: 'Oraukwu  Microfinance Bank',
          institutioncbnCode: '090492'
        },
        {
          cbnCode: '090588',
          bankName: 'Orisun MFB',
          shortCode: 'Orisun MFB',
          institutioncbnCode: '090588'
        },
        {
          cbnCode: '090460',
          bankName: 'ORITA-BASORUN Microfinance Bank',
          shortCode: 'ORITA-BASORUN MFB',
          institutioncbnCode: '090460'
        },
        {
          cbnCode: '090567',
          bankName: 'OROKAM MICROFINANCE BANK LTD',
          shortCode: 'OROKAM MICROFINANCE BANK LTD',
          institutioncbnCode: '090567'
        },
        {
          cbnCode: '090396',
          bankName: 'Oscotech MFB',
          shortCode: 'OSCOTECH MFB',
          institutioncbnCode: '090396'
        },
        {
          cbnCode: '090456',
          bankName: 'Ospoly Microfinance Bank',
          shortCode: 'Ospoly MFB',
          institutioncbnCode: '090456'
        },
        {
          cbnCode: '090580',
          bankName: 'OTECH MICROFINANCE BANK LTD',
          shortCode: 'OTECH MICROFINANCE BANK LTD',
          institutioncbnCode: '090580'
        },
        {
          cbnCode: '090542',
          bankName: 'OTUO MICROFINANCE BANK LTD',
          shortCode: 'OTUO MICROFINANCE BANK LTD',
          institutioncbnCode: '090542'
        },
        {
          cbnCode: '090635',
          bankName: 'Oyan Microfinance Bank',
          shortCode: 'Oyan Microfinance Bank',
          institutioncbnCode: '090635'
        },
        {
          cbnCode: '327',
          bankName: 'PAGA',
          shortCode: 'PAGA',
          institutioncbnCode: '100002'
        },
        {
          cbnCode: '070008',
          bankName: 'Page MFBank',
          shortCode: 'Page MFBank',
          institutioncbnCode: '070008'
        },
        {
          cbnCode: '090497',
          bankName: 'Palmcoast Microfinance bank',
          shortCode: 'Palmcoast Microfinance bank',
          institutioncbnCode: '090497'
        },
        {
          cbnCode: '100033',
          bankName: 'PalmPay',
          shortCode: 'PALMPAY',
          institutioncbnCode: '100033'
        },
        {
          cbnCode: '000030',
          bankName: 'Parallex Bank',
          shortCode: 'Parallex Bank',
          institutioncbnCode: '000030'
        },
        {
          cbnCode: '090390',
          bankName: 'Parkway MF Bank',
          shortCode: 'Parkway MF Bank',
          institutioncbnCode: '090390'
        },
        {
          cbnCode: '311',
          bankName: 'Parkway-ReadyCash',
          shortCode: 'PARKWAY',
          institutioncbnCode: '100003'
        },
        {
          cbnCode: '090317',
          bankName: 'Patrick Gold',
          shortCode: 'PATRICK GOLD',
          institutioncbnCode: '090317'
        },
        {
          cbnCode: '329',
          bankName: 'PayAttitude Online',
          shortCode: 'PAYATITUDE ONLINE',
          institutioncbnCode: '110001'
        },
        {
          cbnCode: '090402',
          bankName: 'Peace Microfinance Bank',
          shortCode: 'Peace MFB',
          institutioncbnCode: '090402'
        },
        {
          cbnCode: '090137',
          bankName: 'Pecan Trust Microfinance Bank',
          shortCode: 'PECAN TRUST MICROFINANCE',
          institutioncbnCode: '090137'
        },
        {
          cbnCode: '090196',
          bankName: 'Pennywise Microfinance bank',
          shortCode: 'PENNYWISE MFB',
          institutioncbnCode: '090196'
        },
        {
          cbnCode: '090135',
          bankName: 'Personal Trust Microfinance Bank',
          shortCode: 'PERSONAL TRUST MICROFINANCE',
          institutioncbnCode: '090135'
        },
        {
          cbnCode: '090165',
          bankName: 'Petra Microfinance Bank',
          shortCode: 'PETRA MICROFINANCE',
          institutioncbnCode: '090165'
        },
        {
          cbnCode: '090289',
          bankName: 'Pillar MFB',
          shortCode: 'Pillar MFB',
          institutioncbnCode: '090289'
        },
        {
          cbnCode: '070013',
          bankName: 'PLATINUM MORTGAGE BANK',
          shortCode: 'PLATINUM MORTGAGE BANK',
          institutioncbnCode: '070013'
        },
        {
          cbnCode: '076',
          bankName: 'POLARIS BANK',
          shortCode: 'POLARIS',
          institutioncbnCode: '000008'
        },
        {
          cbnCode: '090534',
          bankName: 'Polyibadan Microfinance Bank',
          shortCode: 'Polyibadan Microfinance Bank',
          institutioncbnCode: '090534'
        },
        {
          cbnCode: '090296',
          bankName: 'Polyuwanna MFB',
          shortCode: 'POLYUWANNA MFB',
          institutioncbnCode: '090296'
        },
        {
          cbnCode: '090412',
          bankName: 'Preeminent Microfinance Bank',
          shortCode: 'Preeminent MFB',
          institutioncbnCode: '090412'
        },
        {
          cbnCode: '000031',
          bankName: 'Premium Trust bank',
          shortCode: 'Premium Trust bank',
          institutioncbnCode: '000031'
        },
        {
          cbnCode: '090274',
          bankName: 'Prestige Microfinance bank',
          shortCode: 'PRESTIGE MFB',
          institutioncbnCode: '090274'
        },
        {
          cbnCode: '090481',
          bankName: 'PRISCO MFB',
          shortCode: 'PRISCO MFB',
          institutioncbnCode: '090481'
        },
        {
          cbnCode: '090499',
          bankName: 'Pristine Divitis Microfinance Bank',
          shortCode: 'Pristine Divitis MFB',
          institutioncbnCode: '090499'
        },
        {
          cbnCode: '090503',
          bankName: 'Projects Microfinance bank',
          shortCode: 'Projects Microfinance bank',
          institutioncbnCode: '090503'
        },
        {
          cbnCode: '101',
          bankName: 'Providus Bank ',
          shortCode: 'PROVIDUS BANK',
          institutioncbnCode: '000023'
        },
        {
          cbnCode: '110013',
          bankName: 'QR Payments',
          shortCode: 'QR Payments',
          institutioncbnCode: '110013'
        },
        {
          cbnCode: '090569',
          bankName: 'QUBE MICROFINANCE BANK LTD',
          shortCode: 'QUBE MICROFINANCE BANK LTD',
          institutioncbnCode: '090569'
        },
        {
          cbnCode: '090261',
          bankName: 'QuickFund Microfinance bank',
          shortCode: 'QUICKFUND MFB',
          institutioncbnCode: '090261'
        },
        {
          cbnCode: '090496',
          bankName: 'Radalpha Microfinance bank',
          shortCode: 'Radalpha Microfinance bank',
          institutioncbnCode: '090496'
        },
        {
          cbnCode: '090170',
          bankName: 'Rahama MFB',
          shortCode: 'RAHAMA MFB',
          institutioncbnCode: '090170'
        },
        {
          cbnCode: '502',
          bankName: 'Rand Merchant Bank',
          shortCode: 'RAND MERCHANT BANK',
          institutioncbnCode: '000024'
        },
        {
          cbnCode: '090616',
          bankName: 'RAYYAN MFB',
          shortCode: 'RAYYAN MFB',
          institutioncbnCode: '090616'
        },
        {
          cbnCode: '070011',
          bankName: 'Refuge Mortgage Bank',
          shortCode: 'REFUGE MORTGAGE BANK',
          institutioncbnCode: '070011'
        },
        {
          cbnCode: '090125',
          bankName: 'REGENT MFB',
          shortCode: 'REGENT MICROFINANCE',
          institutioncbnCode: '090125'
        },
        {
          cbnCode: '090463',
          bankName: 'Rehoboth Microfinance Bank',
          shortCode: 'Rehoboth MFB',
          institutioncbnCode: '090463'
        },
        {
          cbnCode: '090173',
          bankName: 'Reliance MFB',
          shortCode: 'RELIANCE MFB',
          institutioncbnCode: '090173'
        },
        {
          cbnCode: '090198',
          bankName: 'RENMONEY MICROFINANCE BANK',
          shortCode: 'RENMONEY MICROFINANCE BANK',
          institutioncbnCode: '090198'
        },
        {
          cbnCode: '090322',
          bankName: 'Rephidim MICROFINANCE BANK',
          shortCode: 'Rephidim MFB',
          institutioncbnCode: '090322'
        },
        {
          cbnCode: '110024',
          bankName: 'Resident Fintech Limited',
          shortCode: 'Resident Fintech Limited',
          institutioncbnCode: '110024'
        },
        {
          cbnCode: '110046',
          bankName: 'REXEL',
          shortCode: 'REXEL',
          institutioncbnCode: '110046'
        },
        {
          cbnCode: '090132',
          bankName: 'RICHWAY MFB',
          shortCode: 'RICHWAY MICROFINANCE',
          institutioncbnCode: '090132'
        },
        {
          cbnCode: '090433',
          bankName: 'RIGO Microfinance Bank',
          shortCode: 'RIGO MFB',
          institutioncbnCode: '090433'
        },
        {
          cbnCode: '090515',
          bankName: 'Rima Growth pathway Microfinance Bank ',
          shortCode: 'Rima Growth pathway Microfinance Bank ',
          institutioncbnCode: '090515'
        },
        {
          cbnCode: '090443',
          bankName: 'RIMA Microfinance Bank',
          shortCode: 'RIMA MFB',
          institutioncbnCode: '090443'
        },
        {
          cbnCode: '090547',
          bankName: 'ROCKSHIELD MICROFINANCE BANK',
          shortCode: 'ROCKSHIELD MICROFINANCE BANK',
          institutioncbnCode: '090547'
        },
        {
          cbnCode: '090622',
          bankName: 'Royal Blue MFB',
          shortCode: 'Royal Blue MFB',
          institutioncbnCode: '090622'
        },
        {
          cbnCode: '090138',
          bankName: 'Royal Exchange Microfinance Bank',
          shortCode: 'ROYAL EXCHANGE MICROFINANCE',
          institutioncbnCode: '090138'
        },
        {
          cbnCode: '090175',
          bankName: 'Rubies MFB',
          shortCode: 'RUBIES MFB',
          institutioncbnCode: '090175'
        },
        {
          cbnCode: '090286',
          bankName: 'Safe Haven MFB',
          shortCode: 'Safe Haven MFB',
          institutioncbnCode: '090286'
        },
        {
          cbnCode: '090485',
          bankName: 'Safegate Microfinance Bank',
          shortCode: 'Safegate MFB',
          institutioncbnCode: '090485'
        },
        {
          cbnCode: '403',
          bankName: 'SafeTrust',
          shortCode: 'SMBL',
          institutioncbnCode: '090006'
        },
        {
          cbnCode: '090140',
          bankName: 'Sagamu Microfinance Bank',
          shortCode: 'Sagamu MFB',
          institutioncbnCode: '090140'
        },
        {
          cbnCode: '050003',
          bankName: 'Sage Grey Finace Limited',
          shortCode: 'Sage Grey Finace Limited',
          institutioncbnCode: '050003'
        },
        {
          cbnCode: '090513',
          bankName: 'SEAP Microfinance Bank',
          shortCode: 'SEAP Microfinance Bank',
          institutioncbnCode: '090513'
        },
        {
          cbnCode: '090369',
          bankName: 'Seedvest MICROFINANCE BANK',
          shortCode: 'SEEDVEST MFB',
          institutioncbnCode: '090369'
        },
        {
          cbnCode: '090502',
          bankName: 'Shalom Microfinance Bank',
          shortCode: 'Shalom MFB',
          institutioncbnCode: '090502'
        },
        {
          cbnCode: '090401',
          bankName: 'Shepherd Trust Microfinance Bank',
          shortCode: 'Shepherd Trust MFB',
          institutioncbnCode: '090401'
        },
        {
          cbnCode: '090559',
          bankName: 'SHIELD MICROFINANCE BANK LTD',
          shortCode: 'SHIELD MICROFINANCE BANK LTD',
          institutioncbnCode: '090559'
        },
        {
          cbnCode: '090558',
          bankName: 'SHONGOM MICROFINANCE BANK LTD',
          shortCode: 'SHONGOM MICROFINANCE BANK LTD',
          institutioncbnCode: '090558'
        },
        {
          cbnCode: '000034',
          bankName: 'Signature Bank',
          shortCode: 'Signature Bank',
          institutioncbnCode: '000034'
        },
        {
          cbnCode: '050008',
          bankName: 'SIMPLE FINANCE LIMITED',
          shortCode: 'SIMPLE FINANCE LIMITED',
          institutioncbnCode: '050008'
        },
        {
          cbnCode: '090449',
          bankName: 'SLS  MF Bank',
          shortCode: 'SLS  MF Bank',
          institutioncbnCode: '090449'
        },
        {
          cbnCode: '120004',
          bankName: 'SmartCash Payment Service bank',
          shortCode: 'SmartCash Payment Service bank',
          institutioncbnCode: '120004'
        },
        {
          cbnCode: '090573',
          bankName: 'SNOW MFB',
          shortCode: 'SNOW MFB',
          institutioncbnCode: '090573'
        },
        {
          cbnCode: '090506',
          bankName: 'Solid Allianze MFB',
          shortCode: 'Solid Allianze MFB',
          institutioncbnCode: '090506'
        },
        {
          cbnCode: '090524',
          bankName: 'Solidrock Microfinance bank',
          shortCode: 'Solidrock Microfinance bank',
          institutioncbnCode: '090524'
        },
        {
          cbnCode: '090325',
          bankName: 'SPARKLE MICROFINANCE BANK',
          shortCode: 'SPARKLE MFB',
          institutioncbnCode: '090325'
        },
        {
          cbnCode: '110026',
          bankName: 'SPAY business',
          shortCode: 'SPAY business',
          institutioncbnCode: '110026'
        },
        {
          cbnCode: '090436',
          bankName: 'Spectrum Microfinance Bank',
          shortCode: 'SPECTRUM',
          institutioncbnCode: '090436'
        },
        {
          cbnCode: '304',
          bankName: 'Stanbic @Ease',
          shortCode: 'STANBIC @EASE',
          institutioncbnCode: '100007'
        },
        {
          cbnCode: '221',
          bankName: 'StanbicIBTC Bank',
          shortCode: 'STANBIC',
          institutioncbnCode: '000012'
        },
        {
          cbnCode: '090182',
          bankName: 'Standard MFB',
          shortCode: 'Standard MFB',
          institutioncbnCode: '090182'
        },
        {
          cbnCode: '068',
          bankName: 'StandardChartered',
          shortCode: 'SCB',
          institutioncbnCode: '000021'
        },
        {
          cbnCode: '090162',
          bankName: 'Stanford MFB',
          shortCode: 'STANFORD MFB',
          institutioncbnCode: '090162'
        },
        {
          cbnCode: '090583',
          bankName: 'STATESIDE MFB',
          shortCode: 'STATESIDE MFB',
          institutioncbnCode: '090583'
        },
        {
          cbnCode: '070022',
          bankName: 'STB Mortgage Bank',
          shortCode: 'STB Mortgage Bank',
          institutioncbnCode: '070022'
        },
        {
          cbnCode: '090262',
          bankName: 'Stellas Microfinance bank',
          shortCode: 'STELLAS MFB',
          institutioncbnCode: '090262'
        },
        {
          cbnCode: '232',
          bankName: 'Sterling Bank',
          shortCode: 'STERLING',
          institutioncbnCode: '000001'
        },
        {
          cbnCode: '090340',
          bankName: 'Stockcorp  Microfinance Bank',
          shortCode: 'Stockcorp  MFB',
          institutioncbnCode: '090340'
        },
        {
          cbnCode: '090305',
          bankName: 'Sulsap MFB',
          shortCode: 'SULSAP MFB',
          institutioncbnCode: '090305'
        },
        {
          cbnCode: '090302',
          bankName: 'Sunbeam Microfinance Bank',
          shortCode: 'Sunbeam MFB',
          institutioncbnCode: '090302'
        },
        {
          cbnCode: '100',
          bankName: 'SUNTRUST BANK',
          shortCode: 'SUNTRUST',
          institutioncbnCode: '000022'
        },
        {
          cbnCode: '090446',
          bankName: 'Support MF Bank',
          shortCode: 'Support MFB',
          institutioncbnCode: '090446'
        },
        {
          cbnCode: '090564',
          bankName: 'SUPREME MICROFINANCE BANK LTD',
          shortCode: 'SUPREME MICROFINANCE BANK LTD',
          institutioncbnCode: '090564'
        },
        {
          cbnCode: '328',
          bankName: 'TagPay',
          shortCode: 'TAGPAY',
          institutioncbnCode: '100023'
        },
        {
          cbnCode: '302',
          bankName: 'Taj Bank',
          shortCode: 'Taj Bank',
          institutioncbnCode: '000026'
        },
        {
          cbnCode: '080002',
          bankName: 'TajWallet',
          shortCode: 'TajWallet',
          institutioncbnCode: '080002'
        },
        {
          cbnCode: '090560',
          bankName: 'TANADI MICROFINANCE BANK LTD',
          shortCode: 'TANADI MICROFINANCE BANK LTD',
          institutioncbnCode: '090560'
        },
        {
          cbnCode: '090426',
          bankName: 'TANGERINE MONEY',
          shortCode: 'TANGERINE MONEY',
          institutioncbnCode: '090426'
        },
        {
          cbnCode: '090593',
          bankName: 'TASUED MICROFINANCE BANK LTD',
          shortCode: 'TASUED MICROFINANCE BANK LTD',
          institutioncbnCode: '090593'
        },
        {
          cbnCode: '090115',
          bankName: 'TCF',
          shortCode: 'TCF MICROFINANCE',
          institutioncbnCode: '090115'
        },
        {
          cbnCode: '319',
          bankName: 'TeasyMobile',
          shortCode: 'TEASY',
          institutioncbnCode: '100010'
        },
        {
          cbnCode: '050007',
          bankName: 'Tekla Finance Ltd',
          shortCode: 'Tekla Finance Ltd',
          institutioncbnCode: '050007'
        },
        {
          cbnCode: '090373',
          bankName: 'TF MICROFINANCE BANK',
          shortCode: 'TF MFB',
          institutioncbnCode: '090373'
        },
        {
          cbnCode: '090283',
          bankName: 'THRIVE MFB',
          shortCode: 'THRIVE MFB',
          institutioncbnCode: '090283'
        },
        {
          cbnCode: '102',
          bankName: 'TITAN TRUST BANK',
          shortCode: 'TITAN TRUST',
          institutioncbnCode: '000025'
        },
        {
          cbnCode: '000032',
          bankName: 'TITAN-PAYSTACK',
          shortCode: 'TITAN-PAYSTACK',
          institutioncbnCode: '000032'
        },
        {
          cbnCode: '100039',
          bankName: 'TITAN-PAYSTACK',
          shortCode: 'TITAN-PAYSTACK',
          institutioncbnCode: '100039'
        },
        {
          cbnCode: '090613',
          bankName: 'Total Trust Microfinance Bank',
          shortCode: 'Total Trust Microfinance Bank',
          institutioncbnCode: '090613'
        },
        {
          cbnCode: '090146',
          bankName: 'Trident Microfinance Bank',
          shortCode: 'Trident MFB',
          institutioncbnCode: '090146'
        },
        {
          cbnCode: '050014',
          bankName: 'TRINITY FINANCIAL SERVICES LIMITED',
          shortCode: 'TRINITY FINANCIAL SERVICES LIMITED',
          institutioncbnCode: '050014'
        },
        {
          cbnCode: '090525',
          bankName: 'Triple A Microfinance bank',
          shortCode: 'Triple A Microfinance bank',
          institutioncbnCode: '090525'
        },
        {
          cbnCode: '090327',
          bankName: 'Trust MFB',
          shortCode: 'Trust MFB',
          institutioncbnCode: '090327'
        },
        {
          cbnCode: '090123',
          bankName: 'TrustBanc J6 Microfinance Bank Limited',
          shortCode: 'TrustBanc J6 Microfinance Bank Limited',
          institutioncbnCode: '090123'
        },
        {
          cbnCode: '090276',
          bankName: 'Trustfund Microfinance Bank',
          shortCode: 'Trustfund MFB',
          institutioncbnCode: '090276'
        },
        {
          cbnCode: '090315',
          bankName: 'U &amp; C MFB',
          shortCode: 'U &amp;AMP;C MFB',
          institutioncbnCode: '090315'
        },
        {
          cbnCode: '090403',
          bankName: 'UDA Microfinance Bank',
          shortCode: 'UDA Microfinance Bank',
          institutioncbnCode: '090403'
        },
        {
          cbnCode: '090517',
          bankName: 'Uhuru Microfinance bank',
          shortCode: 'Uhuru Microfinance bank',
          institutioncbnCode: '090517'
        },
        {
          cbnCode: '090609',
          bankName: 'Ummah Microfinance Bank',
          shortCode: 'Ummah Microfinance Bank',
          institutioncbnCode: '090609'
        },
        {
          cbnCode: '090514',
          bankName: 'Umuchinemere Procredit Microfinance Bank',
          shortCode: 'Umuchinemere Procredit Microfinance Bank',
          institutioncbnCode: '090514'
        },
        {
          cbnCode: '090510',
          bankName: 'Umunnachi Microfinance Bank',
          shortCode: 'Umunnachi Microfinance Bank',
          institutioncbnCode: '090510'
        },
        {
          cbnCode: '090331',
          bankName: 'UNAAB MFB',
          shortCode: 'UNAAB MFB',
          institutioncbnCode: '090331'
        },
        {
          cbnCode: '090266',
          bankName: 'Uniben Microfinance bank',
          shortCode: 'UNIBEN MFB',
          institutioncbnCode: '090266'
        },
        {
          cbnCode: '090193',
          bankName: 'Unical MFB',
          shortCode: 'UNICAL MFB',
          institutioncbnCode: '090193'
        },
        {
          cbnCode: '090637',
          bankName: 'Unifund Microfinance Bank',
          shortCode: 'Unifund Microfinance Bank',
          institutioncbnCode: '090637'
        },
        {
          cbnCode: '090461',
          bankName: 'UNIIBADAN Microfinance Bank',
          shortCode: 'UNIIBADAN MFB',
          institutioncbnCode: '090461'
        },
        {
          cbnCode: '090452',
          bankName: 'Unilag  Microfinance Bank',
          shortCode: 'Unilag  MFB',
          institutioncbnCode: '090452'
        },
        {
          cbnCode: '090341',
          bankName: 'unilorin Microfinance Bank',
          shortCode: 'unilorin MFB',
          institutioncbnCode: '090341'
        },
        {
          cbnCode: '090464',
          bankName: 'Unimaid Microfinance Bank',
          shortCode: 'Unimaid MFB',
          institutioncbnCode: '090464'
        },
        {
          cbnCode: '032',
          bankName: 'Union Bank',
          shortCode: 'UBN',
          institutioncbnCode: '000018'
        },
        {
          cbnCode: '033',
          bankName: 'United Bank for Africa',
          shortCode: 'UBA',
          institutioncbnCode: '000004'
        },
        {
          cbnCode: '215',
          bankName: 'Unity Bank',
          shortCode: 'UNITY',
          institutioncbnCode: '000011'
        },
        {
          cbnCode: '090338',
          bankName: 'UniUyo Microfinance Bank',
          shortCode: 'UniUyo MFB',
          institutioncbnCode: '090338'
        },
        {
          cbnCode: '090251',
          bankName: 'UNN MFB',
          shortCode: 'UNN MFB',
          institutioncbnCode: '090251'
        },
        {
          cbnCode: '090453',
          bankName: 'Uzondu MF Bank',
          shortCode: 'Uzondu MF Bank',
          institutioncbnCode: '090453'
        },
        {
          cbnCode: '110015',
          bankName: 'Vas2nets Limited',
          shortCode: 'Vas2nets Limited',
          institutioncbnCode: '110015'
        },
        {
          cbnCode: '110009',
          bankName: 'Venture Garden Nigeria Limited',
          shortCode: 'VENTURE GARDEN',
          institutioncbnCode: '110009'
        },
        {
          cbnCode: '090110',
          bankName: 'VFD MFB',
          shortCode: 'VFD MICROFINANCE',
          institutioncbnCode: '090110'
        },
        {
          cbnCode: '090139',
          bankName: 'Visa Microfinance Bank',
          shortCode: 'VISA MICROFINANCE',
          institutioncbnCode: '090139'
        },
        {
          cbnCode: '320',
          bankName: 'VTNetworks',
          shortCode: 'VTNETWORK',
          institutioncbnCode: '100012'
        },
        {
          cbnCode: '090590',
          bankName: 'WAYA MICROFINANCE BANK LTD',
          shortCode: 'WAYA MICROFINANCE BANK LTD',
          institutioncbnCode: '090590'
        },
        {
          cbnCode: '035',
          bankName: 'Wema Bank',
          shortCode: 'WEMA',
          institutioncbnCode: '000017'
        },
        {
          cbnCode: '090120',
          bankName: 'WETLAND MFB',
          shortCode: 'WETLAND MICROFINANCE',
          institutioncbnCode: '090120'
        },
        {
          cbnCode: '090419',
          bankName: 'WinView Bank',
          shortCode: 'WinView',
          institutioncbnCode: '090419'
        },
        {
          cbnCode: '110029',
          bankName: 'Woven Finance',
          shortCode: 'Woven Finance',
          institutioncbnCode: '110029'
        },
        {
          cbnCode: '090201',
          bankName: 'Xpress Payments',
          shortCode: 'Xpress Payments',
          institutioncbnCode: '090201'
        },
        {
          cbnCode: '090124',
          bankName: 'XSLNCE Microfinance Bank',
          shortCode: 'XSLNCE MICROFINANCE',
          institutioncbnCode: '090124'
        },
        {
          cbnCode: '090466',
          bankName: 'YCT Microfinance Bank',
          shortCode: 'YCT MFB',
          institutioncbnCode: '090466'
        },
        {
          cbnCode: '110027',
          bankName: 'Yello Digital financial services',
          shortCode: 'Yello Digital financial services',
          institutioncbnCode: '110027'
        },
        {
          cbnCode: '090142',
          bankName: 'Yes MFB',
          shortCode: 'YES MICROFINANCE',
          institutioncbnCode: '090142'
        },
        {
          cbnCode: '090252',
          bankName: 'Yobe MFB',
          shortCode: 'YOBE MFB',
          institutioncbnCode: '090252'
        },
        {
          cbnCode: '057',
          bankName: 'Zenith Bank',
          shortCode: 'ZENITH',
          institutioncbnCode: '000015'
        },
        {
          cbnCode: '322',
          bankName: 'ZenithMobile',
          shortCode: 'ZENITH MOBILE',
          institutioncbnCode: '100018'
        },
        {
          cbnCode: '090504',
          bankName: 'Zikora Microfinance bank',
          shortCode: 'Zikora Microfinance bank',
          institutioncbnCode: '090504'
        },
        {
          cbnCode: '100025',
          bankName: 'Zinternet-KongaPay',
          shortCode: 'Zinternet-KongaPay',
          institutioncbnCode: '100025'
        },
        {
          cbnCode: '100034',
          bankName: 'ZWallet',
          shortCode: 'ZWallet',
          institutioncbnCode: '100034'
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
