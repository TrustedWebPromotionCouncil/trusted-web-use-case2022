import 'dart:convert';
import 'dart:typed_data' show Uint8List;

const _jwsProtectedHeaderKey = "protected";
const _jwsPayloadKey = "payload";
const _jwsSignatureKey = "signature";

const _jwsSeparator = ".";

// {"alg":"SIG-X","typ":"JWT"}
const _defaultProtectedHeader = "eyJhbGciOiJTSUctWCIsInR5cCI6IkpXVCJ9";

extension _JsonValueOrException on Map<String, dynamic> {
  T valueOf<T>(String key) {
    var value = this[key];
    if (value is! T) throw StateError(
      "The json does not contains required value: ${key}",
    );
    return value;
  }
}

class JsonWebSignature {
  final String protectedHeader;
  final String payload;
  final String signature;
  JsonWebSignature({
      this.protectedHeader = _defaultProtectedHeader,
      required this.payload,
      required this.signature,
  });

  JsonWebSignature.fromJson(Map<String, dynamic> jsonJWS): this(
    protectedHeader: jsonJWS.valueOf(_jwsProtectedHeaderKey),
    payload: jsonJWS.valueOf(_jwsPayloadKey),
    signature: jsonJWS.valueOf(_jwsSignatureKey),
  );

  JsonWebSignature.fromJsonString(String strJWS): this.fromJson(
    json.decode(strJWS),
  );

  factory JsonWebSignature.fromCompactSerialization(String serialization) {
    var parts = serialization.split(_jwsSeparator);
    if (parts.length != 3) throw ArgumentError.value(
      serialization, "serialization",
      "Compact serialization should have 3 parts.",
    );
    return JsonWebSignature(
      protectedHeader: parts[0], payload: parts[1], signature: parts[2],
    );
  }

  static T _valueOrException<T>(T? value, String? name) {
    if (value == null) throw ArgumentError.value(
      value, name, "The argument should not be null.",
    );
    return value;
  }

  static String _encodeString(String jsonString) => base64.encode(
    utf8.encode(jsonString),
  );

  static String _encodeJson(Map<String, dynamic> jsonMap) => _encodeString(
    json.encode(jsonMap),
  );

  JsonWebSignature.fromContents({
      String? protectedHeader,
      String? protectedHeaderString,
      Map<String, dynamic>? protectedHeaderJson,
      String? payload,
      String? payloadString,
      Map<String, dynamic>? payloadJson,
      String? signature,
      Uint8List? signatureBytes,
  }): this(
    protectedHeader: protectedHeader ?? (
      (protectedHeaderString != null) ? _encodeString(protectedHeaderString) : (
        (protectedHeaderJson != null) ?
          _encodeJson(protectedHeaderJson) : _defaultProtectedHeader
      )
    ),
    payload: payload ?? (
      (payloadString != null) ?
        _encodeString(payloadString) :
        _encodeJson(_valueOrException(payloadJson, "payload"))
    ),
    signature: signature ?? base64.encode(
      _valueOrException(signatureBytes, "signature"),
    ),
  );

  String _decode(String encoded) => utf8.decode(base64.decode(encoded));

  String get protectedHeaderDecoded => _decode(protectedHeader);
  String get payloadDecoded => _decode(payload);

  Map<String, dynamic> _toJson(String encoded) => json.decode(_decode(encoded));

  Map<String, dynamic> get protectedHeaderJson => _toJson(protectedHeader);
  Map<String, dynamic> get payloadJson => _toJson(payload);

  String toCompactSerialization() =>
    "${protectedHeader}${_jwsSeparator}${payload}${_jwsSeparator}${signature}";

  Map<String, dynamic> toJson() => {
    _jwsProtectedHeaderKey: protectedHeader,
    _jwsPayloadKey: payload,
    _jwsSignatureKey: signature,
  };
}
