import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsMulterFileConstraint implements ValidatorConstraintInterface {
  validate(file: any, args: ValidationArguments): boolean {
    return (
      file &&
      typeof file === 'object' &&
      'fieldname' in file &&
      'originalname' in file &&
      'mimetype' in file
    );
  }

  defaultMessage(args: ValidationArguments): string {
    const { property } = args;
    return `${property} has Invalid file`;
  }
}
export function IsMulterFile(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMulterFileConstraint,
    });
  };
}
