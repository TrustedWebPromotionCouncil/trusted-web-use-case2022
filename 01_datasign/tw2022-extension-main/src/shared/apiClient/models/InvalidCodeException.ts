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
 * @interface InvalidCodeException
 */
export interface InvalidCodeException {
    /**
     * 
     * @type {string}
     * @memberof InvalidCodeException
     */
    name?: InvalidCodeExceptionNameEnum;
    /**
     * 
     * @type {string}
     * @memberof InvalidCodeException
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum InvalidCodeExceptionNameEnum {
    InvalidCodeException = 'invalid_code_exception'
}

export function InvalidCodeExceptionFromJSON(json: any): InvalidCodeException {
    return InvalidCodeExceptionFromJSONTyped(json, false);
}

export function InvalidCodeExceptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): InvalidCodeException {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function InvalidCodeExceptionToJSON(value?: InvalidCodeException | null): any {
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

