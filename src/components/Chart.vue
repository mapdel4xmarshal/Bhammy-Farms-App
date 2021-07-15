<template>
  <chart :options="options"></chart>
</template>

<script>
import { Chart } from 'highcharts-vue';

export default {
  name: 'CustomChart',
  components: { Chart },
  data() {
    return {
      chartOptions: {
        chart: {
          backgroundColor: 'transparent',
          spacingTop: 30,
          zoomType: 'x'
        },
        title: false,
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: [{ title: false }, {
          min: 0,
          max: 1,
          tickPositions: [],
          title: ''
        }],
        tooltip: {
          shared: true,
          headerFormat: '<b>{point.key}</b><br/>'
        },
        series: [{
          name: 'Amount',
          type: 'areaspline',
          color: '#7f2775',
          fillOpacity: 0.1,
          data: [{ x: new Date(), y: 0 }]
        }]
      }
    };
  },
  props: {
    name: {
      type: String
    },
    yAxisLabelFormatter: {
      type: Function
    },
    xAxisLabelFormatter: {
      type: Function
    },
    series: {
      type: Array
    },
    legendEnabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    options() {
      const options = { ...this.chartOptions };
      options.legend.enabled = this.legendEnabled;
      if (this.yAxisLabelFormatter) options.yAxis.labels = { formatter: this.yAxisLabelFormatter() };
      if (this.xAxisLabelFormatter) options.xAxis.labels = { formatter: this.xAxisLabelFormatter() };
      options.series = this.series;
      return options;
    }
  }
};
</script>

<style scoped>

</style>
