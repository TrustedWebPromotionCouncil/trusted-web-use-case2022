# Classes
```mermaid
classDiagram

  class MessageStore
  <<interface>> MessageStore

  class DWN
  class DIDResolver
  class MessageReply
  class Response

  class handlers_collections_query
  class handlers_collections_wriite
  class handlers_permissions_request

  DWN o-- MessageStore
  DWN o-- DIDResolver

  DWN --> handlers_collections_query
  DWN --> handlers_collections_wriite
  DWN --> handlers_permissions_request

  DWN --> MessageReply
  DWN --> Response

  handlers_collections_query --> CollectionsQuery
  handlers_collections_wriite --> CollectionsWrite
  handlers_permissions_request --> PermissionsRequest
```

```mermaid
classDiagram
  class Authorizable
  <<interface>> Authorizable

  class BaseMessage
  <<interface>> BaseMessage

  class Message
  <<abstract>> Message

  class CollectionsQuery
  class CollectionsWrite
  class PermissionsRequest
  class PermissionsGrant

  class CollectionsQueryMessage
  class CollectionsWriteMessage
  class PermissionsRequestMessage
  class PermissionsGrantMessage

  Message <|-- CollectionsQuery
  Message <|-- CollectionsWrite
  Message <|-- PermissionsRequest
  Message <|-- PermissionsGrant

  Message o-- BaseMessage

  Authorizable <|.. CollectionsQuery
  Authorizable <|.. CollectionsWrite
  Authorizable <|.. PermissionsRequest
  Authorizable <|.. PermissionsGrant

  BaseMessage <|.. CollectionsQueryMessage
  BaseMessage <|.. CollectionsWriteMessage
  BaseMessage <|.. PermissionsRequestMessage
  BaseMessage <|.. PermissionsGrantMessage

  CollectionsQuery --> auth
  CollectionsWrite --> auth
  PermissionsRequest --> auth
  PermissionsGrant --> auth
```

```typescript
export type BaseMessage = {
  descriptor: {
    target: string;
    method: string;
  };
};
```

# Sequences
## Boot an App
```mermaid
sequenceDiagram
  participant app as App
  participant dwn as DWN
  participant store as MessageStore

  app ->> dwn: DWN.create(dwnConfig)
  activate dwn
  app ->> store: new()
  activate store
  deactivate store
  deactivate dwn
```

```typescript
export interface MessageStore {
  open(): Promise<void>;
  close(): Promise<void>;
  put(messageJson: BaseMessage): Promise<void>;
  get(cid: CID): Promise<BaseMessage>;
  query(query: any): Promise<BaseMessage[]>;
  delete(cid: CID): Promise<void>;
}
```

## Interfaces
### Common Sequences
#### Whole Outline Of Processing One Request
```mermaid
sequenceDiagram
  participant client as Client
  participant app as App
  participant dwn as DWN
  participant store as MessageStore
  participant msg as Message
  participant handers_cq as method handlers
  participant reply as MessageReply
  participant response as Response

  client ->> client: sign request
  client ->> app: request
  app ->> app: build message from request
  app ->> dwn: processRequest()
  activate dwn
  loop request.messages
    dwn ->> dwn: processMessage(message)
      activate dwn
      dwn ->> msg: parse(message)
      dwn ->> handers_cq: interfaceMethodHandler(message)
        note right of handers_cq: handler is collections-query<br/>or collections-write<br/>or permissions-request
        handers_cq ->> reply: new()
        activate reply
        handers_cq -->> dwn: reply
      dwn ->> response: new()
      activate response
      deactivate dwn
  end
  dwn -->> app: response
  deactivate dwn
  deactivate reply
  deactivate response
```


#### Authentication Part
```typescript
export type JwsHeaderParameters = {
  alg: string
  kid: string
};
export type SignatureInput = {
  protectedHeader: JwsHeaderParameters
  jwkPrivate: PrivateJwk
};
export type AuthCreateOptions = {
  signatureInput: SignatureInput
};
```

