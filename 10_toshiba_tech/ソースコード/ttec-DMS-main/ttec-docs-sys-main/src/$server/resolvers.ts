import { Resolvers } from "./graphql/resolvers"
import { dateTimeScalar } from "./graphql/scalars/datetime"
import { NodeXService } from "./services/NodeX"
import { DocumentService } from "./services/document"
import { UserService } from "./services/user"

export const resolvers: Resolvers = {
    DateTime: dateTimeScalar,
    Mutation: {
        removeDocument: async (parent, args, context, info) => {
            return await DocumentService.removeOne(context, { documentId: args.documentId })
        },
        addUser: async (parent, args, context, info) => {
            return await UserService.addUser(context, { email: args.email, password: args.password })
        },
        resetPassword: async (parent, args, context, info) => {
            return await UserService.resetPassword(context, { email: args.email, password: args.password })
        },
        removeUser: async (parent, args, context, info) => {
            return await UserService.removeUser(context, { email: args.email })
        }
    },
    Query: {
        documents: async (parent, args, context, info) => {
            return await DocumentService.findAll(context, {})
        },
        document: async (parent, args, context, info) => {
            return await DocumentService.findOne(context, {
                documentId: args.documentId,
            })
        },
        user: async (parent, args, context, info) => {
            return await UserService.user(context, {})
        },
        didGenerateVC: async (parent, args, context, info) => {
            return await NodeXService.DID.generateVC({
                message: args.message,
            })
        },
        didVerifyVC: async (parent, args, context, info) => {
            return await NodeXService.DID.verifyVC({
                message: args.message,
            })
        },
        didcommGeneratePlaintextMessage: async (parent, args, context, info) => {
            return await NodeXService.DIDComm.generatePlaintextMessage({
                destinations: args.destinations,
                message: args.message,
            })
        },
        didcommVerifyPlaintextMessage: async (parent, args, context, info) => {
            return await NodeXService.DIDComm.verifyPlaintextMessage({
                message: args.message,
            })
        },
        didcommGenerateSignedMessage: async (parent, args, context, info) => {
            return await NodeXService.DIDComm.generateSignedMessage({
                destinations: args.destinations,
                message: args.message,
            })
        },
        didcommVerifySignedMessage: async (parent, args, context, info) => {
            return await NodeXService.DIDComm.verifySignedMessage({
                message: args.message,
            })
        },
        didcommGenerateEncryptedMessage: async (parent, args, context, info) => {
            return await NodeXService.DIDComm.generateEncryptedMessage({
                destinations: args.destinations,
                message: args.message,
            })
        },
        didcommVerifyEncryptedMessage: async (parent, args, context, info) => {
            return await NodeXService.DIDComm.verifyEncryptedMessage({
                message: args.message,
            })
        },
    },
}
