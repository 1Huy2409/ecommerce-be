
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = "roleskeyyyyy"
export const Public = (...roles: string[]) => SetMetadata(ROLE_KEY, roles);
