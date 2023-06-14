export const state = () => ({
    credentials: []
});

export const getters = {
    list(state) {
        return state.credentials;
    }
}

// トラストサービスAPI利用時のヘッダ、および、ボディの構成をラッピングしたデータ型
export const requestWrapper = {
    trustAgentId: `kangaku`,
    trustAgentRole: `administrator`,
    trustUserId: '',
    trustUserRole: `user`,
    requestData: ''
}

export const mutations = {
    setList(state, data) {
        state.credentials = data;
    },
    create(state, data) {
        state.credentials.push(data);
    },
    update(state, data) {
        state.credentials.forEach((credential, index) => {
            if (credential.id === data.id) {
                state.credentials.splice(index, 1, data);
            }
        });
    },
    delete(state, data) {
        state.credentials.forEach((credential, index) => {
            if (credential.id === data.id) {
                state.credentials.splice(index, 1);
            }
        });
    },
}

export const actions = {
    async fetchList() {
        console.log('credentials.js - fetchList')
        return await this.$axios.$get(`/api/credentials`).catch(e => console.log(e));
    },
    async fetchListIssuerEmail() {
        const issuerEmail = sessionStorage.getItem('email')
        console.log('credentials.js - fetchListIssuerEmail')
        return this.$axios.$get(`/api/credentials/issuer/${issuerEmail}`).catch(e => console.log(e));
    },
    async create({ commit }, credential) {
        console.log('credentials.js - create:{%j}', credential)
        const response = await this.$axios.$post(`/api/credentials`, credential).catch(e => console.log(e));
        commit('create', response);
    },
    async update({ commit }, credential) {
        console.log('credentials.js - update:{%j}', credential)

        const resCredential = await this.$axios.$put(`/api/credentials/${credential.id}`, credential).catch(e => console.log(e));
        console.log('credential={%j}', resCredential);

        try {
            const now = new Date();
            const requestCreateData = {
                holder: resCredential.holderEmail + '/kangaku_students',
                kind: 'student_card',
                validity: {
                    not_before: now.getFullYear() + "-" + ('00' + (now.getMonth() + 1)).slice(-2) + "-" +  ('00' + (now.getDate() + 1)).slice(-2) + "T00:00:00+09:00",
                    not_after: (now.getFullYear() + 1) + "-" + ('00' + (now.getMonth() + 1)).slice(-2) + "-" + ('00' + (now.getDate() + 1)).slice(-2) + "T00:00:00+09:00"
                },
                attributes: {
                    holderName: resCredential.holderName,
                    name: resCredential.name,
                    selfLevel: resCredential.selfLevel,
                    selfDescription: resCredential.selfDescription,
                    issuerEmail: resCredential.issuerEmail,
                    issuerName: resCredential.issuerName,
                    credentialLevel: resCredential.level,
                    credentialDescription: resCredential.description
                },
            };
    
            requestWrapper.trustUserId = resCredential.issuerEmail;
            requestWrapper.requestData = requestCreateData;
    
            console.log('create_cert_dev request {%j}', requestWrapper);
            const resCreateCert = await this.$axios.$post('/api/create_cert_dev', requestWrapper);
            console.log('create_cert_dev response={%j}', resCreateCert);

            const requestSendData = {
                certificate_id: resCreateCert,
                holder: resCredential.holderEmail + '/kangaku_students',
            };
    
            requestWrapper.requestData = requestSendData;

            console.log('send_cert_dev request body={%j}', requestWrapper);
            const resCreateSend = await this.$axios.$post('/api/send_cert_dev', requestWrapper);
            console.log('send_cert_dev response={%j}', resCreateSend);
        } catch (e) {
            if (e instanceof Error) console.error(e.message);
            res.status(500).send('Server Error');
        };

        // 検証用の実装(証明書送付後の証明書一覧取得) ここから
        // const requestGetData = {
        //     issuer: ["kangaku"],
        //     holder: resCredential.holderEmail + '/kangaku_students'
        // };

        // requestWrapper.trustUserId = resCredential.holderEmail;
        // requestWrapper.requestData = requestGetData;

        // try {
        //     const resp2 = await this.$axios.$post('/api/list_received_dev', requestWrapper);
        //     console.log('end_certs={%j}', resp2);
        // } catch (e) {
        //     if (e instanceof Error) console.error(e.message);
        //     res.status(500).send('Server Error');
        // }
        // ここまで
        
        commit('update', resCredential);
    },
    async delete({ commit }, credential) {
        console.log('credentials.js - delete:{%j}', credential)
        const response = await this.$axios.$delete(`/api/credentials/${credential.id}`, credential).catch(e => console.log(e));
        commit('delete', response);
    },
    async read ({ commit }, credential) {
        console.log('credentials.js - read:{%j}', credential)
        return await this.$axios.$get(`/api/credentials/${credential.id}`, credential).catch(e => console.log(e));
    },
}