import prisma from "@/libs/prisma";

export default async function Home() {
  const transactions = await prisma.transaction.findMany();
  const total = transactions.reduce((total, transaction) => {
    return String(transaction.type).toUpperCase() === "ADD"
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);

  function checkType(type) {
    return String(type).toUpperCase() === "ADD" ? true : false;
  }

  return (
    <section className="flex flex-col gap-4 h-screen w-full py-[100px]">
      <div className={"w-[400px] mx-auto border rounded-lg p-4"}>
        <div>
          <p className={" font-semibold"}>Wallet Amount</p>
          <h2 className=" text-center font-semibold text-3xl mt-5">
            {total} <span className={" text-lg font-medium"}>MMK</span>
          </h2>
        </div>
        <div className={" my-5"}>
          <button className={" p-2 rounded-md bg-gray-900 text-white w-full"}>
            Add Transaction
          </button>
        </div>
        <div>
          <h3>History</h3>
          <div className={" space-y-2 mt-5"}>
            {transactions.map((transaction) => {
              return (
                <div
                  key={transaction.id}
                  className={`flex items-center gap-5 p-3 border rounded-md ${
                    checkType(transaction.type) ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <p>
                    {checkType(transaction.type) ? "- " : "+ "}{" "}
                    {transaction.amount}
                  </p>
                  <p>{transaction.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
