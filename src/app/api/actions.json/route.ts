import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = (req: Request) => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/join",
        apiPath: "api/actions/join",
      },
    ],
  };
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};
