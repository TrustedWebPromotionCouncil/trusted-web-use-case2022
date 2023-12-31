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
import {
    EmailAllOf,
    EmailAllOfFromJSON,
    EmailAllOfFromJSONTyped,
    EmailAllOfToJSON,
    ForwardEmail,
    ForwardEmailFromJSON,
    ForwardEmailFromJSONTyped,
    ForwardEmailToJSON,
} from './';

/**
 * 
 * @export
 * @interface Email
 */
export interface Email {
    /**
     * 
     * @type {string}
     * @memberof Email
     */
    alterEgoEmail: string;
    /**
     * 
     * @type {boolean}
     * @memberof Email
     */
    allDomainBlocked?: boolean;
    /**
     * 
     * @type {Array<ForwardEmail>}
     * @memberof Email
     */
    forwardEmails: Array<ForwardEmail>;
}

export function EmailFromJSON(json: any): Email {
    return EmailFromJSONTyped(json, false);
}

export function EmailFromJSONTyped(json: any, ignoreDiscriminator: boolean): Email {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'alterEgoEmail': json['alter_ego_email'],
        'allDomainBlocked': !exists(json, 'all_domain_blocked') ? undefined : json['all_domain_blocked'],
        'forwardEmails': ((json['forward_emails'] as Array<any>).map(ForwardEmailFromJSON)),
    };
}

export function EmailToJSON(value?: Email | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'alter_ego_email': value.alterEgoEmail,
        'all_domain_blocked': value.allDomainBlocked,
        'forward_emails': ((value.forwardEmails as Array<any>).map(ForwardEmailToJSON)),
    };
}

