import WithdrawalSlip from "@/app/components/slip";
import { prisma } from "@/lib/db";

export default async function ReceiptPage(props: any) {
  const { id } = await props.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <p className="text-lg text-red-500 font-semibold">
          Transaction not found
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Transaction Receipt
        </h1>
        <WithdrawalSlip
          data={{
            date: transaction.createdAt.toLocaleDateString(),
            amount: transaction.amount,
            amountWords: transaction.amountWord,
            accountNumber: transaction.accountNumber,
            name: transaction.qrData,
          }}
        />
      </div>
    </div>
  );
}
