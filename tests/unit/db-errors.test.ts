import {
  ConditionalCheckFailedException,
  ResourceInUseException,
  ResourceNotFoundException,
} from "@aws-sdk/client-dynamodb";
import { mapDynamoError, RepositoryError } from "../../src/db/errors.js";

describe("DynamoDB error mapping", () => {
  it("maps known DynamoDB errors", () => {
    expect(
      mapDynamoError(new ConditionalCheckFailedException({ $metadata: {}, message: "condition failed" }))
    ).toMatchObject({ code: "CONFLICT" });
    expect(mapDynamoError(new ResourceInUseException({ $metadata: {}, message: "in use" }))).toMatchObject({
      code: "CONFLICT",
    });
    expect(mapDynamoError(new ResourceNotFoundException({ $metadata: {}, message: "missing" }))).toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("maps unknown errors", () => {
    const error = mapDynamoError(new Error("boom"));

    expect(error).toBeInstanceOf(RepositoryError);
    expect(error).toMatchObject({ code: "UNKNOWN" });
  });
});
