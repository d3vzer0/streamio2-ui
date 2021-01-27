<template>
  <q-timeline-entry
    :title="`@${content._source['tweet.username']} / ${content._source['tweet.full_name']}`"
    :subtitle="content._source['publish_date']"
    color="blue"
    icon="mdi-twitter"
  >
    <div class="rss-title">
      {{ content._source['tweet.content'] }}
    </div>
    <div class="rss-tags q-mt-md">
      <q-chip v-for="(tag, index) in content._source.tags" size="sm" v-bind:key="index" icon="mdi-pin">{{tag}}</q-chip>
    </div>
  </q-timeline-entry>
</template>

<script>
export default {
  name: 'TweetCard',
  props: ['content'],
  data () {
    return {
      ok: ''
    }
  }
}
</script>
