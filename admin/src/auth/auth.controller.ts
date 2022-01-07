import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth-guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login with username and password. A JWT is returned in response which can be used to make further API calls.
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Login with a token. Token must be set as authorization header. If the request succeeds, the token is valid.
   */
  @ApiBearerAuth()
  @Post('loginWithToken')
  async loginWithToken() {}

  /**
   * This endpoint is just to enable Single Sign on with Google.
   */
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  /**
   * After signing in with Google, the Google redirects to this endpoint along with user profile details (Google id, firstName, lastName etc).
   * If the User is already available in the system (matched by its Google id, it is logged in by issuing a JWT).
   * If the User is not available in the system (matched by its Google id), it is redirected to the registration page.
   */
  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req, @Response() res) {
    return this.authService.googleLogin(req, res);
  }
}
