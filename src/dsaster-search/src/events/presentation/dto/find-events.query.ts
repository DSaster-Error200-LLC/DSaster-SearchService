import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

export class FindEventsQuery {
  @ApiProperty({
    description:
      "Text to look for in the event name. The match is case-insensitive, ignores leading and trailing spaces, and succeeds when the event name contains the text",
    example: "rock",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