Sign
```mermaid
sequenceDiagram
  participant caller
  note right of caller: caller is collections-query<br/>or collections-write<br/>or permissions-request
  participant auth
  participant cids
  participant signer as GeneralJwsSigner

  caller ->> auth: sign(message, signatureInput)
    auth ->> cids: generateCid(message.descriptor)
    auth ->> signer: create(authPayloadBytes, [signatureInput])
    loop
      signer ->> signer: addSignature(signatureInput)
      activate signer
      signer ->> signer: sign(signingInputBytes, jwkPrivate)
      signer ->> signer: this.jws.signatures.push({ protected, signature }
      activate signer
      deactivate signer
      deactivate signer
    end
    auth ->> signer: getJws()
```

verify
```mermaid
sequenceDiagram
  participant caller
  note right of caller: caller is collections-query<br/>or collections-write<br/>or permissions-request
  participant auth
  participant verifier as GeneralJwsVerifier

  caller ->> auth: verifyAuth(message, didResolver, messageStore)
    auth ->> auth: validateSchema()
    auth ->> auth: authenticate(message.authorization, didResolver)
    note left of auth: extract kid from signature.<br/>protected@authenticate.signatures
    auth ->> verifier: vefiry(didResolver)
    activate verifier
    auth -> auth: authorize(message, signers)
    note left of auth: if requester is the same as the target DID,<br/> we can directly grant access
    deactivate verifier
```

spec note
```json
{  // Request Object
  "target": "did:example:123",
  "messages": [  // Message Objects
    {
      "data": "<BASE64URL_STRING>",
      "descriptor": {
        "nonce": "9b9c7f1fcabfc471ee2682890b58a427ba2c8db59ddf3c2d5ad16ccc84bb3106",
        "method": "CollectionsWrite",
        "target": "did:example:123", // checked if this did is the same with as signer's did in the sdk implemenatatioan.
        "schema": "https://schema.org/SocialMediaPosting",
        "recordId": "b6464162-84af-4aab-aff5-f1f8438dfc1e",
        "dataCid": CID(data),
        "dateCreated": 123456789,
        "dataFormat": "application/json"
     },
      "authorization": {
        "payload": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        "signatures": [{
          "protected": "f454w56e57r68jrhe56gw45gw35w65w4f5i54c85j84wh5jj8h5", // signer's kid is in this value.
          "signature": "5678nr67e56g45wf546786n9t78r67e45657bern797t8r6e5" // vefiry using public key got from above kid
        }]
      }
    },
    {...}
  ]
}
```

`nonce`は`dateCreated`が役割をカバーするので仕様から無くなりそう
https://github.com/TBD54566975/dwn-sdk-js/commit/a317e504958d755b99b4fe4097d888332cb7a595

### Inferface Common Types
```typescript
export type Signature = {
  protected: string
  signature: string
};
export type GeneralJws = {
  payload: string
  signatures: Signature[]
};
export type AuthorizableMessage = {
  authorization: GeneralJws;
};
```
### Collection
#### CollectionQuery

```typescript
export type CollectionsQueryOptions = AuthCreateOptions & {
  target: string;
  nonce: string;
  filter: {
    recipient?: string;
    protocol?: string;
    contextId?: string;
    schema?: string;
    recordId?: string;
    parentId?: string;
    dataFormat?: string;
  },
  dateSort?: string;
};
export type CollectionsQueryDescriptor = {
  target: string;
  method: 'CollectionsQuery';
  nonce: string;
  filter: {
    recipient?: string;
    protocol?: string;
    contextId?: string;
    schema?: string;
    recordId?: string;
    parentId?: string;
    dataFormat?: string;
  }
  dateSort?: string;
};
export type CollectionsQueryMessage = AuthorizableMessage & {
  descriptor: CollectionsQueryDescriptor;
};
```

