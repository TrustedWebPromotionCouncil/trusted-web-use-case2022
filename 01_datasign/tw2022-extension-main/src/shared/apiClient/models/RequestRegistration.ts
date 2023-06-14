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
 * @interface RequestRegistration
 */
export interface RequestRegistration {
    /**
     * 
     * @type {string}
     * @memberof RequestRegistration
     */
    email: string;
    /**
     * 
     * @type {boolean}
     * @memberof RequestRegistration
     */
    acceptMarketingMail: boolean;
}

export function RequestRegistrationFromJSON(json: any): RequestRegistration {
    return RequestRegistrationFromJSONTyped(json, false);
}

export function RequestRegistrationFromJSONTyped(json: any, ignoreDiscriminator: boolean): RequestRegistration {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'acceptMarketingMail': json['accept_marketing_mail'],
    };
}

export function RequestRegistrationToJSON(value?: RequestRegistration | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'accept_marketing_mail': value.acceptMarketingMail,
    };
}

