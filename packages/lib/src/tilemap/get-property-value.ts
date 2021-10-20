import { TiledProperty, TiledPropertyType } from "../@types/tiled";

/**
 * Get a property value from properties list
 * @param properties
 * @param type
 * @param name
 */
export function getPropertyValue(
  properties: TiledProperty[],
  type: "float" | "int",
  name: string,
): number | undefined;
export function getPropertyValue(
  properties: TiledProperty[],
  type: "string",
  name: string,
): string | undefined;
export function getPropertyValue(
  properties: TiledProperty[],
  type: "bool",
  name: string,
): boolean | undefined;
export function getPropertyValue(
  properties: TiledProperty[],
  type: TiledPropertyType,
  name: string,
) {
  const property = properties.find(
    (property) => property.name === name && property.type === type,
  );

  return property?.value;
}
