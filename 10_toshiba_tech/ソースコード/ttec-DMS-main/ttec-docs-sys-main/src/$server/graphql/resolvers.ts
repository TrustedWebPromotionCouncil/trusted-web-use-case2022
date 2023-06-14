import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../../$server/graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Document: ResolverTypeWrapper<Document>;
  DocumentMetadata: ResolverTypeWrapper<DocumentMetadata>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Document'] | ResolversTypes['DocumentMetadata'] | ResolversTypes['User'];
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  Document: Document;
  DocumentMetadata: DocumentMetadata;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Node: ResolversParentTypes['Document'] | ResolversParentTypes['DocumentMetadata'] | ResolversParentTypes['User'];
  Query: {};
  String: Scalars['String'];
  User: User;
};

export type ConstraintDirectiveArgs = {
  endsWith?: Maybe<Scalars['String']>;
  exclusiveMax?: Maybe<Scalars['Int']>;
  exclusiveMin?: Maybe<Scalars['Int']>;
  format?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['Int']>;
  maxLength?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Int']>;
  minLength?: Maybe<Scalars['Int']>;
  multipleOf?: Maybe<Scalars['Int']>;
  notContains?: Maybe<Scalars['String']>;
  pattern?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
};

export type ConstraintDirectiveResolver<Result, Parent, ContextType = GraphQLContext, Args = ConstraintDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  did?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scanedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  serialNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vc?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentMetadataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DocumentMetadata'] = ResolversParentTypes['DocumentMetadata']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scanedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAddUserArgs, 'email' | 'password'>>;
  removeDocument?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationRemoveDocumentArgs, 'documentId'>>;
  removeUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRemoveUserArgs, 'email'>>;
  resetPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'email' | 'password'>>;
};

export type NodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Document' | 'DocumentMetadata' | 'User', ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  didGenerateVC?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidGenerateVcArgs, 'message'>>;
  didVerifyVC?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidVerifyVcArgs, 'message'>>;
  didcommGenerateEncryptedMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidcommGenerateEncryptedMessageArgs, 'destinations' | 'message'>>;
  didcommGeneratePlaintextMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidcommGeneratePlaintextMessageArgs, 'destinations' | 'message'>>;
  didcommGenerateSignedMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidcommGenerateSignedMessageArgs, 'destinations' | 'message'>>;
  didcommVerifyEncryptedMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidcommVerifyEncryptedMessageArgs, 'message'>>;
  didcommVerifyPlaintextMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidcommVerifyPlaintextMessageArgs, 'message'>>;
  didcommVerifySignedMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryDidcommVerifySignedMessageArgs, 'message'>>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<QueryDocumentArgs, 'documentId'>>;
  documents?: Resolver<Array<ResolversTypes['DocumentMetadata']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  DocumentMetadata?: DocumentMetadataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = GraphQLContext> = {
  constraint?: ConstraintDirectiveResolver<any, any, ContextType>;
};
