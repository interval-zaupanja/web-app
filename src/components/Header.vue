<template>
  <div id="header" class="sticky" @wheel.prevent @touchmove.prevent @scroll.prevent>
    <div class="background blur">
      <div id="header-strip">
        <!-- logo -->
        <div class="logo" @click="$router.push('/'); closeMenu()">
          <div>
            <img src="@/assets/logo-white.png" />
          </div>
        </div>

        <!-- navbar -->
        <div v-if="this.navbar_full" id="navbar"
          style="display: inline-block; margin-left: 40px; margin-right: 40px; float: right; vertical-align: middle; align-items: center;">
          <ul id="menu-list" style="margin: 0px">
            <li><router-link to="/glasovanja">Glasovanja</router-link></li>
            <li><router-link to="/priljubljenost">Priljubljenost</router-link></li>
            <!-- <li><router-link to="/zaupanje">Zaupanje</router-link></li> -->
            <li>
              <router-link to="">
                Drugo
                <span class="material-symbols-outlined">keyboard_arrow_down</span>
              </router-link>
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
        <div v-if="!this.navbar_full" id="menu-bar-button"
          style="display: inline-block; margin-left: 30px; margin-right: 30px; float: right; vertical-align: middle; line-height: 70px; cursor: pointer;">
          <span v-if="!this.navbar_menu_expanded" class="material-symbols-outlined menu-icon" alt="menu--v1"
            @click="navbar_menu_expanded = true">
            menu
          </span>
          <span v-else class="material-symbols-outlined menu-icon" alt="delete-sign--v1" @click="closeMenu()">
            close
          </span>
        </div>
      </div>

      <div id="menu-bar" v-if="navbar_menu_expanded">
        <ul id="dropdown-nav" style="margin: 0px">
          <li @click="closeMenu()"><router-link to="/glasovanja">Glasovanja</router-link></li>
          <li @click="closeMenu()"><router-link to="/priljubljenost">Priljubljenost</router-link></li>
          <li @click="closeMenu()"><router-link to="/zaupanje">Zaupanje</router-link></li>
          <li class="dropdown-nav-submenu">
            <router-link to="" @click="this.drugo_expanded = !this.drugo_expanded">Drugo
              <span v-if="!this.drugo_expanded" class="material-symbols-outlined">keyboard_arrow_down</span>
              <span v-else class="material-symbols-outlined">keyboard_arrow_up</span>
            </router-link>
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
    <div v-if="navbar_menu_expanded" id="blocking-element" @click="closeMenu()">
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
.sticky {
  /* poskrbi, da se glava vedno drži vrha strani */
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

#header-strip {
  display: block;
  height: 70px;
  line-height: 70px;
  /* potrebno, da vertical-align deluje */
  color: white;

  /* overflow: hidden; zato, da na zelo majhnih zaslonih ne gre gumb za meni v naslednjo vrstico;
    vendar sem moral odstranit, ker sicer Drugo dropdown ni deloval  */
}

.background {
  background-color: #ae1813;
}

/* .blur { */
/*
  - Ne deluje na Drugo .dropdown meniju (problem je verjetno v tem, da je to nevidni del, ki tudi ne veča velikosti #header-strip)
  - Poskusil sem popraviti z ::before psevdoelementi (https://generatepress.com/forums/topic/blur-filter-opacity-behind-drop-down-menu-not-working/) vendar mi ne preveč uspevalo, ker je struktura preveč kompleksna
  - Izgleda da ni (enostavnega) načina za popravek tega
  */

/* -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
} */

/* Logo */
.logo {
  margin-left: 40px;
  margin-right: 40px;
  max-width: 50%;
  height: 100%;
  
  display: inline-block;
  
  cursor: pointer;
}

.logo div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.logo div img {
  max-height: 65%;
}

/* Navbar */
.menu-list>* {
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
  color: white !important;
  font-size: 20px;
  text-align: center;
}

ul li ul.dropdown li {
  display: block;
  text-align: center;
  background: #8E1C18;
}

ul li ul.dropdown li a {
  padding: 0;
}

ul li ul.dropdown {
  width: 100%;
  position: absolute;
  display: none;
}

ul li:hover {
  background-color: #1d1d1f38;
}

ul li ul.dropdown li:hover {
  background-color: #721714;
}

ul li:hover ul.dropdown {
  display: block;
}

.dropdown-nav-submenu li {
  background-color: #1d1d1f38;
}

.dropdown-nav-submenu li:hover {
  background-color: #721714;
}

ol,
ul {
  padding-left: 0;
}

.zadnji {
  border-radius: 0px 0px 15px 15px;
}

/* Menu bar */

.material-symbols-outlined {
  display: inline-block;
  vertical-align: middle;
  /* Optional: Align it vertically */
}

.menu-icon {
  font-size: 45px;
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
  background: #ae1813;
}

.dropdown-nav-submenu {}

#blocking-element {
  height: 100vh;
  background-color: #8080808a;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
</style>
