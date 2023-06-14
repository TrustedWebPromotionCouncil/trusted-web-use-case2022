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
 * @interface RequestRevoke
 */
export interface RequestRevoke {
    /**
     * 
     * @type {string}
     * @memberof RequestRevoke
     */
    token: string;
    /**
     * 
     * @type {string}
     * @memberof RequestRevoke
     */
    tokenTypeHint?: RequestRevokeTokenTypeHintEnum;
}

/**
* @export
* @enum {string}
*/
export enum RequestRevokeTokenTypeHintEnum {
    AccessToken = 'access_token',
    RefreshToken = 'refresh_token'
}

export function RequestRevokeFromJSON(json: any): RequestRevoke {
    return RequestRevokeFromJSONTyped(json, false);
}

export function RequestRevokeFromJSONTyped(json: any, ignoreDiscriminator: boolean): RequestRevoke {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'token': json['token'],
        'tokenTypeHint': !exists(json, 'token_type_hint') ? undefined : json['token_type_hint'],
    };
}

export function RequestRevokeToJSON(value?: RequestRevoke | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'token': value.token,
        'token_type_hint': value.tokenTypeHint,
    };
}
