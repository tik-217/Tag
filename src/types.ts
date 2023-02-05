export interface ICoord {
  x: number;
  y: number;
}

export interface IZeroEnvironment {
  north: ICoord;
  east: ICoord;
  south: ICoord;
  west: ICoord;
}
