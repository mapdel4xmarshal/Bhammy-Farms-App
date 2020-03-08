<template>
  <div style="overflow-y: auto; height:100vh;">
  <div class="invoice-container">
    <div class="invoice-header">
      <img src="../../assets/images/Logofull.png" height="50px"/>
      <div class="bill-from">
        <strong>Bhammy Farms Inc.</strong>
        <i>1234, Address Area,</i>
        <i>Ilorin, Kwara-State</i>
      </div>
      <hr>

      <div style="width:100%;">
        <div class="bill-to">
          <strong>CUSTOMER:</strong>
          <span style="font-size: 12px; text-transform: uppercase;">{{ invoice.customerName }}</span>
          <i>1234, Address Area,</i>
          <i>Ilorin, Kwara-State</i>
        </div>

        <div class="invoice-stats">
          <div><strong>Status:</strong></div>
          <div class="grid-item-1" :class="invoice.paymentStatus">{{ invoice.paymentStatus }}</div>
          <div><strong>Invoice #:</strong></div>
          <div>{{ invoice.id }}</div>
          <div><strong>Date:</strong></div>
          <div>31/12/2018</div>
          <div><strong>Due date:</strong></div>
          <div>31/12/2018</div>
          <div><strong>Total due:</strong></div>
          <div>₦24526</div>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <th width="40%">DESCRIPTION</th>
        <th width="15%">UNIT</th>
        <th width="15%">PRICE</th>
        <th width="20%">TOTAL</th>
      </thead>
      <tbody>
        <tr v-for="item in 4" :key="item">
          <td>Jumbo Egg</td>
          <td>100</td>
          <td>N900</td>
          <td>N90,000</td>
        </tr>
      <tr>
        <td></td>
        <td></td>
        <td>
          <strong>TOTAL</strong>
          <span>PAID</span>
          <span>PAID</span>
          <span>BAL.</span>
        </td>
        <td>
          ₦125,000
          <span>₦50,000</span>
          <span>₦50,000</span>
          <span>₦25,000</span>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
  </div>
</template>

<script>
export default {
  name: 'ViewInvoice',
  props: ['invoice'],
};
</script>

<style scoped>
  .invoice-container{
    background-color: #fff;
    padding: 15px;
    min-height: calc(100vh - var(--header-nav-height));
  }

  .bill-from{
    float:right;
    text-align: right;
    display: inline-block;
  }

  .bill-to{
    text-align: left;
    display: inline-block;
  }

  .bill-from i, .bill-from strong, .bill-to i, .bill-to strong{
    display: block;
    font-size: 14px;
  }

  .invoice-stats{
    display: inline-grid;
    grid-template-columns: auto auto;
    grid-column-gap: 5px;
    float: right;
    font-size: 14px;
  }

  .grid-item-1 {
    text-transform: uppercase;
  }

  .paid{
    color: var(--paidColor);
  }

  .due{
    color: var(--dueColor);
  }

  .unpaid{
    color: var(--unpaidColor);
  }

  .partial{
    color: var(--partialColor);
  }

  .draft{
    color: var(--draftColor);
  }

  table{
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
    margin-top: 30px;
  }

  th{
    background-color: #eee;
    color: #000;
    font-size: 12px;
    padding:5px;
  }

  tr{
    border-bottom: 1px solid #80808052;
    padding: 5px 0;
  }

  td{
    font-size: 12px;
    padding: 5px;
    color: #747474;
  }

  /*tr:nth-child(even){
    background-color: #f2f2f2;
  }*/

</style>
