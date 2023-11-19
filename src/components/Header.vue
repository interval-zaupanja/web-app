<template>
  <div id="header" class="sticky">
    <div id="header-strip" class="white-pink">
      <!-- logo -->
      <router-link to="/" style="display: inline-block; margin-left: 40px; margin-right: 40px; max-width: 50%; vertical-align: middle;">
        <img src="@/assets/logo.png" style="max-height: 50px;"/>
      </router-link>

      <!-- navbar -->
      <div v-if="this.navbar_full" id="navbar" style="display: inline-block; margin-left: 40px; margin-right: 40px; float: right; vertical-align: middle; align-items: center;">
        <ul id="menu-list" style="margin: 0px">
          <li><router-link to="/glasovanja">Glasovanja</router-link></li>
          <li><router-link to="/priljubljenost">Priljubljenost</router-link></li>
          <li><router-link to="/zaupanje">Zaupanje</router-link></li>
          <li>
            <router-link to="">Drugo ⏷</router-link>
            <ul class="dropdown">
              <li><router-link to="/ankete">Ankete</router-link></li>
              <li><router-link to="/izvajalci">Izvajalci</router-link></li>
              <li><router-link to="/zalozniki">Založniki</router-link></li>
              <li><router-link to="/stranke">Stranke</router-link></li>
              <li class="zadnji"><router-link to="/osebe">Osebe</router-link></li>
            </ul>
          </li>
          <li><router-link to="/o-nas">O nas</router-link></li>
        </ul>
      </div>

      <!-- menu bar button -->
      <div
        v-if="!this.navbar_full"
        id="menu-bar-button"
        style="display: inline-block; margin-left: 30px; margin-right: 30px; float: right; vertical-align: middle; line-height: 70px;"
      >
        <img
          v-if="!this.navbar_menu_expanded"
          width="45" height="45"
          src="@/assets/icons/menu.png" alt="menu--v1"
          @click="navbar_menu_expanded = true"
        />
        <img
          v-else
          width="45" height="45"
          src="@/assets/icons/close-menu.png" alt="delete-sign--v1"
          @click="closeMenu()"
        />
      </div>
    </div>

    <div id="menu-bar" v-if="navbar_menu_expanded" class="white-pink">
      <ul id="dropdown-nav" style="margin: 0px">
        <li @click="closeMenu()"><router-link to="/glasovanja">Glasovanja</router-link></li>
        <li @click="closeMenu()"><router-link to="/priljubljenost">Priljubljenost</router-link></li>
        <li @click="closeMenu()"><router-link to="/zaupanje">Zaupanje</router-link></li>
        <li>
          <router-link to="" @click="this.drugo_expanded = !this.drugo_expanded">Drugo <span v-if="!this.drugo_expanded">⏷</span><span v-else>⏶</span></router-link>
          <ul v-if="this.drugo_expanded">
            <li @click="closeMenu()"><router-link to="/ankete">Ankete</router-link></li>
            <li @click="closeMenu()"><router-link to="/izvajalci">Izvajalci</router-link></li>
            <li @click="closeMenu()"><router-link to="/zalozniki">Založniki</router-link></li>
            <li @click="closeMenu()"><router-link to="/stranke">Stranke</router-link></li>
            <li @click="closeMenu()"><router-link to="/osebe">Osebe</router-link></li>
          </ul>
        </li>
        <li @click="closeMenu()"><router-link to="/o-nas">O nas</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      navbar_full: true,
      navbar_menu_expanded: false,
      windowWidth: null,
      drugo_expanded: false
    }
  },
  created() {
    window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
    this.checkScreen() // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
  },
  methods: {
    toogleNavbar() {
      this.navbar_full = !this.navbar_full
    },
    checkScreen() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 1025) {
        this.navbar_full = false
      } else {
        this.navbar_full = true
        this.navbar_menu_expanded = false
      }
    },
    closeMenu() {
      this.navbar_menu_expanded = false
      this.drugo_expanded = false
    }
  }
}
</script>

<style scoped>
/* celotna glava */
#header-strip {
    display: block;
    height: 70px;
    line-height: 70px; /* potrebno, da vertical-align deluje */
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
  backdrop-filter: blur(15px);
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

#dropdown-nav {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#dropdown-nav li a {
  padding-top: 10px;
  padding-bottom: 10px;
}

#dropdown-nav li ul {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #a59394be;
}
</style>
