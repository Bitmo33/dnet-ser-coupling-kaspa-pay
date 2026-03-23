/**
 * generic-ser-flow.ts
 *
 * Illustrative reference example for the
 * SER (Settlement–Exchange–Record) coupling model.
 *
 * This file is provided for conceptual and explanatory purposes.
 * It does not represent production infrastructure.
 */

type ISO8601 = string;

interface SettlementContext {
  txId: string;
  assetSold: string;
  amountSold: number;
  settlementId: string;
  settlementTimestamp: ISO8601;
}

interface ExchangeResult {
  exchangeId: string;
  assetBought: string;
  amountBought: number;
  exchangeRate: number;
  exchangeTimestamp: ISO8601;
}

interface RecordResult {
  recordId: string;
  txId: string;
  assetSold: string;
  assetBought: string;
  amountSold: number;
  amountBought: number;
  acquisitionValue: number;
  disposalValue: number;
  capitalGain: number;
  taxCategory: string;
  recordTimestamp: ISO8601;
}

interface SerTransactionResult {
  settlement: SettlementContext;
  exchange: ExchangeResult;
  record: RecordResult;
}

function now(): ISO8601 {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

/**
 * Settlement (S)
 * Creates a settlement context for the transaction lifecycle.
 */
function createSettlement(
  txId: string,
  assetSold: string,
  amountSold: number
): SettlementContext {
  return {
    txId,
    assetSold,
    amountSold,
    settlementId: generateId("SET"),
    settlementTimestamp: now()
  };
}

/**
 * Exchange (E)
 * Resolves an exchange result using the settlement context.
 *
 * In this simplified reference example, the rate is fixed.
 */
function resolveExchange(
  settlement: SettlementContext,
  assetBought: string
): ExchangeResult {
  const exchangeRate = 1.25;
  const amountBought = settlement.amountSold * exchangeRate;

  return {
    exchangeId: generateId("EX"),
    assetBought,
    amountBought,
    exchangeRate,
    exchangeTimestamp: now()
  };
}

/**
 * Record (R)
 * Generates a compliance-ready record using the settlement and exchange outputs.
 */
function generateRecord(
  settlement: SettlementContext,
  exchange: ExchangeResult
): RecordResult {
  const acquisitionValue = settlement.amountSold;
  const disposalValue = exchange.amountBought;
  const capitalGain = disposalValue - acquisitionValue;

  return {
    recordId: generateId("REC"),
    txId: settlement.txId,
    assetSold: settlement.assetSold,
    assetBought: exchange.assetBought,
    amountSold: settlement.amountSold,
    amountBought: exchange.amountBought,
    acquisitionValue,
    disposalValue,
    capitalGain,
    taxCategory: "capital_gain",
    recordTimestamp: now()
  };
}

/**
 * SER Coupling Flow
 *
 * This reference flow illustrates how settlement, exchange,
 * and record generation may be composed under one transaction identifier.
 */
export function runSerFlow(
  assetSold: string,
  amountSold: number,
  assetBought: string
): SerTransactionResult {
  const txId = generateId("TX");

  const settlement = createSettlement(txId, assetSold, amountSold);
  const exchange = resolveExchange(settlement, assetBought);
  const record = generateRecord(settlement, exchange);

  return {
    settlement,
    exchange,
    record
  };
}

/**
 * Example usage
 */
const example = runSerFlow("CRYPTO_ASSET_A", 1000, "FIAT_ASSET_B");

console.log("SER Flow Example");
console.log(JSON.stringify(example, null, 2));
