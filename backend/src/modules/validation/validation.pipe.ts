import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GlobalValidationPipe implements PipeTransform<any> {
  constructor() {
    // Enable validation of all properties by default
    this.transform = this.transform.bind(this);
  }
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data provided');
    }
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map(error => {
        const constraints = Object.values(error.constraints || {});
        return {
          field: error.property,
          value: error.value,
          constraints: constraints,
          message: constraints.join(', ')
        };
      });
      
      throw new BadRequestException({
        message: 'Validation failed',
        validationErrors: messages,
        details: 'Please check the validation errors for each field and correct your input'
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}