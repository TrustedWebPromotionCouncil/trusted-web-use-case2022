use serde_json::Value;
use didcomm_rs::{Message, AttachmentBuilder, AttachmentDataBuilder};
use cuid;
use crate::{unid::{errors::UNiDError, keyring::{self}}};
use super::{did_vc::DIDVCService, types::VerifiedContainer};

pub struct DIDCommPlaintextService {}

impl DIDCommPlaintextService {
    pub fn generate(to_did: &str, message: &Value, metadata: Option<&Value>) -> Result<Value, UNiDError> {
        let keyring = match keyring::mnemonic::MnemonicKeyring::load_keyring() {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to load keyring".to_string() })
        };
        let did = match keyring.get_identifier() {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to get identifier".to_string() })
        };

        let body = match DIDVCService::generate(&message) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to generate body".to_string() }),
        };

        let mut message = match Message::new()
            .from(&did)
            .to(&[ &to_did ])
            .body(&body.to_string()) {
                Ok(v) => v,
                Err(_) => return Err(UNiDError { message: "Failed to create message".to_string() }),
            };

        // NOTE: Has attachment
        if let Some(value) = metadata {
            let id = match cuid::cuid() {
                Ok(v) => v,
                _ => return Err(UNiDError{ message: "Failed to generate cuid".to_string() }),
            };

            let data = AttachmentDataBuilder::new()
                .with_link("https://did.getunid.io")
                .with_json(&value.to_string());

            message.append_attachment(
                AttachmentBuilder::new(true)
                .with_id(&id)
                .with_format("metadata")
                .with_data(data)
            )
        }

        match message.clone().as_raw_json() {
            Ok(v) => {
                match serde_json::from_str::<Value>(&v) {
                    Ok(v) => Ok(v),
                    Err(_) => Err(UNiDError{ message: "Failed to parse message".to_string() }),
                }
            },
            Err(_) => return Err(UNiDError{ message: "Failed to parse message".to_string() }),
        }
    }

    pub fn verify(message: &Value) -> Result<VerifiedContainer, UNiDError> {
        let message = match Message::receive(&message.to_string(), None, None, None) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to parse message".to_string() }),
        };

        let metadata = message
            .attachment_iter()
            .find(|item| {
                match item.format.clone() {
                    Some(value) => value == "metadata",
                    None => false
                }
            });

        let body = match message.clone().get_body() {
            Ok(v) => {
                match serde_json::from_str::<Value>(&v) {
                    Ok(v) => v,
                    Err(_) => return Err(UNiDError{ message: "Failed to parse message".to_string() }),
                }
            },
            Err(_) => return Err(UNiDError{ message: "Failed to parse message".to_string() }),
        };

        match metadata {
            Some(metadata) => {
                match metadata.data.json.clone() {
                    Some(json) => {
                        match serde_json::from_str::<Value>(&json) {
                            Ok(metadata) => {
                                Ok(VerifiedContainer {
                                    message: body,
                                    metadata: Some(metadata),
                                })
                            },
                            _ => Err(UNiDError { message: "Failed to parse metadata".to_string() })
                        }
                    },
                    _ => Err(UNiDError { message: "Failed to parse metadata".to_string() })
                }
            },
            None => {
                Ok(VerifiedContainer {
                    message: body,
                    metadata: None,
                })
            }
        }
    }

}