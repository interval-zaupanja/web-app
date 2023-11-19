<template>
  <div>
    <Header/>
    <div id="full-height">
      <div id="view">
        <router-view></router-view>
      </div>
      <Footer/>
    </div>
  </div>
  <div id="odlozisce" style="display: none"/>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      edge_to_edge: false
    }
  },
  created() {
        window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
        this.checkScreen() // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
    },
    methods: {
        checkScreen() {
            this.windowWidth = window.innerWidth
            if (this.windowWidth <= 600) {
                this.edge_to_edge = true
            } else {
                this.edge_to_edge = false
            }
        }
    }
}
</script>

<style>
/* #app { privzeto od Vue
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
} */

#full-height { /* izgleda, da edino na tak način deluje */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#view {
  margin-top: 70px;
  margin-bottom: auto;
  display: block;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>