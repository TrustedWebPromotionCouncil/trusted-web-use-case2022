const state = {
    token: null,
}
const getters = {
    authenticated: (state) => !!state.token,
}

const mutations = {
    setToken: (state, token) => {
        state.token = token
    }
}

const actions = {
    
}