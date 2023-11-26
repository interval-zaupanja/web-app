<template>
    <div :class="this.full_width ? '' :'container'">
        <div v-for="item in this.items" :key="item._id" class="bubble-outer" :class="this.full_width ? '' :'grid-bubble'">
            <TextImageBubble
            :text="getText(item)"
            :image="this.vrniLogoUri(item.logo_uri ?? item.slika_uri)"
            @click="$router.push(this.path + item._id)"
            :style="'height: ' + this.getHeight(this.size) + '; width: ' +  this.getWidth(this.size)"
            :stick_to_bottom="this.size === 'large' ? true : false"
            />
        </div>
    </div>
</template>

<script>
import TextImageBubble from '../../components/TextImageBubble.vue'

export default {
    name: 'BubbleGrid',
    props: ['items', 'path', 'size'],
    components: {
        TextImageBubble
    },
    data() {
        return {
            full_width: false
        }
    },
    created() {
		window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
		this.checkScreen() // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
	},
	methods: {
		checkScreen() {
			var windowWidth = window.innerWidth
			if (windowWidth <= 600) {
				this.full_width = true
			} else {
				this.full_width = false
			}
		},
        getText(item) {
            var text = item.ime
            if (item.ime_srednje) {
                text += ' ' + item.ime_srednje.charAt(0) + '.'
            }
            if (item.priimek) {
                text += ' ' + item.priimek
            }
            return text
        },
        getHeight(size) {
            if (this.full_width) { // ker je zaslon ozek, je temu tudi primerno, da se zmanjša višina mehurčka 
                return '175px'
            }

            switch (size) {
                case 'small':
                    return "150px"
                case 'medium':
                    return "200px"
                case 'large':
                    return '350px'
                default:
                    return "150px"
            }
        },
        getWidth(size) {
            if (this.full_width) {
                return '100%'
            }

            switch (size) {
                case 'small':
                    return "250px"
                case 'medium':
                    return "250px"
                case 'large':
                    return '350px'
                default:
                    return "250px"
            }
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    /* justify-content: center; */
    /* justify-content: space-between; */
    /* justify-content: space-around; (manj prostora pri straneh) */
    /* justify-content: space-evenly; */
    flex-wrap: wrap;
    /* align-content se navezuje na wrap */
    /* align-content: space-evenly; */

    /* zato, da je mehurček v isti vrstici, kjer je očitno dovolj prostora */
    margin: 0;
    padding: 0;
    min-width: 100%;
}

.grid-bubble {
    /* display: inline-block; dejansko ni potrebno */
    vertical-align: top; /* popravek, da se vedno držijo vrha in (verjetno zaradi table znotraj TextImageBubble) ne splavajo stran od vrha */
}
</style>
