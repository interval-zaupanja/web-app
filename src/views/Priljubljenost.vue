<template>
    <div>

    </div>
</template>

<script>
export default {
    name: 'Priljubljenost',
    data() {
        return {
            vprasanja: []
        }
    },
    async mounted() {
        await this.getData()
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + '/api/vprasanja?tip=priljubljenost')
            this.vprasanja = data
        }
    }
}
</script>