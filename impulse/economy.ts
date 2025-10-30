/*
* Pokemon Showdown
* Economy Utility Functions
*/
import { ImpulseDB } from './impulse-db';

/**
 * Represents a user's economy profile document in the database.
 */
export interface EconomyUser {
	_id: string;
	balance: number;
	updatedAt: Date;
}

/**
 * Represents an individual money transaction log entry.
 */
export interface Transaction {
	_id?: unknown;
	from: string;
	to: string;
	amount: number;
	type: 'transfer' | 'give' | 'take' | 'shop' | 'reward';
	reason?: string;
	timestamp: Date;
}

/**
 * The result object returned after attempting a money transfer.
 */
export interface TransferResult {
	success: boolean;
	error?: string;
	fromBalance?: number;
	toBalance?: number;
}

/**
 * Summary statistics for the entire economy module.
 */
export interface EconomyStats {
	totalUsers: number;
	totalMoney: { totalBalance: number };
}

const EconomyDB = ImpulseDB<EconomyUser>('economy');
const TransactionsDB = ImpulseDB<Transaction>('transactions');

/**
 * The configuration object for the in-game currency.
 */
export const CURRENCY = { name: 'PokéBucks', symbol: '$' };

/**
 * Configuration settings for the economy module.
 */
export const ECONOMY_CONFIG = {
	startingBalance: 10,
};

/**
 * Retrieves a user's economy profile. If the user does not exist, a new profile is created with the starting balance.
 * @param userid The ID of the user.
 * @returns A promise that resolves to the EconomyUser profile.
 */
export const getEconomyUser = async (userid: string): Promise<EconomyUser> => {
	let user = await EconomyDB.findOne({ _id: userid });
	if (!user) {
		const now = new Date();
		user = { _id: userid, balance: ECONOMY_CONFIG.startingBalance, updatedAt: now };
		await EconomyDB.insertOne(user);
	}
	return user;
};

/**
 * Updates a user's balance by the specified amount.
 * @param userid The ID of the user.
 * @param amount The amount to add (positive) or subtract (negative).
 * @returns A promise that resolves to the updated EconomyUser profile.
 */
export const updateBalance = async (userid: string, amount: number): Promise<EconomyUser> => {
	const user = await getEconomyUser(userid);
	const newBalance = user.balance + amount;

	await EconomyDB.updateOne({ _id: userid }, { $set: { balance: newBalance, updatedAt: new Date() } });

	return { ...user, balance: newBalance, updatedAt: new Date() };
};

/**
 * Executes a transfer of money from one user to another.
 * Automatically checks for positive amount and sender's sufficient balance.
 * NOTE: Does not log a transaction entry; this must be done separately if needed.
 * @param from The ID of the sending user.
 * @param to The ID of the receiving user.
 * @param amount The amount of money to transfer (must be positive).
 * @param reason An optional reason for the transfer.
 * @returns A promise that resolves to the TransferResult object.
 */
export const transferMoney = async (
	from: string,
	to: string,
	amount: number,
	reason?: string
): Promise<TransferResult> => {
	if (amount <= 0) return { success: false, error: 'Amount must be positive' };

	const fromUser = await getEconomyUser(from);
	if (fromUser.balance < amount) return { success: false, error: 'Insufficient balance' };

	await updateBalance(from, -amount);
	const updatedTo = await updateBalance(to, amount);

	const updatedFrom = await getEconomyUser(from);
	return { success: true, fromBalance: updatedFrom.balance, toBalance: updatedTo.balance };
};

/**
 * Retrieves the transaction history for a specific user, or the global history if no user ID is provided.
 * @param userid The ID of the user (optional).
 * @param limit The maximum number of transactions to return. Defaults to 50.
 * @returns A promise that resolves to an array of Transaction objects.
 */
export const getTransactionHistory = (userid: string, limit = 50): Promise<Transaction[]> =>
	userid ? TransactionsDB.find({ $or: [{ from: userid }, { to: userid }] }, { sort: { timestamp: -1 }, limit }) :
	TransactionsDB.find({}, { sort: { timestamp: -1 }, limit });

/**
 * Formats an amount of money into a string with the currency symbol and proper localization.
 * @param amount The amount to format.
 * @returns The formatted currency string (e.g., "$1,000").
 */
export const formatMoney = (amount: number | undefined | null): string =>
	`${CURRENCY.symbol}${(amount ?? 0).toLocaleString()}`;

/**
 * Calculates and retrieves global economy statistics.
 * @returns A promise that resolves to the EconomyStats object.
 */
export const getEconomyStats = async (): Promise<EconomyStats> => {
	const totalUsers = await EconomyDB.countDocuments({});
	const [totalMoneyResult] = await EconomyDB.aggregate([
		{ $group: { _id: null, totalBalance: { $sum: '$balance' } } },
	]);

	return {
		totalUsers,
		totalMoney: totalMoneyResult || { totalBalance: 0 },
	};
};

/**
 * Retrieves the economy leaderboard based on user balance, paginated.
 * @param page The page number to retrieve. Defaults to 1.
 * @param limit The number of entries per page. Defaults to 50.
 * @returns The result of the findPaginated database query.
 */
export const getLeaderboard = (page = 1, limit = 50): ReturnType<typeof EconomyDB.findPaginated> =>
	EconomyDB.findPaginated({}, { page, limit, sort: { balance: -1 } });

/**
 * Resets a user's economy data, deleting their profile and all associated transactions.
 * @param userid The ID of the user to reset.
 * @returns A promise that resolves when the deletion operations are complete.
 */
export const resetUser = async (userid: string): Promise<void> => {
	await EconomyDB.deleteOne({ _id: userid });
	await TransactionsDB.deleteMany({ $or: [{ from: userid }, { to: userid }] });
};

/**
 * Calculates the total money currently in the economy across all user balances.
 * @returns A promise that resolves to the total currency amount.
 */
export const getTotalEconomy = async (): Promise<number> => {
	const [result] = await EconomyDB.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]);
	return result?.total || 0;
};

/**
 * The main Economy API object, bundling all utility functions and configuration constants.
 */
export const Economy = {
	getUser: getEconomyUser,
	updateBalance,
	transferMoney,
	getTransactionHistory,
	formatMoney,
	getStats: getEconomyStats,
	getLeaderboard,
	resetUser,
	getTotalEconomy,
	CURRENCY,
	CONFIG: ECONOMY_CONFIG,
	EconomyDB,
	TransactionDB: TransactionsDB,
};
