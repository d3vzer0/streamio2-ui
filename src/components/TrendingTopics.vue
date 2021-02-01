<template>
  <apexchart type="bar" height="300" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import { DateTime } from 'luxon'
export default {
  name: 'TrendingTopics',
  props: ['results'],
  data () {
    return {
      series: this.parsedData(),
      chartOptions: {
        chart: {
          type: 'bar',
          stackType: '100%',
          height: 200,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        grid: {
          show: false
        },
        // responsive: [{
        //   breakpoint: 480,
        //   options: {
        //     legend: {
        //       position: 'bottom',
        //       offsetX: -10,
        //       offsetY: 0
        //     }
        //   }
        // }],
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: [{
                from: -30,
                to: 5,
                name: 'low',
                color: '#00A100'
              },
              {
                from: 6,
                to: 20,
                name: 'medium',
                color: '#128FD9'
              },
              {
                from: 21,
                to: 45,
                name: 'high',
                color: '#FFB200'
              },
              {
                from: 46,
                to: 55,
                name: 'extreme',
                color: '#FF0000'
              }
              ]
            }
          }
        },
        // plotOptions: {
        //   bar: {
        //     horizontal: true
        //   }
        // },
        xaxis: {
          type: 'categories',
          // type: 'datetime',
          categories: this.parsedLabels()
        },
        legend: {
          position: 'bottom'
        },
        fill: {
          opacity: 1
        }
      }
    }
  },
  mounted () {
    this.chartData = this.newData
  },
  computed: {

  },
  methods: {
    parsedLabels () {
      var labels = []
      const histogramData = this.results.aggregations.histogram_data
      histogramData.forEach(date => {
        var cleanDate = date.key_as_string.replace(' ', 'T')
        labels.push(DateTime.fromISO(cleanDate).toISO())
      })
      return labels
    },
    parsedData: function () {
      var datasets = {}
      const labelLength = this.parsedLabels().length
      const histogramData = this.results.aggregations.histogram_data
      for (const [i, date] of histogramData.entries()) {
        date.tags.buckets.forEach(vuln => {
          if (!(vuln.key in datasets)) {
            datasets[vuln.key] = {
              name: vuln.key,
              data: new Array(labelLength).fill(0)
            }
          }
          datasets[vuln.key].data.splice(i, 0, vuln.doc_count)
        })
      }
      const denormalizedValues = []
      for (const value of Object.values(datasets)) {
        denormalizedValues.push(value)
      }
      return denormalizedValues
    }
  }
}
</script>

<style lang="scss">

</style>
