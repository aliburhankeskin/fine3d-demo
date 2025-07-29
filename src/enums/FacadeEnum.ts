export enum Facade {
  None = 0,

  North = 1 << 0, // 1
  South = 1 << 1, // 2
  East = 1 << 2, // 4
  West = 1 << 3, // 8

  NorthEast = North | East, // 1 | 4 = 5
  NorthWest = North | West, // 1 | 8 = 9
  SouthEast = South | East, // 2 | 4 = 6
  SouthWest = South | West, // 2 | 8 = 10

  All = North | South | East | West, // 1 | 2 | 4 | 8 = 15
}
