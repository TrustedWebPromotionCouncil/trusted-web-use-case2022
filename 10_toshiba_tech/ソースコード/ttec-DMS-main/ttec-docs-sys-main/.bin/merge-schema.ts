import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { print } from 'graphql'
import fs from 'fs'

(async () => {
    const loadedFiles = loadFilesSync(`graphql/schema/**/*.graphql`)
    const typeDefs = mergeTypeDefs(loadedFiles)
    const printedTypeDefs = print(typeDefs)

    fs.writeFileSync('graphql/schema.graphql', printedTypeDefs)
})()