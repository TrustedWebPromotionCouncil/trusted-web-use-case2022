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
 * @interface ConfirmSignIn
 */
export interface ConfirmSignIn {
    /**
     * 
     * @type {string}
     * @memberof ConfirmSignIn
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof ConfirmSignIn
     */
    code: string;
}

export function ConfirmSignInFromJSON(json: any): ConfirmSignIn {
    return ConfirmSignInFromJSONTyped(json, false);
}

export function ConfirmSignInFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfirmSignIn {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'code': json['code'],
    };
}

export function ConfirmSignInToJSON(value?: ConfirmSignIn | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'code': value.code,
    };
}

