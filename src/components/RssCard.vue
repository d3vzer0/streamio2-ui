<template>
  <div class="rss-timeline">
    <div class="timeline-pages">
      <q-pagination
        style="margin-left: -8px;" unelevated dense color="orange"
        rounded v-model="currentPage" :max="totalPages" :max-pages="5">
      </q-pagination>
    </div>
    <div class="timeline-content">
      <q-timeline>
        <q-timeline-entry
          :title="content._source['rss.source']"
          :subtitle="content._source['publish_date']"
          color="orange"
          icon="mdi-rss"
          v-for="(content, index) in results.results" v-bind:key="`rss-${index}`"
          >
          <div class="rss-title">
            {{content._source['rss.title']}}
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
export default {
  name: 'RSSCard',
  props: ['results'],
  data () {
    return {
      ok: ''
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
</style>
