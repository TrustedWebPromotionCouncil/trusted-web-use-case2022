import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const holders = [
    { "email": "student_a@example.jp", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "学生A" },
    { "email": "student_b@example.jp", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "学生B" },
  ];

  const issuers = [
    { "email": "aaaa@example.jp", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "教員A" },
    { "email": "bbbb@example.jp", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "教員B" },
  ];

  const verifiers = [
    { "email": "company_a@example.com", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "企業A" },
    { "email": "company_b@example.com", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "企業B" },
    { "email": "company_c@example.com", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "企業C" },
    { "email": "company_d@example.com", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "企業D" },
    { "email": "company_e@example.com", "password": "$2b$10$GVNcGS22C5lYCbqirPobduSQO.BRtCyK6dLlQX4Bw5YHBRuCs6UaG", "name": "企業E" },
  ];

  const skills = [
    {
      "holderEmail": "student_a@example.jp",
      "holderName": "学生A（初期データ）",
      "name": "プログラミング(Java)",
      "level": "Lv.5",
      "description": "Spring Frameworkが得意（初期データ）",
    },
    {
      "holderEmail": "student_a@example.jp",
      "holderName": "学生A（初期データ）",
      "name": "プログラミング(JavaScript)",
      "level": "Lv.3",
      "description": "Vue.js学習中（初期データ）",
    },
    {
      "holderEmail": "student_b@example.jp",
      "holderName": "学生B（初期データ）",
      "name": "プログラミング(C#)",
      "level": "Lv.4",
      "description": "Windowsアプリが得意（初期データ）",
    },
    {
      "holderEmail": "student_b@example.jp",
      "holderName": "学生B（初期データ）",
      "name": "プログラミング(Python)",
      "level": "Lv.1",
      "description": "データ分析にてNumPyを利用（初期データ）",
    },
  ];

  const credentials = [
    {
      "name": "プログラミング(Java)",
      "selfLevel": "Lv.5",
      "selfDescription": "Spring Frameworkが得意（初期データ）",
      "holderEmail": "student_a@example.jp",
      "holderName": "学生A（初期データ）",
      "level": "Lv.3",
      "description": "冗長なコードが多い印象（初期データ）",
      "certified": true,
      "issuerEmail": "aaaa@example.jp",
      "issuerName": "教員A（初期データ）",
    },
    {
      "name": "プログラミング(Java)",
      "selfLevel": "Lv.5",
      "selfDescription": "Spring Frameworkが得意（初期データ）",
      "holderEmail": "student_a@example.jp",
      "holderName": "学生A（初期データ）",
      "level": null,
      "description": null,
      "certified": false,
      "issuerEmail": "bbbb@example.jp",
      "issuerName": "教員B（初期データ）",
    },
    {
      "name": "プログラミング(JavaScript)",
      "selfLevel": "Lv.3",
      "selfDescription": "Vue.js学習中（初期データ）",
      "holderEmail": "student_a@example.jp",
      "holderName": "学生A（初期データ）",
      "level": "Lv.3",
      "description": "自己評価は妥当（初期データ）",
      "certified": false,
      "issuerEmail": "aaaa@example.jp",
      "issuerName": "教員A（初期データ）",
    },
    {
      "name": "プログラミング(C#)",
      "selfLevel": "Lv.4",
      "selfDescription": "Windowsアプリが得意（初期データ）",
      "holderEmail": "student_b@example.jp",
      "holderName": "学生B（初期データ）",
      "level": null,
      "description": null,
      "certified": false,
      "issuerEmail": "bbbb@example.jp",
      "issuerName": "教員B（初期データ）",
    },
    {
      "name": "プログラミング(Python)",
      "selfLevel": "Lv.1",
      "selfDescription": "データ分析にてNumPyを利用（初期データ）",
      "holderEmail": "student_b@example.jp",
      "holderName": "学生B（初期データ）",
      "level": "Lv.3",
      "description": "十分にできている（初期データ）",
      "certified": true,
      "issuerEmail": "bbbb@example.jp",
      "issuerName": "教員B（初期データ）",
    },
  ];

  const proofs = [
    {
      "trustSealId": "a4856907-3bf0-4e20-9b7b-0cbf10612900",
      "hashValue": "542328a3-8183-4abd-9093-eeaa97270b07",
      "proofHash": null,
      "holderEmail": "student_a@example.jp",
      "holderName": "学生A",
      "verifierEmail": "company_e@example.com",
      "verifierName": "企業E",
    },
  ];

  const result = await Promise.all(holders.map(async (user) => prisma.holder.create({ data: user })))
  console.log(result)

  const result2 = await Promise.all(issuers.map(async (user) => prisma.issuer.create({ data: user })))
  console.log(result2)

  const result3 = await Promise.all(verifiers.map(async (user) => prisma.verifier.create({ data: user })))
  console.log(result3)

  const result4 = await Promise.all(skills.map(async (d) => prisma.skill.create({ data: d })))
  console.log(result4)

  const result5 = await Promise.all(credentials.map(async (d) => prisma.credential.create({ data: d })))
  console.log(result5)

  const result6 = await Promise.all(proofs.map(async (d) => prisma.proof.create({ data: d })))
  console.log(result6)

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })