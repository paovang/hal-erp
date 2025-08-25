export const TRANSACTION_MANAGER_SERVICE = Symbol(
  'TRANSACTION_MANAGER_SERVICE',
);
export const PAGINATION_SERVICE = Symbol('PAGINATION_SERVICE');
export const TRANSFORM_RESULT_SERVICE = Symbol('TRANSFORM_RESULT_SERVICE');

export const LOCALIZATION_SERVICE = Symbol('LOCALIZATION_SERVICE');

export const GENERTE_CODE_SERVICE = Symbol('GENERTE_CODE_SERVICE');

export const USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY = Symbol(
  'USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY',
);
// export const USER_PROFILE_IMAGE_FOLDER = 'profile';

export const PROFILE_IMAGE_ALLOW_MIME_TYPE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
];

export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const SUPPORTED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
];

export const SUPPORTED_UPLOAD_MIME_TYPES = [
  ...SUPPORTED_IMAGE_MIME_TYPES,
  ...SUPPORTED_DOCUMENT_MIME_TYPES,
];

export const SIGNATURE_ALLOW_MIME_TYPE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];
