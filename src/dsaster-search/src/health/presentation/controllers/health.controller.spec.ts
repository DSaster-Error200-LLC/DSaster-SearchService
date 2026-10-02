import { Test, TestingModule } from "@nestjs/testing";

import { HealthModule } from "@app/health/health.module.js";
import { HealthController } from "./health.controller.js";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("returns ok status", () => {
    expect(controller.check()).toEqual({ status: "ok" });
  });
});
