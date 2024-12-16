<template>
  <div style="width: 100%; margin-top: auto; margin-bottom: auto" :class="this.getSize()">
    <img src="@/assets/LoadingAnimation.gif" :class="this.getSizeImg()"/>
    <div class="loading-message caption" v-if="longLoading && !serverUnresponsive">Prosimo počakajte. Včasih lahko traja nekaj časa (tudi do minuto) preden se API strežnik ogreje.</div>
    <div class="loading-message caption" v-if="serverUnresponsive">API strežnik se ne odziva ☹️</div>
  </div>
</template>

<script>
// https://loading.io/license/#free-license

export default {
  name: 'Nalaganje',
  props: ['size'],
  data() {
    return {
      longLoading: false,
      serverUnresponsive: false
    }
  },
  methods: { // for some reason couldn't this to work with the nullish coalescing operator inside the template
    getSize() {
      return this.size == undefined ? 'medium' : this.size
    },
    getSizeImg() {
      return this.getSize() + '-img'
    }
  },
  mounted() {
    setTimeout(() => {
        this.longLoading = true
    }, 3000, this.hash);

    setTimeout(() => {
        this.serverUnresponsive = true
    }, 80000, this.hash); // if the server does not respond within 80 seconds, it is deemed to be unresponsive
  },
  beforeUnmount() {
    clearTimeout(this.timeoutId); // prevents unnecessary side-effects
  }
}
</script>

<style scoped>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.loading-message {
  margin-top: 25px;
  text-align: center;
}


/* Loading icon sizes */
.large-img {
  height: 200px;
}
.large {
  padding-top: 150px;
  padding-bottom: 150px;
}

.medium-img {
  height: 150px;
}
.medium {
  padding-top: 100px;
  padding-bottom: 100px;
}

.medium-small-img {
  height: 100px;
}
.medium-small {
  padding-top: 50px;
  padding-bottom: 50px;
}

</style>