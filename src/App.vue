<template>
  <Header/>
  To se verjetno compila
  <Content/>
  Ne vem zakaj se to ne compila fgfg
  <Footer/>
</template>

<script>
import Header from '@/components/Header.vue'
import Content from "@/components/Content.vue"
import Footer from "@/components/Footer.vue";

export default {
  name: 'App',
  components: {
    'Header': Header,
    'Footer': Footer,
    'Content': Content
  }
}
</script>

<style>
</style>
