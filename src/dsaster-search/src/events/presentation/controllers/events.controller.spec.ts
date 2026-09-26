import { Test, TestingModule } from "@nestjs/testing";

import { EventsModule } from "@app/events/events.module.js";
import { RegisterEventRequest } from "@app/events/presentation/dto/register-event.request.js";
import { EventsController } from "./events.controller.js";

const id = "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11";

const body: RegisterEventRequest = {
  name: "Rock Concert",
  artist: "The Example Band",
  date: new Date("2026-10-10T20:00:00Z"),
  venue: { name: "Central Arena", location: "Madrid" },
};

describe("EventsController", () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventsModule],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it("returns the full registered event", async () => {
    expect(await controller.register(id, body)).toEqual({ id, ...body });
  });

  it("finds registered events as previews", async () => {
    await controller.register(id, body);

    expect(await controller.find({ name: "rock" })).toEqual([
      {
        id,
        name: body.name,
        artist: body.artist,
        date: body.date,
        venueName: body.venue.name,
      },
    ]);
  });

  it("returns the full event by id", async () => {
    await controller.register(id, body);

    expect(await controller.getDetails(id)).toEqual({ id, ...body });
  });
});
