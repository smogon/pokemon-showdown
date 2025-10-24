/*
* Pokemon Showdown
* Economy Module
*/
import { ImpulseDB } from './impulse-db';

export interface EconomyUser {
	_id: string;
	balance: number;
	updatedAt: Date;
}

export interface Transaction {
	_id?: unknown;
	from: string;
	to: string;
	amount: number;
	type: 'transfer' | 'give' | 'take' | 'shop' | 'reward';
	reason?: string;
	timestamp: Date;
}

export interface TransferResult {
	success: boolean;
	error?: string;
	fromBalance?: number;
	toBalance?: number;
}

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

export const getEconomyUser = async (userid: string): Promise<EconomyUser> => {
	let user = await EconomyDB.findOne({ _id: userid });
	if (!user) {
		const now = new Date();
		user = { _id: userid, balance: ECONOMY_CONFIG.startingBalance, updatedAt: now };
		await EconomyDB.insertOne(user);
	}
	return user;
};

export const updateBalance = async (userid: string, amount: number): Promise<EconomyUser> => {
	const user = await getEconomyUser(userid);
	const newBalance = user.balance + amount;

	await EconomyDB.updateOne({ _id: userid }, { $set: { balance: newBalance, updatedAt: new Date() } });

	return { ...user, balance: newBalance, updatedAt: new Date() };
};

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

export const getTransactionHistory = (userid: string, limit = 50): Promise<Transaction[]> => 
	userid ? TransactionsDB.find({ $or: [{ from: userid }, { to: userid }] }, { sort: { timestamp: -1 }, limit })
	       : TransactionsDB.find({}, { sort: { timestamp: -1 }, limit });

export const formatMoney = (amount: number | undefined | null): string => 
	`${CURRENCY.symbol}${(amount ?? 0).toLocaleString()}`;

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

export const getLeaderboard = (page = 1, limit = 50): ReturnType<typeof EconomyDB.findPaginated> => 
	EconomyDB.findPaginated({}, { page, limit, sort: { balance: -1 } });

export const resetUser = async (userid: string): Promise<void> => {
	await EconomyDB.deleteOne({ _id: userid });
	await TransactionsDB.deleteMany({ $or: [{ from: userid }, { to: userid }] });
};

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
