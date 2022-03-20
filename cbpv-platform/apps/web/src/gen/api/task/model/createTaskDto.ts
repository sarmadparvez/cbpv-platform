/**
 * Task
 * Task service is responsible for iterative validation of Prototypes. Tasks are created and Feedback is provided through this service.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Question } from './question';


export interface CreateTaskDto { 
    title: string;
    description?: string;
    testType: CreateTaskDto.TestTypeEnum;
    prototypeFormat: CreateTaskDto.PrototypeFormatEnum;
    accessType: CreateTaskDto.AccessTypeEnum;
    iframeUrl1?: string;
    iframeUrl2?: string;
    textualDescription1?: string;
    textualDescription2?: string;
    minAge?: number;
    maxAge?: number;
    minExperience?: number;
    maxExperience?: number;
    budget: number;
    incentive: number;
    projectId: string;
    skills: Array<string>;
    countries: Array<string>;
    questions: Array<Question>;
}
export namespace CreateTaskDto {
    export type TestTypeEnum = 'basic' | 'comparison';
    export const TestTypeEnum = {
        Basic: 'basic' as TestTypeEnum,
        Comparison: 'comparison' as TestTypeEnum
    };
    export type PrototypeFormatEnum = 'image' | 'iframe' | 'text';
    export const PrototypeFormatEnum = {
        Image: 'image' as PrototypeFormatEnum,
        Iframe: 'iframe' as PrototypeFormatEnum,
        Text: 'text' as PrototypeFormatEnum
    };
    export type AccessTypeEnum = 'open' | 'nda' | 'request';
    export const AccessTypeEnum = {
        Open: 'open' as AccessTypeEnum,
        Nda: 'nda' as AccessTypeEnum,
        Request: 'request' as AccessTypeEnum
    };
}


