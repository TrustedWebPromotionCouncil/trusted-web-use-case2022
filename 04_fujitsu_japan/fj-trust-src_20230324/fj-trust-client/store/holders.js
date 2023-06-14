export const state = () => ({
    holders: []
});

export const getters = {
    list (state) {
        return state.holders;
    }
}

export const mutations = {
    setList (state, data) {
        state.holders = data;
    },
    create (state, data) {
        state.holders.push(data);
    },
    delete (state, data) {
        state.holders.forEach((holder, index) => {
            if (holder.id === data.id) {
                state.holders.splice(index, 1);
            }
        });
    },
    update (state, data) {
        state.holders.forEach((holder, index) => {
            if (holder.id === data.id) {
                state.holders.splice(index, 1, data);
            }
        });
    }
}

export const actions = {
    async fetchList () {
        console.log('holders.js - fetchList')
        return await this.$axios.$get(`/api/holders`).catch(e => console.log(e));
    },
    async create ({ commit }, holder) {
        console.log('holders.js - create:{%j}', holder)
        const response = await this.$axios.$post(`/api/holders`, holder).catch(e => console.log(e));
        commit('create', response);
    },
    async delete ({ commit }, holder) {
        console.log('holders.js - delete:{%j}', holder)
        const response = await this.$axios.$delete(`/api/holders/${holder.id}`, holder).catch(e => console.log(e));
        commit('delete', response);
    },
    async update ({ commit }, holder) {
        console.log('holders.js - update:{%j}', holder)
        const response = await this.$axios.$put(`/api/holders/${holder.id}`, holder).catch(e => console.log(e));
        commit('update', response);
    },
    async read ({ commit }, holder) {
        console.log('holders.js - read:{%j}', holder)
        return await this.$axios.$get(`/api/holders/${holder.id}`, holder).catch(e => console.log(e));
    },
}