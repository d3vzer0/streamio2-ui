<template>
<div class="modular-filter">
  <q-item-label header>{{name | upper}}</q-item-label>
    <q-item>
      <q-item-section>
          <q-option-group
          :options="options"
          type="checkbox"
          v-model="selected"
          />
      </q-item-section>
  </q-item>
</div>
</template>

<script>
export default {
  name: 'FilterComponent',
  props: ['results', 'name'],
  data () {
    return {
      selectedValues: []
    }
  },
  computed: {
    options: function () {
      var allOptions = []
      this.results.forEach(doc => {
        allOptions.push({ label: doc.key, value: doc.key })
      })
      return allOptions
    },
    selected: {
      get: function () {
        return this.selectedValues
      },
      set: function (values) {
        this.selectedValues = values
        this.$emit('changeSelection', this.name, values)
      }
    }
  }
}
</script>
