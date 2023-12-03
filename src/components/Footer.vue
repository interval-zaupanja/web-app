<template>
	<div id="footer">
		<div style="display: flex; justify-content: center; flex-wrap: wrap">
			<div style="display: inline-block; margin: 0px 50px">
				© Interval zaupanja {{ new Date().getFullYear() }}
			</div>
			<div style="display: inline-block; margin: 0px 20px">
				<div style="display: flex; justify-content: center; flex-wrap: wrap">
					<router-link to="/vop" style="display: inline-block">Varstvo osebnih podatkov</router-link>
					<router-link to="/pogoji-uporabe" style="display: inline-block">Pogoji uporabe</router-link>
					<router-link to="/prijavljene-napake" style="display: inline-block">Prijavljene napake</router-link>
					<router-link to="/kontakt" style="display: inline-block">Kontakt</router-link>
				</div>
			</div>
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
	background-color: #3d3d3d;
	color: #d0d0d0; /* barva pisave */
	text-align: center;
	padding: 15px;
}

a {
	padding-left: 10px;
	padding-right: 10px;
}

a, a:visited, a:active, a:hover {
	color: #d0d0d0 !important; /* !important potreben, da povozi Bootstrap in ostale nastavitve */
}
</style>