import { SetMetadata } from "@nestjs/common";

export enum  Role {
    user = "User",
    admin = "Admin",
    guest = "Guest"
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)