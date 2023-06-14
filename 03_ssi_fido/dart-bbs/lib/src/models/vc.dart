import 'dart:convert';

class VerifiableCredential {
  String strVC;
  late Map mapVC = json.decode(strVC);
  late List<String> messages = getMessages();
  late Map? proof = mapVC["proof"];

  VerifiableCredential(this.strVC);

  String getSignature() {
    return proof!["proofValue"];
  }

  String getNonce() {
    return proof!["nonce"];
  }

  String getVerificationMethod() {
    return proof!["verificationMethod"];
  }

  List<String> getMessages() {
    /* requiredField */
    Map requiredFields = {};
    for (String key in mapVC.keys) {
      if (["holder", "proof", "credentialSubject"].contains(key)) {
        continue;
      }
      requiredFields[key] = mapVC[key];
    }
    List<String> ret = [json.encode(requiredFields)];

    /* credentialSubject 
       -> selectiveFields */
    ret.addAll(getSelectiveFields());

    return ret;
  }

  List<String> getSelectiveFields() {
    List<String> ret = [];
    for (var m in mapVC["credentialSubject"]) {
      ret.add(json.encode(m));
    }
    return ret;
  }

  // revealed indices
  List<int> getRevealedIndices(List<int> revealedIndices) {
    return [0] + revealedIndices;
  }

  Map createVPWithSelectiveDisclosure(List<int> revealed) {
    Map VP = json.decode(messages[0]);
    VP["credentialSubject"] = [];
    for (var index in revealed) {
      /* root message == required */
      if (index == 0) continue;

      VP["credentialSubject"].add(json.decode(messages[index]));
    }
    return VP;
  }
}
