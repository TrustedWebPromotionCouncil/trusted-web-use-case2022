import axiosBase from 'axios';
import crypto from 'crypto';
import jwtDecode from 'jwt-decode';

const axiosl = axiosBase.create({
    timeout: 60000
})
export const state = () => ({
    idyxCerts: [],
});

export const requestWrapper = {
    trustAgentId: `kangaku_students`,
    trustAgentRole: `administrator`,
    trustUserId: '',
    trustUserRole: `user`,
    requestData: '',
    applyData: '',
    verifyData: '',
}

export const holder = {
    holderName: sessionStorage.getItem('userName'),
    holderEmail: sessionStorage.getItem('email'),
}

export const getters = {
    list(state) {
        return state.idyxCerts;
    }
}

export const mutations = {
    setList(state, data) {
        state.idyxCerts = data;
    },
    create(state, data) {
        state.proofs.push(data);
    },
    delete(state, data) {
        state.proofs.forEach((proof, index) => {
            if (proof.id === data.id) {
                state.proofs.splice(index, 1);
            }
        });
    },
    update(state, data) {
        state.proofs.forEach((proof, index) => {
            if (proof.id === data.id) {
                state.proofs.splice(index, 1, data);
            }
        });
    },
}

export const actions = {
    async fetchList() {
        console.log('proofs.js - fetchList')
        return await this.$axios.$get(`/api/proofs`).catch(e => console.log(e));
    },
    async fetchListIdyx() {
        console.log('proofs.js - fetchListIdyx')
        const requestGetData = {
            issuer: ["kangaku"],
            holder: holder.holderEmail + '/kangaku_students'
        };
        requestWrapper.trustUserId = holder.holderEmail;
        requestWrapper.requestData = requestGetData;

        return await this.$axios.$post(`/api/list_received_dev`, requestWrapper).catch(e => console.log(e));
    },
    async create({ commit }, proof) {
        console.log('proofs.js - create:{%j}', proof)
        const response = await this.$axios.$post(`/api/proofs`, proof).catch(e => console.log(e));
        commit('create', response);
    },
    async generatePdf({ commit }, { idyxCerts, verifiers }) {
        console.log('proofs.js - generatePdf:{%j}{%j}', idyxCerts, verifiers)
        const baseU = `${window.location.protocol}//${window.location.host}`
        console.log(`Href=${window.location.href}`)
        const requestApplyData = {
            // eslint-disable-next-line no-array-constructor
            certificates: new Array(),
            policy: { organization: 'kangaku_verifier' },
            hash_value: ''
        };

        for (let idyxCert of idyxCerts) {
            requestApplyData.certificates.push({ certificate_id: idyxCert.certificate_id })
            console.log('idyxCert.certificate_id=%s', idyxCert.certificate_id)
            console.log('idyxCert.holderName=%s', idyxCert.holderName)
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a) {
            let r = (new Date().getTime() + Math.random() * 16) % 16 | 0, v = a == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        requestApplyData.hash_value = uuid
        console.log(`hash_value=${uuid}`)

        requestWrapper.trustUserId = holder.holderEmail;
        requestWrapper.applyData = requestApplyData;

        const trust_seal_res = await this.$axios.post(`/api/apply_seal_dev`, requestWrapper).catch(e => console.log(e));
        const trust_seal_id = trust_seal_res.data
        console.log(`trust_seal_id=${trust_seal_id}`)

        const proof = {
            trustSealId: trust_seal_id,
            hashValue: uuid,
            proofHash: null,
            holderEmail: holder.holderEmail,
            holderName: holder.holderName,
            verifierEmail: verifiers[0].email,
            verifierName: verifiers[0].name,
        }

        const requestPdfData = {
            holderName: '',
            verifierName: '',
            targetUrl: ''
        }
        console.log('baseurl=%s', process.env.BASE_URL)
        requestPdfData.holderName = holder.holderName;
        requestPdfData.verifierName = verifiers[0].name
        requestPdfData.targetUrl = `${baseU}/verifier/verify/${trust_seal_id}/${uuid}`

        // // ここから検証用
        // const requestVerifyData = {
        //     trust_seal_id: trust_seal_id,
        //     hash_value: uuid
        // }
        // requestWrapper.verifyData = requestVerifyData;
        // const seal_attributes = await this.$axios.post(`/api/verify_seal_dev`, requestWrapper).catch(e => console.log(e));
        // console.log('seal_attributes={%j}', seal_attributes)
        // // ここまで検証用

        await axiosl.post(`/api/pdfgen/`, requestPdfData, { responseType: "blob", timeout: 60000 })
            .then(response => {
                console.log('response.headers=%j', response.headers)
                console.log('data.length=' + response.data.length)
                const blob = new Blob([response.data], { type: 'application/pdf' })
                const url = (window.URL || window.webkitURL).createObjectURL(blob)
                let fileName = ''
                let disposition = response.headers["content-disposition"]
                console.log(`disposition=${disposition}`)
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        fileName = matches[1].replace(/['"]/g, '')
                    }
                } else {
                    fileName = trust_seal_id
                }
                console.log('url=%s', url)
                console.log('fileName=%s', fileName)
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a)
                const hash = crypto.createHash('sha256').update(blob).digest('hex');
                console.log(`hash=${hash}`)
            })
            .catch(e => console.log('error=' + e));
    }
}