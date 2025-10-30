import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom decorator to check if a property's value is equal to the value
 * of another property on the same object (e.g., 'confirmPassword' must
 * equal 'password').
 *
 * @param property The name of the property to compare against (e.g., 'password').
 * @param validationOptions Optional validation configuration.
 */
export function IsEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Get the value of the property we are comparing against (e.g., 'password')
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // Check if the current value (confirmPassword) equals the related value (password)
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match ${args.constraints[0]}`;
        },
      },
    });
  };
}
