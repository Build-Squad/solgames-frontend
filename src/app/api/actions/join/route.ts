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
  const url = new URL(req.url);
  const betAmount = url.searchParams.get("betAmount");
  const joiningCode = url.searchParams.get("joiningCode");

  // We need the escrow account pubKey as well in the request and need to valid if that exists on our side. (Security reasons)

  const payload: ActionGetResponse = {
    icon: new URL("/chess2.jpg", new URL(req.url).origin).toString(),
    title: "Join my chess game",
    description: "Chess game offered by your friend",
    label: "Accept my chess game.",
    links: {
      actions: [
        {
          href: `/api/actions/join?betAmount=${betAmount}&joiningCode=${joiningCode}`,
          label: `${betAmount} SOL`,
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

    let betAmount: number = 0.1;
    if (url.searchParams.has("betAmount")) {
      const val = url.searchParams.get("betAmount");
      try {
        betAmount = parseFloat(val || "0.1");
      } catch (err) {
        throw "Invalid 'bet amount' input";
      }
    }

    const toPublicKey = new PublicKey(
      "2TA2aASYQFWNyo8ac5V9Fg5E19nPYbHEfg8obnkfDMRv"
    );

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        lamports: betAmount * LAMPORTS_PER_SOL,
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
