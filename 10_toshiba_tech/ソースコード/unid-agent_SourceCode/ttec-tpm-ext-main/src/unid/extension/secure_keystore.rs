use std::ffi::CStr;

use crate::{config::{KeyPair, Extension}, unid::errors::UNiDError, app_config};

#[repr(C)]
enum EKBRKEYID {
    EkbrkeyidKey1,
    EkbrkeyidKey2,
    EkbrkeyidKey3,
    EkbrkeyidKey4,
    EkbrkeyidKey5,
}

#[derive(Debug)]
pub enum SecureKeyStoreType {
    Sign,
    Update,
    Recover,
    Encrypt,
}

pub struct SecureKeyStore {
}

impl SecureKeyStore {
    const MAX_BUFFER_LENGTH: usize = 1024;

    pub fn new() -> SecureKeyStore {
        SecureKeyStore {}
    }

    fn write_external(&self, extension: &Extension, key_type: &SecureKeyStoreType, key_pair: &KeyPair) -> Result<(), UNiDError> {
        log::info!("Called: write_external (type: {:?})", key_type);

        unsafe {
            let encoded_secret_key = hex::encode(&key_pair.secret_key);
            let encoded_public_key = hex::encode(&key_pair.public_key);

            let joined_keys = [ [ encoded_secret_key, encoded_public_key ].join(".").as_bytes(), b"\0" ].concat();
            let mut joined_keys_buffer = [0u8; SecureKeyStore::MAX_BUFFER_LENGTH + 1];

            joined_keys.iter().enumerate().for_each(|(index, value)| {
                joined_keys_buffer[index] = *value;
            });

            let joined_keys_buffer_ptr: *const i8 = joined_keys_buffer.as_ptr().cast();

            let lib = match libloading::Library::new(&extension.filename) {
                Ok(v) => v,
                Err(_) => return Err(UNiDError{ message: "Failed to load library".to_string() })
            };

            let func: libloading::Symbol<unsafe extern fn(key_id: EKBRKEYID, p_key_data: *const i8) -> bool> = match lib.get(&extension.symbol.as_bytes()) {
                Ok(v) => v,
                Err(_) => return Err(UNiDError{ message: "Failed to load symbol".to_string() })
            };

            let result = match key_type {
                SecureKeyStoreType::Sign => {
                    func(EKBRKEYID::EkbrkeyidKey1, joined_keys_buffer_ptr)
                },
                SecureKeyStoreType::Update => {
                    func(EKBRKEYID::EkbrkeyidKey2, joined_keys_buffer_ptr)
                },
                SecureKeyStoreType::Recover => {
                    func(EKBRKEYID::EkbrkeyidKey3, joined_keys_buffer_ptr)
                },
                SecureKeyStoreType::Encrypt => {
                    func(EKBRKEYID::EkbrkeyidKey4, joined_keys_buffer_ptr)
                },
            };

            if result != true {
                Err(UNiDError { message: "Failed to write to external keystore".to_string() })
            } else {
                Ok(())
            }
        }
    }