Request Side
```mermaid
sequenceDiagram
  participant requester
  participant interface as messages/collections-query
  participant auth
  participant model as CollectionQuery
  participant web_node as DWebNode

  requester ->> requester: build options
  requester ->> interface: create(options: CollectionsQueryOptions)
  activate interface
  interface ->> interface: build descriptor
  interface ->> auth: sign(message, signatureInput)
    auth -->> interface: authorization: AuthorizableMessage
    interface ->> model: new(message: CollectionsQueryMessage)
    activate model
  interface -->> requester: CollectionQuery
  deactivate interface
  deactivate model
  requester ->> web_node: post CollectionQuery
```

DWebNode Side(handler part)
```mermaid
sequenceDiagram
  participant handers_cq as handlers/collections-query
  participant cq as CollectionsQuery
  participant auth
  participant store as MessageStore
  participant si as "search-index"
  participant db as levelDB
  participant reply as MessageReply

  handers_cq ->> cq: new(message as CollectionsQueryMessage)
  activate cq
  handers_cq ->> cq: verifyAuth(didResolver, messageStore)
    cq ->> auth: verifyAuth()
    note over auth: see auth sequence
  handers_cq ->> store: query(query)
    store ->> si: query
    store ->> db: get(cid)
    store -->> handers_cq: entries

  handers_cq -> reply: new(entries)
  activate reply
  deactivate cq
  deactivate reply
```

#### CollectionWrite
```typescript
export type CollectionsWriteOptions = AuthCreateOptions & {
  target: string;
  recipient: string;
  protocol?: string;
  contextId?: string;
  schema?: string;
  recordId: string;
  parentId?: string;
  nonce: string;
  data: Uint8Array;
  dateCreated: number;
  published?: boolean;
  datePublished?: number;
  dataFormat: string;
};
export type CollectionsWriteDescriptor = {
  target: string;
  recipient: string;
  method: 'CollectionsWrite';
  protocol?: string;
  contextId?: string;
  schema?: string;
  nonce: string;
  recordId: string;
  parentId?: string;
  dataCid: string;
  dateCreated: number;
  published?: boolean;
  datePublished?: number;
  dataFormat: string;
};
export type CollectionsWriteMessage = AuthorizableMessage & {
  descriptor: CollectionsWriteDescriptor;
  encodedData?: string;
};
```

Request Side
```mermaid
sequenceDiagram
  participant requester
  participant interface as messages/collections-write
  participant auth
  participant model as CollectionWrite
  participant web_node as DWebNode

  requester ->> requester: build options
  requester ->> interface: create(options: CollectionsWriteOptions)
  activate interface
  interface ->> interface: build descriptor
  interface ->> interface: encode data
  interface ->> auth: sign(message, signatureInput)
    auth -->> interface: authorization: AuthorizableMessage
    interface ->> model: new(message: CollectionsWriteMessage)
    activate model
  interface -->> requester: CollectionWrite
  deactivate interface
  deactivate model
  requester ->> web_node: post Collection
```

DWebNode Side(handler part)
```mermaid
sequenceDiagram
  participant handers_cq as handlers/collections-write
  participant cq as CollectionsWrite
  participant auth
  participant store as MessageStore
  participant si as "search-index"
  participant db as levelDB
  participant reply as MessageReply

  handers_cq ->> cq: new(message as CollectionsQueryMessage)
  activate cq
  handers_cq ->> cq: verifyAuth(didResolver, messageStore)
  cq ->> auth: verifyAuth()
  note over auth: see auth sequence
  handers_cq ->> store: query(query)
  store ->> si: query
  store ->> db: get(cid)
  store -->> handers_cq: existingMessages

  alt is newest
    handers_cq ->> store: put(message)
    store ->> db: put
    store ->> si: put
  end

  loop existingMessages
    handers_cq ->> store: delete(message)
    store ->> db: delete
    store ->> si: delete
  end

  alt is newest
    handers_cq ->> reply: new(status: { code: 202, detail: 'Accepted' })
    activate reply
    deactivate reply
  else
    handers_cq ->> reply: new(status: { code: 409, detail: 'Conflict' })
    activate reply
    deactivate reply
  end
  deactivate cq
```

