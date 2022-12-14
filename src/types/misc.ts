// https://stackoverflow.com/questions/38123222/proper-way-to-declare-json-object-in-typescript
export type JsonPrimitive = string | number | boolean | null
export interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> { }
export interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> { }
export type Json = JsonPrimitive | JsonMap | JsonArray
