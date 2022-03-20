/**
 * Admin
 * Admin service is responsible for User management and authentication. Also it provides static data i.e list of Skills and Countries 
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Action { 
    action: Action.ActionEnum;
}
export namespace Action {
    export type ActionEnum = 'manage' | 'create' | 'read' | 'update' | 'delete';
    export const ActionEnum = {
        Manage: 'manage' as ActionEnum,
        Create: 'create' as ActionEnum,
        Read: 'read' as ActionEnum,
        Update: 'update' as ActionEnum,
        Delete: 'delete' as ActionEnum
    };
}


