import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** 日付型 (文字列) */
  DateTime: any;
};

/** 文章 */
export type Document = Node & {
  __typename?: 'Document';
  /** レコード作成日時 */
  createdAt: Scalars['DateTime'];
  /** PDF ファイル */
  data: Scalars['String'];
  /** DID */
  did: Scalars['String'];
  /** ファイル名 */
  filename: Scalars['String'];
  /** レコード ID */
  id: Scalars['ID'];
  /** 設置場所 */
  location?: Maybe<Scalars['String']>;
  /** ファイルフォーマット (MIME タイプ) */
  mimeType: Scalars['String'];
  /** スキャン日時 */
  scanedAt: Scalars['DateTime'];
  /** シリアル番号 */
  serialNumber?: Maybe<Scalars['String']>;
  /** レコード更新日時 */
  updatedAt: Scalars['DateTime'];
  /** ユーザー名 (ID) */
  username?: Maybe<Scalars['String']>;
  /** スキャンデータ (VC) */
  vc: Scalars['String'];
};

/** 文章 */
export type DocumentMetadata = Node & {
  __typename?: 'DocumentMetadata';
  /** レコード作成日時 */
  createdAt: Scalars['DateTime'];
  /** ファイル名 */
  filename: Scalars['String'];
  /** レコード ID */
  id: Scalars['ID'];
  /** 設置場所 */
  location?: Maybe<Scalars['String']>;
  /** スキャン日時 */
  scanedAt: Scalars['DateTime'];
  /** レコード更新日時 */
  updatedAt: Scalars['DateTime'];
};

/** ミューテーションの集合を定義します */
export type Mutation = {
  __typename?: 'Mutation';
  /** ユーザーを追加します */
  addUser: User;
  /** 特定のスキャンデータを削除します */
  removeDocument: Scalars['ID'];
  /** ユーザーを削除します */
  removeUser: User;
  /** ユーザーのパスワードをリセットします */
  resetPassword: User;
};


/** ミューテーションの集合を定義します */
export type MutationAddUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


/** ミューテーションの集合を定義します */
export type MutationRemoveDocumentArgs = {
  documentId: Scalars['String'];
};


/** ミューテーションの集合を定義します */
export type MutationRemoveUserArgs = {
  email: Scalars['String'];
};


/** ミューテーションの集合を定義します */
export type MutationResetPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

/** Node */
export type Node = {
  /** レコード作成日時 */
  createdAt: Scalars['DateTime'];
  /** 物理 ID */
  id: Scalars['ID'];
  /** レコード更新日時 */
  updatedAt: Scalars['DateTime'];
};

/** クエリの集合を定義します */
export type Query = {
  __typename?: 'Query';
  /** DID - GenerateVC */
  didGenerateVC: Scalars['String'];
  /** DID - VerifyVC */
  didVerifyVC: Scalars['String'];
  /** DIDComm - GenerateEncryptedMessage */
  didcommGenerateEncryptedMessage: Scalars['String'];
  /** DIDComm - GeneratePlaintextMessage */
  didcommGeneratePlaintextMessage: Scalars['String'];
  /** DIDComm - GenerateSignedMessage */
  didcommGenerateSignedMessage: Scalars['String'];
  /** DIDComm - VerifyEncryptedMessage */
  didcommVerifyEncryptedMessage: Scalars['String'];
  /** DIDComm - VerifyPlaintextMessage */
  didcommVerifyPlaintextMessage: Scalars['String'];
  /** DIDComm - VerifySignedMessage */
  didcommVerifySignedMessage: Scalars['String'];
  /** 特定のスキャンデータを返却します */
  document: Document;
  /** スキャンデータの一覧を返却します */
  documents: Array<DocumentMetadata>;
  /** ユーザーを返却します */
  user: User;
};


