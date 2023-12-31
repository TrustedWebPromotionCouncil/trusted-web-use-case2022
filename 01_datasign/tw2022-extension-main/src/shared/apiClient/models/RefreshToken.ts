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
 * @interface RefreshToken
 */
export interface RefreshToken {
    /**
     * 
     * @type {string}
     * @memberof RefreshToken
     */
    refreshToken: string;
}

export function RefreshTokenFromJSON(json: any): RefreshToken {
    return RefreshTokenFromJSONTyped(json, false);
}

export function RefreshTokenFromJSONTyped(json: any, ignoreDiscriminator: boolean): RefreshToken {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'refreshToken': json['refresh_token'],
    };
}

export function RefreshTokenToJSON(value?: RefreshToken | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'refresh_token': value.refreshToken,
    };
}

