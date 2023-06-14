import 'dart:convert';
import 'dart:typed_data';

Uint8List convertStringToUint8List(String str) {
  return Uint8List.fromList(utf8.encode(str));
}

String convertUint8ListToString(Uint8List uint8list) {
  return base64.encode(uint8list);
}
