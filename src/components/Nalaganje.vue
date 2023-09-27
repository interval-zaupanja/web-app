<template>
  <div v-if="this.size === 'medium'">
    <img src="@/assets/LoadingAnimation.gif" style="height: 150px"/>
  </div>
  <div v-else-if="this.size === 'medium-small'">
    <img src="@/assets/LoadingAnimation.gif" style="height: 100px"/>
  </div>
  <div v-else>
    <img src="@/assets/LoadingAnimation.gif" style="height: 200px"/>
  </div>
</template>

<script>
// https://loading.io/license/#free-license

export default {
  name: 'Nalaganje',
  props: ['size']
}
</script>

<style scoped>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>