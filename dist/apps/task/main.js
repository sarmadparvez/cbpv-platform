/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/task/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const projects_module_1 = __webpack_require__("./apps/task/src/app/projects/projects.module.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const global_exception_filter_1 = __webpack_require__("./apps/task/src/app/common/global-exception-filter.ts");
const core_1 = __webpack_require__("@nestjs/core");
const tasks_module_1 = __webpack_require__("./apps/task/src/app/tasks/tasks.module.ts");
const skills_module_1 = __webpack_require__("./apps/task/src/app/skills/skills.module.ts");
const schedule_1 = __webpack_require__("@nestjs/schedule");
const countries_module_1 = __webpack_require__("./apps/task/src/app/countries/countries.module.ts");
const feedbacks_module_1 = __webpack_require__("./apps/task/src/app/feedbacks/feedbacks.module.ts");
const cloudinary_1 = __webpack_require__("./apps/task/src/app/config/cloudinary.ts");
const auth_module_1 = __webpack_require__("./apps/task/src/app/auth/auth.module.ts");
const jwt_auth_guard_1 = __webpack_require__("./apps/task/src/app/auth/jwt-auth.guard.ts");
const users_module_1 = __webpack_require__("./apps/task/src/app/users/users.module.ts");
const iam_module_1 = __webpack_require__("./apps/task/src/app/iam/iam.module.ts");
let AppModule = class AppModule {
};
AppModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ load: [cloudinary_1.default] }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                    // for production, we have a remote database
                    if (process.env.DATABASE_URL) {
                        return {
                            url: process.env.DATABASE_URL,
                            type: 'postgres',
                            synchronize: true,
                            extra: { ssl: { rejectUnauthorized: false } },
                            autoLoadEntities: true,
                        };
                    }
                    return Object.assign(yield (0, typeorm_2.getConnectionOptions)(), {
                        autoLoadEntities: true,
                    });
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            projects_module_1.ProjectsModule,
            tasks_module_1.TasksModule,
            skills_module_1.SkillsModule,
            countries_module_1.CountriesModule,
            feedbacks_module_1.FeedbacksModule,
            users_module_1.UsersModule,
            iam_module_1.IamModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/task/src/app/auth/auth.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const constants_1 = __webpack_require__("./apps/task/src/app/auth/constants.ts");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const jwt_strategy_1 = __webpack_require__("./apps/task/src/app/auth/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
AuthModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
            }),
        ],
        providers: [jwt_strategy_1.JwtStrategy],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./apps/task/src/app/auth/constants.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: 'F767D0B3082AECF1DF9DA87302749FE958277E1B77356D6AB75398BAEAFB3A56',
};


/***/ }),

/***/ "./apps/task/src/app/auth/jwt-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const contextService = __webpack_require__("request-context");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    /**
     * Override to set request in the contextService to make it available throughout thea app.
     * @param context
     */
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        contextService.set('request', request);
        return super.canActivate(context);
    }
};
JwtAuthGuard = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)()
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),

/***/ "./apps/task/src/app/auth/jwt.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const passport_jwt_1 = __webpack_require__("passport-jwt");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
const constants_1 = __webpack_require__("./apps/task/src/app/auth/constants.ts");
const contextService = __webpack_require__("request-context");
const policy_1 = __webpack_require__("./apps/task/src/app/iam/policy.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.jwtConstants.secret,
        });
    }
    validate(payload) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = {
                id: payload.sub,
                firstName: payload.firstName,
                lastName: payload.lastName,
                roles: payload.roles,
            };
            contextService.set('user', user);
            contextService.set('userAbility', (0, policy_1.defineAbilityFor)(contextService.get('user')));
            return user;
        });
    }
};
JwtStrategy = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),

/***/ "./apps/task/src/app/common/global-exception-filter.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const tslib_1 = __webpack_require__("tslib");
// Based on a motivation and solution form:
// https://docs.nestjs.com/exception-filters#throwing-standard-exceptions
// https://stackoverflow.com/questions/58993405/how-can-i-handle-typeorm-error-in-nestjs
// The solution is copied and modified as per our requirement.
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("typeorm");
const core_1 = __webpack_require__("@nestjs/core");
const ability_1 = __webpack_require__("@casl/ability");
/**
 * Catch unhandled exceptions and return proper Http response code
 */
let GlobalExceptionFilter = class GlobalExceptionFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        let message = exception.message.message;
        common_1.Logger.error(message, exception.stack, `${request.method} ${request.url}`);
        let httpStatus;
        let responseBody;
        switch (exception.constructor) {
            case ability_1.ForbiddenError:
                httpStatus = common_1.HttpStatus.FORBIDDEN;
                message = exception.message;
                break;
            case typeorm_1.QueryFailedError: // TypeOrm error
                httpStatus = common_1.HttpStatus.UNPROCESSABLE_ENTITY;
                message = exception.message;
                break;
            case typeorm_1.EntityNotFoundError: // TypeOrm error
                httpStatus = common_1.HttpStatus.NOT_FOUND;
                message = exception.message;
                break;
            case typeorm_1.CannotCreateEntityIdMapError: // TypeOrm error
                httpStatus = common_1.HttpStatus.UNPROCESSABLE_ENTITY;
                message = exception.message;
                break;
            case typeorm_1.UpdateValuesMissingError: // Typeorm error
                httpStatus = common_1.HttpStatus.UNPROCESSABLE_ENTITY;
                message = exception.message;
                break;
            default:
                const httpException = exception;
                if (httpException.getResponse) {
                    responseBody = exception.getResponse();
                    httpStatus = httpException.getStatus();
                }
                else {
                    httpStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                }
                if (!message) {
                    message = 'Internal Server Error';
                }
        }
        if (!responseBody) {
            responseBody = {
                statusCode: httpStatus,
                message,
            };
        }
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
};
GlobalExceptionFilter = (0, tslib_1.__decorate)([
    (0, common_1.Catch)(),
    (0, tslib_1.__metadata)("design:paramtypes", [core_1.HttpAdapterHost])
], GlobalExceptionFilter);
exports.GlobalExceptionFilter = GlobalExceptionFilter;


/***/ }),

/***/ "./apps/task/src/app/config/cloudinary.ts":
/***/ ((__unused_webpack_module, exports) => {


// Cloudinary configuration https://cloudinary.com
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = () => ({
    cloudinary: {
        config: {
            cloud_name: 'dtduup6h7',
            api_key: '888317151932757',
            api_secret: 'GmYo0sGpDKPaIMntFL3gqSPADAY',
            secure: true,
        },
        apiUrl: 'https://api.cloudinary.com/v1_1/:cloud_name/:action',
        imagesFolder: 'cbpv-platform/images',
    },
});


/***/ }),

/***/ "./apps/task/src/app/countries/countries.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const countries_service_1 = __webpack_require__("./apps/task/src/app/countries/countries.service.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const country_entity_1 = __webpack_require__("./apps/task/src/app/countries/entities/country.entity.ts");
const config_1 = __webpack_require__("@nestjs/config");
const axios_1 = __webpack_require__("@nestjs/axios");
let CountriesModule = class CountriesModule {
};
CountriesModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([country_entity_1.Country]), config_1.ConfigModule, axios_1.HttpModule],
        providers: [countries_service_1.CountriesService],
    })
], CountriesModule);
exports.CountriesModule = CountriesModule;


/***/ }),

/***/ "./apps/task/src/app/countries/countries.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const country_entity_1 = __webpack_require__("./apps/task/src/app/countries/entities/country.entity.ts");
const schedule_1 = __webpack_require__("@nestjs/schedule");
const rxjs_1 = __webpack_require__("rxjs");
const axios_1 = __webpack_require__("@nestjs/axios");
const config_1 = __webpack_require__("@nestjs/config");
let CountriesService = class CountriesService {
    constructor(httpService, configService, countryRepository) {
        this.httpService = httpService;
        this.configService = configService;
        this.countryRepository = countryRepository;
    }
    /**
     * Fetching Countries from the Admin service and saving in database
     * Called once whenever application runs. Saves Countries in database only if they are not already saved
     * */
    fetchAndSaveCountries() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const country = yield this.countryRepository.findOne();
            if (country) {
                common_1.Logger.debug('countries already available in database.');
                return;
            }
            const adminAPI = this.configService.get('ADMIN_API');
            if (adminAPI) {
                try {
                    const response = yield (0, rxjs_1.firstValueFrom)(this.httpService.get(`${adminAPI}/countries`));
                    const countries = response.data;
                    this.countryRepository.save(countries);
                    common_1.Logger.debug('Countries saved in database');
                }
                catch (err) {
                    common_1.Logger.error(`failed to fetch and save countries ${err}`);
                }
            }
        });
    }
};
(0, tslib_1.__decorate)([
    (0, schedule_1.Timeout)(0),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], CountriesService.prototype, "fetchAndSaveCountries", null);
CountriesService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(2, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    (0, tslib_1.__metadata)("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        typeorm_2.Repository])
], CountriesService);
exports.CountriesService = CountriesService;


/***/ }),

/***/ "./apps/task/src/app/countries/entities/country.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Country = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
let Country = class Country {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, code: { required: true, type: () => String } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Country.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], Country.prototype, "name", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], Country.prototype, "code", void 0);
Country = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)()
], Country);
exports.Country = Country;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/dto/create-feedback.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateFeedbackDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class CreateFeedbackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { comment: { required: false, type: () => String }, taskId: { required: true, type: () => String }, answers: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/feedbacks/entities/answer.entity.ts").Answer)] }, taskRating: { required: false, type: () => Number, minimum: 1, maximum: 5 }, taskRatingComment: { required: false, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateFeedbackDto.prototype, "comment", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateFeedbackDto.prototype, "taskId", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, tslib_1.__metadata)("design:type", Array)
], CreateFeedbackDto.prototype, "answers", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateFeedbackDto.prototype, "taskRating", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateFeedbackDto.prototype, "taskRatingComment", void 0);
exports.CreateFeedbackDto = CreateFeedbackDto;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/dto/findAll-feedback.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FindAllFeedbackDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
const swagger_1 = __webpack_require__("@nestjs/swagger");
class FindAllFeedbackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { taskId: { required: true, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'The task to which the feedbacks belong.',
        required: false,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], FindAllFeedbackDto.prototype, "taskId", void 0);
