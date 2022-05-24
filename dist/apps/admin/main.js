/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/admin/src/app/migration sync recursive \\.ts$":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./1640532247325-skills-seed.ts": "./apps/admin/src/app/migration/1640532247325-skills-seed.ts",
	"./1640548061457-countries-seed.ts": "./apps/admin/src/app/migration/1640548061457-countries-seed.ts"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./apps/admin/src/app/migration sync recursive \\.ts$";

/***/ }),

/***/ "./apps/admin/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const skills_module_1 = __webpack_require__("./apps/admin/src/app/skills/skills.module.ts");
const typeorm_1 = __webpack_require__("typeorm");
const config_1 = __webpack_require__("@nestjs/config");
const typeorm_2 = __webpack_require__("@nestjs/typeorm");
const countries_module_1 = __webpack_require__("./apps/admin/src/app/countries/countries.module.ts");
const users_module_1 = __webpack_require__("./apps/admin/src/app/users/users.module.ts");
const core_1 = __webpack_require__("@nestjs/core");
const global_exception_filter_1 = __webpack_require__("./apps/admin/src/app/common/global-exception-filter.ts");
const auth_module_1 = __webpack_require__("./apps/admin/src/app/auth/auth.module.ts");
const jwt_auth_guard_1 = __webpack_require__("./apps/admin/src/app/auth/jwt-auth.guard.ts");
const iam_module_1 = __webpack_require__("./apps/admin/src/app/iam/iam.module.ts");
/**
 * To solve single file build artifact issue for nx, for running Typeorm migrations.
 * Solution copied from : https://github.com/typeorm/typeorm/issues/5458#issuecomment-770453233
 */
const contexts = __webpack_require__("./apps/admin/src/app/migration sync recursive \\.ts$");
const migrations = contexts.keys()
    .map(modulePath => contexts(modulePath))
    .reduce((result, migrationModule) => {
    return Object.assign(result, migrationModule);
});
let AppModule = class AppModule {
};
AppModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_2.TypeOrmModule.forRootAsync({
                useFactory: () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
                    // for production, we have a remote database
                    if (process.env.DATABASE_URL) {
                        return {
                            url: process.env.DATABASE_URL,
                            type: 'postgres',
                            synchronize: true,
                            extra: { ssl: { rejectUnauthorized: false } },
                            autoLoadEntities: true,
                            migrationsRun: true,
                            migrations: Object.values(migrations)
                        };
                    }
                    return Object.assign(yield (0, typeorm_1.getConnectionOptions)(), {
                        autoLoadEntities: true,
                        migrationsRun: true,
                        migrations: Object.values(migrations)
                    });
                }),
            }),
            skills_module_1.SkillsModule,
            countries_module_1.CountriesModule,
            auth_module_1.AuthModule,
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

/***/ "./apps/admin/src/app/auth/auth.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const local_auth_guard_1 = __webpack_require__("./apps/admin/src/app/auth/local-auth-guard.ts");
const auth_service_1 = __webpack_require__("./apps/admin/src/app/auth/auth.service.ts");
const login_dto_1 = __webpack_require__("./apps/admin/src/app/auth/dto/login.dto.ts");
const public_decorator_1 = __webpack_require__("./apps/admin/src/app/auth/public.decorator.ts");
const passport_1 = __webpack_require__("@nestjs/passport");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Login with username and password. A JWT is returned in response which can be used to make further API calls.
     */
    login(loginDto, req) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.authService.login(req.user);
        });
    }
    /**
     * Login with a token. Token must be set as authorization header. If the request succeeds, the token is valid.
     */
    loginWithToken() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { });
    }
    /**
     * This endpoint is just to enable Single Sign on with Google.
     */
    googleAuth(req) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { });
    }
    /**
     * After signing in with Google, the Google redirects to this endpoint along with user profile details (Google id, firstName, lastName etc).
     * If the User is already available in the system (matched by its Google id, it is logged in by issuing a JWT).
     * If the User is not available in the system (matched by its Google id), it is redirected to the registration page.
     */
    googleAuthRedirect(req, res) {
        return this.authService.googleLogin(req, res);
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Login with username and password. A JWT is returned in response which can be used to make further API calls." }),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__("./apps/admin/src/app/auth/dto/login-response.dto.ts").LoginResponseDto) }),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__param)(1, (0, common_1.Request)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [login_dto_1.LoginDto, Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthController.prototype, "login", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Login with a token. Token must be set as authorization header. If the request succeeds, the token is valid." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('loginWithToken'),
    openapi.ApiResponse({ status: 201 }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthController.prototype, "loginWithToken", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "This endpoint is just to enable Single Sign on with Google." }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Request)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "After signing in with Google, the Google redirects to this endpoint along with user profile details (Google id, firstName, lastName etc).\nIf the User is already available in the system (matched by its Google id, it is logged in by issuing a JWT).\nIf the User is not available in the system (matched by its Google id), it is redirected to the registration page." }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Request)()),
    (0, tslib_1.__param)(1, (0, common_1.Response)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], AuthController.prototype, "googleAuthRedirect", null);
