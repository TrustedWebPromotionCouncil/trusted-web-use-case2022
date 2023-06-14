import { PluginOrDisabledPlugin, useTiming } from '@envelop/core'
import { ASTNode, print } from 'graphql'
import chalk from 'chalk'

const astToString = (ast: ASTNode): string => {
    return print(ast).replace(/\r?\n/g, '').replace(/ +/g, ' ')
}

// 処理時間計測用ミドルウェア
// eslint-disable-next-line react-hooks/rules-of-hooks
const useTimingMiddleware: PluginOrDisabledPlugin = useTiming({
    onExecutionMeasurement: (args, timing) => {
        console.log(
            `${chalk.cyan('graphql:execution')} ${args.operationName}( ${astToString(
                args.document,
            )} ) ${timing.ms}ms`,
        )
    },
    onResolverMeasurement: undefined,
    onParsingMeasurement: undefined,
    onValidationMeasurement: undefined,
    onSubscriptionMeasurement: undefined,
    onContextBuildingMeasurement: undefined,
})

// ミドルウェアの返却
export const middlewares: Array<PluginOrDisabledPlugin> = ((): Array<PluginOrDisabledPlugin> => {
    return [useTimingMiddleware]
})()