exports.FindAllFeedbackDto = FindAllFeedbackDto;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/dto/rate-feedback.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RateFeedbackDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class RateFeedbackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { feedbackRating: { required: true, type: () => Number, minimum: 1, maximum: 5 }, feedbackRatingComment: { required: false, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Number)
], RateFeedbackDto.prototype, "feedbackRating", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], RateFeedbackDto.prototype, "feedbackRatingComment", void 0);
exports.RateFeedbackDto = RateFeedbackDto;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/dto/rate-task.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RateTaskDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class RateTaskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { taskRating: { required: true, type: () => Number, minimum: 1, maximum: 5 }, taskRatingComment: { required: false, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Number)
], RateTaskDto.prototype, "taskRating", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], RateTaskDto.prototype, "taskRatingComment", void 0);
exports.RateTaskDto = RateTaskDto;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/dto/update-feedback.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateFeedbackDto = void 0;
const openapi = __webpack_require__("@nestjs/swagger");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const create_feedback_dto_1 = __webpack_require__("./apps/task/src/app/feedbacks/dto/create-feedback.dto.ts");
class UpdateFeedbackDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_feedback_dto_1.CreateFeedbackDto, ['taskId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateFeedbackDto = UpdateFeedbackDto;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/entities/answer.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Answer = exports.ThumbsRating = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
const class_validator_1 = __webpack_require__("class-validator");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
const question_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts");
var ThumbsRating;
(function (ThumbsRating) {
    ThumbsRating["Up"] = "up";
    ThumbsRating["Down"] = "down";
})(ThumbsRating = exports.ThumbsRating || (exports.ThumbsRating = {}));
/**
 * An Answer belongs to a Feedback. Answers are created by /feedbacks POST and PATCH endpoints.
 */
let Answer = class Answer {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, textAnswer: { required: true, type: () => String }, radioAnswer: { required: true, type: () => String }, starRatingAnswer: { required: true, type: () => Number, minimum: 1, maximum: 5 }, thumbsRatingAnswer: { required: true, enum: (__webpack_require__("./apps/task/src/app/feedbacks/entities/answer.entity.ts").ThumbsRating) }, feedbackId: { required: true, type: () => String }, questionId: { required: true, type: () => String } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Answer.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Answer.prototype, "textAnswer", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Answer.prototype, "radioAnswer", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, tslib_1.__metadata)("design:type", Number)
], Answer.prototype, "starRatingAnswer", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'enum', enum: ThumbsRating, nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Answer.prototype, "thumbsRatingAnswer", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => feedback_entity_1.Feedback, (feedback) => feedback.answers, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'feedbackId' }),
    (0, tslib_1.__metadata)("design:type", String)
], Answer.prototype, "feedbackId", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('uuid'),
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    (0, tslib_1.__metadata)("design:type", String)
], Answer.prototype, "questionId", void 0);
Answer = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)()
], Answer);
exports.Answer = Answer;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/entities/feedback.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Feedback = exports.PaymentStatus = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
const answer_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/answer.entity.ts");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Completed"] = "completed";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
let Feedback = class Feedback {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, dateCreated: { required: true, type: () => Date }, comment: { required: true, type: () => String }, paymentStatus: { required: true, enum: (__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").PaymentStatus) }, feedbackRating: { required: true, type: () => Number }, feedbackRatingComment: { required: true, type: () => String }, taskRating: { required: true, type: () => Number }, taskRatingComment: { required: true, type: () => String }, taskId: { required: true, type: () => String }, task: { required: true, type: () => (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task) }, userId: { required: true, type: () => String }, answers: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/feedbacks/entities/answer.entity.ts").Answer)] } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Feedback.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    (0, tslib_1.__metadata)("design:type", Date)
], Feedback.prototype, "dateCreated", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Feedback.prototype, "comment", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending }),
    (0, tslib_1.__metadata)("design:type", String)
], Feedback.prototype, "paymentStatus", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", Number)
], Feedback.prototype, "feedbackRating", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Feedback.prototype, "feedbackRatingComment", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", Number)
], Feedback.prototype, "taskRating", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Feedback.prototype, "taskRatingComment", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('uuid'),
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    (0, tslib_1.__metadata)("design:type", String)
], Feedback.prototype, "taskId", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, (task) => task.feedbacks),
    (0, tslib_1.__metadata)("design:type", task_entity_1.Task)
], Feedback.prototype, "task", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Feedback.prototype, "userId", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => answer_entity_1.Answer, (answer) => answer.feedbackId, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, tslib_1.__metadata)("design:type", Array)
], Feedback.prototype, "answers", void 0);
Feedback = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)()
], Feedback);
exports.Feedback = Feedback;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/feedbacks.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbacksController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const feedbacks_service_1 = __webpack_require__("./apps/task/src/app/feedbacks/feedbacks.service.ts");
const create_feedback_dto_1 = __webpack_require__("./apps/task/src/app/feedbacks/dto/create-feedback.dto.ts");
const update_feedback_dto_1 = __webpack_require__("./apps/task/src/app/feedbacks/dto/update-feedback.dto.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const findAll_feedback_dto_1 = __webpack_require__("./apps/task/src/app/feedbacks/dto/findAll-feedback.dto.ts");
const ability_1 = __webpack_require__("@casl/ability");
const policy_1 = __webpack_require__("./apps/task/src/app/iam/policy.ts");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
const contextService = __webpack_require__("request-context");
const rate_feedback_dto_1 = __webpack_require__("./apps/task/src/app/feedbacks/dto/rate-feedback.dto.ts");
const rate_task_dto_1 = __webpack_require__("./apps/task/src/app/feedbacks/dto/rate-task.dto.ts");
let FeedbacksController = class FeedbacksController {
    constructor(feedbacksService) {
        this.feedbacksService = feedbacksService;
    }
    /**
     * Create a new Feedback. The user must have Create permission for Feedback.
     */
    create(createFeedbackDto) {
        // check if user have permission to create Feedback
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Create, feedback_entity_1.Feedback);
        return this.feedbacksService.create(createFeedbackDto);
    }
    /**
     * Get a list of all Feedbacks. The user must have permission to Read all Feedbacks.
     */
    findAll(query) {
        // check if user have permission to list Feedback
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, new feedback_entity_1.Feedback());
        return this.feedbacksService.findAll(query);
    }
    /**
     * Get a list of Feedbacks on which the calling user have access to.
     * The user must have Read permission on the Feedbacks.
     */
    searchAll() {
        // check if user have permission to read Feedbacks
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, feedback_entity_1.Feedback);
        return this.feedbacksService.searchAll();
    }
    /**
     * Get all Feedbacks for a Task. The user must have Read permission on the Task.
     */
    findFeedbacks(taskId) {
        return this.feedbacksService.findFeedbacks(taskId);
    }
    /**
     * Get a Feedback.
     * The calling user must have Read permission on the Feedback.
     * The Read permission for the Feedback is granted if one of the following holds:
     * 1. The feedback is created by the User.
     * 2. User have Read permission on the Task to which this Feedback belongs.
     */
    findOne(id) {
        return this.feedbacksService.findOne(id);
    }
    /**
     * Update a Feedback. The calling user must have Update permission on the Feedback.
     */
    update(id, updateFeedbackDto) {
        return this.feedbacksService.update(id, updateFeedbackDto);
    }
    /**
     * Release payment for the Feedback. User must have Update Permission on the Task related to Feedback.
     */
    releasePayment(id) {
        return this.feedbacksService.releasePayment(id);
    }
    /**
     * Rate a feedback. User must have Update Permission on the Task related to Feedback.
     */
    rateFeedback(id, rateFeedbackDto) {
        return this.feedbacksService.rateFeedback(id, rateFeedbackDto);
    }
    /**
     * Rate a Task related to feedback. User must have Read Permission on the Feedback.
     */
    rateTask(id, rateTaskDto) {
        return this.feedbacksService.rateTask(id, rateTaskDto);
    }
    /**
     * Delete a Feedback. The calling user must have Delete permission on the Feedback.
     */
    remove(id) {
        return this.feedbacksService.remove(id);
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Create a new Feedback. The user must have Create permission for Feedback." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback) }),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [create_feedback_dto_1.CreateFeedbackDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "create", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of all Feedbacks. The user must have permission to Read all Feedbacks." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback)] }),
    (0, tslib_1.__param)(0, (0, common_1.Query)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [findAll_feedback_dto_1.FindAllFeedbackDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "findAll", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of Feedbacks on which the calling user have access to.\nThe user must have Read permission on the Feedbacks." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('search'),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback)] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "searchAll", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get all Feedbacks for a Task. The user must have Read permission on the Task." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('tasks/:taskId'),
    (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'The task id to list Feedbacks for',
    }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback)] }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('taskId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "findFeedbacks", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a Feedback.\nThe calling user must have Read permission on the Feedback.\nThe Read permission for the Feedback is granted if one of the following holds:\n1. The feedback is created by the User.\n2. User have Read permission on the Task to which this Feedback belongs." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "findOne", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Update a Feedback. The calling user must have Update permission on the Feedback." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, update_feedback_dto_1.UpdateFeedbackDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "update", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Release payment for the Feedback. User must have Update Permission on the Task related to Feedback." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(':id/releasePayment'),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "releasePayment", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Rate a feedback. User must have Update Permission on the Task related to Feedback." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id/rateFeedback'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, rate_feedback_dto_1.RateFeedbackDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "rateFeedback", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Rate a Task related to feedback. User must have Read Permission on the Feedback." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id/rateTask'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, rate_task_dto_1.RateTaskDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "rateTask", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Delete a Feedback. The calling user must have Delete permission on the Feedback." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], FeedbacksController.prototype, "remove", null);
FeedbacksController = (0, tslib_1.__decorate)([
    (0, swagger_1.ApiTags)('feedbacks'),
    (0, common_1.Controller)('feedbacks'),
    (0, tslib_1.__metadata)("design:paramtypes", [feedbacks_service_1.FeedbacksService])
], FeedbacksController);
exports.FeedbacksController = FeedbacksController;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/feedbacks.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbacksModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const feedbacks_service_1 = __webpack_require__("./apps/task/src/app/feedbacks/feedbacks.service.ts");
const feedbacks_controller_1 = __webpack_require__("./apps/task/src/app/feedbacks/feedbacks.controller.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
const answer_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/answer.entity.ts");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
let FeedbacksModule = class FeedbacksModule {
};
FeedbacksModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([feedback_entity_1.Feedback, answer_entity_1.Answer, task_entity_1.Task])],
        controllers: [feedbacks_controller_1.FeedbacksController],
        providers: [feedbacks_service_1.FeedbacksService],
    })
], FeedbacksModule);
exports.FeedbacksModule = FeedbacksModule;


