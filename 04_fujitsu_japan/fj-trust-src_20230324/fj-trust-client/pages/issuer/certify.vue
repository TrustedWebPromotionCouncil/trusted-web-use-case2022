<template>
    <v-main>
        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title><span class="text-h5">教員 - スキル評価</span></v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>申請者：{{ editedItem.holderName }}</v-col>
                            <v-col>スキル名：{{ editedItem.name }}</v-col>
                            <v-col>自己評価：{{ editedItem.selfLevel }}</v-col>
                            <v-col>自己評価詳細：{{ editedItem.selfDescription }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-select v-model="editedItem.level" :items="levelMaster" label="評価"></v-select>
                            </v-col>
                            <v-col>
                                <v-text-field v-model="editedItem.description" label="コメント"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-btn class="mx-0" :color="editedItem.certified ? 'primary' : 'lightgray'"
                                    @click="editedItem.certified = !editedItem.certified">
                                    {{ editedItem.certified ? 'ACCEPT' : 'NOT ACCEPT' }}
                                    <v-icon dark right>{{ editedItem.certified ? 'mdi-check' : 'mdi-cancel' }}</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
                    <v-btn color="blue darken-1" text @click="save">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-data-table :headers="headers" :items="credentials" item-key="id" class="elevation-1">
            <template v-slot:item.certified="{ item }">
                <v-btn class="mx-0" :color="item.certified ? 'primary' : 'lightgray'">
                    {{ item.certified ? 'ACCEPT' : 'NOT ACCEPT' }}
                    <v-icon dark right>{{ item.certified ? 'mdi-check' : 'mdi-cancel' }}</v-icon>
                </v-btn>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            </template>
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
        title: 'スキル評価・承認'        
    }),
    layout: 'issuer',
    data: () => ({
        dialog: false,
        headers: [
            { text: '申請者', value: 'holderName' },
            { text: 'スキル名', value: 'name' },
            { text: '自己評価', value: 'selfLevel' },
            { text: '自己評価詳細', value: 'selfDescription' },
            { text: '評価', value: 'level' },
            { text: 'コメント', value: 'description' },
            { text: '承認', value: 'certified' },
            { text: 'Action', value: 'actions', sortable: false },
        ],
        levelMaster: [
            { text: 'Lv.1', value: 'Lv.1' },
            { text: 'Lv.2', value: 'Lv.2' },
            { text: 'Lv.3', value: 'Lv.3' },
            { text: 'Lv.4', value: 'Lv.4' },
            { text: 'Lv.5', value: 'Lv.5' },
        ],
        editedItem: {
            id: null,
            holderName: null,
            selfLevel: null,
            selfDescription: null,
            level: null,
            description: null,
            certified: false,
        },
        defaultEditedItem: {
            id: null,
            holderName: null,
            selfLevel: null,
            selfDescription: null,
            level: null,
            description: null,
            certified: false,
        },
    }),
    computed: {
        credentials() {
            return this.$store.getters['credentials/list']
        }
    },
    methods: {
        editItem(item) {
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        async save() {
            await this.$store.dispatch('credentials/update', this.editedItem)
            this.close()
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                }, 1000);
            })
        },
    },
}
</script>