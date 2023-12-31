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
 * @interface EmailNotConfirmedException
 */
export interface EmailNotConfirmedException {
    /**
     * 
     * @type {string}
     * @memberof EmailNotConfirmedException
     */
    name?: EmailNotConfirmedExceptionNameEnum;
    /**
     * 
     * @type {string}
     * @memberof EmailNotConfirmedException
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum EmailNotConfirmedExceptionNameEnum {
    EmailNotConfirmedException = 'email_not_confirmed_exception'
}

export function EmailNotConfirmedExceptionFromJSON(json: any): EmailNotConfirmedException {
    return EmailNotConfirmedExceptionFromJSONTyped(json, false);
}

export function EmailNotConfirmedExceptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmailNotConfirmedException {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function EmailNotConfirmedExceptionToJSON(value?: EmailNotConfirmedException | null): any {
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

