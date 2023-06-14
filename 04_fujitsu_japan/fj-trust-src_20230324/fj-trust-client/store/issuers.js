export const state = () => ({
    issuers: []
});

export const getters = {
    list (state) {
        return state.issuers;
    }
}

export const mutations = {
    setList (state, data) {
        state.issuers = data;
    },
    create (state, data) {
        state.issuers.push(data);
    },
    delete (state, data) {
        state.issuers.forEach((issuer, index) => {
            if (issuer.id === data.id) {
                state.issuers.splice(index, 1);
            }
        });
    },
    update (state, data) {
        state.issuers.forEach((issuer, index) => {
            if (issuer.id === data.id) {
                state.issuers.splice(index, 1, data);
            }
        });
    }
}

export const actions = {
    async fetchList () {
        console.log('issuers.js - fetchList')
        return await this.$axios.$get(`/api/issuers`).catch(e => console.log(e));
    },
    async create ({ commit }, issuer) {
        console.log('issuers.js - create')
        const response = await this.$axios.$post(`/api/issuers`, issuer).catch(e => console.log(e));
        commit('create', response);
    },
    async delete ({ commit }, issuer) {
        console.log('issuers.js - delete')
        const response = await this.$axios.$delete(`/api/issuers/${issuer.id}`, issuer).catch(e => console.log(e));
        commit('delete', response);
    },
    async update ({ commit }, issuer) {
        console.log('issuers.js - update')
        const response = await this.$axios.$put(`/api/issuers/${issuer.id}`, issuer).catch(e => console.log(e));
        commit('update', response);
    },
    async read ({ commit }, issuer) {
        console.log('issuers.js - read:{%j}', issuer)
        return await this.$axios.$get(`/api/issuers/${issuer.id}`, issuer).catch(e => console.log(e));
    },
}