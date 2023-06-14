<template>
    <v-main>
        <p>Verifier 証明済データ参照</p>
        <v-data-table v-if="canShow" v-model="sealAttributes" :headers="headers" :items="idyxAttributes" item-key="id">
        </v-data-table>
    </v-main>
</template>
<script>
export default {
    async fetch({ store, params }) {
        console.log(`verify - fetch:${params.seal}, ${params.hash}`)
        const seal_attributes = await store.dispatch('verify/fetchList', { seal: params.seal, hash: params.hash })
        console.log('seal_attributes2={%j}', seal_attributes)
        store.commit('verify/setList', seal_attributes)
    },
    head: () => ({
        title: '証明済データ参照'        
    }),
    layout: 'verifier',
    data: () => ({
        headers: [
            { text: '申告者', value: 'attributes.holderName' },
            { text: 'スキル', value: 'attributes.name' },
            { text: '自己評価', value: 'attributes.selfLevel' },
            { text: '自己評価詳細', value: 'attributes.selfDescription' },
            { text: '評価者', value: 'attributes.issuerName' },
            { text: '評価', value: 'attributes.credentialLevel' },
            { text: 'コメント', value: 'attributes.credentialDescription' },
        ],
        sealAttributes: [],
        canShow: true,
    }),
    created: function() {
        const seal = this.$nuxt.$route.params.seal
        const hash = this.$nuxt.$route.params.hash
        console.log(seal)
        console.log(hash)
    },
    computed: {
        idyxAttributes() {
            return this.$store.getters[`verify/list`]
        }
    }
}
</script>