AuthController = (0, tslib_1.__decorate)([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    (0, tslib_1.__metadata)("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;


/***/ }),

/***/ "./apps/admin/src/app/auth/auth.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./apps/admin/src/app/auth/auth.service.ts");
const users_module_1 = __webpack_require__("./apps/admin/src/app/users/users.module.ts");
const local_strategy_1 = __webpack_require__("./apps/admin/src/app/auth/local.strategy.ts");
const auth_controller_1 = __webpack_require__("./apps/admin/src/app/auth/auth.controller.ts");
const passport_1 = __webpack_require__("@nestjs/passport");
const constants_1 = __webpack_require__("./apps/admin/src/app/auth/constants.ts");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const jwt_strategy_1 = __webpack_require__("./apps/admin/src/app/auth/jwt.strategy.ts");
const google_strategy_1 = __webpack_require__("./apps/admin/src/app/auth/google.strategy.ts");
const config_1 = __webpack_require__("@nestjs/config");
let AuthModule = class AuthModule {
};
AuthModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: constants_1.jwtConstants.expiresIn },
            }),
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, google_strategy_1.GoogleStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./apps/admin/src/app/auth/auth.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const users_service_1 = __webpack_require__("./apps/admin/src/app/users/users.service.ts");
const bcrypt = __webpack_require__("bcrypt");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const config_1 = __webpack_require__("@nestjs/config");
const login_response_dto_1 = __webpack_require__("./apps/admin/src/app/auth/dto/login-response.dto.ts");
let AuthService = class AuthService {
    constructor(configService, usersService, jwtService) {
        this.configService = configService;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    validateUser(username, pass) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.usersService.findByUsername(username);
            if (user) {
                const matched = yield bcrypt.compare(pass, user.passwordHash);
                if (matched) {
                    delete user.passwordHash;
                    return user;
                }
            }
            return null;
        });
    }
    login(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const payload = {
                firstName: user.firstName,
                lastName: user.lastName,
                sub: user.id,
                roles: user.roles,
            };
            const response = new login_response_dto_1.LoginResponseDto();
            response.accessToken = this.jwtService.sign(payload);
            return response;
        });
    }
    googleLogin(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new common_1.BadRequestException();
            }
            // check if user already exist in database
            const user = yield this.usersService.findOneBy({
                where: {
                    googleId: req.user.googleId,
                },
            });
            const webAppUrl = this.configService.get('WEB_APP_URL');
            if (user) {
                // user is already registered
                const login = yield this.login(user);
                res.redirect(`${webAppUrl}/access/login?accessToken=${login.accessToken}`);
                return;
            }
            // User does not exist in the database, it needs to proceed with completing registration
            res.redirect(`${webAppUrl}/access/register?googleId=${req.user.googleId}&firstName=${req.user.firstName}&lastName=${req.user.lastName}`);
        });
    }
};
AuthService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./apps/admin/src/app/auth/constants.ts":
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: 'F767D0B3082AECF1DF9DA87302749FE958277E1B77356D6AB75398BAEAFB3A56',
    expiresIn: '60d',
};


/***/ }),

/***/ "./apps/admin/src/app/auth/dto/login-response.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginResponseDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class LoginResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { accessToken: { required: true, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], LoginResponseDto.prototype, "accessToken", void 0);
exports.LoginResponseDto = LoginResponseDto;


/***/ }),

/***/ "./apps/admin/src/app/auth/dto/login.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class LoginDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], LoginDto.prototype, "username", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;


/***/ }),