    fn write_internal(&self, key_type: &SecureKeyStoreType, key_pair: &KeyPair) -> Result<(), UNiDError> {
        log::info!("Called: write_internal (type: {:?})", key_type);

        let config = app_config();

        match key_type {
            SecureKeyStoreType::Sign => {
                match config.inner.lock() {
                    Ok(mut config) => {
                        config.save_sign_key_pair(&key_pair)
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
            SecureKeyStoreType::Update => {
                match config.inner.lock() {
                    Ok(mut config) => {
                        config.save_update_key_pair(&key_pair)
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
            SecureKeyStoreType::Recover => {
                match config.inner.lock() {
                    Ok(mut config) => {
                        config.save_recover_key_pair(&key_pair)
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
            SecureKeyStoreType::Encrypt => {
                match config.inner.lock() {
                    Ok(mut config) => {
                        config.save_encrypt_key_pair(&key_pair)
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
        }
    }

    fn read_external(&self, extension: &Extension, key_type: &SecureKeyStoreType) -> Result<Option<KeyPair>, UNiDError> {
        log::info!("Called: read_external (type: {:?})", key_type);

        unsafe {
            let keys_buffer = [0u8; SecureKeyStore::MAX_BUFFER_LENGTH + 1];

            let keys_buffer_ptr: *const i8 = keys_buffer.as_ptr().cast();

            let keys_len = 0;

            let lib = match libloading::Library::new(&extension.filename) {
                Ok(v) => v,
                _ => return Err(UNiDError{ message: "Failed to load library".to_string() })
            };

            let func: libloading::Symbol<unsafe extern fn(key_id: EKBRKEYID, p_key_data_buffer: *const i8, key_data_buffer_len: usize, p_key_data_len: *const usize) -> u32> = match lib.get(&extension.symbol.as_bytes()) {
                Ok(v) => v,
                _ => return Err(UNiDError{ message: "Failed to load symbol".to_string() })
            };

            let result = match key_type {
                SecureKeyStoreType::Sign => {
                    func(EKBRKEYID::EkbrkeyidKey1, keys_buffer_ptr, keys_buffer.len(), &keys_len)
                },
                SecureKeyStoreType::Update => {
                    func(EKBRKEYID::EkbrkeyidKey2, keys_buffer_ptr, keys_buffer.len(), &keys_len)
                },
                SecureKeyStoreType::Recover => {
                    func(EKBRKEYID::EkbrkeyidKey3, keys_buffer_ptr, keys_buffer.len(), &keys_len)
                },
                SecureKeyStoreType::Encrypt => {
                    func(EKBRKEYID::EkbrkeyidKey4, keys_buffer_ptr, keys_buffer.len(), &keys_len)
                },
            };

            if keys_len != 256 {
                return Err(UNiDError { message: "Failed to read from external keystore".to_string() })
            }

            let keys = match CStr::from_ptr(keys_buffer_ptr).to_str() {
                Ok(v) => v.to_string(),
                _ => return Err(UNiDError { message: "Failed to read from external keystore".to_string() })
            };

            let splitted_keys: Vec<String> = keys.split(".").map(|v| v.to_string()).collect();

            if splitted_keys.len() != 2 {
                return Err(UNiDError { message: "Failed to read from external keystore".to_string() })
            }

            let secret_key = match splitted_keys.first() {
                Some(v) => {
                    match hex::decode(v) {
                        Ok(v) => v,
                        _ => return Err(UNiDError { message: "Failed to read from external keystore".to_string() })
                    }
                },
                _ => return Err(UNiDError { message: "Failed to read from external keystore".to_string() })
            };
            let public_key = match splitted_keys.last() {
                Some(v) => {
                    match hex::decode(v) {
                        Ok(v) => v,
                        _ => return Err(UNiDError { message: "Failed to read from external keystore".to_string() })
                    }
                },
                _ => return Err(UNiDError { message: "Failed to read from external keystore".to_string() })
            };

            if 0 < result {
                Ok(Some(KeyPair {
                    public_key,
                    secret_key,
                }))
            } else {
                Err(UNiDError{ message: "Failed to read from external keystore".to_string() })
            }
        }
    }

    fn read_internal(&self, key_type: &SecureKeyStoreType) -> Result<Option<KeyPair>, UNiDError> {
        log::info!("Called: read_internal (type: {:?})", key_type);

        let config = app_config();

        match key_type {
            SecureKeyStoreType::Sign => {
                match config.inner.lock() {
                    Ok(config) => {
                        Ok(config.load_sign_key_pair())
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
            SecureKeyStoreType::Update => {
                match config.inner.lock() {
                    Ok(config) => {
                        Ok(config.load_update_key_pair())
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
            SecureKeyStoreType::Recover => {
                match config.inner.lock() {
                    Ok(config) => {
                        Ok(config.load_recovery_key_pair())
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
            SecureKeyStoreType::Encrypt => {
                match config.inner.lock() {
                    Ok(config) => {
                        Ok(config.load_encrypt_key_pair())
                    },
                    _ => Err(UNiDError { message: "Failed to lock config".to_string() }),
                }
            },
        }
    }

    pub fn write(&self, key_type: &SecureKeyStoreType, key_pair: &KeyPair) -> Result<(), UNiDError> {
        let config = app_config();
        let extension = match config.inner.lock() {
            Ok(config) => {
                config.load_secure_keystore_write_sig()
            },
            _ => return Err(UNiDError { message: "Failed to lock config".to_string() })
        };

        match extension {
            Some(v) => {
                self.write_external(&v, &key_type, &key_pair)
            },
            _ => {
                self.write_internal(&key_type, &key_pair)
            }
        }
    }

    pub fn read(&self, key_type: &SecureKeyStoreType) -> Result<Option<KeyPair>, UNiDError> {
        let config = app_config();
        let extension = match config.inner.lock() {
            Ok(config) => {
                config.load_secure_keystore_read_sig()
            },
            _ => return Err(UNiDError { message: "Failed to lock config".to_string() }),
        };

        match extension {
            Some(v) => {
                self.read_external(&v, &key_type)
            },
            _ => {
                self.read_internal(&key_type)
            }
        }
    }
}