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


import * as runtime from '../runtime';
import {
    AccountLockedOutException,
    AccountLockedOutExceptionFromJSON,
    AccountLockedOutExceptionToJSON,
    AlreadyConfirmedException,
    AlreadyConfirmedExceptionFromJSON,
    AlreadyConfirmedExceptionToJSON,
    AuthToken,
    AuthTokenFromJSON,
    AuthTokenToJSON,
    BadRequest,
    BadRequestFromJSON,
    BadRequestToJSON,
    ConfirmSignIn,
    ConfirmSignInFromJSON,
    ConfirmSignInToJSON,
    EmailNotConfirmedException,
    EmailNotConfirmedExceptionFromJSON,
    EmailNotConfirmedExceptionToJSON,
    EmailNotFoundException,
    EmailNotFoundExceptionFromJSON,
    EmailNotFoundExceptionToJSON,
    ExpiredCodeException,
    ExpiredCodeExceptionFromJSON,
    ExpiredCodeExceptionToJSON,
    InternalServerError,
    InternalServerErrorFromJSON,
    InternalServerErrorToJSON,
    InvalidCodeException,
    InvalidCodeExceptionFromJSON,
    InvalidCodeExceptionToJSON,
    RefreshToken,
    RefreshTokenFromJSON,
    RefreshTokenToJSON,
    RequestRevoke,
    RequestRevokeFromJSON,
    RequestRevokeToJSON,
    RequestSignIn,
    RequestSignInFromJSON,
    RequestSignInToJSON,
} from '../models';

export interface ConfirmEmailForSignInRequest {
    confirmSignIn: ConfirmSignIn;
}

export interface GetAuthTokenRequest {
    refreshToken: RefreshToken;
}

export interface ReqeustAuthenticationRequest {
    requestSignIn: RequestSignIn;
}

export interface RevokeTokenRequest {
    requestRevoke: RequestRevoke;
}

/**
 * 
 */
export class AuthApi extends runtime.BaseAPI {

    /**
     * confirm a email.
     */
    async confirmEmailForSignInRaw(requestParameters: ConfirmEmailForSignInRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<AuthToken>> {
        if (requestParameters.confirmSignIn === null || requestParameters.confirmSignIn === undefined) {
            throw new runtime.RequiredError('confirmSignIn','Required parameter requestParameters.confirmSignIn was null or undefined when calling confirmEmailForSignIn.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/confirm`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ConfirmSignInToJSON(requestParameters.confirmSignIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthTokenFromJSON(jsonValue));
    }

    /**
     * confirm a email.
     */
    async confirmEmailForSignIn(requestParameters: ConfirmEmailForSignInRequest, initOverrides?: RequestInit): Promise<AuthToken> {
        console.debug('email: ' + requestParameters.confirmSignIn.email);
        console.debug('code: ' + requestParameters.confirmSignIn.code);
        const response = await this.confirmEmailForSignInRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * get auth token
     */
    async getAuthTokenRaw(requestParameters: GetAuthTokenRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<AuthToken>> {
        if (requestParameters.refreshToken === null || requestParameters.refreshToken === undefined) {
            throw new runtime.RequiredError('refreshToken','Required parameter requestParameters.refreshToken was null or undefined when calling getAuthToken.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/token`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RefreshTokenToJSON(requestParameters.refreshToken),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthTokenFromJSON(jsonValue));
    }

    /**
     * get auth token
     */
    async getAuthToken(requestParameters: GetAuthTokenRequest, initOverrides?: RequestInit): Promise<AuthToken> {
        const response = await this.getAuthTokenRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * request authentication
     */
    async reqeustAuthenticationRaw(requestParameters: ReqeustAuthenticationRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.requestSignIn === null || requestParameters.requestSignIn === undefined) {
            throw new runtime.RequiredError('requestSignIn','Required parameter requestParameters.requestSignIn was null or undefined when calling reqeustAuthentication.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/request`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RequestSignInToJSON(requestParameters.requestSignIn),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * request authentication
     */
    async reqeustAuthentication(requestParameters: ReqeustAuthenticationRequest, initOverrides?: RequestInit): Promise<void> {
        await this.reqeustAuthenticationRaw(requestParameters, initOverrides);
    }

    /**
     * revoke token
     */
    async revokeTokenRaw(requestParameters: RevokeTokenRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.requestRevoke === null || requestParameters.requestRevoke === undefined) {
            throw new runtime.RequiredError('requestRevoke','Required parameter requestParameters.requestRevoke was null or undefined when calling revokeToken.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/revoke`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RequestRevokeToJSON(requestParameters.requestRevoke),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * revoke token
     */
    async revokeToken(requestParameters: RevokeTokenRequest, initOverrides?: RequestInit): Promise<void> {
        await this.revokeTokenRaw(requestParameters, initOverrides);
    }

}