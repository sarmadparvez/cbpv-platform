import { SetMetadata } from '@nestjs/common';

// For public routes i.e the routes which don't need authentication

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