/***/ }),

/***/ "./apps/task/src/app/feedbacks/feedbacks.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbacksService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const class_transformer_1 = __webpack_require__("class-transformer");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const utils_1 = __webpack_require__("./apps/task/src/app/iam/utils.ts");
const policy_1 = __webpack_require__("./apps/task/src/app/iam/policy.ts");
const contextService = __webpack_require__("request-context");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
let FeedbacksService = class FeedbacksService {
    constructor(feedbackRepository, taskRepository) {
        this.feedbackRepository = feedbackRepository;
        this.taskRepository = taskRepository;
    }
    create(createFeedbackDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Check if user have already provided feedback for this task, fail in that case.
            // The feedback for a Task iteration can only be provided once.
            const existingFeedback = yield this.feedbackRepository.findOne({
                where: {
                    taskId: createFeedbackDto.taskId,
                    userId: contextService.get('user').id,
                },
            });
            if (existingFeedback) {
                // user have already provided feedback for this Task
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    error: 'You have already provided feedback on this task.',
                }, common_1.HttpStatus.PRECONDITION_FAILED);
            }
            // check if Answers belong to the questions of the Task
            const task = yield this.taskRepository.findOneOrFail(createFeedbackDto.taskId, {
                select: ['id'],
                relations: ['questions'],
            });
            const taskQuestionIds = task.questions.map((question) => question.id);
            const allAnswersBelongToTaskQuesitons = createFeedbackDto.answers.every((answer) => taskQuestionIds.includes(answer.questionId));
            if (!allAnswersBelongToTaskQuesitons) {
                // There exist atleast one answer which does not belong to the Task Questions
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    error: 'The answers does not belong to task questions.',
                }, common_1.HttpStatus.PRECONDITION_FAILED);
            }
            const feedback = feedbackDtoToEntity(createFeedbackDto);
            feedback.userId = contextService.get('user').id;
            return this.feedbackRepository.save(feedback);
        });
    }
    findAll(query) {
        const options = {
            relations: ['task'],
        };
        if (query && query.taskId) {
            options.where = {
                taskId: query.taskId,
            };
        }
        return this.feedbackRepository.find(options);
    }
    findFeedbacks(taskId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Check if user have Read permission for the Task
            yield (0, utils_1.findWithPermissionCheck)(taskId, policy_1.Action.Read, this.taskRepository);
            return this.feedbackRepository.find({
                where: {
                    taskId,
                },
            });
        });
    }
    findOne(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const feedback = yield this.feedbackRepository.findOneOrFail(id, {
                relations: ['answers'],
            });
            const ability = contextService.get('userAbility');
            if (ability.can(policy_1.Action.Read, feedback)) {
                return feedback;
            }
            else {
                // User implicitly have Read permission on Feedback if the user have Read permission on the Task to which this feedback belongs.
                yield (0, utils_1.findWithPermissionCheck)(feedback.taskId, policy_1.Action.Read, this.taskRepository);
                return feedback;
            }
        });
    }
    update(id, updateFeedbackDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // first check if the record exist in database because we use .save here and
            // save will create new if it not exists, but we don't want to create new here
            // as this is an update call.
            yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Update, this.feedbackRepository);
            const feedback = feedbackDtoToEntity(updateFeedbackDto);
            feedback.id = id;
            // using save instead of update here to also add/remove Answers relationship
            yield this.feedbackRepository.save(feedback);
            return this.feedbackRepository.findOne(id);
        });
    }
    remove(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Delete, this.feedbackRepository);
            return this.feedbackRepository.delete(id);
        });
    }
    searchAll() {
        var _a;
        return this.feedbackRepository.find({
            where: {
                userId: (_a = contextService.get('user')) === null || _a === void 0 ? void 0 : _a.id,
            },
            relations: ['task'],
        });
    }
    releasePayment(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const feedback = yield this.feedbackRepository.findOneOrFail(id, {
                select: ['id', 'taskId', 'paymentStatus'],
            });
            // Check if user have Update permission on the Task for which the payment is to be released.
            yield (0, utils_1.findWithPermissionCheck)(feedback.taskId, policy_1.Action.Update, this.taskRepository);
            if (feedback.paymentStatus === feedback_entity_1.PaymentStatus.Completed) {
                // Payment already completed
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    error: 'Payment for the Feedback is already completed.',
                }, common_1.HttpStatus.PRECONDITION_FAILED);
            }
            return this.feedbackRepository.update(id, {
                paymentStatus: feedback_entity_1.PaymentStatus.Completed,
            });
        });
    }
    rateFeedback(id, rateFeedbackDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const feedback = yield this.feedbackRepository.findOneOrFail(id, {
                select: ['id', 'taskId'],
            });
            // Check if user have Update permission on the Task for which the rating is to be given.
            yield (0, utils_1.findWithPermissionCheck)(feedback.taskId, policy_1.Action.Update, this.taskRepository);
            const updatedFeedback = feedbackDtoToEntity(rateFeedbackDto);
            updatedFeedback.id = id;
            return this.feedbackRepository.save(updatedFeedback);
        });
    }
    rateTask(feedbackId, rateTaskDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Check if user have Read permission on the Feedback
            yield (0, utils_1.findWithPermissionCheck)(feedbackId, policy_1.Action.Read, this.feedbackRepository);
            const updatedFeedback = feedbackDtoToEntity(rateTaskDto);
            updatedFeedback.id = feedbackId;
            return this.feedbackRepository.save(updatedFeedback);
        });
    }
};
FeedbacksService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    (0, tslib_1.__param)(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FeedbacksService);
exports.FeedbacksService = FeedbacksService;
function feedbackDtoToEntity(dto) {
    const data = (0, class_transformer_1.classToPlain)(dto);
    return (0, class_transformer_1.plainToClass)(feedback_entity_1.Feedback, data);
}


/***/ }),

/***/ "./apps/task/src/app/iam/iam.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IamController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const extra_1 = __webpack_require__("@casl/ability/extra");
const contextService = __webpack_require__("request-context");
let IamController = class IamController {
    /**
     * Get permissions of the calling user.
     */
    getPermissions() {
        var _a;
        return (0, extra_1.packRules)((_a = contextService.get('userAbility')) === null || _a === void 0 ? void 0 : _a.rules, (subjectType) => {
            if (typeof subjectType === 'string') {
                return subjectType;
            }
            return subjectType.name;
        });
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get permissions of the calling user." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getPermissions'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], IamController.prototype, "getPermissions", null);
IamController = (0, tslib_1.__decorate)([
    (0, swagger_1.ApiTags)('IAM'),
    (0, common_1.Controller)('iam')
], IamController);
exports.IamController = IamController;


/***/ }),

/***/ "./apps/task/src/app/iam/iam.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IamModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const iam_controller_1 = __webpack_require__("./apps/task/src/app/iam/iam.controller.ts");
let IamModule = class IamModule {
};
IamModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        controllers: [iam_controller_1.IamController]
    })
], IamModule);
exports.IamModule = IamModule;


/***/ }),

/***/ "./apps/task/src/app/iam/policy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defineAbilityFor = exports.AppAbility = exports.Action = void 0;
const ability_1 = __webpack_require__("@casl/ability");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
/**
 * Defines the policy for a User.
 * The policy includes the actions a User can perform on entities.
 */
var Action;
(function (Action) {
    Action["Manage"] = "manage";
    Action["Create"] = "create";
    Action["Read"] = "read";
    Action["Update"] = "update";
    Action["Delete"] = "delete";
})(Action = exports.Action || (exports.Action = {}));
exports.AppAbility = ability_1.Ability;
// For each role, define the permissions
const rolePermissions = {
    admin(user, { can }) {
        can(Action.Manage, 'all');
    },
    developer(user, { can }) {
        can(Action.Manage, project_entity_1.Project, { userId: user.id });
        can(Action.Manage, task_entity_1.Task, { userId: user.id });
    },
    crowdworker(user, { can }) {
        can(Action.Create, feedback_entity_1.Feedback);
        can(Action.Read, feedback_entity_1.Feedback, { userId: user.id });
    },
};
function defineAbilityFor(user) {
    const builder = new ability_1.AbilityBuilder(exports.AppAbility);
    user.roles.forEach((role) => {
        if (typeof rolePermissions[role] === 'function') {
            rolePermissions[role](user, builder);
        }
        else {
            throw new Error(`Trying to use unknown role "${role}"`);
        }
    });
    return builder.build({
        detectSubjectType: (item) => item.constructor,
    });
}
exports.defineAbilityFor = defineAbilityFor;


/***/ }),

/***/ "./apps/task/src/app/iam/utils.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findWithPermissionCheck = void 0;
const tslib_1 = __webpack_require__("tslib");
const ability_1 = __webpack_require__("@casl/ability");
const contextService = __webpack_require__("request-context");
/**
 * Retrieve an entity from database and check permissions on it
 * @param id The id of the entity in database
 * @param action The action to check permission for
 * @param repository The repository to use to retrieve record from databae
 */
function findWithPermissionCheck(id, action, repository, findOneOptions) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const entity = yield repository.findOneOrFail(id, findOneOptions);
        // check if user have permission to remove this project
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(action, entity);
        return entity;
    });
}
exports.findWithPermissionCheck = findWithPermissionCheck;


/***/ }),

/***/ "./apps/task/src/app/projects/dto/create-project.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateProjectDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class CreateProjectDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateProjectDto.prototype, "title", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
exports.CreateProjectDto = CreateProjectDto;


/***/ }),

/***/ "./apps/task/src/app/projects/dto/update-project.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProjectDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const mapped_types_1 = __webpack_require__("@nestjs/mapped-types");
const create_project_dto_1 = __webpack_require__("./apps/task/src/app/projects/dto/create-project.dto.ts");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
const class_validator_1 = __webpack_require__("class-validator");
class UpdateProjectDto extends (0, mapped_types_1.PartialType)(create_project_dto_1.CreateProjectDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: (__webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts").ProjectStatus) } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsEnum)(project_entity_1.ProjectStatus),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], UpdateProjectDto.prototype, "status", void 0);
exports.UpdateProjectDto = UpdateProjectDto;


/***/ }),

