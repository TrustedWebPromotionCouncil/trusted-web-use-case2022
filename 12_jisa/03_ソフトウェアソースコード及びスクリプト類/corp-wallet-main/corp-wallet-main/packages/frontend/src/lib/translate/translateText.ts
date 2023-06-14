const translateList = {
  SWCertificate: "ソフトウェア利用証明書",
  IndustryCertificate: "工業会証明書",
  ApplicationCertificate: "経営力向上認定証明書",
  maker: "ソフトウェア会社(DEMO)",
  Agency: "所管官庁(当該中小事業者の業種所管)",
  "did:web:vc-issuer-jisa.azurewebsites.net": "JISA",
  "did:web:vc-issuer-agency.azurewebsites.net": "所管官庁(当該中小事業者の業種所管)",
};

export const translateText = (text: string) => {
  return translateList[text] || text;
};
