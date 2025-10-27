/*
* Pokemon Showdown
* Battle Tower Utils
*/
import { Teams } from '../../../sim/teams';

interface ActiveBattleMeta {
  roomid: string;
  battleType: string;
  opponentId: string;
  data?: any;
  onWin?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void;
  onLose?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void;
}

const activeBattles: Map<string, ActiveBattleMeta> = new Map();

function packTeam(team: any[]) {
  if (typeof Teams?.pack === 'function') return Teams.pack(team);
  return team;
}

export function createBattle(options: {
  user: any,
  botUserId: string,
  userTeam: any[],
  botTeam: any[],
  battleType: string,
  format?: string,
  title?: string,
  data?: any,
  onWin?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void,
  onLose?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void,
}) {
  const player1Packed = packTeam(options.userTeam);
  const player2Packed = packTeam(options.botTeam);

  const player1 = options.user;
  const player2 = Users.get(options.botUserId);
  if (!player1 || !player2) return null;

  const battleRoom = Rooms.createBattle({
    format: options.format || 'gen9customgame',
    players: [
      { user: player1, team: player1Packed },
      { user: player2, team: player2Packed }
    ],
    title: options.title || `${player1.name} vs. ${player2.name}`,
  });
  player1.joinRoom?.(battleRoom);
  player2.joinRoom?.(battleRoom);

  activeBattles.set(battleRoom.roomid, {
    roomid: battleRoom.roomid,
    battleType: options.battleType,
    opponentId: options.botUserId,
    data: options.data,
    onWin: options.onWin,
    onLose: options.onLose,
  });

  return battleRoom;
}

export const handlers: Chat.Handlers = {
  onBattleEnd(battle, winner, players) {
    const entry = activeBattles.get(battle.roomid);
    if (!entry) return;
    activeBattles.delete(battle.roomid);
    const isUserWin = winner === players[0];
    if (isUserWin) {
      entry.onWin?.(battle, winner, players, entry);
    } else {
      entry.onLose?.(battle, winner, players, entry);
    }
  }
};
