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
  // Images
  'image/png',
  'image/jpg',
  'image/jpeg',
  // PDF
  'application/pdf',
  // Word documents
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Excel documents
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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

/**
 * Image formats sharp must not re-encode: SVG is a vector format and would be
 * rasterised, animated GIF would lose its frames.
 */
export const NON_RASTER_IMAGE_MIME_TYPES = ['image/svg+xml', 'image/gif'];

/**
 * Largest width/height (in pixels) kept when optimizing an uploaded image.
 * Images below this stay at their original size — never upscaled.
 */
export const MAX_IMAGE_DIMENSION = 2000;

export const SIGNATURE_ALLOW_MIME_TYPE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

// approval workflow email approval
export const APPROVAL_TOKEN_JWT_SERVICE = Symbol('APPROVAL_TOKEN_JWT_SERVICE');

// reset password
export const RESET_PASSWORD_TOKEN_JWT_SERVICE = Symbol(
  'RESET_PASSWORD_TOKEN_JWT_SERVICE',
);
export const SEND_RESET_PASSWORD_EMAIL_USE_CASE = Symbol(
  'SEND_RESET_PASSWORD_EMAIL_USE_CASE',
);