/** クエリの集合を定義します */
export type QueryDidGenerateVcArgs = {
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDidVerifyVcArgs = {
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDidcommGenerateEncryptedMessageArgs = {
  destinations: Array<Scalars['String']>;
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDidcommGeneratePlaintextMessageArgs = {
  destinations: Array<Scalars['String']>;
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDidcommGenerateSignedMessageArgs = {
  destinations: Array<Scalars['String']>;
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDidcommVerifyEncryptedMessageArgs = {
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDidcommVerifyPlaintextMessageArgs = {
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDidcommVerifySignedMessageArgs = {
  message: Scalars['String'];
};


/** クエリの集合を定義します */
export type QueryDocumentArgs = {
  documentId: Scalars['String'];
};

/** ユーザー */
export type User = Node & {
  __typename?: 'User';
  /** レコード作成日時 */
  createdAt: Scalars['DateTime'];
  /** メールアドレス */
  email: Scalars['String'];
  /** レコード ID */
  id: Scalars['ID'];
  /** レコード更新日時 */
  updatedAt: Scalars['DateTime'];
};

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string } };

export type DidGenerateVcQueryVariables = Exact<{
  message: Scalars['String'];
}>;


export type DidGenerateVcQuery = { __typename?: 'Query', didGenerateVC: string };

export type DidVerifyVcQueryVariables = Exact<{
  message: Scalars['String'];
}>;


export type DidVerifyVcQuery = { __typename?: 'Query', didVerifyVC: string };

export type DidCommGeneratePlaintextMessageQueryVariables = Exact<{
  destinations: Array<Scalars['String']> | Scalars['String'];
  message: Scalars['String'];
}>;


export type DidCommGeneratePlaintextMessageQuery = { __typename?: 'Query', didcommGeneratePlaintextMessage: string };

export type DidCommVerifyPlaintextMessageQueryVariables = Exact<{
  message: Scalars['String'];
}>;


export type DidCommVerifyPlaintextMessageQuery = { __typename?: 'Query', didcommVerifyPlaintextMessage: string };

export type DidCommGenerateSignedMessageQueryVariables = Exact<{
  destinations: Array<Scalars['String']> | Scalars['String'];
  message: Scalars['String'];
}>;


export type DidCommGenerateSignedMessageQuery = { __typename?: 'Query', didcommGenerateSignedMessage: string };

export type DidCommVerifySignedMessageQueryVariables = Exact<{
  message: Scalars['String'];
}>;


export type DidCommVerifySignedMessageQuery = { __typename?: 'Query', didcommVerifySignedMessage: string };

export type DidCommGenerateEncryptedMessageQueryVariables = Exact<{
  destinations: Array<Scalars['String']> | Scalars['String'];
  message: Scalars['String'];
}>;


export type DidCommGenerateEncryptedMessageQuery = { __typename?: 'Query', didcommGenerateEncryptedMessage: string };

export type DidCommVerifyEncryptedMessageQueryVariables = Exact<{
  message: Scalars['String'];
}>;


export type DidCommVerifyEncryptedMessageQuery = { __typename?: 'Query', didcommVerifyEncryptedMessage: string };

export type GetDocumentQueryVariables = Exact<{
  documentId: Scalars['String'];
}>;


export type GetDocumentQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: string, did: string, vc: string, location?: string | null, username?: string | null, serialNumber?: string | null, scanedAt: any, filename: string, mimeType: string, data: string, createdAt: any } };

export type RemoveDocumentMutationVariables = Exact<{
  documentId: Scalars['String'];
}>;


export type RemoveDocumentMutation = { __typename?: 'Mutation', removeDocument: string };

export type GetDocumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDocumentsQuery = { __typename?: 'Query', documents: Array<{ __typename?: 'DocumentMetadata', id: string, location?: string | null, filename: string, scanedAt: any }> };


export const GetUserDocument = gql`
    query getUser {
  user {
    id
    email
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const DidGenerateVcDocument = gql`
    query DIDGenerateVC($message: String!) {
  didGenerateVC(message: $message)
}
    `;

/**
 * __useDidGenerateVcQuery__
 *
 * To run a query within a React component, call `useDidGenerateVcQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidGenerateVcQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidGenerateVcQuery({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidGenerateVcQuery(baseOptions: Apollo.QueryHookOptions<DidGenerateVcQuery, DidGenerateVcQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidGenerateVcQuery, DidGenerateVcQueryVariables>(DidGenerateVcDocument, options);
      }
export function useDidGenerateVcLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidGenerateVcQuery, DidGenerateVcQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidGenerateVcQuery, DidGenerateVcQueryVariables>(DidGenerateVcDocument, options);
        }
export type DidGenerateVcQueryHookResult = ReturnType<typeof useDidGenerateVcQuery>;
export type DidGenerateVcLazyQueryHookResult = ReturnType<typeof useDidGenerateVcLazyQuery>;
export type DidGenerateVcQueryResult = Apollo.QueryResult<DidGenerateVcQuery, DidGenerateVcQueryVariables>;
export const DidVerifyVcDocument = gql`
    query DIDVerifyVC($message: String!) {
  didVerifyVC(message: $message)
}
    `;

/**
 * __useDidVerifyVcQuery__
 *
 * To run a query within a React component, call `useDidVerifyVcQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidVerifyVcQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidVerifyVcQuery({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidVerifyVcQuery(baseOptions: Apollo.QueryHookOptions<DidVerifyVcQuery, DidVerifyVcQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidVerifyVcQuery, DidVerifyVcQueryVariables>(DidVerifyVcDocument, options);
      }
export function useDidVerifyVcLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidVerifyVcQuery, DidVerifyVcQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidVerifyVcQuery, DidVerifyVcQueryVariables>(DidVerifyVcDocument, options);
        }
export type DidVerifyVcQueryHookResult = ReturnType<typeof useDidVerifyVcQuery>;
export type DidVerifyVcLazyQueryHookResult = ReturnType<typeof useDidVerifyVcLazyQuery>;
export type DidVerifyVcQueryResult = Apollo.QueryResult<DidVerifyVcQuery, DidVerifyVcQueryVariables>;
export const DidCommGeneratePlaintextMessageDocument = gql`
    query DIDCommGeneratePlaintextMessage($destinations: [String!]!, $message: String!) {
  didcommGeneratePlaintextMessage(destinations: $destinations, message: $message)
}
    `;

/**
 * __useDidCommGeneratePlaintextMessageQuery__
 *
 * To run a query within a React component, call `useDidCommGeneratePlaintextMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidCommGeneratePlaintextMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidCommGeneratePlaintextMessageQuery({
 *   variables: {
 *      destinations: // value for 'destinations'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidCommGeneratePlaintextMessageQuery(baseOptions: Apollo.QueryHookOptions<DidCommGeneratePlaintextMessageQuery, DidCommGeneratePlaintextMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidCommGeneratePlaintextMessageQuery, DidCommGeneratePlaintextMessageQueryVariables>(DidCommGeneratePlaintextMessageDocument, options);
      }
export function useDidCommGeneratePlaintextMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidCommGeneratePlaintextMessageQuery, DidCommGeneratePlaintextMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidCommGeneratePlaintextMessageQuery, DidCommGeneratePlaintextMessageQueryVariables>(DidCommGeneratePlaintextMessageDocument, options);
        }
export type DidCommGeneratePlaintextMessageQueryHookResult = ReturnType<typeof useDidCommGeneratePlaintextMessageQuery>;
export type DidCommGeneratePlaintextMessageLazyQueryHookResult = ReturnType<typeof useDidCommGeneratePlaintextMessageLazyQuery>;
export type DidCommGeneratePlaintextMessageQueryResult = Apollo.QueryResult<DidCommGeneratePlaintextMessageQuery, DidCommGeneratePlaintextMessageQueryVariables>;
export const DidCommVerifyPlaintextMessageDocument = gql`
    query DIDCommVerifyPlaintextMessage($message: String!) {
  didcommVerifyPlaintextMessage(message: $message)
}
    `;

/**
 * __useDidCommVerifyPlaintextMessageQuery__
 *
 * To run a query within a React component, call `useDidCommVerifyPlaintextMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidCommVerifyPlaintextMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidCommVerifyPlaintextMessageQuery({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidCommVerifyPlaintextMessageQuery(baseOptions: Apollo.QueryHookOptions<DidCommVerifyPlaintextMessageQuery, DidCommVerifyPlaintextMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidCommVerifyPlaintextMessageQuery, DidCommVerifyPlaintextMessageQueryVariables>(DidCommVerifyPlaintextMessageDocument, options);
      }
export function useDidCommVerifyPlaintextMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidCommVerifyPlaintextMessageQuery, DidCommVerifyPlaintextMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidCommVerifyPlaintextMessageQuery, DidCommVerifyPlaintextMessageQueryVariables>(DidCommVerifyPlaintextMessageDocument, options);
        }
export type DidCommVerifyPlaintextMessageQueryHookResult = ReturnType<typeof useDidCommVerifyPlaintextMessageQuery>;
export type DidCommVerifyPlaintextMessageLazyQueryHookResult = ReturnType<typeof useDidCommVerifyPlaintextMessageLazyQuery>;
export type DidCommVerifyPlaintextMessageQueryResult = Apollo.QueryResult<DidCommVerifyPlaintextMessageQuery, DidCommVerifyPlaintextMessageQueryVariables>;
export const DidCommGenerateSignedMessageDocument = gql`
    query DIDCommGenerateSignedMessage($destinations: [String!]!, $message: String!) {
  didcommGenerateSignedMessage(destinations: $destinations, message: $message)
}
    `;

/**
 * __useDidCommGenerateSignedMessageQuery__
 *
 * To run a query within a React component, call `useDidCommGenerateSignedMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidCommGenerateSignedMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidCommGenerateSignedMessageQuery({
 *   variables: {
 *      destinations: // value for 'destinations'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidCommGenerateSignedMessageQuery(baseOptions: Apollo.QueryHookOptions<DidCommGenerateSignedMessageQuery, DidCommGenerateSignedMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidCommGenerateSignedMessageQuery, DidCommGenerateSignedMessageQueryVariables>(DidCommGenerateSignedMessageDocument, options);
      }
export function useDidCommGenerateSignedMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidCommGenerateSignedMessageQuery, DidCommGenerateSignedMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidCommGenerateSignedMessageQuery, DidCommGenerateSignedMessageQueryVariables>(DidCommGenerateSignedMessageDocument, options);
        }
export type DidCommGenerateSignedMessageQueryHookResult = ReturnType<typeof useDidCommGenerateSignedMessageQuery>;
export type DidCommGenerateSignedMessageLazyQueryHookResult = ReturnType<typeof useDidCommGenerateSignedMessageLazyQuery>;
export type DidCommGenerateSignedMessageQueryResult = Apollo.QueryResult<DidCommGenerateSignedMessageQuery, DidCommGenerateSignedMessageQueryVariables>;
export const DidCommVerifySignedMessageDocument = gql`
    query DIDCommVerifySignedMessage($message: String!) {
  didcommVerifySignedMessage(message: $message)
}
    `;

/**
 * __useDidCommVerifySignedMessageQuery__
 *
 * To run a query within a React component, call `useDidCommVerifySignedMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidCommVerifySignedMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidCommVerifySignedMessageQuery({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidCommVerifySignedMessageQuery(baseOptions: Apollo.QueryHookOptions<DidCommVerifySignedMessageQuery, DidCommVerifySignedMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidCommVerifySignedMessageQuery, DidCommVerifySignedMessageQueryVariables>(DidCommVerifySignedMessageDocument, options);
      }
export function useDidCommVerifySignedMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidCommVerifySignedMessageQuery, DidCommVerifySignedMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidCommVerifySignedMessageQuery, DidCommVerifySignedMessageQueryVariables>(DidCommVerifySignedMessageDocument, options);
        }
export type DidCommVerifySignedMessageQueryHookResult = ReturnType<typeof useDidCommVerifySignedMessageQuery>;
export type DidCommVerifySignedMessageLazyQueryHookResult = ReturnType<typeof useDidCommVerifySignedMessageLazyQuery>;
export type DidCommVerifySignedMessageQueryResult = Apollo.QueryResult<DidCommVerifySignedMessageQuery, DidCommVerifySignedMessageQueryVariables>;
export const DidCommGenerateEncryptedMessageDocument = gql`
    query DIDCommGenerateEncryptedMessage($destinations: [String!]!, $message: String!) {
  didcommGenerateEncryptedMessage(destinations: $destinations, message: $message)
}
    `;

/**
 * __useDidCommGenerateEncryptedMessageQuery__
 *
 * To run a query within a React component, call `useDidCommGenerateEncryptedMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidCommGenerateEncryptedMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidCommGenerateEncryptedMessageQuery({
 *   variables: {
 *      destinations: // value for 'destinations'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidCommGenerateEncryptedMessageQuery(baseOptions: Apollo.QueryHookOptions<DidCommGenerateEncryptedMessageQuery, DidCommGenerateEncryptedMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidCommGenerateEncryptedMessageQuery, DidCommGenerateEncryptedMessageQueryVariables>(DidCommGenerateEncryptedMessageDocument, options);
      }
export function useDidCommGenerateEncryptedMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidCommGenerateEncryptedMessageQuery, DidCommGenerateEncryptedMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidCommGenerateEncryptedMessageQuery, DidCommGenerateEncryptedMessageQueryVariables>(DidCommGenerateEncryptedMessageDocument, options);
        }
export type DidCommGenerateEncryptedMessageQueryHookResult = ReturnType<typeof useDidCommGenerateEncryptedMessageQuery>;
export type DidCommGenerateEncryptedMessageLazyQueryHookResult = ReturnType<typeof useDidCommGenerateEncryptedMessageLazyQuery>;
export type DidCommGenerateEncryptedMessageQueryResult = Apollo.QueryResult<DidCommGenerateEncryptedMessageQuery, DidCommGenerateEncryptedMessageQueryVariables>;
export const DidCommVerifyEncryptedMessageDocument = gql`
    query DIDCommVerifyEncryptedMessage($message: String!) {
  didcommVerifyEncryptedMessage(message: $message)
}
    `;

/**
 * __useDidCommVerifyEncryptedMessageQuery__
 *
 * To run a query within a React component, call `useDidCommVerifyEncryptedMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDidCommVerifyEncryptedMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDidCommVerifyEncryptedMessageQuery({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useDidCommVerifyEncryptedMessageQuery(baseOptions: Apollo.QueryHookOptions<DidCommVerifyEncryptedMessageQuery, DidCommVerifyEncryptedMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DidCommVerifyEncryptedMessageQuery, DidCommVerifyEncryptedMessageQueryVariables>(DidCommVerifyEncryptedMessageDocument, options);
      }
export function useDidCommVerifyEncryptedMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DidCommVerifyEncryptedMessageQuery, DidCommVerifyEncryptedMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DidCommVerifyEncryptedMessageQuery, DidCommVerifyEncryptedMessageQueryVariables>(DidCommVerifyEncryptedMessageDocument, options);
        }
export type DidCommVerifyEncryptedMessageQueryHookResult = ReturnType<typeof useDidCommVerifyEncryptedMessageQuery>;
export type DidCommVerifyEncryptedMessageLazyQueryHookResult = ReturnType<typeof useDidCommVerifyEncryptedMessageLazyQuery>;
export type DidCommVerifyEncryptedMessageQueryResult = Apollo.QueryResult<DidCommVerifyEncryptedMessageQuery, DidCommVerifyEncryptedMessageQueryVariables>;
export const GetDocumentDocument = gql`
    query GetDocument($documentId: String!) {
  document(documentId: $documentId) {
    id
    did
    vc
    location
    username
    serialNumber
    scanedAt
    filename
    mimeType
    data
    createdAt
  }
}
    `;

/**
 * __useGetDocumentQuery__
 *
 * To run a query within a React component, call `useGetDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentQuery({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useGetDocumentQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
      }
export function useGetDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
        }
export type GetDocumentQueryHookResult = ReturnType<typeof useGetDocumentQuery>;
export type GetDocumentLazyQueryHookResult = ReturnType<typeof useGetDocumentLazyQuery>;
export type GetDocumentQueryResult = Apollo.QueryResult<GetDocumentQuery, GetDocumentQueryVariables>;
export const RemoveDocumentDocument = gql`
    mutation RemoveDocument($documentId: String!) {
  removeDocument(documentId: $documentId)
}
    `;
export type RemoveDocumentMutationFn = Apollo.MutationFunction<RemoveDocumentMutation, RemoveDocumentMutationVariables>;

/**
 * __useRemoveDocumentMutation__
 *
 * To run a mutation, you first call `useRemoveDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeDocumentMutation, { data, loading, error }] = useRemoveDocumentMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useRemoveDocumentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveDocumentMutation, RemoveDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveDocumentMutation, RemoveDocumentMutationVariables>(RemoveDocumentDocument, options);
      }
export type RemoveDocumentMutationHookResult = ReturnType<typeof useRemoveDocumentMutation>;
export type RemoveDocumentMutationResult = Apollo.MutationResult<RemoveDocumentMutation>;
export type RemoveDocumentMutationOptions = Apollo.BaseMutationOptions<RemoveDocumentMutation, RemoveDocumentMutationVariables>;
export const GetDocumentsDocument = gql`
    query GetDocuments {
  documents {
    id
    location
    filename
    scanedAt
  }
}
    `;

/**
 * __useGetDocumentsQuery__
 *
 * To run a query within a React component, call `useGetDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDocumentsQuery(baseOptions?: Apollo.QueryHookOptions<GetDocumentsQuery, GetDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentsQuery, GetDocumentsQueryVariables>(GetDocumentsDocument, options);
      }
export function useGetDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentsQuery, GetDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentsQuery, GetDocumentsQueryVariables>(GetDocumentsDocument, options);
        }
export type GetDocumentsQueryHookResult = ReturnType<typeof useGetDocumentsQuery>;
export type GetDocumentsLazyQueryHookResult = ReturnType<typeof useGetDocumentsLazyQuery>;
export type GetDocumentsQueryResult = Apollo.QueryResult<GetDocumentsQuery, GetDocumentsQueryVariables>;