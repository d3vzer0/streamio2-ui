<template>
  <q-page :style="dynamicBackground">
    <div class="row flex-center">
      <div class="search-index col-xl-4 col-lg-4 col-md-6 col-sm-7 col-xs-9">
        <q-form @submit="onSearch">
          <q-input rounded clearable outlined bg-color="white" v-model="searchQuery" label="Search">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-form>
      </div>
    </div>
    <div class="bg-tip">
      <p>Photo by <a :href="unsplashUserProfile">{{selectedBackground.user.name }}</a> on <a :href="unsplashHome">Unsplash</a></p>
    </div>
  </q-page>
</template>

<script>

export default {
  components: {
  },
  name: 'PageIndex',
  data () {
    return {
      searchQuery: null,
      unsplashRef: '?utm_source=StreamIO&utm_medium=referral',
      selectedBackground: {
        urls: {
          regular: 'https://unsplash.com/photos/jFCViYFYcus/download?force=true&w=1920'
        },
        user: {
          name: 'Lukasz Szmigiel',
          username: 'szmigieldesign'
        },
        links: {
          html: 'https://unsplash.com/@szmigieldesign'
        }
      },
      backgroundImages: []
    }
  },
  created () {
    this.getBackgroundImage()
    this.$nextTick(function () {
      window.setInterval(() => {
        this.loopBackgroundImage()
      }, 50000)
    })
  },
  computed: {
    dynamicBackground () {
      return {
        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${this.selectedBackground.urls.regular})`
      }
    },
    unsplashUserProfile () {
      return this.selectedBackground.user.links.html + this.unsplashRef
    },
    unsplashHome () {
      return 'https://unsplash.com/' + this.unsplashRef
    }
  },
  methods: {
    getBackgroundImage () {
      this.$axios
        .get('unsplash')
        .then(response => this.getBackgroundImageSuccess(response.data))
    },
    getBackgroundImageSuccess (response) {
      this.backgroundImages = response
      this.selectedBackground = response[0]
    },
    loopBackgroundImage () {
      this.selectedBackground = this.backgroundImages[Math.floor(Math.random() * this.backgroundImages.length)]
    },
    onSearch () {
      this.$router.push({ path: 'search', query: { q: this.searchQuery } })
    }
  }
}
</script>

<style lang="scss">
.q-page {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.search-index {
  margin-top: 200px;
  height: 100px;
}

.bg-tip {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: white;
  a:link {
    color: inherit;
    text-decoration: none;
    font-weight: bold;
  }

}
</style>
