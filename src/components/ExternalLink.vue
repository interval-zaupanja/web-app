<template>
    <a :href="this.link" target="_blank" class="btn btn-primary" :style="this.buttonColor()" rel="noopener">
        {{ this.label }}
        <span class="material-symbols-outlined">open_in_new</span>
    </a>
</template>

<script>
export default {
    name: 'ExternalLink',
    props: ['link', 'label', 'color'],
    methods: {
        buttonColor() {
            if (this.color) {
                const red = parseInt(this.color.substring(1,3), 16)
                const green = parseInt(this.color.substring(3,5), 16)
                const blue = parseInt(this.color.substring(5,7), 16)
                var textColor;
                if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) { // vir: https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
                    textColor = "#000000"
                }  else {
                    textColor = "#ffffff"
                }
                return "background: " + this.color + "; border-color: " + this.color + "; color: " + textColor
            } else {
                return ""
            }
        },
    }
}
</script>


<style scoped>
a {
    float: right;
    width: 100%;
    
}
</style>