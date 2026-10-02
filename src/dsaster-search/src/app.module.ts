import { Module } from "@nestjs/common";
import { EventsModule } from "./events/events.module.js";
import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [EventsModule, HealthModule],
})
export class AppModule {}
