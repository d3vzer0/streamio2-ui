<template>
  <apexchart v-if="series.length" type="treemap" height="200" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  name: 'TrendingTreemap',
  props: ['results'],
  data () {
    return {
      series: [],
      chartOptions: {
        colors: [
          '#362E41',
          '#512D3D',
          '#6B2C39',
          '#A12A31',
          '#BC292D',
          '#D62828',
          '#E75414',
          '#EB5F0F',
          '#EF6A0A',
          '#F77F00',
          '#EF6537',
          '#C0ADDB'
        ],
        chart: {
          type: 'treemap',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false
          }
        },
        legend: {
          position: 'bottom'
        },
        fill: {
          opacity: 1
        },
        grid: {
          padding: {
            top: -25,
            left: 0,
            right: -25
          }
        }
      }
    }
  },
  mounted () {
    this.parsedData(this.results)
  },
  watch: {
    results: function (newVal, oldVal) {
      this.parsedData(newVal)
    }
  },
  methods: {
    parsedData: function (results) {
      var datasets = []
      const histogramData = results.aggregations.tags
      histogramData.forEach(element => {
        datasets.push({
          x: element.key,
          y: element.doc_count
        })
      })
      this.series = [{ data: datasets }]
    }
  }
}
</script>
