<template>
  <q-page>
    <div class="row no-wrap shadow-1 top-header">
      <q-toolbar class="col-2">
        <q-avatar>
          <img src="/VulnLaneBets.png">
        </q-avatar>
        <q-toolbar-title>vulnstreetbets</q-toolbar-title>
      </q-toolbar>
      <q-toolbar class="col-6">
        <q-form @submit="getAllResults" style="width: 100%;">
          <q-input borderless bg-color="white" v-model="searchQuery" label="Search" style='width: 100%'>
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
      <q-toolbar class="col-2">
        <q-input v-model="startDate" class="date-input">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="startDate" mask="YYYY-MM-DD" @input="getAllResults">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-toolbar>
      <q-toolbar class="col-2">
        <q-input v-model="endDate" class="date-input">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="endDate" mask="YYYY-MM-DD" @input="getAllResults">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-toolbar>
    </div>
    <div class="row">
      <div class="col">
        <topics-treemap :results="treemapResults" v-if="treemapResults"></topics-treemap>
      </div>
    </div>
    <div class="row q-pa-md content">
      <div class="col-2">
        <q-list style="max-width: 350px">
          <q-item-label header>Stonk Exchange</q-item-label>
            <q-item>
              <q-item-section>
                <q-option-group @input="getAllResults()"
                  :options="availableColumns"
                  type="checkbox"
                  v-model="selectedColumns"
                />
              </q-item-section>
            </q-item>
        </q-list>
        <filter-component v-on:changeSelection="changeFilter" :name="agg" :results="values" v-for="(values, agg) in aggregationResults" v-bind:key="agg"></filter-component>
      </div>
      <div class="col">
        <div class="row">
          <div class="col" v-for="(results, column) in searchResults" v-bind:key="column">
            <q-timeline color="secondary">
              <component :results="results" v-bind:is="componentMapping[column]" v-on:changePage="changedPage"></component>
            </q-timeline>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { DateTime } from 'luxon'
import TopicsTreemap from 'src/components/TopicsTreemap.vue'
import FilterComponent from 'src/components/FilterComponent.vue'
import CVECard from '../components/CVECard.vue'
import TweetCard from '../components/TweetCard.vue'
import RssCard from '../components/RssCard.vue'

export default {
  name: 'PageIndex',
  props: ['query'],
  components: {
    CVECard,
    TweetCard,
    FilterComponent,
    RssCard,
    TopicsTreemap
  },
  data () {
    return {
      searchQuery: this.query,
      searchStart: 0,
      searchLimit: 20,
      searchFilters: {},
      selectedColumnsStore: ['NVD', 'rss', 'twitter'],
      selectedFiltersStore: {},
      availableColumns: [
        {
          label: 'NVD NeXT',
          value: 'NVD'
        },
        {
          label: 'RSS Traders BV.',
          value: 'rss'
        },
        {
          label: 'Twitter Securities Inc.',
          value: 'twitter'
        }
      ],
      searchResults: {
      },
      searchAggs: {
        'rss.source': {
          type: 'terms',
          size: 20
        },
        'vulnerability.id': {
          type: 'terms',
          size: 20
        }
      },
      treemapResults: null,
      aggregationResults: {},
      searchExclude: [
        {
          field: 'nvd.module',
          term: 'references'
        },
        {
          field: 'nvd.module',
          term: 'impacted'
        }
      ],
      componentMapping: {
        NVD: 'CVECard',
        rss: 'RssCard',
        twitter: 'TweetCard'
      },
      startDate: DateTime.local().minus({ days: 3 }).toISODate(),
      endDate: DateTime.local().toISODate()
    }
  },
  computed: {
    currentDate () {
      return DateTime.local()
    },
    selectedColumns: {
      get () {
        return this.selectedColumnsStore
      },
      set (columns) {
        this.selectedColumnsStore = columns
        var columnFilters = []
        columns.forEach(column => {
          columnFilters.push({ term: column })
        })
        this.searchFilters['event.provider'] = columnFilters
      }
    }
  },
  mounted () {
    this.getAllResults()
  },
  methods: {
    changeFilter (agg, values) {
      var formattedFilters = []
      values.forEach(value => {
        formattedFilters.push({ term: value })
      })
      this.searchFilters[agg] = formattedFilters
      this.getAllResults()
    },
    changedPage (column, newpage) {
      const newStart = (newpage - 1) * column.limit
      this.runSearch([column.column], newStart)
    },
    getAllResults () {
      for (var column of Object.keys(this.searchResults)) {
        this.$delete(this.searchResults, column)
      }
      this.runSearch(this.selectedColumns)
      this.getTree()
    },
    getTree () {
      var postData = {
        query: this.searchQuery,
        start: 0,
        column: 'treemap',
        limit: 0,
        aggregations: {
          tags: {
            type: 'terms',
            count: 20
          }
        },
        filters: {
          ...this.searchFilters
        },
        exclude: this.searchExclude
      }
      this.$axios
        .post('/search', [postData])
        .then(response => this.getTreeSuccess(response.data))
    },
    getTreeSuccess (response) {
      this.treemapResults = response[0]
      for (const [key, value] of Object.entries(response[0].aggregations)) {
        this.aggregationResults[key] = value
      }
    },
    runSearch (columns, start = 0, limit = 30) {
      var searchQueries = []
      columns.forEach(column => {
        var postData = {
          query: this.searchQuery,
          start: start,
          column: column,
          limit: limit,
          filters: {
            ...this.searchFilters,
            'event.provider': [{ term: column }]
          },
          exclude: this.searchExclude
        }
        searchQueries.push(postData)
      })
      this.$axios
        .post('/search', searchQueries)
        .then(response => this.runSearchSuccess(response.data))
    },
    runSearchSuccess (response) {
      response.forEach(results => {
        this.$set(this.searchResults, results.column, results)
      })
    }
  }
}
</script>

<style lang="scss">
.trendingchart {
  margin-top: 100px;
  width: 100%;
  height: 200px;
}

.top-header {
  background-color: white;
}

.date-input {
  padding-bottom: 0px;
}

body{
  background-color: rgb(249, 249, 249);
}

</style>
