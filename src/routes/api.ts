import type { FastifyPluginAsync } from "fastify";

export const registerApiRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["name", "version"],
            properties: {
              name: { type: "string" },
              version: { type: "string" },
            },
          },
        },
      },
    },
    async () => {
      return {
        name: "codepuranx-api",
        version: "v1",
      };
    },
  );
};
