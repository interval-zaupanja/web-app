new Vue({
    el: '#zadnje-ankete',
    data: {
        ankete: []
    },
    async mounted() {
        await this.getData();
        await this.imenaAnketarjev();
        Vue.set(this.ankete); // osveži pogled, kar za sam getData() očitno ni potrebno
    },
    methods: {
        async getData() {
            await axios
                .get("http://localhost:4000/api/ankete")
                .then(response => this.ankete = response.data)
                .catch(error => {console.error(error)});
        },
        async imenaAnketarjev() { // imena anketarjev se dodajo šele naknadno; lahko bi jih sicer dodal tudi med samim klicem podatkov!!!
            for (let i = 0; i < this.ankete.length; i++) {
                await axios
                    .get("http://localhost:4000/api/anketarji/" + this.ankete[i].anketar_id)
                    .then(response => {
                        this.ankete[i].anketar_ime = response.data.ime;
                    })
                    .catch(error => console.error(error));
            }
        },
        getLinkUrl(id) {
            return 'ankete/' + id;
        }
    }
});