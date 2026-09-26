import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class RegisterVenueRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;
}

export class RegisterEventRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artist: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ type: RegisterVenueRequest })
  @Type(() => RegisterVenueRequest)
  @ValidateNested()
  venue: RegisterVenueRequest;
}
