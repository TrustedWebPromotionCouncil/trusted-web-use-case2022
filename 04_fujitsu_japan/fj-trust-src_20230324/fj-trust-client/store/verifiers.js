export const state = () => ({
    verifiers: []
});

export const getters = {
    list (state) {
        return state.verifiers;
    }
}

export const mutations = {
    setList (state, data) {
        state.verifiers = data;
    },
    create (state, data) {
        state.verifiers.push(data);
    },
    delete (state, data) {
        state.verifiers.forEach((verifier, index) => {
            if (verifier.id === data.id) {
                state.verifiers.splice(index, 1);
            }
        });
    },
    update (state, data) {
        state.verifiers.forEach((verifier, index) => {
            if (verifier.id === data.id) {
                state.verifiers.splice(index, 1, data);
            }
        });
    }
}

export const actions = {
    async fetchList () {
        console.log('verifiers.js - fetchList')
        return await this.$axios.$get(`/api/verifiers`).catch(e => console.log(e));
    },
    async create ({ commit }, verifier) {
        console.log('verifiers.js - create')
        const response = await this.$axios.$post(`/api/verifiers`, verifier).catch(e => console.log(e));
        commit('create', response);
    },
    async delete ({ commit }, verifier) {
        console.log('verifiers.js - delete')
        const response = await this.$axios.$delete(`/api/verifiers/${verifier.id}`, verifier).catch(e => console.log(e));
        commit('delete', response);
    },
    async update ({ commit }, verifier) {
        console.log('verifiers.js - update')
        const response = await this.$axios.$put(`/api/verifiers/${verifier.id}`, verifier).catch(e => console.log(e));
        commit('update', response);
    },
    async read ({ commit }, verifier) {
        console.log('verifiers.js - read:{%j}', verifier)
        return await this.$axios.$get(`/api/verifiers/${verifier.id}`, verifier).catch(e => console.log(e));
    },
}