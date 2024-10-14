import Redis from 'ioredis';
import { State } from './state';
import crypto from 'crypto';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

async function getStateValue(stateHash: string): Promise<string | null> {
  try {
    const value = await redis.get(stateHash);
    return value;
  } catch (error) {
    console.error(`Error fetching state value for hash ${stateHash}:`, error);
    return null;
  }
}

function getBattleStateHash(serializedBattle: AnyObject) {
  return crypto.createHash('sha256').update(JSON.stringify(serializedBattle)).digest('hex');
}

export async function applyAction(stateHash: string, action1: string, action2: string): Promise<string | null> {
  try {
    const stateString = await redis.get(stateHash);
    const battle = State.deserializeBattle(stateString!);
    battle.makeChoices(action1, action2);
    const newState = State.serializeBattle(battle);
    const newStateHash = getBattleStateHash(newState);
    await redis.set(newStateHash, JSON.stringify(newState));
    return newStateHash
  } catch (error) {
    console.error(`Error fetching state value for hash ${stateHash}:`, error);
    return null;
  }
}