/***/ "./apps/task/src/app/projects/entities/project.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Project = exports.ProjectStatus = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Open"] = "open";
    ProjectStatus["Closed"] = "closed";
})(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
let Project = class Project {
    constructor(init) {
        Object.assign(this, init);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, dateCreated: { required: true, type: () => Date }, status: { required: true, enum: (__webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts").ProjectStatus) }, userId: { required: true, type: () => String } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Project.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], Project.prototype, "title", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Project.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    (0, tslib_1.__metadata)("design:type", Date)
], Project.prototype, "dateCreated", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.Open }),
    (0, tslib_1.__metadata)("design:type", String)
], Project.prototype, "status", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Project.prototype, "userId", void 0);
Project = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)(),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], Project);
exports.Project = Project;


/***/ }),

/***/ "./apps/task/src/app/projects/projects.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const projects_service_1 = __webpack_require__("./apps/task/src/app/projects/projects.service.ts");
const create_project_dto_1 = __webpack_require__("./apps/task/src/app/projects/dto/create-project.dto.ts");
const update_project_dto_1 = __webpack_require__("./apps/task/src/app/projects/dto/update-project.dto.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const ability_1 = __webpack_require__("@casl/ability");
const contextService = __webpack_require__("request-context");
const policy_1 = __webpack_require__("./apps/task/src/app/iam/policy.ts");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    /**
     * Create a new Project. The user must have Create permission for Projects.
     */
    create(createProjectDto) {
        // check if user have permission to create project
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Create, project_entity_1.Project);
        return this.projectsService.create(createProjectDto);
    }
    /**
     * Get a list of all Projects. The user must have permission to Read all Projects.
     */
    findAll() {
        // check if user have permission to list projects
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, new project_entity_1.Project());
        return this.projectsService.findAll();
    }
    /**
     * Get a list of Projects on which the calling user have access to.
     * The user must have Read permission on the Projects.
     */
    searchAll() {
        // check if user have permission to read projects
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, project_entity_1.Project);
        return this.projectsService.searchAll();
    }
    /**
     * Get a Project. The calling user must have Read permission the Project.
     */
    findOne(id) {
        return this.projectsService.findOne(id);
    }
    /**
     * Update a Project. The calling user must have Update permission the Project.
     */
    update(id, updateProjectDto) {
        return this.projectsService.update(id, updateProjectDto);
    }
    /**
     * Delete a Project. The calling user must have Delete permission the Project.
     */
    remove(id) {
        return this.projectsService.remove(id);
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Create a new Project. The user must have Create permission for Projects." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts").Project) }),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [create_project_dto_1.CreateProjectDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of all Projects. The user must have permission to Read all Projects." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts").Project)] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of Projects on which the calling user have access to.\nThe user must have Read permission on the Projects." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('search'),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts").Project)] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], ProjectsController.prototype, "searchAll", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a Project. The calling user must have Read permission the Project." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts").Project) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Update a Project. The calling user must have Update permission the Project." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts").Project) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Delete a Project. The calling user must have Delete permission the Project." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
ProjectsController = (0, tslib_1.__decorate)([
    (0, swagger_1.ApiTags)('projects'),
    (0, common_1.Controller)('projects'),
    (0, tslib_1.__metadata)("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
exports.ProjectsController = ProjectsController;


/***/ }),

/***/ "./apps/task/src/app/projects/projects.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const projects_service_1 = __webpack_require__("./apps/task/src/app/projects/projects.service.ts");
const projects_controller_1 = __webpack_require__("./apps/task/src/app/projects/projects.controller.ts");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
let ProjectsModule = class ProjectsModule {
};
ProjectsModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_entity_1.Project])],
        controllers: [projects_controller_1.ProjectsController],
        providers: [projects_service_1.ProjectsService],
    })
], ProjectsModule);
exports.ProjectsModule = ProjectsModule;


/***/ }),

/***/ "./apps/task/src/app/projects/projects.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
const typeorm_1 = __webpack_require__("typeorm");
const typeorm_2 = __webpack_require__("@nestjs/typeorm");
const class_transformer_1 = __webpack_require__("class-transformer");
const contextService = __webpack_require__("request-context");
const policy_1 = __webpack_require__("./apps/task/src/app/iam/policy.ts");
const utils_1 = __webpack_require__("./apps/task/src/app/iam/utils.ts");
let ProjectsService = class ProjectsService {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    create(createProjectDto) {
        const project = projectDtoEntity(createProjectDto);
        project.userId = contextService.get('user').id;
        return this.projectRepository.save(project);
    }
    findAll() {
        return this.projectRepository.find();
    }
    searchAll() {
        var _a;
        return this.projectRepository.find({
            where: {
                userId: (_a = contextService.get('user')) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
    }
    findOne(id) {
        return (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Read, this.projectRepository);
    }
    update(id, updateProjectDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Update, this.projectRepository);
            const project = projectDtoEntity(updateProjectDto);
            yield this.projectRepository.update(id, project);
            return this.projectRepository.findOne(id);
        });
    }
    remove(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Delete, this.projectRepository);
            return this.projectRepository.delete(id);
        });
    }
};
ProjectsService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_2.InjectRepository)(project_entity_1.Project)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeorm_1.Repository])
], ProjectsService);
exports.ProjectsService = ProjectsService;
function projectDtoEntity(dto) {
    const data = (0, class_transformer_1.classToPlain)(dto);
    return (0, class_transformer_1.plainToClass)(project_entity_1.Project, data);
}


/***/ }),

/***/ "./apps/task/src/app/skills/entities/skill.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Skill = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
let Skill = class Skill {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Skill.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], Skill.prototype, "name", void 0);
Skill = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)()
], Skill);
exports.Skill = Skill;


/***/ }),

/***/ "./apps/task/src/app/skills/skills.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkillsModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const skills_service_1 = __webpack_require__("./apps/task/src/app/skills/skills.service.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const skill_entity_1 = __webpack_require__("./apps/task/src/app/skills/entities/skill.entity.ts");
const config_1 = __webpack_require__("@nestjs/config");
const axios_1 = __webpack_require__("@nestjs/axios");
let SkillsModule = class SkillsModule {
};
SkillsModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([skill_entity_1.Skill]), config_1.ConfigModule, axios_1.HttpModule],
        providers: [skills_service_1.SkillsService],
    })
], SkillsModule);
exports.SkillsModule = SkillsModule;


/***/ }),

/***/ "./apps/task/src/app/skills/skills.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkillsService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const skill_entity_1 = __webpack_require__("./apps/task/src/app/skills/entities/skill.entity.ts");
const common_2 = __webpack_require__("@nestjs/common");
const schedule_1 = __webpack_require__("@nestjs/schedule");
const axios_1 = __webpack_require__("@nestjs/axios");
const config_1 = __webpack_require__("@nestjs/config");
const rxjs_1 = __webpack_require__("rxjs");
let SkillsService = class SkillsService {
    constructor(httpService, configService, skillRepository) {
        this.httpService = httpService;
        this.configService = configService;
        this.skillRepository = skillRepository;
    }
    /**
     * Fetching Skills from the Admin service and saving in database
     * Called once whenever application runs. Saves skills in database only if they are not already saved
     * */
    fetchAndSaveSkills() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const skill = yield this.skillRepository.findOne();
            if (skill) {
                common_2.Logger.debug('skills already available in database.');
                return;
            }
            const adminAPI = this.configService.get('ADMIN_API');
            if (adminAPI) {
                try {
                    const response = yield (0, rxjs_1.firstValueFrom)(this.httpService.get(`${adminAPI}/skills`));
                    const skills = response.data;
                    this.skillRepository.save(skills);
                    common_2.Logger.debug('Skills saved in database');
                }
                catch (err) {
                    common_2.Logger.error(`failed to fetch and save skills ${err}`);
                }
            }
        });
    }
};
(0, tslib_1.__decorate)([
    (0, schedule_1.Timeout)(0),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], SkillsService.prototype, "fetchAndSaveSkills", null);
SkillsService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(2, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    (0, tslib_1.__metadata)("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        typeorm_2.Repository])
], SkillsService);
exports.SkillsService = SkillsService;


/***/ }),

/***/ "./apps/task/src/app/tasks/dto/batch-create-images.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BatchCreateImagesDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class BatchCreateImagesDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { images: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/tasks/entities/image.entity.ts").Image)] } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Array)
], BatchCreateImagesDto.prototype, "images", void 0);
exports.BatchCreateImagesDto = BatchCreateImagesDto;


/***/ }),

/***/ "./apps/task/src/app/tasks/dto/create-task.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTaskDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
class CreateTaskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, testType: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").TestType) }, prototypeFormat: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").PrototypeFormat) }, accessType: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").AccessType) }, iframeUrl1: { required: false, type: () => String }, iframeUrl2: { required: false, type: () => String }, textualDescription1: { required: false, type: () => String }, textualDescription2: { required: false, type: () => String }, minAge: { required: false, type: () => Number, minimum: 18, maximum: 67 }, maxAge: { required: false, type: () => Number, minimum: 18, maximum: 67 }, minExperience: { required: false, type: () => Number, minimum: 0, maximum: 49 }, maxExperience: { required: false, type: () => Number, minimum: 0, maximum: 49 }, budget: { required: true, type: () => Number, minimum: 0 }, incentive: { required: true, type: () => Number, minimum: 0 }, projectId: { required: true, type: () => String }, skills: { required: true, type: () => [String] }, countries: { required: true, type: () => [String] }, questions: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts").Question)] } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsEnum)(task_entity_1.TestType),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "testType", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsEnum)(task_entity_1.PrototypeFormat),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "prototypeFormat", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsEnum)(task_entity_1.AccessType),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "accessType", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "iframeUrl1", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "iframeUrl2", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "textualDescription1", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "textualDescription2", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(67),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateTaskDto.prototype, "minAge", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(67),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateTaskDto.prototype, "maxAge", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(49),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateTaskDto.prototype, "minExperience", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(49),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateTaskDto.prototype, "maxExperience", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateTaskDto.prototype, "budget", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateTaskDto.prototype, "incentive", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTaskDto.prototype, "projectId", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Array)
], CreateTaskDto.prototype, "skills", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Array)
], CreateTaskDto.prototype, "countries", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Array)
], CreateTaskDto.prototype, "questions", void 0);
exports.CreateTaskDto = CreateTaskDto;


