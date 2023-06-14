<template>
    <v-main>
        <h1 class="display-1 mt-5">ログアウト</h1>
        <div>
            <p>ログアウトしました</p>
            <a href="/login" @click="$auth.logout()">ログイン画面へ</a>
        </div>
    </v-main>
</template>
<script>
export default {
    head: () => ({
        title: 'ログアウト'        
    }),
    asyncData (context) {
        context.app.$auth.logout()
        localStorage.clear()
        sessionStorage.clear()
    },
}
</script>