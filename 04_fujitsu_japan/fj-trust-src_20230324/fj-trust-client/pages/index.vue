<template>
    <v-main>
        <NuxtLink to="/login">ログイン画面</NuxtLink>
        <div v-if="$auth.loggedIn">
            <div>
                <p>ログイン状態：{{ $auth.loggedIn }}</p>
                <p>ロール：{{ $auth.user.agentId }}{{ agentId }}</p>
                <p>ユーザー名：{{ $auth.user.name }}{{ jwt_decoded.name }}</p>
                <p>メールアドレス：{{ $auth.user.email }}{{ jwt_decoded.upn }}</p>
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
    mounted() {
        console.log('agentId is ' + this.agentId)
        if (this.agentId == 'kangaku_students') {
            this.$router.push('/holder/regist');
        } else if (this.agentId == 'kangaku') {
            this.$router.push('/issuer/certify');
        } else if (this.agentId == 'kangaku_verifier') {
            this.$router.push('/verifier/veri');
        }
    }
})
</script>