/***/ }),

/***/ "./apps/task/src/app/tasks/dto/feedback-stats-response.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionAnswerStats = exports.FeedbackStatsResponseDto = void 0;
const openapi = __webpack_require__("@nestjs/swagger");
class FeedbackStatsResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { stats: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/tasks/dto/feedback-stats-response.dto.ts").QuestionAnswerStats)] } };
    }
}
exports.FeedbackStatsResponseDto = FeedbackStatsResponseDto;
class QuestionAnswerStats {
    static _OPENAPI_METADATA_FACTORY() {
        return { questionId: { required: true, type: () => String }, questionType: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts").QuestionType) }, starRatingAnswer: { required: true, type: () => Number }, starRatingAnswerCount: { required: true, type: () => Number }, radioAnswer: { required: true, type: () => String }, radioAnswerCount: { required: true, type: () => Number }, thumbsUpCount: { required: true, type: () => Number }, thumbsDownCount: { required: true, type: () => Number } };
    }
}
exports.QuestionAnswerStats = QuestionAnswerStats;


/***/ }),

/***/ "./apps/task/src/app/tasks/dto/file-upload-signature-response.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileUploadSignatureResponseDto = void 0;
const openapi = __webpack_require__("@nestjs/swagger");
class FileUploadSignatureResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { apiKey: { required: true, type: () => String }, uploadUrl: { required: true, type: () => String }, signature: { required: true, type: () => String }, timestamp: { required: true, type: () => Number }, folder: { required: true, type: () => String } };
    }
}
exports.FileUploadSignatureResponseDto = FileUploadSignatureResponseDto;


/***/ }),

/***/ "./apps/task/src/app/tasks/dto/find-all-tasks.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FindAllTasksDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
const swagger_1 = __webpack_require__("@nestjs/swagger");
class FindAllTasksDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { projectId: { required: true, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'The project to which the tasks belongs.',
        required: false,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], FindAllTasksDto.prototype, "projectId", void 0);
exports.FindAllTasksDto = FindAllTasksDto;


/***/ }),

/***/ "./apps/task/src/app/tasks/dto/update-task.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTaskDto = void 0;
const openapi = __webpack_require__("@nestjs/swagger");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const create_task_dto_1 = __webpack_require__("./apps/task/src/app/tasks/dto/create-task.dto.ts");
class UpdateTaskDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_task_dto_1.CreateTaskDto, ['projectId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTaskDto = UpdateTaskDto;


/***/ }),

/***/ "./apps/task/src/app/tasks/entities/image.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Image = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
const class_validator_1 = __webpack_require__("class-validator");
let Image = class Image {
    constructor(init) {
        Object.assign(this, init);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, url: { required: true, type: () => String }, dateCreated: { required: true, type: () => Date }, prototypeNumber: { required: true, type: () => Number, minimum: 1, maximum: 2 }, taskId: { required: true, type: () => String }, cloudId: { required: true, type: () => String } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Image.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, tslib_1.__metadata)("design:type", String)
], Image.prototype, "url", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    (0, tslib_1.__metadata)("design:type", Date)
], Image.prototype, "dateCreated", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(2),
    (0, typeorm_1.Column)({ default: 1 }),
    (0, tslib_1.__metadata)("design:type", Number)
], Image.prototype, "prototypeNumber", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, (task) => task.images, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    (0, tslib_1.__metadata)("design:type", String)
], Image.prototype, "taskId", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], Image.prototype, "cloudId", void 0);
Image = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)(),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], Image);
exports.Image = Image;


/***/ }),

/***/ "./apps/task/src/app/tasks/entities/question.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Question = exports.QuestionType = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
const class_validator_1 = __webpack_require__("class-validator");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
var QuestionType;
(function (QuestionType) {
    QuestionType["Text"] = "text";
    QuestionType["Radio"] = "radio";
    QuestionType["StarRating"] = "star-rating";
    QuestionType["ThumbsRating"] = "thumbs-rating";
})(QuestionType = exports.QuestionType || (exports.QuestionType = {}));
/**
 * A Question belongs to a Task. Questions are created by /tasks POST and PATCH endpoints.
 */
let Question = class Question {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, description: { required: true, type: () => String }, type: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts").QuestionType) }, order: { required: true, type: () => Number, minimum: 1 }, radioOptions: { required: true, type: () => [String] }, taskId: { required: true, type: () => String } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Question.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, tslib_1.__metadata)("design:type", String)
], Question.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'enum', enum: QuestionType }),
    (0, tslib_1.__metadata)("design:type", String)
], Question.prototype, "type", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.Min)(1),
    (0, tslib_1.__metadata)("design:type", Number)
], Question.prototype, "order", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { array: true, nullable: true }),
    (0, tslib_1.__metadata)("design:type", Array)
], Question.prototype, "radioOptions", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, (task) => task.questions, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    (0, tslib_1.__metadata)("design:type", String)
], Question.prototype, "taskId", void 0);
Question = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)()
], Question);
exports.Question = Question;


/***/ }),

/***/ "./apps/task/src/app/tasks/entities/task.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = exports.ColumnNumericTransformer = exports.AccessType = exports.TaskStatus = exports.PrototypeFormat = exports.TestType = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
const class_validator_1 = __webpack_require__("class-validator");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
const image_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/image.entity.ts");
const skill_entity_1 = __webpack_require__("./apps/task/src/app/skills/entities/skill.entity.ts");
const country_entity_1 = __webpack_require__("./apps/task/src/app/countries/entities/country.entity.ts");
const question_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
var TestType;
(function (TestType) {
    TestType["Basic"] = "basic";
    TestType["Comparison"] = "comparison";
})(TestType = exports.TestType || (exports.TestType = {}));
var PrototypeFormat;
(function (PrototypeFormat) {
    PrototypeFormat["Image"] = "image";
    PrototypeFormat["Iframe"] = "iframe";
    PrototypeFormat["Text"] = "text";
})(PrototypeFormat = exports.PrototypeFormat || (exports.PrototypeFormat = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Draft"] = "draft";
    TaskStatus["Open"] = "open";
    TaskStatus["Closed"] = "closed";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
var AccessType;
(function (AccessType) {
    AccessType["Open"] = "open";
    AccessType["Nda"] = "nda";
    AccessType["Request"] = "request";
})(AccessType = exports.AccessType || (exports.AccessType = {}));
// Typeorm return decimal values as string. Here is the workaround for that.
// This solution is copied from https://stackoverflow.com/questions/69872250/typeorm-decimal-column-values-returned-as-strings-instead-of-decimal-numbers
class ColumnNumericTransformer {
    to(data) {
        return data;
    }
    from(data) {
        return parseFloat(data);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.ColumnNumericTransformer = ColumnNumericTransformer;
let Task = class Task {
    constructor(init) {
        Object.assign(this, init);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, dateCreated: { required: true, type: () => Date }, testType: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").TestType) }, prototypeFormat: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").PrototypeFormat) }, status: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").TaskStatus) }, accessType: { required: true, enum: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").AccessType) }, iframeUrl1: { required: true, type: () => String }, iframeUrl2: { required: true, type: () => String }, textualDescription1: { required: true, type: () => String }, textualDescription2: { required: true, type: () => String }, minAge: { required: true, type: () => Number, minimum: 18, maximum: 67 }, maxAge: { required: true, type: () => Number, minimum: 18, maximum: 67 }, minExperience: { required: true, type: () => Number, minimum: 0, maximum: 49 }, maxExperience: { required: true, type: () => Number, minimum: 0, maximum: 49 }, budget: { required: true, type: () => Number }, incentive: { required: true, type: () => Number }, userId: { required: true, type: () => String }, projectId: { required: true, type: () => String }, images: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/tasks/entities/image.entity.ts").Image)] }, skills: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/skills/entities/skill.entity.ts").Skill)] }, countries: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/countries/entities/country.entity.ts").Country)] }, questions: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts").Question)] }, feedbacks: { required: true, type: () => [(__webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts").Feedback)] } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "title", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    (0, tslib_1.__metadata)("design:type", Date)
], Task.prototype, "dateCreated", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'enum', enum: TestType }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "testType", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PrototypeFormat,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "prototypeFormat", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'enum', enum: TaskStatus, default: TaskStatus.Draft }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "status", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AccessType,
        default: AccessType.Open,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "accessType", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "iframeUrl1", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "iframeUrl2", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "textualDescription1", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "textualDescription2", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(67),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", Number)
], Task.prototype, "minAge", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(67),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", Number)
], Task.prototype, "maxAge", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(49),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", Number)
], Task.prototype, "minExperience", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(49),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", Number)
], Task.prototype, "maxExperience", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('decimal', {
        transformer: new ColumnNumericTransformer(),
    }),
    (0, tslib_1.__metadata)("design:type", Number)
], Task.prototype, "budget", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('decimal', {
        transformer: new ColumnNumericTransformer(),
    }),
    (0, tslib_1.__metadata)("design:type", Number)
], Task.prototype, "incentive", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "userId", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('uuid'),
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    (0, tslib_1.__metadata)("design:type", String)
], Task.prototype, "projectId", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => image_entity_1.Image, (image) => image.taskId, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, tslib_1.__metadata)("design:type", Array)
], Task.prototype, "images", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)(),
    (0, tslib_1.__metadata)("design:type", Array)
], Task.prototype, "skills", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToMany)(() => country_entity_1.Country, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)(),
    (0, tslib_1.__metadata)("design:type", Array)
], Task.prototype, "countries", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => question_entity_1.Question, (question) => question.taskId, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, tslib_1.__metadata)("design:type", Array)
], Task.prototype, "questions", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, (feedback) => feedback.taskId),
    (0, tslib_1.__metadata)("design:type", Array)
], Task.prototype, "feedbacks", void 0);
Task = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)(),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], Task);
exports.Task = Task;


/***/ }),

