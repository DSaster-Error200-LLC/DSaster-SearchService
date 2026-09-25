import { ConflictException, NotFoundException } from "@nestjs/common";
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

  it("returns registered events from register", () => {
    expect(service.register(id, request)).toEqual({ id, ...request });
  });

  it("finds registered events as previews with only the venue name", () => {
    service.register(id, request);

    expect(service.find({ name: " rock " })).toEqual([
      {
        id,
        name: request.name,
        artist: request.artist,
        date: request.date,
        venueName: request.venue.name,
      },
    ]);
  });

  it("returns no previews when the name does not match", () => {
    service.register(id, request);

    expect(service.find({ name: "jazz" })).toEqual([]);
  });

  it("returns no previews when the name is blank", () => {
    service.register(id, request);

    expect(service.find({ name: "   " })).toEqual([]);
  });

  it("rejects registering the same id twice", () => {
    service.register(id, request);

    expect(() => service.register(id, request)).toThrow(ConflictException);
  });

  it("returns an event by id", () => {
    const registered = service.register(id, request);

    expect(service.getById(id)).toEqual(registered);
  });

  it("throws NotFoundException when event does not exist", () => {
    expect(() => service.getById(id)).toThrow(NotFoundException);
  });
});
