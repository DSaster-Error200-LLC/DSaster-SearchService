import { Test, TestingModule } from "@nestjs/testing";

import { EventsModule } from "@app/events/events.module.js";
import {
  event,
  eventId,
  eventPreview,
  registerEventInput,
} from "@test/fixtures/event.fixtures.js";
import { EventsController } from "./events.controller.js";

describe("EventsController", () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventsModule],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it("returns the full registered event", async () => {
    expect(await controller.register(eventId, registerEventInput)).toEqual(
      event,
    );
  });

  it("finds registered events as previews", async () => {
    await controller.register(eventId, registerEventInput);

    expect(await controller.find({ name: "rock" })).toEqual([eventPreview]);
  });

  it("returns the full event by id", async () => {
    await controller.register(eventId, registerEventInput);

    expect(await controller.getDetails(eventId)).toEqual(event);
  });
});
