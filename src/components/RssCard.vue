<template>
  <q-timeline-entry
    :title="content._source['rss.source']"
    :subtitle="content._source['publish_date']"
    color="orange"
    icon="mdi-rss"
  >
    <div class="rss-title">
      {{content._source['rss.title']}}
    </div>
    <div class="rss-tags q-mt-md">
      <q-chip v-for="(tag, index) in content._source.tags" size="sm" v-bind:key="index" icon="mdi-pin">{{tag}}</q-chip>
    </div>
    <div class="rss-tags">
      <q-chip v-for="(tag, index) in content._source.tags" size="sm" v-bind:key="index" icon="mdi-pin">{{tag}}</q-chip>
    </div>
  </q-timeline-entry>
</template>

<script>
export default {
  name: 'RSSCard',
  props: ['content'],
  data () {
    return {
      ok: ''
    }
  }
}
</script>
