<template>
    <v-main>
        <h1 class="display-1 mt-5">テスト用ログイン</h1>
        <v-form @submit.prevent="loginUserAAD">
            <v-select v-model="user.agentId" :items="agentId" label="ロール"></v-select>
            <v-btn type="submit" class="info">ログイン</v-btn>
        </v-form>
        <br />
        <div v-if="this.$auth.loggedIn">
            <p>{{ jwt_decoded }}</p>
        </div>
    </v-main>
</template>
<script>
export default {
    head: () => ({
        title: 'ログイン'
    }),
    auth: false,
    asyncData(context) {
        return {
            jwt_decoded: context.app.$auth.$storage.getUniversal('jwt_decoded')
        }
    },
    data: () => ({
        jwt_decoded: null,
        user: {
            id: null,
            agentId: '',
            email: '',
            password: '',
        },
        agentId: [
            { text: '学生', value: 'kangaku_students' },
            { text: '教員', value: 'kangaku' },
            { text: '企業', value: 'kangaku_verifier' },
        ],
    }),
    methods: {
        loginUserAAD() {
            if (this.user.agentId.length === 0) {
                window.alert('ロールを選択してください')
            }
            this.$auth.loginWith("aad").then(() => {
                console.log(this.jwt_decoded)
                console.log('upn=' + this.jwt_decoded.upn)
                this.$auth.$storage.setUniversal('agentId', this.user.agentId)
                sessionStorage.setItem('email', this.jwt_decoded.upn)
                sessionStorage.setItem('userName', this.jwt_decoded.name)
                sessionStorage.setItem('agentId', this.user.agentId)
            })
        },
        loginUser() {
            if (this.user.agentId.length === 0 || this.user.email.length === 0 || this.user.password.length === 0) {
                window.alert('ロール、および、メールアドレス、パスワードを入力してください。')
            }
            try {
                const resp = this.$auth.loginWith('local', {
                    data: this.user
                }).then(() => {
                    sessionStorage.setItem('email', this.$auth.user.email)
                    sessionStorage.setItem('userName', this.$auth.user.name)
                    sessionStorage.setItem('agentId', this.$auth.user.agentId)
                    if (this.$auth.user.agentId == 'kangaku_students') {
                        this.$router.push('/holder/regist');
                    } else if (this.$auth.user.agentId == 'kangaku') {
                        this.$router.push('/issuer/certify');
                    } else if (this.$auth.user.agentId == 'kangaku_verifier') {
                        this.$router.push('/verifier/veri');
                    }
                })
                console.log(resp)
            } catch (e) {
                console.log(e)
            }
        },
    }
}
</script>