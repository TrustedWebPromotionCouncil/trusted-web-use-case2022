export default function ({ redirect, store, route }) {
    const authenticated = store.getters['authen/authenticated']

    if (!authenticated && route.path !== '/login' ) {
        return redirect('/login')
    }
}