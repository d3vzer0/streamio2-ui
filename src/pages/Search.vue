<template>
  <q-page>
    <div class="row no-wrap shadow-1 top-header">
      <q-toolbar class="col-2">
        <q-toolbar-title>StreamIO</q-toolbar-title>
      </q-toolbar>
      <q-toolbar class="col-6">
        <q-form @submit="getAll">
          <q-input borderless bg-color="white" v-model="searchQuery" label="Search" style='width: 100%'>
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
      <q-toolbar class="col-2">
        <q-input v-model="startDate" mask="date" :rules="['date']" class="date-input">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="startDate">
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
        <q-input v-model="endDate" mask="date" :rules="['date']" class="date-input">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="endDate">
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
    <div class="row q-pa-md content">
      <div class="col-2">
        <q-list>
          <q-item v-for="(values, agg) in aggregationResults" v-bind:key="agg">
            <!-- <q-item-label header>{{agg}}</q-item-label> -->
            <q-item-section side>
              <q-radio v-model="shape" :val="val.key" :label="val.key" v-for="(val, row) in values" v-bind:key="row">
                <!-- {{val}} {{row}}
                {{agg}} -->
              </q-radio>

              <!-- <q-option-group dense
                v-model="availableFilters.cveId.group"
                :options="availableFilters.cveId.options"
                type="checkbox"
              /> -->
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-4">
            <q-timeline color="secondary" >
              <component :content="result" v-bind:is="componentMapping[result._source['event.provider']]" v-for="(result, index) in nvdResults" v-bind:key="index"/>
            </q-timeline>
          </div>
          <div class="col-4">
            <q-timeline color="secondary" >
              <component :content="result" v-bind:is="componentMapping[result._source['event.provider']]" v-for="(result, index) in rssResults" v-bind:key="index"/>
            </q-timeline>
          </div>
          <div class="col-4">
            <q-timeline color="secondary" >
              <component :content="result" v-bind:is="componentMapping[result._source['event.provider']]" v-for="(result, index) in twitterResults" v-bind:key="index"/>
            </q-timeline>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { DateTime } from 'luxon'
import CVECard from '../components/CVECard.vue'
import TweetCard from '../components/TweetCard.vue'
import RssCard from '../components/RssCard.vue'

export default {
  name: 'PageIndex',
  props: ['query'],
  components: {
    CVECard,
    TweetCard,
    RssCard
  },
  data () {
    return {
      searchQuery: this.query,
      searchStart: 0,
      searchLimit: 20,
      searchFilters: {},
      searchAggs: {
        // 'event.provider': {
        //   type: 'terms',
        //   size: 20
        // }
        // 'rss.source': {
        //   type: 'terms',
        //   size: 20
        // },
        // 'vulnerability.id': {
        //   type: 'terms',
        //   size: 20
        // }
      },
      shape: null,
      twitterResults: [],
      nvdResults: [],
      rssResults: [],
      otherResults: [],
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
      searchResults: [],
      componentMapping: {
        NVD: 'CVECard',
        rss: 'RssCard',
        twitter: 'TweetCard'
      },
      startDate: DateTime.local().minus({ days: 30 }).toISODate(),
      endDate: DateTime.local().toISODate()
    }
  },
  computed: {
    currentDate () {
      return DateTime.local()
    }
  },
  mounted () {
    this.getAll()
  },
  methods: {
    getAll () {
      // this.runSearch(this.runSearchSuccess)
      this.getTweets()
      this.getRss()
      this.getNvd()
    },
    getTweets () {
      this.twitterResults = []
      this.searchFilters = { 'event.provider': { term: 'twitter' } }
      this.runSearch(this.runSearchSuccess)
    },
    getRss () {
      this.rssResults = []
      this.searchFilters = { 'event.provider': { term: 'rss' } }
      this.runSearch(this.runSearchSuccess)
    },
    getNvd () {
      this.nvdResults = []
      this.searchFilters = { 'event.provider': { term: 'NVD' } }
      this.runSearch(this.runSearchSuccess)
    },
    runSearch (callback) {
      const postData = {
        query: this.searchQuery,
        start: this.searchStart,
        limit: this.searchLimit,
        aggregations: this.searchAggs,
        filters: this.searchFilters,
        exclude: this.searchExclude
      }
      this.$axios
        .post('/search', postData)
        .then(response => callback(response.data))
    },
    runSearchSuccess (response) {
      response.results.forEach(element => {
        switch (element._source['event.provider']) {
          case 'twitter':
            this.twitterResults.push(element)
            break
          case 'rss':
            this.rssResults.push(element)
            break
          case 'NVD':
            this.nvdResults.push(element)
            break
          default:
            this.otherResults.push(element)
        }
      })
      this.aggregationResults = response.aggregations
    }
  }
}
</script>

<style lang="scss">

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
