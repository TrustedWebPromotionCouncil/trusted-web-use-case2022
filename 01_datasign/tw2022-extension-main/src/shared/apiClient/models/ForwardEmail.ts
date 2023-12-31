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
import {
    ForwardEmailAllOf,
    ForwardEmailAllOfFromJSON,
    ForwardEmailAllOfFromJSONTyped,
    ForwardEmailAllOfToJSON,
    Id,
    IdFromJSON,
    IdFromJSONTyped,
    IdToJSON,
} from './';

/**
 * 
 * @export
 * @interface ForwardEmail
 */
export interface ForwardEmail {
    /**
     * 
     * @type {number}
     * @memberof ForwardEmail
     */
    readonly id: number;
    /**
     * 
     * @type {string}
     * @memberof ForwardEmail
     */
    email: string;
}

export function ForwardEmailFromJSON(json: any): ForwardEmail {
    return ForwardEmailFromJSONTyped(json, false);
}

export function ForwardEmailFromJSONTyped(json: any, ignoreDiscriminator: boolean): ForwardEmail {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'email': json['email'],
    };
}

export function ForwardEmailToJSON(value?: ForwardEmail | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
    };
}

