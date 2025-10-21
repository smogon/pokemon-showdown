/*
* Pokemon Showdown
* Economy Module
*/

import { ImpulseDB } from './impulse-db';

/**
 * Represents a user in the economy system
 */
export interface EconomyUser {
	_id: string;
	balance: number;
	updatedAt: Date;
}

/**
 * Represents a transaction between users
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
 * Result of a money transfer operation
 */
export interface TransferResult {
	success: boolean;
	error?: string;
	fromBalance?: number;
	toBalance?: number;
}

/**
 * Statistics about the economy system
 */
export interface EconomyStats {
	totalUsers: number;
	totalMoney: { totalBalance: number };
}

const EconomyDB = ImpulseDB<EconomyUser>('economy');
const TransactionsDB = ImpulseDB<Transaction>('transactions');

export const CURRENCY = { name: 'PokéBucks', symbol: '$' };

export const ECONOMY_CONFIG = {
	startingBalance: 10,
};

/**
 * Gets or creates an economy user
 * @param userid - The user ID to fetch
 * @returns The economy user object
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
 * Updates a user's balance
 * @param userid - The user ID
 * @param amount - The amount to add (negative to subtract)
 * @returns The updated user object
 */
export const updateBalance = async (userid: string, amount: number): Promise<EconomyUser> => {
	const user = await getEconomyUser(userid);
	const newBalance = user.balance + amount;

	await EconomyDB.updateOne({ _id: userid }, { $set: { balance: newBalance, updatedAt: new Date() } });

	return { ...user, balance: newBalance, updatedAt: new Date() };
};

/**
 * Transfers money from one user to another
 * @param from - The sender's user ID
 * @param to - The recipient's user ID
 * @param amount - The amount to transfer
 * @param reason - Optional reason for the transfer
 * @returns Result object with success status and updated balances
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
 * Gets transaction history for a user or all transactions
 * @param userid - The user ID to get transactions for, or empty string for all
 * @param limit - Maximum number of transactions to return
 * @returns Array of transactions
 */
export const getTransactionHistory = (userid: string, limit = 50): Promise<Transaction[]> => 
	userid ? TransactionsDB.find({ $or: [{ from: userid }, { to: userid }] }, { sort: { timestamp: -1 }, limit })
	       : TransactionsDB.find({}, { sort: { timestamp: -1 }, limit });

/**
 * Formats a monetary amount with currency symbol
 * @param amount - The amount to format
 * @returns Formatted string with currency symbol
 */
export const formatMoney = (amount: number | undefined | null): string => 
	`${CURRENCY.symbol}${(amount ?? 0).toLocaleString()}`;

/**
 * Gets statistics about the economy system
 * @returns Object containing total users and total money
 */
export const getEconomyStats = async (): Promise<EconomyStats> => {
	const totalUsers = await EconomyDB.countDocuments({});
	const [totalMoneyResult] = await EconomyDB.aggregate([
		{ $group: { _id: null, totalBalance: { $sum: '$balance' } } }
	]);

	return {
		totalUsers,
		totalMoney: totalMoneyResult || { totalBalance: 0 },
	};
};

/**
 * Gets the leaderboard of users by balance
 * @param page - Page number for pagination
 * @param limit - Number of users per page
 * @returns Paginated leaderboard results
 */
export const getLeaderboard = (page = 1, limit = 50): ReturnType<typeof EconomyDB.findPaginated> => 
	EconomyDB.findPaginated({}, { page, limit, sort: { balance: -1 } });

/**
 * Resets a user's economy data
 * @param userid - The user ID to reset
 */
export const resetUser = async (userid: string): Promise<void> => {
	await EconomyDB.deleteOne({ _id: userid });
	await TransactionsDB.deleteMany({ $or: [{ from: userid }, { to: userid }] });
};

/**
 * Gets the total amount of money in the economy
 * @returns Total balance across all users
 */
export const getTotalEconomy = async (): Promise<number> => {
	const [result] = await EconomyDB.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]);
	return result?.total || 0;
};

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
