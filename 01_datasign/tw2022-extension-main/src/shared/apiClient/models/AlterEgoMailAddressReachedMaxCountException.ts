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
 * @interface AlterEgoMailAddressReachedMaxCountException
 */
export interface AlterEgoMailAddressReachedMaxCountException {
    /**
     * 
     * @type {string}
     * @memberof AlterEgoMailAddressReachedMaxCountException
     */
    name?: AlterEgoMailAddressReachedMaxCountExceptionNameEnum;
    /**
     * 
     * @type {string}
     * @memberof AlterEgoMailAddressReachedMaxCountException
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum AlterEgoMailAddressReachedMaxCountExceptionNameEnum {
    AlterEgoMailAddressReachedMaxCountException = 'alter_ego_mail_address_reached_max_count_exception'
}

export function AlterEgoMailAddressReachedMaxCountExceptionFromJSON(json: any): AlterEgoMailAddressReachedMaxCountException {
    return AlterEgoMailAddressReachedMaxCountExceptionFromJSONTyped(json, false);
}

export function AlterEgoMailAddressReachedMaxCountExceptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): AlterEgoMailAddressReachedMaxCountException {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function AlterEgoMailAddressReachedMaxCountExceptionToJSON(value?: AlterEgoMailAddressReachedMaxCountException | null): any {
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

