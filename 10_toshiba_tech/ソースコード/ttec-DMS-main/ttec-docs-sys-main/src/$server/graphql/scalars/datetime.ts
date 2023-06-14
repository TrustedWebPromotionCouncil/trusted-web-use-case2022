import { GraphQLScalarType } from 'graphql'

const naiveIsoDateRegex = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/

export const dateTimeScalar = new GraphQLScalarType<Date, string>({
    name: 'DateTime',
    description: 'the `DateTime` scalar type representing the date and time.',
    parseValue: (value) => {
        const _value = value as string

        if (!naiveIsoDateRegex.test(_value)) {
            throw new Error('Invalid date format')
        }

        return new Date(_value)
    },
    serialize: (value) => {
        const _value = value as Date

        return _value.toISOString()
    },
})
