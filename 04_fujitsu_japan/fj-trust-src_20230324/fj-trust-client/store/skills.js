export const state = () => ({
    skills: []
});

export const getters = {
    list (state) {
        return state.skills;
    }
}

export const holder = {
    holderEmail: sessionStorage.getItem('email'),
    holderName: sessionStorage.getItem('userName'),
}

export const mutations = {
    setList (state, data) {
        state.skills = data;
    },
    create (state, data) {
        console.log('data=%j', data)
        state.skills.push(data);
    },
    delete (state, data) {
        state.skills.forEach((skill, index) => {
            if (skill.id === data.id) {
                state.skills.splice(index, 1);
            }
        });
    },
    update (state, data) {
        state.skills.forEach((skill, index) => {
            if (skill.id === data.id) {
                state.skills.splice(index, 1, data);
            }
        });
    }
}

export const actions = {
    async fetchList () {
        console.log('skills.js - fetchList')
        return await this.$axios.$get(`/api/skills`).catch(e => console.log(e));
    },
    async fetchListHolderEmail () {
        // const holderEmail = sessionStorage.getItem('email')
        console.log('skills.js - fetchListHolderEmail')
        return await this.$axios.$get(`/api/skills/holder/${holder.holderEmail}`).catch(e => console.log(e));
    },
    async create ({ commit }, skill) {
        console.log('skills.js - create:{%j}', skill)
        skill.holderEmail = holder.holderEmail
        skill.holderName = holder.holderName
        const response = await this.$axios.$post(`/api/skills`, skill).catch(e => console.log(e));
        commit('create', response);
    },
    async delete ({ commit }, skill) {
        console.log('skills.js - delete:{%j}', skill)
        const response = await this.$axios.$delete(`/api/skills/${skill.id}`, skill).catch(e => console.log(e));
        commit('delete', response);
    },
    async update ({ commit }, skill) {
        console.log('skills.js - update:{%j}', skill)
        const response = await this.$axios.$put(`/api/skills/${skill.id}`, skill).catch(e => console.log(e));
        commit('update', response);
    },
    async read ({ commit }, skill) {
        console.log('skills.js - read:{%j}', skill)
        return await this.$axios.$get(`/api/skills/${skill.id}`, skill).catch(e => console.log(e));
    },
}