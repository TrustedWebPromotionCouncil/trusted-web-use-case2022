import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:dart_bbs/src/vdr/vdr_settings.dart';

/* Interface
 input  : jwkSet String
 {
  "keys": [
    {
      "kty": "RSA",
      "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
      "e": "AQAB"
    },
    {
      "kty": "OKP",
      "crv": "Bls12381G2",
      "x": "ra5S/xUwWnKBrxexHISuZlRRZPBjZ37wMvF3mfFiytW9urPY6JtiHzJ6t5jQCMHPE+aJ195CvaoS3uRGH0SoUjnGxeuMv+IcWpVhtmy2s1w7ZVgF7ZifpD0Bd9Eu8rpw"
    }
  ]
}
       : type -> holder or issuer


 output : {id: value, keys: value} Map 
*/

Future<Map<String, dynamic>> createDid(String jwkSet) async {
  Map<String, dynamic> jwkSetMap = json.decode(jwkSet);
  var response = await http.post(vdrCreateDidUri,
      body: json.encode(jwkSetMap),
      headers: {"Content-Type": "application/json"});

  return json.decode(response.body);
}