/***/ "./apps/admin/src/app/auth/google.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const passport_1 = __webpack_require__("@nestjs/passport");
const passport_google_oauth20_1 = __webpack_require__("passport-google-oauth20");
const dotenv_1 = __webpack_require__("dotenv");
const common_1 = __webpack_require__("@nestjs/common");
(0, dotenv_1.config)();
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.ADMIN_API_URL}/auth/google/redirect`,
            scope: ['email', 'profile'],
        });
    }
    validate(accessToken, refreshToken, profile, done) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { name, emails, photos } = profile;
            const user = {
                googleId: profile.id,
                firstName: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName,
                lastName: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
                accessToken,
            };
            return user;
        });
    }
};
GoogleStrategy = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], GoogleStrategy);
exports.GoogleStrategy = GoogleStrategy;


/***/ }),

/***/ "./apps/admin/src/app/auth/jwt-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const core_1 = __webpack_require__("@nestjs/core");
const public_decorator_1 = __webpack_require__("./apps/admin/src/app/auth/public.decorator.ts");
const contextService = __webpack_require__("request-context");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    /**
     * Override to return true for public routes which don't need authentication
     */
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        contextService.set('request', request);
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
};
JwtAuthGuard = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),

/***/ "./apps/admin/src/app/auth/jwt.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const passport_jwt_1 = __webpack_require__("passport-jwt");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
const constants_1 = __webpack_require__("./apps/admin/src/app/auth/constants.ts");
const contextService = __webpack_require__("request-context");
const policy_1 = __webpack_require__("./apps/admin/src/app/iam/policy.ts");
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

/***/ "./apps/admin/src/app/auth/local-auth-guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
LocalAuthGuard = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)()
], LocalAuthGuard);
exports.LocalAuthGuard = LocalAuthGuard;


/***/ }),

/***/ "./apps/admin/src/app/auth/local.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
/**
 * Based on the example and solution from nestjs documentation
 * https://docs.nestjs.com/security/authentication
 * The solution is copied and modified as per our requirement.
 */
const passport_local_1 = __webpack_require__("passport-local");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./apps/admin/src/app/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    validate(username, password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.authService.validateUser(username, password);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            return user;
        });
    }
};
LocalStrategy = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [auth_service_1.AuthService])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),

/***/ "./apps/admin/src/app/auth/public.decorator.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = __webpack_require__("@nestjs/common");
// For public routes i.e the routes which don't need authentication
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;


/***/ }),

/***/ "./apps/admin/src/app/common/global-exception-filter.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const tslib_1 = __webpack_require__("tslib");
// Based on a motivation and solution form:
// https://docs.nestjs.com/exception-filters#throwing-standard-exceptions
// https://stackoverflow.com/questions/58993405/how-can-i-handle-typeorm-error-in-nestjs
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

/***/ "./apps/admin/src/app/countries/countries.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const countries_service_1 = __webpack_require__("./apps/admin/src/app/countries/countries.service.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const public_decorator_1 = __webpack_require__("./apps/admin/src/app/auth/public.decorator.ts");
let CountriesController = class CountriesController {
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    /**
     * Get a list of all possible Countries in the System.
     */
    findAll() {
        return this.countriesService.findAll();
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of all possible Countries in the System." }),
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/admin/src/app/countries/entities/country.entity.ts").Country)] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], CountriesController.prototype, "findAll", null);
CountriesController = (0, tslib_1.__decorate)([
    (0, swagger_1.ApiTags)('countries'),
    (0, common_1.Controller)('countries'),
    (0, tslib_1.__metadata)("design:paramtypes", [countries_service_1.CountriesService])
], CountriesController);
exports.CountriesController = CountriesController;


/***/ }),

/***/ "./apps/admin/src/app/countries/countries.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const countries_service_1 = __webpack_require__("./apps/admin/src/app/countries/countries.service.ts");
const countries_controller_1 = __webpack_require__("./apps/admin/src/app/countries/countries.controller.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const country_entity_1 = __webpack_require__("./apps/admin/src/app/countries/entities/country.entity.ts");
let CountriesModule = class CountriesModule {
};
CountriesModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([country_entity_1.Country])],
        controllers: [countries_controller_1.CountriesController],
        providers: [countries_service_1.CountriesService],
    })
], CountriesModule);
exports.CountriesModule = CountriesModule;


/***/ }),

/***/ "./apps/admin/src/app/countries/countries.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const country_entity_1 = __webpack_require__("./apps/admin/src/app/countries/entities/country.entity.ts");
let CountriesService = class CountriesService {
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }
    findAll() {
        return this.countryRepository.find();
    }
};
CountriesService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeorm_2.Repository])
], CountriesService);
exports.CountriesService = CountriesService;


/***/ }),

/***/ "./apps/admin/src/app/countries/entities/country.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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

/***/ "./apps/admin/src/app/data/yaml-to-database.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.yamlToDatabase = void 0;
const tslib_1 = __webpack_require__("tslib");
const typeorm_1 = __webpack_require__("typeorm");
const yaml = __webpack_require__("js-yaml");
const fs = __webpack_require__("fs");
/**
 * Insert a yaml file into database
 * @param fileName the name of the file in src/data
 */
function yamlToDatabase(fileName) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        let records = [];
        let tableName;
        try {
            records = yaml.load(fs.readFileSync(`apps/admin/src/app/data/${fileName}`, 'utf8'));
            tableName = fileName.substring(0, fileName.indexOf('.yaml'));
        }
        catch (err) {
            console.log('error reading the yaml file', err);
        }
        if (!records || !tableName) {
            return;
        }
        const connection = (0, typeorm_1.getConnection)();
        const data = [];
        records.forEach((record) => {
            data.push(record);
        });
        if (data.length > 1) {
            yield connection
                .createQueryBuilder()
                .insert()
                .into(tableName)
                .values(data)
                .orUpdate({
                conflict_target: ['id'],
                overwrite: Object.keys(data[0]),
            })
                .execute();
        }
    });
}
exports.yamlToDatabase = yamlToDatabase;


/***/ }),

/***/ "./apps/admin/src/app/iam/iam.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IamController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const iam_service_1 = __webpack_require__("./apps/admin/src/app/iam/iam.service.ts");
const policy_1 = __webpack_require__("./apps/admin/src/app/iam/policy.ts");
class Action {
}
(0, tslib_1.__decorate)([
    (0, swagger_1.ApiProperty)({
        type: 'enum',
        enum: policy_1.Action,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], Action.prototype, "action", void 0);
let IamController = class IamController {
    constructor(iamService) {
        this.iamService = iamService;
    }
    /**
     * Get permissions of the calling user.
     */
    getPermissions() {
        return this.iamService.getPermissions();
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
    (0, swagger_1.ApiExtraModels)(Action),
    (0, common_1.Controller)('iam'),
    (0, tslib_1.__metadata)("design:paramtypes", [iam_service_1.IamService])
], IamController);
exports.IamController = IamController;


/***/ }),

/***/ "./apps/admin/src/app/iam/iam.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IamModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const iam_controller_1 = __webpack_require__("./apps/admin/src/app/iam/iam.controller.ts");
const iam_service_1 = __webpack_require__("./apps/admin/src/app/iam/iam.service.ts");
const axios_1 = __webpack_require__("@nestjs/axios");
const config_1 = __webpack_require__("@nestjs/config");
let IamModule = class IamModule {
};
IamModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, config_1.ConfigModule],
        controllers: [iam_controller_1.IamController],
        providers: [iam_service_1.IamService],
    })
], IamModule);
exports.IamModule = IamModule;


/***/ }),

/***/ "./apps/admin/src/app/iam/iam.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAuthorizationHeader = exports.IamService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const config_1 = __webpack_require__("@nestjs/config");
const rxjs_1 = __webpack_require__("rxjs");
const axios_1 = __webpack_require__("@nestjs/axios");
const contextService = __webpack_require__("request-context");
const extra_1 = __webpack_require__("@casl/ability/extra");
let IamService = class IamService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    getPermissions() {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const taskServicePermissions = yield this.getUserPermissionsFromTaskService();
            return (0, extra_1.packRules)((_a = contextService.get('userAbility')) === null || _a === void 0 ? void 0 : _a.rules, (subjectType) => {
                if (typeof subjectType === 'string') {
                    return subjectType;
                }
                return subjectType.name;
            }).concat(taskServicePermissions);
        });
    }
    /**
     * Get a user from admin service
     * @param id the uuid for the user
     */
    getUserPermissionsFromTaskService() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const taskApi = this.configService.get('TASK_API');
            if (!taskApi) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Task service url not found.',
                }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            try {
                const response = yield (0, rxjs_1.firstValueFrom)(this.httpService.get(`${taskApi}/iam/getPermissions`, {
                    headers: getAuthorizationHeader(),
                }));
                return response.data;
            }
            catch (err) {
                common_1.Logger.error(`failed to permissions from Task service ${err}`);
                throw new common_1.HttpException({
                    error: err === null || err === void 0 ? void 0 : err.message,
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        });
    }
};
IamService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], IamService);
exports.IamService = IamService;
function getAuthorizationHeader() {
    return {
        Authorization: contextService.get('request').header('Authorization'),
    };
}
exports.getAuthorizationHeader = getAuthorizationHeader;


/***/ }),

/***/ "./apps/admin/src/app/iam/policy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defineAbilityFor = exports.AppAbility = exports.Action = void 0;
const ability_1 = __webpack_require__("@casl/ability");
const user_entity_1 = __webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts");
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
        can([Action.Update, Action.Read], user_entity_1.User, { id: user.id });
    },
    crowdworker(user, { can }) {
        can([Action.Update, Action.Read], user_entity_1.User, { id: user.id });
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

/***/ "./apps/admin/src/app/migration/1640532247325-skills-seed.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.skillsSeed1640532247325 = void 0;
const tslib_1 = __webpack_require__("tslib");
const yaml_to_database_1 = __webpack_require__("./apps/admin/src/app/data/yaml-to-database.ts");
class skillsSeed1640532247325 {
    up(queryRunner) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return (0, yaml_to_database_1.yamlToDatabase)('skill.yaml');
        });
    }
    down(queryRunner) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            console.log('reverting of migration not implemented');
        });
    }
}
exports.skillsSeed1640532247325 = skillsSeed1640532247325;


/***/ }),

/***/ "./apps/admin/src/app/migration/1640548061457-countries-seed.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.countrySeed1640548061457 = void 0;
const tslib_1 = __webpack_require__("tslib");
const yaml_to_database_1 = __webpack_require__("./apps/admin/src/app/data/yaml-to-database.ts");
class countrySeed1640548061457 {
    up(queryRunner) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return (0, yaml_to_database_1.yamlToDatabase)('country.yaml');
        });
    }
    down(queryRunner) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            console.log('reverting of migration not implemented');
        });
    }
}
exports.countrySeed1640548061457 = countrySeed1640548061457;


/***/ }),

/***/ "./apps/admin/src/app/skills/entities/skill.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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

/***/ "./apps/admin/src/app/skills/skills.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkillsController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const skills_service_1 = __webpack_require__("./apps/admin/src/app/skills/skills.service.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const public_decorator_1 = __webpack_require__("./apps/admin/src/app/auth/public.decorator.ts");
let SkillsController = class SkillsController {
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    /**
     * Get a list of all possible skills in the System.
     */
    findAll() {
        return this.skillsService.findAll();
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a list of all possible skills in the System." }),
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/admin/src/app/skills/entities/skill.entity.ts").Skill)] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], SkillsController.prototype, "findAll", null);
SkillsController = (0, tslib_1.__decorate)([
    (0, swagger_1.ApiTags)('skills'),
    (0, common_1.Controller)('skills'),
    (0, tslib_1.__metadata)("design:paramtypes", [skills_service_1.SkillsService])
], SkillsController);
exports.SkillsController = SkillsController;


/***/ }),

/***/ "./apps/admin/src/app/skills/skills.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkillsModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const skills_service_1 = __webpack_require__("./apps/admin/src/app/skills/skills.service.ts");
const skills_controller_1 = __webpack_require__("./apps/admin/src/app/skills/skills.controller.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const skill_entity_1 = __webpack_require__("./apps/admin/src/app/skills/entities/skill.entity.ts");
let SkillsModule = class SkillsModule {
};
SkillsModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([skill_entity_1.Skill])],
        controllers: [skills_controller_1.SkillsController],
        providers: [skills_service_1.SkillsService],
    })
], SkillsModule);
exports.SkillsModule = SkillsModule;


/***/ }),

/***/ "./apps/admin/src/app/skills/skills.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkillsService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const skill_entity_1 = __webpack_require__("./apps/admin/src/app/skills/entities/skill.entity.ts");
let SkillsService = class SkillsService {
    constructor(skillRepository) {
        this.skillRepository = skillRepository;
        // temporarily return just these skills for evaluation
        this.whitelistskills = [
            'afe60a49-92f7-4ae8-9c69-0035ac4c2b6e',
            '1fe74128-2d68-4414-b9b9-c7fdf5189267',
            'a00b0213-30e7-4ee2-b14c-7e5c889d9e0b',
            'd5795f2c-5369-4b67-9513-372cd53af0e6',
            '634dce96-8c20-4642-b56e-8225c34ead3b',
        ];
    }
    findAll() {
        return this.skillRepository.find({
            where: {
                id: (0, typeorm_2.In)(this.whitelistskills),
            },
        });
    }
};
SkillsService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeorm_2.Repository])
], SkillsService);
exports.SkillsService = SkillsService;


/***/ }),

/***/ "./apps/admin/src/app/users/dto/batch-get-user-info.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BatchGetUserInfoDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class BatchGetUserInfoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { ids: { required: true, type: () => [String] } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Array)
], BatchGetUserInfoDto.prototype, "ids", void 0);
exports.BatchGetUserInfoDto = BatchGetUserInfoDto;


/***/ }),

/***/ "./apps/admin/src/app/users/dto/create-user.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
const user_entity_1 = __webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts");
/**
 * Password regex rules:
 * at-least one digit
 * at-lest one lower and upper case character
 * At-least 8 characters
 */
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{8,}$/;
const PASSWORD_REGX_MSG = 'Password should be at-least 8 characters long, must contain one lower case and one upper case letter, and one digit.';
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, username: { required: true, type: () => String }, password: { required: true, type: () => String }, birthDate: { required: false, type: () => Date }, gender: { required: false, enum: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").Gender) }, experience: { required: false, type: () => Number, minimum: 0 }, roles: { required: true, enum: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").Role), isArray: true }, country: { required: false, type: () => String }, skills: { required: true, type: () => [String] } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "username", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(PASSWORD_REGEX, { message: PASSWORD_REGX_MSG }),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "password", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", Date)
], CreateUserDto.prototype, "birthDate", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsEnum)(user_entity_1.Gender),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "gender", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, tslib_1.__metadata)("design:type", Number)
], CreateUserDto.prototype, "experience", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(user_entity_1.Role, { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Array)
], CreateUserDto.prototype, "roles", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "country", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", Array)
], CreateUserDto.prototype, "skills", void 0);
exports.CreateUserDto = CreateUserDto;


/***/ }),

/***/ "./apps/admin/src/app/users/dto/create-with-sso.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateWithSSODto = exports.SSOProvider = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const create_user_dto_1 = __webpack_require__("./apps/admin/src/app/users/dto/create-user.dto.ts");
const class_validator_1 = __webpack_require__("class-validator");
var SSOProvider;
(function (SSOProvider) {
    SSOProvider["Google"] = "google";
    SSOProvider["Apple"] = "apple";
})(SSOProvider = exports.SSOProvider || (exports.SSOProvider = {}));
class CreateWithSSODto extends (0, swagger_1.OmitType)(create_user_dto_1.CreateUserDto, [
    'username',
    'password',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return { ssoProfileId: { required: true, type: () => String }, ssoProvider: { required: true, enum: (__webpack_require__("./apps/admin/src/app/users/dto/create-with-sso.dto.ts").SSOProvider) } };
    }
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateWithSSODto.prototype, "ssoProfileId", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsEnum)(SSOProvider),
    (0, class_validator_1.IsNotEmpty)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateWithSSODto.prototype, "ssoProvider", void 0);
exports.CreateWithSSODto = CreateWithSSODto;


/***/ }),

/***/ "./apps/admin/src/app/users/dto/update-user.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const openapi = __webpack_require__("@nestjs/swagger");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const create_user_dto_1 = __webpack_require__("./apps/admin/src/app/users/dto/create-user.dto.ts");
class UpdateUserDto extends (0, swagger_1.PartialType)(create_user_dto_1.CreateUserDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateUserDto = UpdateUserDto;


/***/ }),

/***/ "./apps/admin/src/app/users/entities/user.entity.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = exports.Gender = exports.Role = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const typeorm_1 = __webpack_require__("typeorm");
const skill_entity_1 = __webpack_require__("./apps/admin/src/app/skills/entities/skill.entity.ts");
const country_entity_1 = __webpack_require__("./apps/admin/src/app/countries/entities/country.entity.ts");
const class_validator_1 = __webpack_require__("class-validator");
const class_transformer_1 = __webpack_require__("class-transformer");
const swagger_1 = __webpack_require__("@nestjs/swagger");
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["Developer"] = "developer";
    Role["Crowdworker"] = "crowdworker";
})(Role = exports.Role || (exports.Role = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
})(Gender = exports.Gender || (exports.Gender = {}));
let User = class User {
    constructor(init) {
        Object.assign(this, init);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, googleId: { required: true, type: () => String }, dateCreated: { required: true, type: () => Date }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, username: { required: true, type: () => String }, passwordHash: { required: true, type: () => String }, birthDate: { required: true, type: () => Date }, gender: { required: true, enum: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").Gender) }, experience: { required: true, type: () => Number, minimum: 0 }, roles: { required: true, enum: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").Role), isArray: true }, country: { required: true, type: () => (__webpack_require__("./apps/admin/src/app/countries/entities/country.entity.ts").Country) }, skills: { required: true, type: () => [(__webpack_require__("./apps/admin/src/app/skills/entities/skill.entity.ts").Skill)] } };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "googleId", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    (0, tslib_1.__metadata)("design:type", Date)
], User.prototype, "dateCreated", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "firstName", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)(),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "lastName", void 0);
(0, tslib_1.__decorate)([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "username", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    (0, class_transformer_1.Exclude)(),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "passwordHash", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, tslib_1.__metadata)("design:type", Date)
], User.prototype, "birthDate", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({ type: 'enum', enum: Gender, nullable: true }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "gender", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.Min)(0),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, tslib_1.__metadata)("design:type", Number)
], User.prototype, "experience", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Role,
        array: true,
    }),
    (0, tslib_1.__metadata)("design:type", Array)
], User.prototype, "roles", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, { eager: true }),
    (0, tslib_1.__metadata)("design:type", country_entity_1.Country)
], User.prototype, "country", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)(),
    (0, tslib_1.__metadata)("design:type", Array)
], User.prototype, "skills", void 0);
User = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)(),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], User);
exports.User = User;


/***/ }),

/***/ "./apps/admin/src/app/users/users.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__("tslib");
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const users_service_1 = __webpack_require__("./apps/admin/src/app/users/users.service.ts");
const create_user_dto_1 = __webpack_require__("./apps/admin/src/app/users/dto/create-user.dto.ts");
const update_user_dto_1 = __webpack_require__("./apps/admin/src/app/users/dto/update-user.dto.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const public_decorator_1 = __webpack_require__("./apps/admin/src/app/auth/public.decorator.ts");
const policy_1 = __webpack_require__("./apps/admin/src/app/iam/policy.ts");
const ability_1 = __webpack_require__("@casl/ability");
const contextService = __webpack_require__("request-context");
const user_entity_1 = __webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts");
const create_with_sso_dto_1 = __webpack_require__("./apps/admin/src/app/users/dto/create-with-sso.dto.ts");
const batch_get_user_info_dto_1 = __webpack_require__("./apps/admin/src/app/users/dto/batch-get-user-info.dto.ts");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    /**
     * Create a new user with username and password.
     */
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    /**
     * Create a new user with single sign on provider profile id. In this case username and password is not required.
     */
    createWithSSO(createWithSSODto) {
        return this.usersService.createWithSSO(createWithSSODto);
    }
    /**
     * Get all the Users in the System. The calling user must have Read permission for all Users.
     */
    findAll() {
        // check permissions first
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, new user_entity_1.User()); // if user can read empty user, it can read any user
        return this.usersService.findAll();
    }
    /**
     * Get a User by ID. The calling user must have Read permission for the User.
     */
    findOne(id) {
        // check permissions
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, new user_entity_1.User({ id }));
        return this.usersService.findOne(id);
    }
    /**
     * Batch get User info e.g name.
     * The calling user must have Read permission for the Users.
     */
    batchGetInfo(batchGetUserInfo) {
        // check permissions
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Read, user_entity_1.User);
        return this.usersService.batchGetInfo(batchGetUserInfo);
    }
    /**
     * Update a user. The calling user must have Update permission for the User.
     */
    update(id, updateUserDto) {
        // check permissions
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Update, new user_entity_1.User({ id }));
        return this.usersService.update(id, updateUserDto);
    }
    /**
     * Delete a user. The calling user must have Delete permission for the User.
     */
    remove(id) {
        // check permissions
        ability_1.ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(policy_1.Action.Delete, new user_entity_1.User({ id }));
        return this.usersService.remove(id);
    }
};
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Create a new user with username and password." }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").User) }),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], UsersController.prototype, "create", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Create a new user with single sign on provider profile id. In this case username and password is not required." }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('createWithSSO'),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").User) }),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [create_with_sso_dto_1.CreateWithSSODto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], UsersController.prototype, "createWithSSO", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get all the Users in the System. The calling user must have Read permission for all Users." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").User)] }),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Get a User by ID. The calling user must have Read permission for the User." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").User) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Batch get User info e.g name.\nThe calling user must have Read permission for the Users." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('batchGetInfo'),
    openapi.ApiResponse({ status: 201, type: [(__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").User)] }),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [batch_get_user_info_dto_1.BatchGetUserInfoDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], UsersController.prototype, "batchGetInfo", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Update a user. The calling user must have Update permission for the User." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts").User) }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], UsersController.prototype, "update", null);
(0, tslib_1.__decorate)([
    openapi.ApiOperation({ description: "Delete a user. The calling user must have Delete permission for the User." }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], UsersController.prototype, "remove", null);
UsersController = (0, tslib_1.__decorate)([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, tslib_1.__metadata)("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;


/***/ }),

/***/ "./apps/admin/src/app/users/users.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const users_service_1 = __webpack_require__("./apps/admin/src/app/users/users.service.ts");
const users_controller_1 = __webpack_require__("./apps/admin/src/app/users/users.controller.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const user_entity_1 = __webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts");
let UsersModule = class UsersModule {
};
UsersModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),

/***/ "./apps/admin/src/app/users/users.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const class_transformer_1 = __webpack_require__("class-transformer");
const user_entity_1 = __webpack_require__("./apps/admin/src/app/users/entities/user.entity.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const bcrypt = __webpack_require__("bcrypt");
const create_with_sso_dto_1 = __webpack_require__("./apps/admin/src/app/users/dto/create-with-sso.dto.ts");
const contextService = __webpack_require__("request-context");
const policy_1 = __webpack_require__("./apps/admin/src/app/iam/policy.ts");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    create(createUserDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = userDtoToEntity(createUserDto);
            // Check if username is available
            const existingUser = yield this.userRepository.findOne({
                select: ['id'],
                where: { username: user.username },
            });
            if (existingUser) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    error: 'This username is not available. Please select a different one.',
                }, common_1.HttpStatus.PRECONDITION_FAILED);
            }
            if (createUserDto.skills) {
                // add skills relationship
                user.skills = createUserDto.skills.map((id) => ({ id }));
            }
            if (createUserDto.country) {
                // add country relationship
                user.country = { id: createUserDto.country };
            }
            // hash password
            user.passwordHash = yield bcrypt.hash(createUserDto.password, yield bcrypt.genSalt());
            const savedUser = yield this.userRepository.save(user);
            // re-retrieve the user here so that password is removed from savedUser which was added to it when converting dto to entity
            return this.userRepository.findOne(savedUser.id);
        });
    }
    createWithSSO(createWithSSODto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = userDtoToEntity(createWithSSODto);
            if (createWithSSODto.skills) {
                // add skills relationship
                user.skills = createWithSSODto.skills.map((id) => ({ id }));
            }
            if (createWithSSODto.country) {
                // add country relationship
                user.country = { id: createWithSSODto.country };
            }
            if (createWithSSODto.ssoProvider === create_with_sso_dto_1.SSOProvider.Google) {
                user.googleId = createWithSSODto.ssoProfileId;
            }
            const savedUser = yield this.userRepository.save(user);
            return this.userRepository.findOne(savedUser.id);
        });
    }
    findAll() {
        return this.userRepository.find();
    }
    findOne(id) {
        return this.userRepository.findOneOrFail(id);
    }
    findByUsername(username) {
        return this.userRepository.findOne({
            where: {
                username,
            },
        });
    }
    findOneBy(options) {
        return this.userRepository.findOne(options);
    }
    update(id, updateUserDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // first check if the record exist in database because we use .save here and
            // save will create new if it not exists, but we don't want to create new here
            // as this is an update call.
            yield this.userRepository.findOneOrFail(id, {
                select: ['id'],
            });
            const user = userDtoToEntity(updateUserDto);
            if (updateUserDto.skills) {
                // update skills relationship
                user.skills = updateUserDto.skills.map((id) => ({ id }));
            }
            if (updateUserDto.country) {
                // update country relationship
                user.country = { id: updateUserDto.country };
            }
            if (updateUserDto.password) {
                // hash password
                user.passwordHash = yield bcrypt.hash(updateUserDto.password, yield bcrypt.genSalt());
            }
            // using save instead of update here to also add/remove the relationships
            user.id = id;
            yield this.userRepository.save(user);
            return this.userRepository.findOne(id);
        });
    }
    remove(id) {
        return this.userRepository.delete(id);
    }
    batchGetInfo(batchGetUserInfo) {
        const cols = ['id', 'firstName', 'lastName'];
        const ability = contextService.get('userAbility');
        if (ability.can(policy_1.Action.Manage, new user_entity_1.User())) {
            cols.push('username');
        }
        return this.userRepository.findByIds(batchGetUserInfo.ids, {
            select: cols,
            loadEagerRelations: false,
        });
    }
};
UsersService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
function userDtoToEntity(dto) {
    const data = (0, class_transformer_1.classToPlain)(dto);
    return (0, class_transformer_1.plainToClass)(user_entity_1.User, data);
}


/***/ }),

/***/ "@casl/ability":
/***/ ((module) => {

"use strict";
module.exports = require("@casl/ability");

/***/ }),

/***/ "@casl/ability/extra":
/***/ ((module) => {

"use strict";
module.exports = require("@casl/ability/extra");

/***/ }),

/***/ "@nestjs/axios":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/swagger":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/typeorm":
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "bcrypt":
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),

/***/ "dotenv":
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "js-yaml":
/***/ ((module) => {

"use strict";
module.exports = require("js-yaml");

/***/ }),

/***/ "passport-google-oauth20":
/***/ ((module) => {

"use strict";
module.exports = require("passport-google-oauth20");

/***/ }),

/***/ "passport-jwt":
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/***/ ((module) => {

"use strict";
module.exports = require("passport-local");

/***/ }),

/***/ "request-context":
/***/ ((module) => {

"use strict";
module.exports = require("request-context");

/***/ }),

/***/ "rxjs":
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

"use strict";
module.exports = require("tslib");

/***/ }),

/***/ "typeorm":
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");

/***/ }),

/***/ "fs":
/***/ ((module) => {

"use strict";
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const app_module_1 = __webpack_require__("./apps/admin/src/app/app.module.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const fs = __webpack_require__("fs");
const common_2 = __webpack_require__("@nestjs/common");
const contextService = __webpack_require__("request-context");
function bootstrap() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors();
        // Swagger
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Admin')
            .setDescription('Admin service is responsible for User management and authentication. Also it provides static data i.e list of Skills and Countries ')
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
        app.useGlobalPipes(new common_2.ValidationPipe({
            transform: true,
            forbidUnknownValues: true,
        }));
        // wrap requests in a middleware namespace 'request'.
        // thi is done to attach data to request context e.g currently logged in user
        app.use(contextService.middleware('request'));
        const port = process.env.PORT || 3001;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    });
}
function saveSwaggerSpec(document) {
    const fileName = 'apps/admin/src/swagger/swagger.json';
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