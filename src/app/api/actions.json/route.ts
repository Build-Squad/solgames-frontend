import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = (req: Request) => {
  console.log("GET called");
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/join",
        apiPath: "api/actions/memo",
      },
    ],
  };
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};
