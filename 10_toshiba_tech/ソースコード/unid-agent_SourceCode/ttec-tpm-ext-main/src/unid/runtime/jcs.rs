use serde_jcs;
use serde_json::{self, Value};

use crate::unid::errors::UNiDError;

pub struct JCS {}

impl JCS {
    pub fn canonicalize(input: &str) -> Result<String, UNiDError> {
        let json = match serde_json::from_str::<Value>(input) {
            Ok(v) => v,
            Err(_) => return Err(UNiDError{ message: "Failed to parse JSON".to_string()})
        };

        match serde_jcs::to_string(&json) {
            Ok(v) => Ok(v),
            Err(_) => Err(UNiDError{ message: "Failed to canonicalize JSON".to_string()})
        }
    }
}

#[cfg(test)]
pub mod tests {
    use super::*;
    use rstest::*;

    #[fixture]
    fn json() -> String {
        String::from(r#"{"c":2,"a":1,"b":[]}"#)
    }

    #[test]
    fn test_canonicalize() {
        let result = match JCS::canonicalize(&json()) {
            Ok(v) => v,
            Err(_) => panic!()
        };

        assert_eq!(result, r#"{"a":1,"b":[],"c":2}"#);
    }
}