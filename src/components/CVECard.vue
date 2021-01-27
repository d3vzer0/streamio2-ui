<template>
  <q-timeline-entry
    :title="content._source['vulnerability.id']"
    :subtitle="content._source['publish_date']"
    color="red"
    icon="mdi-bug"
  >
    <div class="cve-desc">
      {{ content._source['vulnerability.description'] }}
    </div>
    <div class="rss-tags q-mt-md">
      <q-chip v-for="(tag, index) in content._source.tags" size="sm" v-bind:key="index" icon="mdi-pin">{{tag}}</q-chip>
    </div>
  </q-timeline-entry>
</template>

<script>
export default {
  name: 'CVECard',
  props: ['content'],
  data () {
    return {
      ok: ''
    }
  }
}
</script>
