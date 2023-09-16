<template>
  <div v-if="this.size === 'medium'">
    <h3 style="text-align: center">Nalaganje...</h3>
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" style="height: 200px"/>
  </div>
  <div v-else-if="this.size === 'medium-small'">
    <h5 style="text-align: center">Nalaganje...</h5>
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" style="height: 100px"/>
  </div>
  <div v-else>
    <h1 style="text-align: center">Nalaganje...</h1>
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"/>
  </div>
</template>

<script>
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