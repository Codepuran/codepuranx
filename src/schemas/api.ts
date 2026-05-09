import type { JSONSchema } from "json-schema-to-ts";
import type { SchemaType } from "./common.js";

export const apiInfoResponseSchema = {
  type: "object",
  required: ["name", "version"],
  additionalProperties: false,
  properties: { name: { type: "string" }, version: { type: "string" } },
} as const satisfies JSONSchema;

export type ApiInfoResponse = SchemaType<typeof apiInfoResponseSchema>;