### Permissoin
```typescript
export type PermissionConditions = {
  attestation?: 'optional' | 'prohibited' | 'required'
  delegation?: boolean,
  encryption?: 'optional' | 'required'
  publication?: boolean
  sharedAccess?: boolean
};
```
#### PermissoinRequest
```typescript
type PermissionsRequestOptions = AuthCreateOptions & {
  target: string;
  conditions?: PermissionConditions;
  description: string;
  grantedTo: string;
  grantedBy: string;
  objectId?: string;
  scope: PermissionScope;
};
export type PermissionsRequestDescriptor = {
  target: string;
  conditions: PermissionConditions
  description: string
  grantedTo: string
  grantedBy: string
  method: 'PermissionsRequest'
  objectId?: string
  scope: PermissionScope
};
export type PermissionsRequestMessage = AuthorizableMessage & {
  descriptor: PermissionsRequestDescriptor;
};
```

Request Side
```mermaid
sequenceDiagram
  participant requester
  participant interface as messages/permission-request
  participant auth
  participant model as PermissionsRequest
  participant web_node as DWebNode

  requester ->> requester: build options
  requester ->> interface: create(options: PermissionsRequestOptions)
  activate interface
  interface ->> interface: build descriptor
  interface ->> auth: sign(message, signatureInput)
    auth -->> interface: authorization: AuthorizableMessage
    interface ->> model: new(message: PermissionsRequestMessage)
    activate model
  interface -->> requester: PermissionsRequest
  deactivate interface
  deactivate model
  requester ->> web_node: post PermissionsRequest
```

DWebNode Side(handler part)
```mermaid
sequenceDiagram
  participant handers_cq as handlers/permissions-request
  participant cq as PermissionsRequest
  participant auth
  participant store as MessageStore
  participant si as "search-index"
  participant db as levelDB
  participant reply as MessageReply

  handers_cq ->> cq: new(message as PermissionsRequestMessage)
  activate cq
  handers_cq ->> cq: verifyAuth(didResolver, messageStore)
    cq ->> auth: verifyAuth()
    note over auth: see auth sequence
    cq ->> cq: check signer
    alt signer !== request.grantedTo
      cq ->> cq: throw new Error('grantee must be signer')
    end
  handers_cq ->> store: put(message)
  store ->> db: put
  store ->> si: put
  handers_cq ->> reply: new(status: { code: 202, detail: 'Accepted' })
  activate reply
  deactivate cq
  deactivate reply
```

#### PermissoinGrant
```typescript
type PermissionsGrantOptions = AuthCreateOptions & {
  target: string,
  conditions?: PermissionConditions;
  description: string;
  grantedTo: string;
  grantedBy: string;
  objectId?: string;
  permissionsRequestId?: string;
  scope: PermissionScope;
};
export type PermissionsGrantDescriptor = {
  target: string;
  conditions: PermissionConditions;
  delegatedFrom?: string;
  description: string;
  grantedTo: string;
  grantedBy: string;
  method: 'PermissionsGrant';
  objectId: string;
  permissionsRequestId?: string;
  scope: PermissionScope;
};
export type PermissionsGrantMessage = AuthorizableMessage & {
  descriptor: PermissionsGrantDescriptor;
  delegationChain?: PermissionsGrantMessage;
};
```

Request Side
```mermaid
sequenceDiagram
  participant requester
  participant interface as messages/permission-grant
  participant auth
  participant model as PermissionsGrant
  participant web_node as DWebNode

  requester ->> requester: build options
  requester ->> interface: create(options: PermissionsGrantOptions)
  activate interface
  interface ->> interface: build descriptor
  interface ->> auth: sign(message, signatureInput)
    auth -->> interface: authorization: AuthorizableMessage
    interface ->> model: new(message: PermissionsGrantMessage)
    activate model
  interface -->> requester: PermissionsGrant
  deactivate interface
  deactivate model
  requester ->> web_node: post PermissionsGrant
```

Request Side(Not implemented yet)
