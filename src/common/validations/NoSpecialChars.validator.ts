import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class NoSpecialCharsConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
      if (typeof value !== 'string') return false;
  
      // Allow only letters, numbers, dash, and underscore
      const validPattern = /^[A-Za-z0-9_-]+$/;
      return validPattern.test(value);
    }
  
    defaultMessage(): string {
      return 'Code must not contain special characters like & * $ # ( ) @ ! ~ + etc.';
    }
  }
  
  export function NoSpecialChars(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [],
        validator: NoSpecialCharsConstraint,
      });
    };
  }
  