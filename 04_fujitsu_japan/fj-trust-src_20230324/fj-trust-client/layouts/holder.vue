<template>
    <v-app>
        <header>
            <v-app-bar app>
                <v-app-bar-nav-icon @click="drawer=true"></v-app-bar-nav-icon>
                <v-app-bar-title>{{ title }}</v-app-bar-title>
            </v-app-bar>
            <v-navigation-drawer v-model="drawer" fixed temporary>
                <v-list-item>
                    <v-list-item-title class="title">{{ title }}</v-list-item-title>
                    <v-btn icon @click="drawer=false"><v-icon>mdi-chevron-left</v-icon></v-btn>
                </v-list-item>
                <v-list nav>
                    <v-list-item-group>
                        <v-list-item v-for="menuItem in menuItems" :key="menuItem.name" :to="menuItem.url">
                            <v-list-item-icon><v-icon>{{ menuItem.icon }}</v-icon></v-list-item-icon>
                            <v-list-item-content><v-list-item-title>{{ menuItem.name }}</v-list-item-title></v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-navigation-drawer>
        </header>
        <v-main>
            <v-container fluid>
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer padless>
            <v-col cols="12">&copy; {{ new Date().getFullYear() }} - <strong>{{ company }}</strong></v-col>
        </v-footer>
    </v-app>
</template>
<script>
export default {
    data() {
        return {
            title: '学生用',
            company: 'FJJ',
            drawer: false,
            menuItems: [
                { name: 'スキル登録', icon: 'mdi-web', url: '/holder/regist', },
                { name: 'エントリー（申請）', icon: 'mdi-web', url: '/holder/proof', },
                { name: 'ログアウト', icon: 'mdi-web', url: '/logout', },
            ],
        }
    },
    //middleware: 'authenticated'
}
</script>