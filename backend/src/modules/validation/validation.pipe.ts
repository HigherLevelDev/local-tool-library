import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppLogger } from '../logging/app.logger';

@Injectable()
export class GlobalValidationPipe implements PipeTransform<any> {
  private readonly logger = new AppLogger();

  constructor() {
    // Enable validation of all properties by default
    this.transform = this.transform.bind(this);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!value) {
      this.logger.error('Validation failed: No data provided');
      throw new BadRequestException('No data provided');
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Log the incoming data
    this.logger.debug('Validating data', 'ValidationPipe', {
      metatype: metatype.name,
      value: value
    });

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
      
      // Log the validation errors
      this.logger.error('Validation failed', {
        metatype: metatype.name,
        errors: messages,
        receivedFields: Object.keys(value),
        expectedFields: Object.getOwnPropertyNames(new metatype())
      });

      throw new BadRequestException({
        message: 'Validation failed',
        validationErrors: messages,
        details: 'Please check the validation errors for each field and correct your input'
      });
    }

    this.logger.debug('Validation successful', 'ValidationPipe', {
      metatype: metatype.name
    });

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}