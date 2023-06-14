# Issuer web for JISA using Microsoft Entra Verified ID

## About

A sample implementation of issuer web application for Microsoft Entra Verified ID.  
Working demo is running [here](https://vc-issuer-jisa.azurewebsites.net/)

## Requirement

Node 16 LTS

## Setup

* Basically following steps on Microsoft's official documents.
[here](https://docs.microsoft.com/en-us/azure/active-directory/verifiable-credentials/)

### 0. Prerequirements
* Valid Microsoft Azure Subscription and working Entra Verified ID environment.
    * Setup Entra Verified ID tenant and define Verifiable Credential issuance settings. Following information will be required during setting this issuer web.
        * Azure AD tenant ID
        * client_id
        * client_secret
        * issuer DID
        * VC manifest url

### 1. Clone Repository
```
git clone https://github.com/ctc-selmid/jisa-did-poc-issuer-jisa.git
```

### 2. Install required modules
```
npm Install
```

note)  Move to the directory containing the dropped program.

### 3. Setup environments

rename .env.sample to .env and fill out required parameters regarding your environments.

```
# Basic configuration
baseURL='https://d6fb-2.....7-906c.ngrok.io'
cookie_secret_key='cookie_secret_key'
# Entra Verified Id API client application configuration
vcApp_azTenantId='b9a.....6486a'
vcApp_client_id='21b3.....619423a5'
vcApp_client_secret='FqG8.....OdrZ'
vcApp_scope='3db474b9-6a0c-4840-96ac-1fceb342124f/.default' <= do not change this value
# VC Issuer configuration
issuance_requestTemplate='./config/issuance_request_template.json'
issuance_authority='did:web:xxx'
issuance_registration_clientName='DID Developer Community Entra Issuer'
issuance_registration_logoUrl='https://{logo url which is shown in VC}'
issuance_registration_termsOfServiceUrl='https://{TOU url which is shown in VC}'
issuance_type='["{your VC types}"]'
issuance_CredentialManifest='https://verifiedid.did.msidentity.com/v1.0/tenants/...../manifest'
# Wallet app configuration
walletapp_url='https://{Wallet app url}'
```

### 4. Exectuion
```
npm app.js
```


note) If you run ths issuer on your local environment, please use ngrok url as baseURL in the .env file.



