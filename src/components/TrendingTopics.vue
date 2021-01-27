<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'TrendingTopics',
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData'],
  data () {
    return {
      newData: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        datasets: [
          {
            label: 'CVE-2020-1946',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            data: [3, 5, 15, 30]
          },
          {
            label: 'CVE-2019-1246',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            data: [1, 10, 15, 3]
          },
          {
            label: 'HeartBl00d',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            data: [2, 2, 7, 3]
          },
          {
            label: 'TA848494',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            data: [0, 0, 4, 5]
          },
          {
            label: 'CVE-2020-8414',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            data: [3, 4, 4, 2]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: 'Trending topics'
        },
        legend: {
          labels: {
            boxWidth: 0,
            fontColor: '#ffffff'
          },
          display: false,
          align: 'center',
          position: 'bottom'
        },
        scales: {
          scaleShowLabels: false,
          xAxes: [{
            ticks: {
              display: false,
              fontColor: '#ffffff'
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.chartData = this.newData
    this.renderChart(this.chartData, this.options)
  },
  computed: {
  },
  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style lang="scss">

</style>
