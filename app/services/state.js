export const state = {
  collection: null,
  features: [],
  selected: null,
  filtered: [],
  map: null,
  geoLayer: null
};

export function p(feature) {
  return feature?.properties || {};
}

export function valueOf(properties, keys) {
  for (const key of keys) {
    const value = properties?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
}
