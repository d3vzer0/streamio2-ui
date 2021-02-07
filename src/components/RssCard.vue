<template>
  <div class="rss-timeline">
    <q-dialog v-model="showDialog" v-if="dialogContent">
       <q-card style="width: 1000px;">
        <q-card-section>
          <div class="text-h6"> {{ dialogContent._source['rss.title'] }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-markdown>{{ sanitizeContent(dialogContent._source['rss.content']) }}</q-markdown>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="timeline-pages">
      <q-pagination
        style="margin-left: -8px;" unelevated dense color="orange"
        rounded v-model="currentPage" :max="totalPages" :max-pages="5">
      </q-pagination>
    </div>
    <div class="timeline-content">
      <q-timeline>
        <q-timeline-entry
          :subtitle="content._source['publish_date']"
          color="orange"
          icon="mdi-rss"
          v-for="(content, index) in results.results" v-bind:key="`rss-${index}`"
          >
          <template v-slot:title @click="showDialog = true">
            {{ content._source['rss.source'] }}
          </template>
          <div class="rss-title">
            {{content._source['rss.title']}}
            <br/><br/>
            <q-btn size="xs" @click="showDialog = true, dialogContent = content" color="orange"
             unelevated text-color="white">Read more</q-btn>
          </div>
          <div class="rss-tags q-mt-md">
            <q-chip v-for="(tag, index) in content._source.tags" size="sm" v-bind:key="index" icon="mdi-pin">{{tag | truncate(20, '...') }}</q-chip>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </div>

</template>

<script>
import sanitizeHtml from 'sanitize-html'
import TurndownService from 'turndown'

export default {
  name: 'RSSCard',
  props: ['results'],
  data () {
    return {
      showDialog: false,
      dialogContent: null
    }
  },
  methods: {
    sanitizeContent (content) {
      const turndownService = new TurndownService({ headingStyle: 'atx' })
      return turndownService.turndown(sanitizeHtml(content))
    }
  },
  computed: {
    currentPage: {
      get: function () {
        return Math.floor(this.results.start / this.results.limit) + 1
      },
      set: function (input) {
        this.$emit('changePage', this.results, input)
      }
    },
    totalPages: {
      get: function () {
        return Math.ceil(this.results.total / this.results.limit)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-content {
  margin-top: 10px;
}
.btn-fixed-width {
  width: 90px;
}
</style>
