<template>
  <app-footer style="display: block; height: 50px;">
    <div style="display:flex; justify-content:center; align-items: center; height: inherit">
      © Interval zaupanja {{ new Date().getFullYear() }}
      <a href="vop.html" style="margin-left: 90px;">Varstvo osebnih podatkov</a>
      <a href="pogoji-uporabe.html">Pogoji uporabe</a>
      <a href="kontakt.html">Kontakt</a>
    </div>
  </app-footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>

</style>