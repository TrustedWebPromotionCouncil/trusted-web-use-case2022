use std::time::Duration;

use crate::{unid::{errors::UNiDError, keyring, sidetree::payload::{OperationPayload, DIDCreateRequest, CommitmentKeys, DIDCreateResponse, DIDResolutionResponse}, utils::http_client::{HttpClient, HttpClientConfig}}, config::KeyPair};
use rumqttc::{MqttOptions, AsyncClient, QoS};
use serde_json::{Value, json};
use cuid;

use super::internal::didcomm_encrypted::DIDCommEncryptedService;

pub struct UNiD {
    http_client: HttpClient
}

impl UNiD {
    pub fn new() -> Self {
        let client_config: HttpClientConfig = HttpClientConfig {
            base_url: "https://did.getunid.io".to_string(),
        };

        let client = match HttpClient::new(&client_config) {
            Ok(v) => v,
            Err(_) => panic!()
        };

        UNiD { http_client: client }
    }

    // NOTE: DONE
    pub async fn create_identifier(&self) -> Result<DIDResolutionResponse, UNiDError> {
        // NOTE: find did
        if let Ok(v) = keyring::mnemonic::MnemonicKeyring::load_keyring() {
            if let Ok(did) = v.get_identifier() {
                if let Ok(json) = self.find_identifier(&did).await {
                    return Ok(json)
                }
            }
        }

        // NOTE: does not exists did key ring
        let mut keyring = match keyring::mnemonic::MnemonicKeyring::create_keyring() {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to create keyring".to_string() }),
        };

        // NOTE: create payload
        let public = match keyring.get_sign_key_pair().to_public_key("signingKey", &vec!["auth", "general"]) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to create public key".to_string() }),
        };
        let update = match keyring.get_recovery_key_pair().to_jwk(false) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to create update key".to_string() }),
        };
        let recovery = match keyring.get_update_key_pair().to_jwk(false) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to create recovery key".to_string() }),
        };

        let payload = match OperationPayload::did_create_payload(&DIDCreateRequest {
            public_keys: vec![ public ],
            commitment_keys: CommitmentKeys {
                recovery,
                update,
            },
            service_endpoints: vec![],
        }) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to create payload".to_string() }),
        };

        let res = match self.http_client.post(&("/api/v1/operations"), &payload).await {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to create identifier".to_string() }),
        };

        let json = match res.json::<DIDResolutionResponse>().await {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to create identifier".to_string() }),
        };

        // NOTE: save context
        keyring.save(&json.did_document.id);

        Ok(json)
    }

    // NOTE: DONE
    pub async fn find_identifier(&self, did: &str) -> Result<DIDResolutionResponse, UNiDError> {
        let res = match self.http_client.get(&(format!("/api/v1/identifiers/{}", &did))).await {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to find identifier".to_string() }),
        };

        match res.json::<DIDResolutionResponse>().await {
            Ok(v) => Ok(v),
            Err(_) => Err(UNiDError{ message: "Failed to find identifier".to_string() }),
        }
    }

    pub async fn transfer(&self, to_did: &str, messages: &Vec<Value>, metadata: &Value) -> Result<Value, UNiDError> {
        // NOTE: didcomm (enc)
        let container = match DIDCommEncryptedService::generate(&to_did, &json!(messages), Some(&metadata)).await {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to transfer".to_string() }),
        };

        Ok(container)
    }
}