"use client";

import { useEffect, useRef } from "react";

interface SlipData {
  date: string;
  amount: number;
  amountWords: string;
  accountNumber: string;
  name: string;
}

interface Props {
  data: SlipData;
}

export default function WithdrawalSlip({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawAccountNumber(
    ctx: CanvasRenderingContext2D,
    number: string,
    startX: number,
    y: number,
    boxWidth: number,
    boxCount: number
  ) {
    const digits = number.split("");
    for (let i = 0; i < boxCount; i++) {
      const char = digits[i] ?? "";
      const x = startX + i * boxWidth + boxWidth / 9 - 8;
      ctx.fillText(char, x, y);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/1.png";

    img.onload = () => {
      const W = img.width;
      const H = img.height;

      canvas.width = W;
      canvas.height = H;

      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = "black";
      ctx.font = `${W * 0.018}px Arial`;

      ctx.fillText(data.date, W * 0.78, H * 0.24);
      ctx.fillText(`${data.amount}`, W * 0.78, H * 0.33);
      ctx.fillText(data.amountWords, W * 0.34, H * 0.27);

      drawAccountNumber(
        ctx,
        data.accountNumber,
        W * 0.13,
        H * 0.49,
        W * 0.036,
        16
      );

      ctx.fillText(data.name, W * 0.73, H * 0.49);
    };
  }, [data]);

  const printSlip = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgURL = canvas.toDataURL("image/png");
    const win = window.open("");
    if (!win) return;

    win.document.write(`<img src="${imgURL}" style="width:100%">`);
    win.print();
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-sm"
      />
      <button
        onClick={printSlip}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
      >
        Print Withdrawal Slip
      </button>
    </div>
  );
}