/***/ "./apps/task/src/app/tasks/tasks.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const tasks_service_1 = __webpack_require__("./apps/task/src/app/tasks/tasks.service.ts");
const create_task_dto_1 = __webpack_require__("./apps/task/src/app/tasks/dto/create-task.dto.ts");
const update_task_dto_1 = __webpack_require__("./apps/task/src/app/tasks/dto/update-task.dto.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const find_all_tasks_dto_1 = __webpack_require__("./apps/task/src/app/tasks/dto/find-all-tasks.dto.ts");
const ability_1 = __webpack_require__("@casl/ability");
const policy_1 = __webpack_require__("./apps/task/src/app/iam/policy.ts");
const contextService = __webpack_require__("request-context");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
const batch_create_images_dto_1 = __webpack_require__("./apps/task/src/app/tasks/dto/batch-create-images.dto.ts");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    /**
     * Create a new Task. The user must have Create permission for Tasks.
     * User can only create Tasks for its own Projects.
     */
    create(createTaskDto) {
        // check if user have permission to create Task
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Create, task_entity_1.Task);
        return this.tasksService.create(createTaskDto);
    }
    /**
     * By default, Task is created as draft. Use this endpoint to Activate the task.
     * Activating a task changes its status to open, and it can no longer be edited.
     * The calling user must have Update permission on the Task.
     * There are certain pre-requisites for activating a Task.
     *
     * 1. The Task must contain Questions
     * 2. The Task must contain crowd selection criteria (Skills and Countries)
     * 3. The Task must be in Draft state
     * 4. The task must contain Pictures, or Iframe Urls or textual description of Idea.
     */
    activate(id) {
        return this.tasksService.activate(id);
    }
    /**
     * Task can only be closed if it is in Open state.
     * The calling user must have Update permission on the Task
     */
    close(id) {
        return this.tasksService.close(id);
    }
    /**
     * Get a list of all Tasks. The user must have permission to Read all Tasks.
     */
    findAll(query) {
        // check if user have permission to list Tasks
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, new task_entity_1.Task());
        return this.tasksService.findAll(query);
    }
    /**
     * Get a list of all task iterations for a projectId. The iterations are returned in descending order.
     * The user must have Read permission on the Project and its Task iterations.
     */
    findIterations(projectId) {
        // check if user have permission to read Tasks
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, task_entity_1.Task);
        return this.tasksService.findIterations(projectId);
    }
    /**
     * Get open tasks for Crowdworker to work on. The calling user must have Create permission for the Feedback,
     * because only those users can see open tasks which have permission to create feedbacks.
     * Only those Tasks will be returned where user have not provided Feedback yet.
     */
    findOpenTasks() {
        // Check if user have permission to create feedback
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Create, feedback_entity_1.Feedback);
        return this.tasksService.findOpenTasks();
    }
    /**
     * Get a Task. The calling user must have Read permission the Task either explicitly or implicitly.
     * Explicit Permission: E.g Given by a role e.g developer role
     * Implicit Permission: The task criteria matches calling user profile, and calling user have permission to create Feedback.
     * Implicit Permission: This user has created Feedback for this Task
     */
    findOne(id) {
        return this.tasksService.findOne(id);
    }
    /**
     * Get statistics for feedbacks e.g, no of each star rating answer, number of thumbs up/down, no of each radio option selections.
     * The user must have Read Permission for the Task.
     */
    feedbackStats(id) {
        return this.tasksService.feedbackStats(id);
    }
    /**
     * Update a Task. The calling user must have Update permission the Task.
     */
    update(id, updateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }
    /**
     * Delete a Task. The calling user must have Delete permission the Task.
     */
    remove(id) {
        return this.tasksService.remove(id);
    }
    /**
     * Images are uploaded to cloudinary.com. For uploading an image, a signature is required.
     * This endpoint returns that signature which clients can use to upload images.
     */
    imageUploadSignature(id) {
        return this.tasksService.getImageUploadSignature(id);
    }
    /**
     * Batch create Images
     * The user must have Update permission for Task.
     */
    batchCreateImages(id, saveImageUrlsDto) {
        return this.tasksService.batchCreateImages(id, saveImageUrlsDto);
    }
    /**
     * Get list of images for the Task.
     * The caller must have read permission for the Task either explicitly or either implicitly.
     * Explicit Permission: E.g Given by a role e.g developer role
     * Implicit Permission: The task's criteria matches calling user profile, and calling user have permission to create Feedback.
     * Implicit Permission: This user has created Feedback for this Task
     */
    findAllImages(id, prototypeNumber) {
        return this.tasksService.findAllImages(id, prototypeNumber);
    }
    /**
     * Delete an Image for Task. The calling user must have Update permission on the Task.
     */
    removeImage(id, imageId) {
        return this.tasksService.removeImage(id, imageId);
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Create a new Task. The user must have Create permission for Tasks.\nUser can only create Tasks for its own Projects." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task) }),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "create", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "By default, Task is created as draft. Use this endpoint to Activate the task.\nActivating a task changes its status to open, and it can no longer be edited.\nThe calling user must have Update permission on the Task.\nThere are certain pre-requisites for activating a Task.\n\n1. The Task must contain Questions\n2. The Task must contain crowd selection criteria (Skills and Countries)\n3. The Task must be in Draft state\n4. The task must contain Pictures, or Iframe Urls or textual description of Idea." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(':id/activate'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "activate", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Task can only be closed if it is in Open state.\nThe calling user must have Update permission on the Task" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(':id/close'),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "close", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of all Tasks. The user must have permission to Read all Tasks." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task)] }),
    (0, tslib_1.__param)(0, (0, common_1.Query)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [find_all_tasks_dto_1.FindAllTasksDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of all task iterations for a projectId. The iterations are returned in descending order.\nThe user must have Read permission on the Project and its Task iterations." }),
    (0, swagger_1.ApiParam)({
        name: 'projectId',
        description: 'The project id to list iterations for',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('iterations/:projectId'),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task)] }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('projectId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "findIterations", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get open tasks for Crowdworker to work on. The calling user must have Create permission for the Feedback,\nbecause only those users can see open tasks which have permission to create feedbacks.\nOnly those Tasks will be returned where user have not provided Feedback yet." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('open'),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task)] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "findOpenTasks", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a Task. The calling user must have Read permission the Task either explicitly or implicitly.\nExplicit Permission: E.g Given by a role e.g developer role\nImplicit Permission: The task criteria matches calling user profile, and calling user have permission to create Feedback.\nImplicit Permission: This user has created Feedback for this Task" }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get statistics for feedbacks e.g, no of each star rating answer, number of thumbs up/down, no of each radio option selections.\nThe user must have Read Permission for the Task." }),
    (0, common_1.Get)(':id/feedbackStats'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/tasks/dto/feedback-stats-response.dto.ts").FeedbackStatsResponseDto) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "feedbackStats", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Update a Task. The calling user must have Update permission the Task." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts").Task) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "update", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Delete a Task. The calling user must have Delete permission the Task." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "remove", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Images are uploaded to cloudinary.com. For uploading an image, a signature is required.\nThis endpoint returns that signature which clients can use to upload images." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id/imageUploadSignature'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/task/src/app/tasks/dto/file-upload-signature-response.dto.ts").FileUploadSignatureResponseDto) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "imageUploadSignature", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Batch create Images\nThe user must have Update permission for Task." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(':id/batchCreateImages'),
    openapi.ApiResponse({ status: 201 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, batch_create_images_dto_1.BatchCreateImagesDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "batchCreateImages", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get list of images for the Task.\nThe caller must have read permission for the Task either explicitly or either implicitly.\nExplicit Permission: E.g Given by a role e.g developer role\nImplicit Permission: The task's criteria matches calling user profile, and calling user have permission to create Feedback.\nImplicit Permission: This user has created Feedback for this Task" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'prototypeNumber',
        required: false,
        description: 'Optional filtering by prototypeNumber',
        type: 'number',
    }),
    (0, common_1.Get)(':id/images'),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/task/src/app/tasks/entities/image.entity.ts").Image)] }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Query)('prototypeNumber')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, Number]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "findAllImages", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Delete an Image for Task. The calling user must have Update permission on the Task." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id/images/:imageId'),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Param)('imageId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], TasksController.prototype, "removeImage", null);
TasksController = (0, tslib_1.__decorate)([
    (0, swagger_1.ApiTags)('tasks'),
    (0, common_1.Controller)('tasks'),
    (0, tslib_1.__metadata)("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
exports.TasksController = TasksController;


/***/ }),

/***/ "./apps/task/src/app/tasks/tasks.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const tasks_service_1 = __webpack_require__("./apps/task/src/app/tasks/tasks.service.ts");
const tasks_controller_1 = __webpack_require__("./apps/task/src/app/tasks/tasks.controller.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
const image_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/image.entity.ts");
const question_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts");
const config_1 = __webpack_require__("@nestjs/config");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
const users_module_1 = __webpack_require__("./apps/task/src/app/users/users.module.ts");
let TasksModule = class TasksModule {
};
TasksModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, image_entity_1.Image, question_entity_1.Question, project_entity_1.Project]),
            config_1.ConfigModule,
            users_module_1.UsersModule,
        ],
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService],
    })
], TasksModule);
exports.TasksModule = TasksModule;


/***/ }),

