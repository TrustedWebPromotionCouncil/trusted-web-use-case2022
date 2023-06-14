<template>
    <v-app>
        <v-container fluid>
            <Nuxt />
        </v-container>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            title: '採用担当者用',
            company: 'FJJ',
        }
    },
    //middleware: 'authenticated'
}
</script>