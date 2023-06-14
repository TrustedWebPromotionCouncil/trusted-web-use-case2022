export const requestWrapper = {
    trustAgentId: `kangaku_students`,
    trustAgentRole: `administrator`,
    trustUserId: sessionStorage.getItem('email'),
    trustUserRole: `user`,
    requestData: '',
    applyData: '',
    verifyData: '',
}

export const state = () => ({
    certifieds: []
});

export const getters = {
    list (state) {
        return state.seal_attributes;
    }
}

export const mutations = {
    setList (state, data) {
        state.seal_attributes = data;
    },
}

export const actions = {
    async fetchList ( { commit, state }, { seal, hash }) {
        console.log('verify.js - fetchList')
        console.log(`params=${seal}, ${hash}`)
        const requestVerifyData = {
            trust_seal_id: seal,
            hash_value: hash
        }
        requestWrapper.verifyData = requestVerifyData;
        const seal_attributes = await this.$axios.post(`/api/verify_seal_dev`, requestWrapper).catch(e => console.log(e));
        console.log('seal_attributes={%j}', seal_attributes)
        return seal_attributes.data.certificates
    },
}