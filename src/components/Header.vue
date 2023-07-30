<template>
  <div id="header" class="sticky">
    <div style="margin-left: 50px; margin-right: 30px; height: inherit">
      <div style="display: inline-block; margin-left: 10px; margin-right: 10px; font-size: 40px; height: inherit">
        <div style="display:flex; justify-content:center; align-items: center; height: inherit">
          <img src="../assets/logo.png" style="height: 50px"/>
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
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
#header {
    display: block;
    height: 70px;
    
    /*background-color: #f10056;*/
    /*background-color: #0080ff;*/
    /*background-color: #f6caca;*/
    /*background-image: linear-gradient(to bottom right, rgba(255, 166, 0, 0.8), rgba(255, 0, 59, 0.75));*/
    /*background-image: linear-gradient(to bottom right, rgba(29, 29, 31, 0.02), #f6caca);*/
    background-image: linear-gradient(to right, rgb(255, 255, 255), #f6caca);
    color: #ae1813;
}

.sticky { /* poskrbi, da se glava vedno drži vrha strani */
    position: fixed;
    top: 0;
    width: 100%
}

#header a {
    text-decoration: none;
    color: inherit;
    font-size: 20px;
    padding-left: 20px;
    padding-right: 20px;
}

#header a:hover {
    background-color: rgba(29, 29, 31, 0.22);
}

.droppable:hover {
    margin-top: 7px;
    margin-bottom: 0px;
    height: 63px;
    border-radius: 15px 15px 0px 0px;
}

.undroppable:hover {
    border-radius: 0px;
}
</style>
