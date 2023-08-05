<template>
  <div>
    <Header/>
    <div id="full-height">
      <div class="view">
        <router-view></router-view>
      </div>
      <Footer/>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
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

.view {
  margin: auto 0;
  margin-top: 70px;
  display: block;
  padding: 30px 10%;
}
</style>
