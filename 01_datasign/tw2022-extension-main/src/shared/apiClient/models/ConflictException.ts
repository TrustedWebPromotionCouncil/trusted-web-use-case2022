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
 * @interface ConflictException
 */
export interface ConflictException {
    /**
     * 
     * @type {string}
     * @memberof ConflictException
     */
    name?: ConflictExceptionNameEnum;
    /**
     * 
     * @type {string}
     * @memberof ConflictException
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum ConflictExceptionNameEnum {
    ConflictException = 'conflict_exception'
}

export function ConflictExceptionFromJSON(json: any): ConflictException {
    return ConflictExceptionFromJSONTyped(json, false);
}

export function ConflictExceptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConflictException {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function ConflictExceptionToJSON(value?: ConflictException | null): any {
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
