import { gql } from "apollo-server-micro";

export const typeDefs = gql`
schema {
  query: Query
  mutation: Mutation
}

directive @constraint(minLength: Int, maxLength: Int, startsWith: String, endsWith: String, notContains: String, pattern: String, format: String, min: Int, max: Int, exclusiveMin: Int, exclusiveMax: Int, multipleOf: Int) on INPUT_FIELD_DEFINITION

"""日付型 (文字列)"""
scalar DateTime

"""文章"""
type Document implements Node {
  """レコード作成日時"""
  createdAt: DateTime!
  """PDF ファイル"""
  data: String!
  """DID"""
  did: String!
  """ファイル名"""
  filename: String!
  """レコード ID"""
  id: ID!
  """設置場所"""
  location: String
  """ファイルフォーマット (MIME タイプ)"""
  mimeType: String!
  """スキャン日時"""
  scanedAt: DateTime!
  """シリアル番号"""
  serialNumber: String
  """レコード更新日時"""
  updatedAt: DateTime!
  """ユーザー名 (ID)"""
  username: String
  """スキャンデータ (VC)"""
  vc: String!
}

"""文章"""
type DocumentMetadata implements Node {
  """レコード作成日時"""
  createdAt: DateTime!
  """ファイル名"""
  filename: String!
  """レコード ID"""
  id: ID!
  """設置場所"""
  location: String
  """スキャン日時"""
  scanedAt: DateTime!
  """レコード更新日時"""
  updatedAt: DateTime!
}

"""ミューテーションの集合を定義します"""
type Mutation {
  "ユーザーを追加します"
  addUser(
    "メールアドレス"
    email: String!
    "パスワード"
    password: String!
  ): User!
  "特定のスキャンデータを削除します"
  removeDocument(
    "ドキュメント ID"
    documentId: String!
  ): ID!
  "ユーザーを削除します"
  removeUser(
    "メールアドレス"
    email: String!
  ): User!
  "ユーザーのパスワードをリセットします"
  resetPassword(
    "メールアドレス"
    email: String!
    "パスワード"
    password: String!
  ): User!
}

"""Node"""
interface Node {
  """レコード作成日時"""
  createdAt: DateTime!
  """物理 ID"""
  id: ID!
  """レコード更新日時"""
  updatedAt: DateTime!
}

"""クエリの集合を定義します"""
type Query {
  "DIDComm - GenerateEncryptedMessage"
  didcommGenerateEncryptedMessage(
    "destinations"
    destinations: [String!]!
    "message"
    message: String!
  ): String!
  "DIDComm - GeneratePlaintextMessage"
  didcommGeneratePlaintextMessage(
    "destinations"
    destinations: [String!]!
    "message"
    message: String!
  ): String!
  "DIDComm - GenerateSignedMessage"
  didcommGenerateSignedMessage(
    "destinations"
    destinations: [String!]!
    "message"
    message: String!
  ): String!
  "DIDComm - VerifyEncryptedMessage"
  didcommVerifyEncryptedMessage(
    "message"
    message: String!
  ): String!
  "DIDComm - VerifyPlaintextMessage"
  didcommVerifyPlaintextMessage(
    "message"
    message: String!
  ): String!
  "DIDComm - VerifySignedMessage"
  didcommVerifySignedMessage(
    "message"
    message: String!
  ): String!
  "DID - GenerateVC"
  didGenerateVC(
    "message"
    message: String!
  ): String!
  "DID - VerifyVC"
  didVerifyVC(
    "message"
    message: String!
  ): String!
  "特定のスキャンデータを返却します"
  document(
    "ドキュメント ID"
    documentId: String!
  ): Document!
  "スキャンデータの一覧を返却します"
  documents: [DocumentMetadata!]!
  "ユーザーを返却します"
  user: User!
}

"""ユーザー"""
type User implements Node {
  """レコード作成日時"""
  createdAt: DateTime!
  """メールアドレス"""
  email: String!
  """レコード ID"""
  id: ID!
  """レコード更新日時"""
  updatedAt: DateTime!
}
`
