<template>
    <div
        class="bubble"
        :style="'background-color: ' + this.barve.spekter_2"
        style="color: white; font-family: graphik; font-weight: 900; position: relative; padding: 0; overflow: hidden; cursor: pointer; height: 100%; width: 100%"
        @click="$router.push('/glasovanja/64dd0169fc95108f8a064c45')"
    >
        <div style="height: 100%; width: 100%">
            <div :style="'font-size:' + this.topTextFontSize + 'px; color: white; position: absolute; left: 0; top: 0; z-index: 6; margin: 15px'">
                Naslednje glasovanje
            </div>
            <div id="imgContainer" style="height: 100%; width: 100%">
                <img
                    src="https://live.staticflickr.com/65535/49517029202_26e671f248_b.jpg"
                    style="z-index: 4"
                    draggable="false"
                >
            </div>
            <div style="color: rgb(208, 208, 208); font-weight: normal; text-align: center; max-width: 100%; z-index: 5; margin: 15px; position: absolute; left: 0; bottom: 0; font-size: 14px">
                    <span>CC-BY-4.0: © European Union 2020 – Source: EP</span>
                </div>
            <div :style="'position: absolute; right: 0; top: 45px; width: 90%; text-align: right; font-size:' + this.NGmainTextFontSize + 'px; padding: 20px; z-index: 7'">
                <div><i>Volitve poslancev iz Slovenije v Evropski parlament</i></div>
            </div>
            <div :style="'position: absolute; right: 40px; bottom: 40px; width: 90%; text-align: right; font-size: ' + this.NGDateFontSize + 'px; padding: 20px; z-index: 8'">
                <i>9. junij 2024</i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NaslednjeGlasovanje',
    props: ['topTextFontSize', 'NGmainTextFontSize', 'NGDateFontSize']
}
</script>

<style scoped>
img {
    -webkit-mask-image: -webkit-gradient(linear, left top, right bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
    mask-image: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,1) 60%, rgba(0,0,0,0));
    filter: blur(1px);

    max-height: 100%;
}
</style>