import { isEqual } from "lodash";
import { ReadonlyDeep } from "type-fest";
import { generateGrid } from "./generate-grid";

export class Grid3d<T> {
  #grids: T[][][] = [];
  #emptyValue: T;

  constructor(layers: number, width: number, height: number, emptyValue: T) {
    for (let i = 0; i < layers; ++i) {
      this.#grids[i] = generateGrid(width, height, emptyValue);
    }

    this.#emptyValue = emptyValue;
  }

  public isColumnEmpty(x: number, y: number, z: number) {
    const elevation = this.#grids[z];

    if (elevation == null) {
      throw new Error(`No grid layer at elevation ${z}`);
    }

    return this.#grids
      .filter((_elevation, elevationIdx) => elevationIdx >= z)
      .every((elevation) => isEqual(elevation[y][x], this.#emptyValue));
  }

  public setItem(x: number, y: number, z: number, value: T) {
    if (this.#grids[z]?.[y]?.[x] == null) {
      throw new Error(`x, y, z: ${x}, ${y}, ${z} is out of bounds`);
    }

    this.#grids[z][y][x] = value;
  }

  public getItem(x: number, y: number, z: number) {
    return this.#grids[z]?.[y]?.[x];
  }

  get grids(): ReadonlyDeep<T[][][]> {
    // TODO: Cleaner way??
    return this.#grids as unknown as ReadonlyDeep<T[][][]>;
  }
}
