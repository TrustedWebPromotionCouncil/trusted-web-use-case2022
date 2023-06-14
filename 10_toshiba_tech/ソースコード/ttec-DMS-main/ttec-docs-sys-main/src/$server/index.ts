import { ApolloServer } from 'apollo-server-micro'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers } from './resolvers'
import { envelopedExecutor } from './executor'
import { constraintDirective } from 'graphql-constraint-directive'
import { prisma } from '../../prisma/client'
import { typeDefs } from './graphql/graphql.schema'

let schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
})

// @constraint ディレクティブによる入力データのバリデーション
schema = constraintDirective()(schema)

export const server = new ApolloServer({
    schema: schema,
    executor: envelopedExecutor(schema, prisma),
    cache: 'bounded',
    persistedQueries: false,
    plugins: [],
})
