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
 * @interface AlreadyConfirmedException
 */
export interface AlreadyConfirmedException {
    /**
     * 
     * @type {string}
     * @memberof AlreadyConfirmedException
     */
    name?: AlreadyConfirmedExceptionNameEnum;
    /**
     * 
     * @type {string}
     * @memberof AlreadyConfirmedException
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum AlreadyConfirmedExceptionNameEnum {
    AlreadyConfirmedException = 'already_confirmed_exception'
}

export function AlreadyConfirmedExceptionFromJSON(json: any): AlreadyConfirmedException {
    return AlreadyConfirmedExceptionFromJSONTyped(json, false);
}

export function AlreadyConfirmedExceptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): AlreadyConfirmedException {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function AlreadyConfirmedExceptionToJSON(value?: AlreadyConfirmedException | null): any {
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
