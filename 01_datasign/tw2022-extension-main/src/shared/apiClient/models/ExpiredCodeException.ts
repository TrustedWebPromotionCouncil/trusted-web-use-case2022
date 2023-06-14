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
 * @interface ExpiredCodeException
 */
export interface ExpiredCodeException {
    /**
     * 
     * @type {string}
     * @memberof ExpiredCodeException
     */
    name?: ExpiredCodeExceptionNameEnum;
    /**
     * 
     * @type {string}
     * @memberof ExpiredCodeException
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum ExpiredCodeExceptionNameEnum {
    ExpiredCodeException = 'expired_code_exception'
}

export function ExpiredCodeExceptionFromJSON(json: any): ExpiredCodeException {
    return ExpiredCodeExceptionFromJSONTyped(json, false);
}

export function ExpiredCodeExceptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExpiredCodeException {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function ExpiredCodeExceptionToJSON(value?: ExpiredCodeException | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'message': value.message,
    };
}

