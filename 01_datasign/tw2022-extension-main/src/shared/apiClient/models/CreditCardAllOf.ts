/* tslint:disable */
/* eslint-disable */
/**
 * bunsin API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface CreditCardAllOf
 */
export interface CreditCardAllOf {
    /**
     * 
     * @type {string}
     * @memberof CreditCardAllOf
     */
    cardNumber: string;
}

export function CreditCardAllOfFromJSON(json: any): CreditCardAllOf {
    return CreditCardAllOfFromJSONTyped(json, false);
}

export function CreditCardAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreditCardAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'cardNumber': json['card_number'],
    };
}

export function CreditCardAllOfToJSON(value?: CreditCardAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'card_number': value.cardNumber,
    };
}

