<template>
	<div id="footer">
		<div style="display:flex; justify-content:center; align-items: center; height: inherit">
			© Interval zaupanja {{ new Date().getFullYear() }}
			<a href="vop.html" style="margin-left: 90px;">Varstvo osebnih podatkov</a>
			<a href="pogoji-uporabe.html">Pogoji uporabe</a>
			<a href="kontakt.html">Kontakt</a>
		</div>
  </div>
</template>

<script>
export default {
	name: 'Footer'
}
</script>

<style scoped>
#footer {
	display: block;
	height: 50px;
	background-color: #3d3d3d;
	color: #d0d0d0; /* barva pisave */
	text-align: center;
}

#footer a {
	color: #d0d0d0;
	padding-left: 10px;
	padding-right: 10px;
}

#footer a:visited {
	color: #d0d0d0;
}

#footer a:active {
	color: #d0d0d0;
}
</style>