import { isEqual } from "lodash";

/**
 * Given an array of paths, remove any duplicate paths.
 * @param paths
 * @returns
 */
export const getUniquePaths = (paths: { x: number; y: number }[][]) => {
  const unique: typeof paths = [];

  for (const potentialPath of paths) {
    const duplicate = unique.find((path) => isEqual(path, potentialPath));

    if (duplicate == null) {
      unique.push(potentialPath);
    }
  }

  return unique;
};
