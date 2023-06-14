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
 * @interface ResourceNotFoundException
 */
export interface ResourceNotFoundException {
    /**
     * 
     * @type {string}
     * @memberof ResourceNotFoundException
     */
    name?: ResourceNotFoundExceptionNameEnum;
    /**
     * 
     * @type {string}
     * @memberof ResourceNotFoundException
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum ResourceNotFoundExceptionNameEnum {
    ResourceNotFoundException = 'resource_not_found_exception'
}

export function ResourceNotFoundExceptionFromJSON(json: any): ResourceNotFoundException {
    return ResourceNotFoundExceptionFromJSONTyped(json, false);
}

export function ResourceNotFoundExceptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResourceNotFoundException {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function ResourceNotFoundExceptionToJSON(value?: ResourceNotFoundException | null): any {
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

