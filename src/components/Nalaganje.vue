<template>
  <div style="width: 100%">
    <div v-if="this.size === 'medium'">
      <img src="@/assets/LoadingAnimation.gif" style="height: 150px; margin: 100px; margin-left: auto; margin-right: auto"/>
    </div>
    <div v-else-if="this.size === 'medium-small'">
      <img src="@/assets/LoadingAnimation.gif" style="height: 100px; margin: 50px; margin-left: auto; margin-right: auto"/>
    </div>
    <div v-else>
      <img src="@/assets/LoadingAnimation.gif" style="height: 200px; margin: 300px; margin-left: auto; margin-right: auto"/>
    </div>
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