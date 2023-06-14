<template>
    <v-main>
        <v-data-table :headers="headers" :items="certificates" item-key="certificate-id" class="elavation-1">

        </v-data-table>
    </v-main>
</template>
<script>
export default {
    async fetch({ store }) {
        const credentials = await store.dispatch('credentials/fetchListIssuerEmail')
        store.commit('credentials/setList', credentials)
    },
    head: () => ({
        title: '承認取消・失効'
    }),
    layout: 'issuer',
    headers: [
            { text: '申請者', value: 'holderName' },
            { text: 'スキル名', value: 'name' },
            { text: '自己評価', value: 'selfLevel' },
            { text: '自己評価詳細', value: 'selfDescription' },
            { text: '評価者', value: 'issuerName' },
            { text: '評価', value: 'level' },
            { text: 'コメント', value: 'description' },
        ],
}
</script>