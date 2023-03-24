export type Location = string;
export interface Travel {
  time: number;
  distance: number;
}

export default interface ITravelCalculator {
  type: string;
  travelBetween: (from: Location, to: Location) => Travel;
}
