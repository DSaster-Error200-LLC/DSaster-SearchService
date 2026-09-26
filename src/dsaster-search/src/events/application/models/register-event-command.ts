export interface RegisterEventCommand {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly date: Date;
  readonly venue: {
    readonly name: string;
    readonly location: string;
  };
}
