use chrono::Utc;
use serde_json::{Value, json};
use crate::{unid::{errors::UNiDError, keyring::{self}, schema::general::{GeneralVcDataModel, Issuer, CredentialSubject}, cipher::credential_signer::{CredentialSigner, CredentialSignerSuite}}};

pub struct DIDVCService {
}

impl DIDVCService {
    pub fn generate(message: &Value) -> Result<Value, UNiDError> {
        let keyring = match keyring::mnemonic::MnemonicKeyring::load_keyring() {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to load keyring".to_string() })
        };
        let did = match keyring.get_identifier() {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to get identifier".to_string() })
        };

        let r#type = "VerifiableCredential".to_string();
        let context = "https://www.w3.org/2018/credentials/v1".to_string();
        let issuance_date = Utc::now().to_rfc3339();

        let model = GeneralVcDataModel {
            id: None,
            issuer: Issuer { id: did.clone() },
            r#type: vec![ r#type ],
            context: vec![ context ],
            issuance_date,
            credential_subject: CredentialSubject {
                id: None,
                container: message.clone(),
            },
            expiration_date: None,
            proof: None,
        };

        let signed = match CredentialSigner::sign(&model, &CredentialSignerSuite {
            did: Some(did),
            key_id: Some("signingKey".to_string()),
            context: keyring.get_sign_key_pair(),
        }) {
            Ok(v) => v,
            Err(_) => panic!(),
        };

        Ok(json!(signed))
    }

    pub async fn verify(message: &Value) -> Result<Value, UNiDError> {
        let service = crate::services::unid::UNiD::new();

        let model = match serde_json::from_value::<GeneralVcDataModel>(message.clone()) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to deserialize".to_string() }),
        };

        let did_document = match service.find_identifier(&model.issuer.id).await {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to find identifier".to_string() }),
        };
        let public_keys = match did_document.did_document.public_key {
            Some(v) => v,
            None => return Err(UNiDError{ message: "Failed to find public key".to_string() }),
        };

        // FIXME: workaround
        if public_keys.len() != 1 {
            return Err(UNiDError{ message: "Failed to find public key".to_string() })
        }

        let public_key = public_keys[0].clone();

        let context = match keyring::secp256k1::Secp256k1::from_jwk(&public_key.public_key_jwk) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to load public key".to_string() })
        };

        let (verified_model, verified) = match CredentialSigner::verify(&model, &CredentialSignerSuite {
            did: None,
            key_id: None,
            context,
        }) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to verify".to_string() })
        };

        if !verified {
            return Err(UNiDError{ message: "Failed to verify".to_string() })
        }

        Ok(verified_model)
    }
}