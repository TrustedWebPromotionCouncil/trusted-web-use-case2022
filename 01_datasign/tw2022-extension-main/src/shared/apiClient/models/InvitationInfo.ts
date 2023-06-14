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
    Invitation,
    InvitationFromJSON,
    InvitationFromJSONTyped,
    InvitationToJSON,
    InvitationInfoAllOf,
    InvitationInfoAllOfFromJSON,
    InvitationInfoAllOfFromJSONTyped,
    InvitationInfoAllOfToJSON,
} from './';

/**
 * 
 * @export
 * @interface InvitationInfo
 */
export interface InvitationInfo {
    /**
     * 
     * @type {number}
     * @memberof InvitationInfo
     */
    invitationRemainingNumber?: number;
    /**
     * 
     * @type {Array<Invitation>}
     * @memberof InvitationInfo
     */
    histories?: Array<Invitation>;
}

export function InvitationInfoFromJSON(json: any): InvitationInfo {
    return InvitationInfoFromJSONTyped(json, false);
}

export function InvitationInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): InvitationInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'invitationRemainingNumber': !exists(json, 'invitation_remaining_number') ? undefined : json['invitation_remaining_number'],
        'histories': !exists(json, 'histories') ? undefined : ((json['histories'] as Array<any>).map(InvitationFromJSON)),
    };
}

export function InvitationInfoToJSON(value?: InvitationInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'invitation_remaining_number': value.invitationRemainingNumber,
        'histories': value.histories === undefined ? undefined : ((value.histories as Array<any>).map(InvitationToJSON)),
    };
}
