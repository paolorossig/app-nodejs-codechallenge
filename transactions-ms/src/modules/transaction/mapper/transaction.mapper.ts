import { Transaction as TransactionData } from "@prisma/client";
import { Transaction } from "../types/transaction.type";

// This variable maps tranferTypeId to their corresponding transaction type names.
const transactionTypeName = {
  1: "DEBIT",
  2: "CREDIT",
};

export const mapTransaction = (
  transactionData: TransactionData
): Transaction => {
  return {
    transactionExternalId: transactionData.id,
    transactionType: {
      name: transactionTypeName[transactionData.tranferTypeId] ?? "UNKNOWN",
    },
    transactionStatus: {
      name: transactionData.status,
    },
    value: transactionData.value,
    createdAt: transactionData.createdAt,
  };
};
