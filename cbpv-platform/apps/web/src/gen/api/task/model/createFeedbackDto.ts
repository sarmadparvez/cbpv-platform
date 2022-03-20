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
import { Answer } from './answer';


export interface CreateFeedbackDto { 
    comment?: string;
    taskId: string;
    answers: Array<Answer>;
    taskRating?: number;
    taskRatingComment?: string;
}