/***/ "./apps/task/src/app/tasks/tasks.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const class_transformer_1 = __webpack_require__("class-transformer");
const task_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/task.entity.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const cloudinary_1 = __webpack_require__("cloudinary");
const config_1 = __webpack_require__("@nestjs/config");
const file_upload_signature_response_dto_1 = __webpack_require__("./apps/task/src/app/tasks/dto/file-upload-signature-response.dto.ts");
const policy_1 = __webpack_require__("./apps/task/src/app/iam/policy.ts");
const utils_1 = __webpack_require__("./apps/task/src/app/iam/utils.ts");
const contextService = __webpack_require__("request-context");
const project_entity_1 = __webpack_require__("./apps/task/src/app/projects/entities/project.entity.ts");
const users_service_1 = __webpack_require__("./apps/task/src/app/users/users.service.ts");
const feedback_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/feedback.entity.ts");
const image_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/image.entity.ts");
const cloudinary_2 = __webpack_require__("./apps/task/src/app/config/cloudinary.ts");
const question_entity_1 = __webpack_require__("./apps/task/src/app/tasks/entities/question.entity.ts");
const answer_entity_1 = __webpack_require__("./apps/task/src/app/feedbacks/entities/answer.entity.ts");
const feedback_stats_response_dto_1 = __webpack_require__("./apps/task/src/app/tasks/dto/feedback-stats-response.dto.ts");
cloudinary_1.v2.config((0, cloudinary_2.default)().cloudinary.config);
let TasksService = class TasksService {
    constructor(configService, userService, taskRepository, projectRepository) {
        this.configService = configService;
        this.userService = userService;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }
    create(createTaskDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Check if Project of the Task belongs to user.
            const user = contextService.get('user');
            const project = yield this.projectRepository.findOneOrFail(createTaskDto.projectId);
            if (project.userId !== user.id) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.FORBIDDEN,
                    error: 'The project does not belongs to the user.',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            // check if there is already a draft or open Task available, the new Task cannot be created.
            const existingTask = yield this.taskRepository.findOne({
                select: ['id'],
                where: {
                    status: (0, typeorm_2.In)([task_entity_1.TaskStatus.Open, task_entity_1.TaskStatus.Draft]),
                    projectId: createTaskDto.projectId,
                },
            });
            if (existingTask) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    error: 'Please close previous Task iteration before starting a new one.',
                }, common_1.HttpStatus.PRECONDITION_FAILED);
            }
            if (createTaskDto.incentive > createTaskDto.budget) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    error: 'Incentive cannot be greater than total budget.',
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const task = taskDtoToEntity(createTaskDto);
            task.userId = user.id;
            if (createTaskDto.skills) {
                // add skills relationship
                task.skills = createTaskDto.skills.map((id) => ({ id }));
            }
            if (createTaskDto.countries) {
                // add countries relationship
                task.countries = createTaskDto.countries.map((id) => ({ id }));
            }
            return this.taskRepository.save(task);
        });
    }
    findAll(query) {
        const options = {
            relations: ['skills', 'countries'],
        };
        if (query && query.projectId) {
            // order by dateCreated to return in the order of iterations
            options.where = { projectId: query.projectId };
            options.order = { dateCreated: 'ASC' };
        }
        return this.taskRepository.find(options);
    }
    findIterations(projectId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user has read permission on the project
            yield (0, utils_1.findWithPermissionCheck)(projectId, policy_1.Action.Read, this.projectRepository);
            const tasks = yield this.taskRepository.find({
                relations: ['skills', 'countries', 'questions'],
                where: {
                    projectId,
                },
                order: {
                    dateCreated: 'DESC',
                },
            });
            tasks.forEach((task) => {
                task.questions = this.sortQuestions(task.questions);
            });
            return tasks;
        });
    }
    findOpenTasks() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // get current user from the admin service to get details for matching the criteria (Task vs User)
            const user = yield this.userService.getUser(contextService.get('user').id);
            const query = this.getTaskMatchingQuery(user);
            // filter out those tasks on which user have already provided feedback
            query.leftJoin('task.feedbacks', 'feedbacks', 'feedbacks.userId = :userId', {
                userId: user.id,
            });
            query.andWhere('feedbacks.taskId IS NULL AND task.status = :taskStatus', {
                taskStatus: task_entity_1.TaskStatus.Open,
            });
            return query.getMany();
        });
    }
    /**
     * Given a user, find the matching Tasks for it
     * @param user The user to find Tasks for
     * @private
     */
    getTaskMatchingQuery(user) {
        var _a;
        let age = null;
        if (user.birthDate) {
            const birthDate = new Date(user.birthDate);
            const now = new Date();
            age = now.getFullYear() - birthDate.getFullYear();
            const month = now.getMonth() - birthDate.getMonth();
            if (month < 0 || (month == 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
        }
        const query = this.taskRepository
            .createQueryBuilder('task')
            .innerJoinAndSelect('task.skills', 'skills', 'skills.id IN (:...skills) ', {
            skills: user.skills.map((skill) => skill.id),
        })
            .leftJoinAndSelect('task.countries', 'countries')
            .where('(task.maxExperience >= :userExperience OR task.maxExperience IS NULL) ' +
            'AND (task.minExperience <= :userExperience OR task.minExperience IS NULL) ' +
            'AND (task.maxAge >= :userAge OR task.maxAge IS NULL ) ' +
            'AND (task.minAge <= :userAge OR task.minAge IS NULL ) ' +
            'AND (countries.id = :countryId OR countries.id IS NULL)', {
            userExperience: user.experience,
            userAge: age,
            countryId: ((_a = user.country) === null || _a === void 0 ? void 0 : _a.id) || null,
        });
        return query;
    }
    findOne(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findOneOrFail(id, {
                relations: ['skills', 'countries', 'questions'],
            });
            // sort questions for the task
            task.questions = this.sortQuestions(task.questions);
            const ability = contextService.get('userAbility');
            if (ability.can(policy_1.Action.Read, task)) {
                // user have explicit permission to Read the task
                return task;
            }
            // Check if user implicitly have permission to Read the Task
            // i.e if user have permission to create Feedback for this Task
            // first fetch the user from admin service
            if (ability.can(policy_1.Action.Create, feedback_entity_1.Feedback)) {
                const user = yield this.userService.getUser(contextService.get('user').id);
                const query = this.getTaskMatchingQuery(user);
                query.andWhere('task.id = :taskId', {
                    taskId: id,
                });
                const taskMatchedCount = yield query.getCount();
                if (taskMatchedCount > 0) {
                    return task;
                }
            }
            // user have access to Task if user have provided feedback on the task
            if (yield this.hasProvidedFeedbackOnTask(id)) {
                return task;
            }
            // User does not have access to this Task
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: 'You do not have permission for this Task.',
            }, common_1.HttpStatus.FORBIDDEN);
        });
    }
    sortQuestions(questions) {
        return questions.sort((a, b) => {
            return a.order - b.order;
        });
    }
    update(id, updateTaskDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user have permission to update Task
            // a user can only update task which belongs to him (task.userId = user.id)
            const existingTask = yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Update, this.taskRepository);
            // task can only be updated if it is draft state
            this.draftCheck(existingTask);
            const task = taskDtoToEntity(updateTaskDto);
            if (updateTaskDto.skills) {
                // update skills relationship
                task.skills = updateTaskDto.skills.map((id) => ({ id }));
            }
            if (updateTaskDto.countries) {
                // update countries relationship
                task.countries = updateTaskDto.countries.map((id) => ({ id }));
            }
            task.id = id;
            // using save instead of update here to also add/remove the relationships
            yield this.taskRepository.save(task);
            if (updateTaskDto.questions) {
                const updatedTask = yield this.taskRepository.findOne(id, {
                    relations: ['questions'],
                });
                updatedTask.questions = this.sortQuestions(updatedTask.questions);
                return updatedTask;
            }
            return this.taskRepository.findOne(id);
        });
    }
    remove(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user have permission to delete Task
            // a user can only delete task which belongs to him (task.userId = user.id)
            yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Delete, this.taskRepository);
            return this.taskRepository.delete(id);
        });
    }
    activate(id) {
        var _a, _b, _c, _d, _e, _f;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user have permission to update Task
            // a user can only update/activate task which belongs to him (task.userId = user.id)
            const task = yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Update, this.taskRepository, {
                relations: ['images', 'skills', 'countries', 'questions'],
            });
            const messages = [];
            // validate task first
            if (task.status !== task_entity_1.TaskStatus.Draft) {
                messages.push('Task can only be activated when in draft state.');
            }
            if (!task.incentive || task.incentive < 0) {
                messages.push('Please set the incentive.');
            }
            if (!task.budget || task.budget < 1) {
                messages.push('Please set the budget.');
            }
            if (task.incentive > task.budget) {
                messages.push('Incentive cannot be greater than budget.');
            }
            if (task.skills.length === 0) {
                messages.push('Please provide skills for matching the Task with Crowdworkers.');
            }
            if (task.questions.length === 0) {
                messages.push('Please provide questions.');
            }
            if (this.isIframeFormat(task)) {
                if ((this.isBasicTest(task) && !task.iframeUrl1) ||
                    ((_a = task.iframeUrl1) === null || _a === void 0 ? void 0 : _a.trim()) === '') {
                    messages.push('Task cannot be activated without a prototype link.');
                }
                else if (this.isComparisonTest(task) &&
                    (!task.iframeUrl1 ||
                        !task.iframeUrl2 ||
                        ((_b = task.iframeUrl1) === null || _b === void 0 ? void 0 : _b.trim()) === '' ||
                        ((_c = task.iframeUrl2) === null || _c === void 0 ? void 0 : _c.trim()) === '')) {
                    messages.push('Please provide link for the both prototypes.');
                }
            }
            else if (this.isImageFormat(task)) {
                if (this.isBasicTest(task) && task.images.length === 0) {
                    messages.push('At-least one image is required for the basic test.');
                }
                else if (this.isComparisonTest(task)) {
                    const imageForPrototype1 = task.images.find((t) => t.prototypeNumber === 1);
                    const imageForPrototype2 = task.images.find((t) => t.prototypeNumber === 2);
                    if (!imageForPrototype1 || !imageForPrototype2) {
                        messages.push('Please provide images for both prototypes.');
                    }
                }
            }
            else if (this.isTextFormat(task)) {
                if ((this.isBasicTest(task) && !task.textualDescription1) ||
                    ((_d = task.textualDescription1) === null || _d === void 0 ? void 0 : _d.trim()) === '') {
                    messages.push('Task cannot be activated without textual description.');
                }
                else if (this.isComparisonTest(task) &&
                    (!task.textualDescription1 ||
                        ((_e = task.textualDescription1) === null || _e === void 0 ? void 0 : _e.trim()) === '' ||
                        !task.textualDescription2 ||
                        ((_f = task.textualDescription2) === null || _f === void 0 ? void 0 : _f.trim()) === '')) {
                    messages.push('Please provide textual description for both prototypes.');
                }
            }
            else {
                messages.push('The Prototype format must be set');
            }
            if (messages.length > 0) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    error: messages.join(' '),
                }, common_1.HttpStatus.PRECONDITION_FAILED);
            }
            // activate the task after validation
            task.status = task_entity_1.TaskStatus.Open;
            return this.taskRepository.save(task);
        });
    }
    isBasicTest(task) {
        return task.testType === task_entity_1.TestType.Basic;
    }
    isComparisonTest(task) {
        return task.testType === task_entity_1.TestType.Comparison;
    }
    isImageFormat(task) {
        return task.prototypeFormat === task_entity_1.PrototypeFormat.Image;
    }
    isIframeFormat(task) {
        return task.prototypeFormat === task_entity_1.PrototypeFormat.Iframe;
    }
    isTextFormat(task) {
        return task.prototypeFormat === task_entity_1.PrototypeFormat.Text;
    }
    getImageUploadSignature(id) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const cloudinaryConfig = this.configService.get('cloudinary');
        const folder = `${cloudinaryConfig.imagesFolder}/${id}`;
        const signature = cloudinary_1.v2.utils.api_sign_request({
            timestamp,
            folder,
        }, cloudinaryConfig.config.api_secret);
        return (0, class_transformer_1.plainToClass)(file_upload_signature_response_dto_1.FileUploadSignatureResponseDto, {
            apiKey: cloudinaryConfig.config.api_key,
            uploadUrl: cloudinaryConfig.apiUrl
                .replace(':cloud_name', cloudinaryConfig.config.cloud_name)
                .replace(':action', 'upload'),
            signature,
            timestamp,
            folder,
        });
    }
    batchCreateImages(taskId, batchCreateImagesDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user have permission to update Task
            // a user can only update task which belongs to him (task.userId = user.id)
            const existingTask = yield (0, utils_1.findWithPermissionCheck)(taskId, policy_1.Action.Update, this.taskRepository);
            // Images can only be added if the task is in draft state
            this.draftCheck(existingTask);
            batchCreateImagesDto.images.forEach((image) => (image.taskId = taskId));
            // insert images
            return this.taskRepository.manager.insert(image_entity_1.Image, batchCreateImagesDto.images);
        });
    }
    draftCheck(task) {
        if (task.status !== task_entity_1.TaskStatus.Draft) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.PRECONDITION_FAILED,
                error: 'Task is not in draft state.',
            }, common_1.HttpStatus.PRECONDITION_FAILED);
        }
    }
    findAllImages(taskId, prototypeNumber) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let hasPermission = false;
            // check if user have permission to Read Task
            const task = yield this.taskRepository.findOneOrFail(taskId);
            const ability = contextService.get('userAbility');
            if (ability.can(policy_1.Action.Read, task)) {
                // user have explicit permission to Read the task
                hasPermission = true;
            }
            // Check if user implicitly have permission to Read the Task
            // i.e if user have permission to create Feedback for this Task
            // first fetch the user from admin service
            if (!hasPermission && ability.can(policy_1.Action.Create, feedback_entity_1.Feedback)) {
                const user = yield this.userService.getUser(contextService.get('user').id);
                const query = this.getTaskMatchingQuery(user);
                query.andWhere('task.id = :taskId', {
                    taskId,
                });
                const taskMatchedCount = yield query.getCount();
                if (taskMatchedCount > 0) {
                    hasPermission = true;
                }
            }
            if (!hasPermission && (yield this.hasProvidedFeedbackOnTask(taskId))) {
                // user have access to Task if user have provided feedback on the task
                hasPermission = true;
            }
            if (!hasPermission) {
                // User does not have permission to read images for this Task
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.FORBIDDEN,
                    error: 'You do not have permission to access Images for this Task.',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            const where = {
                taskId,
            };
            if (prototypeNumber) {
                where['prototypeNumber'] = prototypeNumber;
            }
            const images = yield this.taskRepository.manager.find(image_entity_1.Image, {
                where,
            });
            // remove image extension to save transformations count on cloudinary.
            // images.forEach((img) => (img.url = img.url.replace(/\.[^/.]+$/, '')));
            return images;
        });
    }
    hasProvidedFeedbackOnTask(taskId) {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const feedback = yield this.taskRepository.manager.find(feedback_entity_1.Feedback, {
                where: {
                    userId: (_a = contextService.get('user')) === null || _a === void 0 ? void 0 : _a.id,
                    taskId,
                },
            });
            return feedback ? true : false;
        });
    }
    removeImage(taskId, imageId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user have permission to Update Task
            const task = yield (0, utils_1.findWithPermissionCheck)(taskId, policy_1.Action.Update, this.taskRepository);
            // check if image belongs to the taskId
            const image = yield this.taskRepository.manager.findOneOrFail(image_entity_1.Image, {
                where: {
                    id: imageId,
                    taskId,
                },
            });
            // delete image from cloud storage
            try {
                const response = yield cloudinary_1.v2.uploader.destroy(image.cloudId);
                // delete image from database
                if (response['result'] && response['result'] === 'ok') {
                    yield this.taskRepository.manager.delete(image_entity_1.Image, image.id);
                }
                else {
                    common_1.Logger.error(response);
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                        error: response.result,
                    }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                }
            }
            catch (err) {
                common_1.Logger.error(`failed deleting image from the cloudinary with public id ${image.cloudId} and imageId ${image.id} `);
                throw err;
            }
        });
    }
    close(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user have permission to close Task
            const task = yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Update, this.taskRepository);
            // validate task first
            if (task.status !== task_entity_1.TaskStatus.Open) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    error: 'Task is not Open. Only Open Task can be closed',
                }, common_1.HttpStatus.PRECONDITION_FAILED);
            }
            return this.taskRepository.update(id, {
                status: task_entity_1.TaskStatus.Closed,
            });
        });
    }
    feedbackStats(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check if user has read permission on the Task
            yield (0, utils_1.findWithPermissionCheck)(id, policy_1.Action.Read, this.taskRepository);
            const questionRepo = this.taskRepository.manager.getRepository(question_entity_1.Question);
            const records = yield questionRepo
                .createQueryBuilder('q')
                .select([
                'q.id as "questionId"',
                'q.type as "questionType"',
                'a.starRatingAnswer as "starRatingAnswer"',
                'count(a.starRatingAnswer)::int as "starRatingAnswerCount"',
                'a."radioAnswer"',
                'count(a."radioAnswer")::int as "radioAnswerCount"',
            ])
                .addSelect('COUNT(CASE WHEN a.thumbsRatingAnswer = :ratingUp THEN 1 END )::int', 'thumbsUpCount')
                .setParameter('ratingUp', answer_entity_1.ThumbsRating.Up)
                .addSelect('COUNT(CASE WHEN a.thumbsRatingAnswer = :ratingDown THEN 1 END )::int', 'thumbsDownCount')
                .setParameter('ratingDown', answer_entity_1.ThumbsRating.Down)
                .innerJoin(answer_entity_1.Answer, 'a', 'q.id = a."questionId" ' +
                'AND ( q.type = :thumbsRating OR q.type = :starRating OR q.type = :radio)' +
                'AND q.taskId = :taskId', {
                thumbsRating: question_entity_1.QuestionType.ThumbsRating,
                starRating: question_entity_1.QuestionType.StarRating,
                radio: question_entity_1.QuestionType.Radio,
                taskId: id,
            })
                .groupBy('q.id, a.starRatingAnswer, a.radioAnswer')
                .getRawMany();
            const response = new feedback_stats_response_dto_1.FeedbackStatsResponseDto();
            response.stats = records;
            return response;
        });
    }
};
TasksService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(2, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    (0, tslib_1.__param)(3, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    (0, tslib_1.__metadata)("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
exports.TasksService = TasksService;
function taskDtoToEntity(dto) {
    const data = (0, class_transformer_1.classToPlain)(dto);
    return (0, class_transformer_1.plainToClass)(task_entity_1.Task, data);
}


/***/ }),

/***/ "./apps/task/src/app/users/users.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const users_service_1 = __webpack_require__("./apps/task/src/app/users/users.service.ts");
const config_1 = __webpack_require__("@nestjs/config");
const axios_1 = __webpack_require__("@nestjs/axios");
let UsersModule = class UsersModule {
};
UsersModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        providers: [users_service_1.UsersService],
        imports: [config_1.ConfigModule, axios_1.HttpModule],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),

