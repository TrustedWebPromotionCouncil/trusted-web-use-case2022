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
 * @interface SMSAllOf
 */
export interface SMSAllOf {
    /**
     * 
     * @type {string}
     * @memberof SMSAllOf
     */
    phoneNumber: string;
}

export function SMSAllOfFromJSON(json: any): SMSAllOf {
    return SMSAllOfFromJSONTyped(json, false);
}

export function SMSAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): SMSAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'phoneNumber': json['phone_number'],
    };
}

export function SMSAllOfToJSON(value?: SMSAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'phone_number': value.phoneNumber,
    };
}

