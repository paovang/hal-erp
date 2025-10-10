import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestDataAccessMapper } from '@src/modules/reports/infrastructure/mappers/report-purchase-request.mapper';
import { ReportPurchaseRequestDataMapper } from '../../mappers/report-purchase-request.mpper';
import { ReportPurchaseRequestItemDataMapper } from '../../mappers/report-purchase-request-item.mapper';
import { ReportPurchaseRequestItemDataAccessMapper } from '@src/modules/reports/infrastructure/mappers/report-purchase-request-item.mapper';
import { DocumentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document.mapper';
import { DepartmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department.mapper';
import { UserDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user.mapper';
import { PositionDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/position.mapper';
import { DocumentTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-type.mapper';
import { RoleDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/role.mapper';
import { PermissionDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/permission.mapper';
import { UserTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-type.mapper';
import { UserSignatureDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-signature.mapper';
import { DocumentDataMapper } from '@src/modules/manage/application/mappers/document.mapper';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';
import { UserDataMapper } from '@src/modules/manage/application/mappers/user.mapper';
import { PositionDataMapper } from '@src/modules/manage/application/mappers/position.mapper';
import { RoleDataMapper } from '@src/modules/manage/application/mappers/role.mapper';
import { UserTypeDataMapper } from '@src/modules/manage/application/mappers/user-type.mapper';
import { UserSignatureDataMapper } from '@src/modules/manage/application/mappers/user-signature.mapper';
import { DocumentTypeDataMapper } from '@src/modules/manage/application/mappers/document-type.mapper';
import { PermissionDataMapper } from '@src/modules/manage/application/mappers/permission.mapper';
import { UnitDataMapper } from '@src/modules/manage/application/mappers/unit.mapper';
import { UnitDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/unit.mapper';
import { UserApprovalDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval.mapper';
import { UserApprovalStepDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval-step.mapper';
import { DocumentStatusDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-status.mapper';
import { DocumentApproverDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-approver.mapper';

export const ReportPurchaseRequestMapperProviders: Provider[] = [
  ReportPurchaseRequestDataAccessMapper,
  ReportPurchaseRequestDataMapper,
  ReportPurchaseRequestItemDataMapper,
  ReportPurchaseRequestItemDataAccessMapper,
  DocumentDataAccessMapper,
  DepartmentDataAccessMapper,
  UserDataAccessMapper,
  PositionDataAccessMapper,
  DocumentTypeDataAccessMapper,
  RoleDataAccessMapper,
  PermissionDataAccessMapper,
  UserTypeDataAccessMapper,
  UserSignatureDataAccessMapper,
  DocumentDataMapper,
  DepartmentDataMapper,
  UserDataMapper,
  PositionDataMapper,
  DocumentTypeDataMapper,
  RoleDataMapper,
  PermissionDataMapper,
  UserTypeDataMapper,
  UserSignatureDataMapper,
  UnitDataMapper,
  UnitDataAccessMapper,
  UserApprovalDataAccessMapper,
  UserApprovalStepDataAccessMapper,
  DocumentStatusDataAccessMapper,
  DocumentApproverDataAccessMapper,
];
