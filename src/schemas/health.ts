import type { JSONSchema } from "json-schema-to-ts";
import type { SchemaType } from "./common.js";

export const healthResponseSchema = {
  type: "object",
  required: ["status"],
  additionalProperties: false,
  properties: { status: { type: "string", enum: ["ok"] } },
} as const satisfies JSONSchema;

export type HealthResponse = SchemaType<typeof healthResponseSchema>;
