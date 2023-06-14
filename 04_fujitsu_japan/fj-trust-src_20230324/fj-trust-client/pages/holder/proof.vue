<template>
    <v-main>
        <v-data-table v-model="selectedCerts" :headers="headers" :items="idyxCerts" item-key="certificate_id" show-select
            class="elevation-1">
        </v-data-table>
        <v-container fluid>
            <p>エントリー先企業選択</p>
            <v-data-table v-model="selectedVerifiers" :headers="vheaders" :items="verifiers" item-key="id" show-select
                single-select class="elevation-1">
            </v-data-table>
            <v-btn color="primary" @click="generatePdf">PDF生成</v-btn>
        </v-container>
    </v-main>
</template>
<script>
export default {
    async fetch({ store }) {
        const proofs = await store.dispatch('proofs/fetchListIdyx')
        store.commit('proofs/setList', proofs)
        const verifiers = await store.dispatch('verifiers/fetchList')
        store.commit('verifiers/setList', verifiers)
    },
    head: () => ({
        title: 'エントリー（申請）'        
    }),
    layout: 'holder',
    data: () => ({
        dialog: false,
        headers: [
            { text: 'スキル', value: 'attributes.name' },
            { text: '自己評価', value: 'attributes.selfLevel' },
            { text: '自己評価詳細', value: 'attributes.selfDescription' },
            { text: '評価', value: 'attributes.credentialLevel' },
            { text: 'コメント', value: 'attributes.credentialDescription' },
            { text: '評価者', value: 'attributes.issuerName' },
            { text: 'ID', value: 'certificate_id' },
        ],
        vheaders: [
            { text: '企業名', value: 'name' },
            { text: 'email', value: 'email' },
        ],
        verifier: {
            id: null,
            name: null,
            email: null,
            description: null,
        },
        selectedCerts: [],
        selectedVerifiers: [],
        pdfData: {
            holderName: '',
            verifierName: '',
            targetUrl: '',
        }
    }),
    computed: {
        idyxCerts() {
            return this.$store.getters['proofs/list']
        },
        verifiers() {
            return this.$store.getters['verifiers/list']
        },
    },
    methods: {
        async generatePdf() {
            console.log('proof - generatePdf:{%j}{%j}', this.selectedCerts, this.selectedVerifiers)
            const pdf = this.$store.dispatch('proofs/generatePdf', { idyxCerts: this.selectedCerts, verifiers: this.selectedVerifiers })
        }
    }
}
</script>