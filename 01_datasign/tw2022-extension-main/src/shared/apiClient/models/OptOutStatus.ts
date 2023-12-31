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
 * @interface OptOutStatus
 */
export interface OptOutStatus {
    /**
     * 
     * @type {boolean}
     * @memberof OptOutStatus
     */
    acceptMarketingMail: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof OptOutStatus
     */
    logAnalytics: boolean;
}

export function OptOutStatusFromJSON(json: any): OptOutStatus {
    return OptOutStatusFromJSONTyped(json, false);
}

export function OptOutStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): OptOutStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'acceptMarketingMail': json['accept_marketing_mail'],
        'logAnalytics': json['log_analytics'],
    };
}

export function OptOutStatusToJSON(value?: OptOutStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'accept_marketing_mail': value.acceptMarketingMail,
        'log_analytics': value.logAnalytics,
    };
}

