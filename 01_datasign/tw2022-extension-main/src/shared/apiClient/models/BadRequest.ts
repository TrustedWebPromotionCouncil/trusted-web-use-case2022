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
 * @interface BadRequest
 */
export interface BadRequest {
    /**
     * 
     * @type {string}
     * @memberof BadRequest
     */
    name?: BadRequestNameEnum;
    /**
     * 
     * @type {string}
     * @memberof BadRequest
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum BadRequestNameEnum {
    InvalidParameterException = 'invalid_parameter_exception'
}

export function BadRequestFromJSON(json: any): BadRequest {
    return BadRequestFromJSONTyped(json, false);
}

export function BadRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): BadRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function BadRequestToJSON(value?: BadRequest | null): any {
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

