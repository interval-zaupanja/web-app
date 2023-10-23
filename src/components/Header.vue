<template>
  <div id="header" class="sticky white-pink">
    <div style="margin-left: 50px; margin-right: 30px; height: inherit">

      <!-- logo -->
      <router-link to="/" style="display: inline-block; height: inherit">
        <div style="display: inline-block; margin-left: 10px; margin-right: 10px; font-size: 40px; height: inherit">
          <div style="display:flex; justify-content:center; align-items: center; height: inherit">
            <img src="@/assets/logo.png" style="height: 50px"/>
          </div>
        </div>
      </router-link>

      <!-- navbar -->
      <div id="nav" style="display: inline-block; margin-left: 40px; margin-right: 40px; height: inherit; float: right">
        <div style="display:flex; justify-content:center; align-items: center; line-height: 70px;"> <!-- *line*-height!!!-->

          <ul id="menu-list">
            <li><router-link to="/glasovanja" class="undroppable">Glasovanja</router-link></li>
            <li><router-link to="/priljubljenost-politikov" class="droppable">Priljubljenost politikov</router-link></li>
            <li><router-link to="/zaupanje" class="droppable">Zaupanje</router-link></li>
            <li class="droppable">
              <router-link to="">Drugo ⏷</router-link>
              <ul class="dropdown">
                <li><router-link to="/ankete" class="undroppable">Ankete</router-link></li>
                <li><router-link to="/izvajalci" class="undroppable">Izvajalci</router-link></li>
                <li><router-link to="/narocniki" class="undroppable">Naročniki</router-link></li>
                <li class="zadnji"><router-link to="/stranke" class="undroppable">Stranke</router-link></li>
              </ul>
            </li>
            <li><router-link to="/o-nas" class="undroppable">O nas</router-link></li>
          </ul>

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
/* celotna glava */
#header {
    display: block;
    height: 70px;
    color: #ae1813;
}

.sticky { /* poskrbi, da se glava vedno drži vrha strani */
    position: fixed;
    top: 0;
    width: 100%
}

/* navbar */

.menu-list > *  {
  padding: 0;
  margin: 0;
}

ul {
  list-style: none;
}

ul li {
  display: inline-block;
  position: relative;
}

ul li a {
  display: block;
  padding: 0px 20px;
  text-decoration: none;
  color: #ae1813;
  font-size: 20px;
  text-align: center;
}

ul li ul.dropdown li {
  display: block;
  text-align: center;
  background: #c8b2b3be;
  backdrop-filter: blur(5px);
}

ul li ul.dropdown li a {
  padding: 0;
}

ul li ul.dropdown {
  width: 100%;
  position: absolute;
  z-index: 999;
  display: none;
}

ul li:hover {
  background: #1d1d1f38;
}

ul li ul.dropdown li:hover {
  background: #a59394be;
}

ul li:hover ul.dropdown {
  display: block;
}

ol, ul {
  padding-left: 0;
}

.zadnji {
  border-radius: 0px 0px 15px 15px;
}
</style>
