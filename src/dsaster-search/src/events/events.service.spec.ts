import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EventsService, RegisterEventRequest } from "./events.service.js";

const id = "0b6f8f5e-6c1d-4a51-9a53-2f8f4f0d1c11";

const request: RegisterEventRequest = {
  name: "Rock Concert",
  artist: "The Example Band",
  date: new Date("2026-10-10T20:00:00Z"),
  venue: { name: "Central Arena", location: "Madrid" },
};

describe("EventsService", () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it("returns no events when nothing is registered", () => {
    expect(service.find({ name: "rock" })).toEqual([]);
  });

  it("reflects registered events in search results", () => {
    const event = service.register(id, request);

    expect(event).toEqual({ id, ...request });
    expect(service.find({ name: " rock " })).toEqual([event]);
    expect(service.find({ name: "jazz" })).toEqual([]);
  });

  it("rejects registering the same id twice", () => {
    service.register(id, request);

    expect(() => service.register(id, request)).toThrow(ConflictException);
  });
});
