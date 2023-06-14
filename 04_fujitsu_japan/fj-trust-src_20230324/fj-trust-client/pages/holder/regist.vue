<template>
    <v-main>
        <form v-on:submit.prevent="submit">
            <v-data-table v-model="selectedSkills" :headers="headers" :items="skills" item-key="id" show-select
                class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>学生 - スキル登録</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">新規登録</v-btn>
                            </template>
                            <v-card>
                                <v-card-title><span class="text-h5">{{ formTitle }}</span></v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col>
                                                <v-select v-model="editedItem.name" :items="skillMaster"
                                                    label="スキル"></v-select>
                                            </v-col>
                                            <v-col>
                                                <v-select v-model="editedItem.level" :items="levelMaster"
                                                    label="レベル"></v-select>
                                            </v-col>
                                            <v-col>
                                                <v-text-field v-model="editedItem.description"
                                                    label="コメント"></v-text-field>
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
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">削除してもよろしいですか?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
            <v-btn color="primary" @click="selectIssuer">承認依頼</v-btn>
            <v-dialog v-model="issuerDialog">
                <v-card>
                    <v-data-table v-model="selectedIssuers" :headers="issuerHeaders" :items="issuers" item-key="id"
                        show-select class="elevation-1">
                    </v-data-table>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="certCancel">キャンセル</v-btn>
                <v-btn color="blue darken-1" text @click="certRequest">申請</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </form>
    </v-main>
</template>

<script>
export default {
    async fetch({ store }) {
        const skills = await store.dispatch('skills/fetchListHolderEmail')
        store.commit('skills/setList', skills)
        const issuers = await store.dispatch('issuers/fetchList');
        store.commit('issuers/setList', issuers);
    },
    head: () => ({
        title: 'スキル登録'        
    }),
    layout: 'holder',
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: 'スキル', value: 'name' },
            { text: 'レベル', value: 'level' },
            { text: 'コメント', value: 'description' },
            { text: '更新日時', value: 'lastUpdate' },
            { text: 'Action', value: 'actions', sortable: false },
        ],
        selectedIssuers: [],
        issuerDialog: false,
        issuerHeaders: [
            { text: '承認者', value: 'name' },
            { text: 'e-mail', value: 'email' },
        ],
        skillMaster: [
            { text: 'プログラミング(JavaScript)', value: 'プログラミング(JavaScript)' },
            { text: 'プログラミング(Python)', value: 'プログラミング(Python)' },
            { text: 'プログラミング(Java)', value: 'プログラミング(Java)' },
            { text: 'プログラミング(TypeScript)', value: 'プログラミング(TypeScript)' },
            { text: 'プログラミング(C#)', value: 'プログラミング(C#)' },
            { text: 'プログラミング(C++)', value: 'プログラミング(C++)' },
            { text: 'プログラミング(PHP)', value: 'プログラミング(PHP)' },
            { text: 'プログラミング(Shell)', value: 'プログラミング(Shell)' },
            { text: 'プログラミング(Ruby)', value: 'プログラミング(Ruby)' },
            { text: 'プログラミング(Kotlin)', value: 'プログラミング(Kotlin)' },
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
            name: null,
            level: null,
            description: null,
            holderEmail: null,
            holderName: null,
        },
        defaultEditedItem: {
            id: null,
            name: null,
            level: null,
            description: null,
            holderEmail: null,
            holderName: null,
        },
        credentialItem: {
            id: null,
            skillId: null,
            level: null,
            description: null,
            certified: false,
            issuerEmail: null,
            issuerName: null,
        },
        editedIndex: -1,
        selectedSkills: [],
    }),
    computed: {
        skills() {
            return this.$store.getters['skills/list']
        },
        formTitle() {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
        issuers() {
            return this.$store.getters['issuers/list']
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    methods: {
        editItem(item) {
            this.editedIndex = this.skills.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedIndex = this.skills.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },
        async deleteItemConfirm() {
            await this.$store.dispatch('skills/delete', this.editedItem)
            this.closeDelete()
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 10000);
            });
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        async save() {
            if (this.editedIndex > -1) {
                await this.$store.dispatch('skills/update', this.editedItem)
            } else {
                this.editedItem.holderId = 1
                await this.$store.dispatch('skills/create', this.editedItem)
            }
            this.close()
        },
        selectIssuer() {
            console.log('regist - selectIssuer:{%j}', this.selectedIssuers)
            console.log(this.selectedSkills)
            this.issuerDialog = true
        },
        async certRequest() {
            console.log('regist - certRequest:{%j}', this.selectedSkills)
            for(let skill of this.selectedSkills) {
                console.log('skillName is ' + skill.name)
                for(let issuer of this.selectedIssuers) {
                    console.log('issuerName is ' + issuer.name)
                    this.credentialItem.holderName = skill.holderName
                    this.credentialItem.holderEmail = skill.holderEmail
                    this.credentialItem.name = skill.name
                    this.credentialItem.selfLevel = skill.level
                    this.credentialItem.selfDescription = skill.description
                    this.credentialItem.issuerEmail = issuer.email
                    this.credentialItem.issuerName = issuer.name
                    await this.$store.dispatch('credentials/create', this.credentialItem)
                }
            }
            this.issuerDialog = false
        },
        certCancel() {
            console.log('regist - certCancel:{%j}', this.selectedIssuers)
            this.issuerDialog = false
        },
    }
}
</script>