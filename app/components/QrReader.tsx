"use client";

import { use, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { stat } from "fs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PaytmScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const router = useRouter();
  const [stateNo, setStateNo] = useState(1); // 1 = scan, 2 = ask account
  const [qrData, setQrData] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const handleData = async () => {
    setLoading(true);
    const res = await axios.post("/api/qr", {
      qr: qrData,
      accountNumber: accountNumber,
      amount: amount,
    });

    console.log("Response:", res.data);
    router.push(`/receipt/${res.data.data.transaction.id}`);
    setLoading(false);
  };

  useEffect(() => {
    QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";

    if (stateNo !== 1) return; // only run scanner in state 1

    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const qrScanner = new QrScanner(
      video,
      (result) => {
        const data = result.data;
        console.log("QR:", data);

        // Save QR result
        setQrData(data);

        // Go to next screen
        setStateNo(2);

        // Stop camera
        qrScanner.stop();
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    setScanner(qrScanner);
    qrScanner.start();

    // Blue scanner line animation
    const animateLine = () => {
      if (stateNo !== 1) return; // stop animation in the next screen

      const h = canvas.height;
      const w = canvas.width;

      ctx.clearRect(0, 0, w, h);

      const lineY = (Date.now() / 8) % h;
      ctx.fillStyle = "rgba(0, 200, 255, 0.5)";
      ctx.fillRect(0, lineY, w, 4);

      requestAnimationFrame(animateLine);
    };

    animateLine();

    return () => {
      qrScanner.stop();
    };
  }, [stateNo]);

  const handleAccountNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccountNumber(value);
  };
  const onSubmit = () => {
    setStateNo(3);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-5">
      {/* --------------------------- */}
      {/*   SCREEN 1: SCAN QR CODE    */}
      {/* --------------------------- */}
      {stateNo === 1 && (
        <div className="relative w-[320px] h-[350px] flex flex-col items-center">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          <div
            className="absolute border-4 border-blue-400 rounded-xl"
            style={{
              width: "250px",
              height: "250px",
              top: "50px",
            }}
          ></div>

          <p className="absolute bottom-2 text-white font-semibold bg-black/40 px-3 py-1 rounded-lg">
            Scan your Passbook QR
          </p>
        </div>
      )}

      {/* --------------------------- */}
      {/*   SCREEN 2: ENTER ACCOUNT   */}
      {/* --------------------------- */}
      {stateNo === 2 && (
        <div className="flex flex-col items-center gap-6 mt-8 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg ">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-white text-center">
            Enter Your Account Number
          </h2>

          <p className="text-gray-500 text-sm text-center">
            QR detected:
            <span className="font-semibold text-blue-600 dark:text-blue-400 ml-1">
              {qrData || "—"}
            </span>
          </p>

          <input
            type="number"
            className="border border-gray-300 dark:border-zinc-700 p-3 rounded-xl w-full text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white transition 
  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
            placeholder="Type account number"
            value={accountNumber}
            onChange={handleAccountNumber}
            min={10}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white px-6 py-3 rounded-xl w-full font-medium shadow-md"
            onClick={onSubmit}
          >
            Continue
          </button>
        </div>
      )}

      {stateNo === 3 && (
        <div className="w-full max-w-md mx-auto mt-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
            How Much Amount to Withdraw?
          </h2>

          <input
            type="text"
            className="border border-gray-300 dark:border-zinc-700 p-3 rounded-xl w-full text-center text-lg 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    dark:bg-zinc-800 dark:text-white transition"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 
  disabled:bg-blue-400 disabled:cursor-not-allowed 
  text-white py-3 rounded-xl text-lg font-medium transition shadow-md"
            onClick={handleData}
          >
            {loading ? (
              <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
