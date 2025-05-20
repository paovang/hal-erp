import { DepartmentApproverOrmEntity } from "./typeorm/department-approver.orm";
import { DepartmentUserOrmEntity } from "./typeorm/department-user.orm";
import { DepartmentOrmEntity } from "./typeorm/department.orm";
import { DocumentTypeOrmEntity } from "./typeorm/document-type.orm";
import { PermissionGroupOrmEntity } from "./typeorm/permission-group.orm";
import { PermissionOrmEntity } from "./typeorm/permission.orm";
import { PositionOrmEntity } from "./typeorm/position.orm";
import { RoleOrmEntity } from "./typeorm/role.orm";
import { SeederLogOrmEntity } from "./typeorm/seeder-log.orm";
import { UnitOrmEntity } from "./typeorm/unit.orm";
import { UserOrmEntity } from "./typeorm/user.orm";

export const models = [
    DepartmentOrmEntity, 
    SeederLogOrmEntity, 
    DocumentTypeOrmEntity, 
    UnitOrmEntity, 
    DepartmentUserOrmEntity, 
    PositionOrmEntity,
    UserOrmEntity,
    DepartmentApproverOrmEntity,
    RoleOrmEntity,
    PermissionOrmEntity,
    PermissionGroupOrmEntity
];