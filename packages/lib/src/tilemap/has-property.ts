import { TiledProperty, TiledPropertyType } from "../@types/tiled";

/**
 * Determine if properties list contains a particular property.
 * @param properties
 * @param type
 * @param name
 * @returns
 */
export const hasProperty = <T extends TiledPropertyType>(
  properties: TiledProperty[],
  type: T,
  name: string,
) => {
  const property = properties.find(
    (property) => property.type === type && property.name === name,
  );

  return property == null ? false : true;
};
