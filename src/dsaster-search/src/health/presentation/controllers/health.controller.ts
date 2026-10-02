import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { HealthStatusResponse } from "@app/health/presentation/dto/health-status.response.js";

@Controller("health")
@ApiTags("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiOkResponse({
    type: HealthStatusResponse,
    description: "Service is healthy",
  })
  check(): HealthStatusResponse {
    return { status: "ok" };
  }
}