/***/ "./apps/task/src/app/users/users.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAuthorizationHeader = exports.UsersService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const axios_1 = __webpack_require__("@nestjs/axios");
const rxjs_1 = __webpack_require__("rxjs");
const config_1 = __webpack_require__("@nestjs/config");
const contextService = __webpack_require__("request-context");
let UsersService = class UsersService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    /**
     * Get a user from admin service
     * @param id the uuid for the user
     */
    getUser(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const adminAPI = this.configService.get('ADMIN_API');
            if (!adminAPI) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Admin service users endpoint url not found.',
                }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            try {
                const response = yield (0, rxjs_1.firstValueFrom)(this.httpService.get(`${adminAPI}/users/${id}`, {
                    headers: getAuthorizationHeader(),
                }));
                return response.data;
            }
            catch (err) {
                common_1.Logger.error(`failed to fetch user details ${err}`);
                throw new common_1.HttpException({
                    error: err === null || err === void 0 ? void 0 : err.message,
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        });
    }
};
UsersService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
function getAuthorizationHeader() {
    return {
        Authorization: contextService.get('request').header('Authorization'),
    };
}
exports.getAuthorizationHeader = getAuthorizationHeader;


/***/ }),

/***/ "@casl/ability":
/***/ ((module) => {

module.exports = require("@casl/ability");

/***/ }),

/***/ "@casl/ability/extra":
/***/ ((module) => {

module.exports = require("@casl/ability/extra");

/***/ }),

/***/ "@nestjs/axios":
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mapped-types":
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),

/***/ "@nestjs/passport":
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/swagger":
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/typeorm":
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "class-transformer":
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "cloudinary":
/***/ ((module) => {

module.exports = require("cloudinary");

/***/ }),

/***/ "passport-jwt":
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "request-context":
/***/ ((module) => {

module.exports = require("request-context");

/***/ }),

/***/ "rxjs":
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "typeorm":
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ "fs":
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const contextService = __webpack_require__("request-context");
const app_module_1 = __webpack_require__("./apps/task/src/app/app.module.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const fs = __webpack_require__("fs");
function bootstrap() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors();
        // Swagger
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Task')
            .setDescription('Task service is responsible for iterative validation of Prototypes. Tasks are created and Feedback is provided through this service.')
            .setVersion('1.0')
            .addBearerAuth({
            description: 'Authentication is done by a signed JWT',
            name: 'Authorization',
            bearerFormat: 'Bearer',
            type: 'http',
            in: 'Header',
        })
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
        // save swagger spec file
        saveSwaggerSpec(document);
        // add global validation
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            forbidUnknownValues: true,
        }));
        // wrap requests in a middleware namespace 'request'.
        // thi is done to attach data to request context e.g currently logged in user
        app.use(contextService.middleware('request'));
        const port = process.env.PORT || 3000;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    });
}
function saveSwaggerSpec(document) {
    const fileName = 'apps/task/src/swagger/swagger.json';
    try {
        fs.writeFileSync(fileName, JSON.stringify(document));
    }
    catch (error) {
        console.error('Error in saving swagger file', fileName, error);
    }
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map