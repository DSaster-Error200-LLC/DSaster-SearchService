import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({ name: "HealthStatus" })
export class HealthStatusResponse {
  @ApiProperty({ example: "ok" })
  status: "ok";
}
