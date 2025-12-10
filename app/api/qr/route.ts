import { prisma } from "@/lib/db";
import { numberToWords } from "@/lib/numberintoword";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { qr, accountNumber, amount } = body;
  const word = numberToWords(amount).toUpperCase() + " ONLY";
  const name = qr.split("-")[1].trim();

  const transaction = await prisma.transaction.create({
    data: {
      qrData: name,
      accountNumber: accountNumber,
      amount: Number(amount),
      amountWord: word,
      inCryptedNumber: accountNumber,
    },
  });

  return NextResponse.json({
    status: "ok",
    data: { transaction },
  });
}
