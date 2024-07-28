import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export const GET = (req: Request) => {
  console.log("GET called");
  const payload: ActionGetResponse = {
    icon: new URL("/chess2.jpg", new URL(req.url).origin).toString(),
    title: "Join my chess game",
    description: "Chess game offered by your friend",
    label: "Accept my chess game.",
    links: {
      actions: [
        {
          href: "/api/actions/memo?amount=0.1",
          label: "0.1 SOL",
        },
        {
          href: "/api/actions/memo?amount=0.5",
          label: "0.5 SOL",
        },
        {
          href: "/api/actions/memo?amount=1.0",
          label: "1.0 SOL",
        },
        {
          href: "/api/actions/memo?amount={amount}",
          label: "Send SOL",
          parameters: [
            {
              name: "amount",
              label: "Enter a SOL amount",
            },
          ],
        },
      ],
    },
  };
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response("Invalid 'account' provided", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    let amount: number = 0.1;
    if (url.searchParams.has("amount")) {
      const val = url.searchParams.get("amount");
      try {
        amount = parseFloat(val || "0.1");
      } catch (err) {
        throw "Invalid 'amount' input";
      }
    }

    const toPublicKey = new PublicKey(
      "2TA2aASYQFWNyo8ac5V9Fg5E19nPYbHEfg8obnkfDMRv"
    );

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        lamports: amount * LAMPORTS_PER_SOL,
        toPubkey: toPublicKey,
      })
    );
    transaction.feePayer = account;

    const connection = new Connection(clusterApiUrl("devnet"));
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Congratulations! You've successfully accepted the game.",
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    let message: string;
    if (typeof err == "string") {
      message = err;
    }
    return Response.json(message ?? "Unknown error occured!", { status: 400 });
  }
};
