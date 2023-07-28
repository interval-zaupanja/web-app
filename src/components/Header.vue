<template>
  <app-header style="display: block; height: 70px" class="sticky">
    <div style="margin-left: 50px; margin-right: 30px; height: inherit">
      <div style="display: inline-block; margin-left: 10px; margin-right: 10px; font-size: 40px; height: inherit">
        <div style="display:flex; justify-content:center; align-items: center; height: inherit">
          <img src="images/logo.png" style="height: 50px"/>
        </div>
      </div>
      <div style="display: inline-block; margin-left: 40px; margin-right: 40px; height: inherit; float: right">
        <div style="display:flex; justify-content:center; align-items: center; line-height: 70px;"> <!-- *line*-height!!!-->
          <a href="glasovanja.html" class="droppable">Glasovanja ⏷</a>
          <a href="priljubljenost-politikov.html" class="droppable">Priljubljenost politikov ⏷</a>
          <a href="priljubljenost-politikov.html" class="droppable">Zaupanje ⏷</a>
          <a href="socialni-pulz.html" class="droppable">Ostalo ⏷</a>
          <a href="referendumi.html" class="droppable">Podatki ⏷</a>
          <a href="o-nas" class="undroppable">O nas</a>
        </div>
      </div>
    </div>
  </app-header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
</style>
