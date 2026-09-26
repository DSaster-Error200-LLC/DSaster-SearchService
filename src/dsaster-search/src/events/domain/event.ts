export interface Venue {
  readonly name: string;
  readonly location: string;
}

export interface Event {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly date: Date;
  readonly venue: Venue;
}
