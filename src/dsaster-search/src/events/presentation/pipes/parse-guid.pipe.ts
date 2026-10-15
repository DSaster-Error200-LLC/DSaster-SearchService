import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseGuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!/^[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(value)) {
      throw new BadRequestException("Validation failed (GUID is expected)");
    }

    return value;
  }
}
