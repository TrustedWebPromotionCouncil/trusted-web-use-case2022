<template>
    <v-main>
        <div v-if="$auth.loggedIn">
            <p>QRコードからログイン画面に遷移した場合は、ブラウザの戻るボタンで直前のページに戻ってください</p>
            <div>
                <p>ログイン状態：{{ $auth.loggedIn }}</p>
                <p>ロール：{{ agentId }}</p>
                <p>ユーザー名：{{ jwt_decoded.name }}</p>
                <p>メールアドレス：{{ jwt_decoded.upn }}</p>
            </div>
            <v-btn class="info" @click="logout">ログアウト</v-btn>
        </div>
    </v-main>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
    asyncData(context) {
        return {
            jwt_decoded: context.app.$auth.$storage.getUniversal('jwt_decoded'),
            agentId: context.app.$auth.$storage.getUniversal('agentId'),
        }
    },
    data() {
        return {}
    },
    methods: {
        logout() {
            this.$auth.logout()
        },
    },
})
</script>