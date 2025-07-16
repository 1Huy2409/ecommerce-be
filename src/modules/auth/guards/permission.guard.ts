import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { PERMISSION_KEY } from 'src/core/decorators/permission.decorator';
import { Reflector } from '@nestjs/core';
import { User } from 'src/database/entities/user.entity';
import { permission } from 'process';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest()
        const user: User = request.user
        if (!user || !user.role || !user.role.permissions) {
            throw new ForbiddenException("You dont have permission to access this service")
        }
        const userPermission = user.role.permissions.map(p => p.name)

        const hasAllPermission = requiredPermissions.every(permission => userPermission.includes(permission))
        if (!hasAllPermission) {
            throw new ForbiddenException("You dont have permission to access this service")
        }
        return true;
    }
}