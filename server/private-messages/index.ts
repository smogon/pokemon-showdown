/**
 * Private message handling, particularly for offline messages.
 * Handles offline PM sending, receiving, and viewing.
 * By Mia.
 * @author mia-pi-git
 */
import { SQL, Utils } from '../../lib';
import { Config } from '../config-loader';
import { Auth } from '../user-groups';
import { statements } from './database';

/** The time until a PM sent offline expires. Currently, 60 days. */
export const EXPIRY_TIME = 60 * 24 * 60 * 60 * 1000;
/** The time until a PM that has been seen by the user expires. Currently, one week. */
export const SEEN_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;
/** The max PMs that one user can have pending to a specific user at one time. */
export const MAX_PENDING = 20;

// SQLite database configuration
export const PM = SQL(module, {
  file: 'databases/offline-pms.db',
  extension: 'server/private-messages/database.js',
});

export interface ReceivedPM {
  time: number;
  sender: string;
  receiver: string;
  seen: number | null;
  message: string;
}

export const PrivateMessages = new class {
  database = PM;
  clearInterval = this.scheduleNextClear();
  offlineIsEnabled = Config.usesqlitepms && Config.usesqlite;

  /**
   * Sends an offline PM to the specified user.
   * @param to - The recipient's username.
   * @param from - The sender's user object or ID.
   * @param message - The message content.
   * @param context - Optional command context for handling offline message events.
   */
  async sendOffline(to: string, from: User | string, message: string, context?: Chat.CommandContext) {
    await this.checkCanSend(to, from); // Validate the sender's permissions.
    const result = await PM.transaction('send', [toID(from), toID(to), message]);
    
    if (result.error) throw new Chat.ErrorMessage(result.error);

    if (typeof from === 'object') {
      from.send(`|pm|${this.getIdentity(from)}|${this.getIdentity(to)}|${message} __[sent offline]__`);
    }

    if (result.changes && context) {
      Chat.runHandlers('onMessageOffline', context, message, toID(to));
    }

    return !!result.changes;
  }

  /**
   * Retrieves user PM settings from the database.
   * @param userid - The user's ID.
   */
  getSettings(userid: string) {
    return PM.get(statements.getSettings, [toID(userid)]);
  }

  /**
   * Deletes the PM settings for the user from the database.
   * @param userid - The user's ID.
   */
  deleteSettings(userid: string) {
    return PM.run(statements.deleteSettings, [toID(userid)]);
  }

  /**
   * Checks whether the user is allowed to send an offline PM.
   * Throws an error if sending is not allowed.
   * @param to - The recipient's username.
   * @param from - The sender's username or user object.
   */
  async checkCanSend(to: string, from: User | string) {
    from = toID(from);
    to = toID(to);
    const setting = await this.getSettings(to);
    const requirement = setting?.view_only || Config.usesqlitepms || "friends";

    switch (requirement) {
      case 'friends':
        if (!(await Chat.Friends.findFriendship(to, from))) {
          if (Config.usesqlitepms === 'friends') {
            throw new Chat.ErrorMessage(`You may only send offline PMs to friends. ${to} is not friends with you.`);
          }
          throw new Chat.ErrorMessage(`${to} is only accepting offline PMs from friends at this time.`);
        }
        break;
      case 'trusted':
        if (!Users.globalAuth.has(toID(from))) {
          throw new Chat.ErrorMessage(`${to} is currently blocking offline PMs from non-trusted users.`);
        }
        break;
      case 'none':
        if (!Auth.atLeast(Users.globalAuth.get(from as ID), '%')) {
          throw new Chat.ErrorMessage(`${to} has indicated that they do not wish to receive offline PMs.`);
        }
        break;
      default:
        if (!Auth.atLeast(Users.globalAuth.get(from as ID), requirement)) {
          if (setting?.view_only) {
            throw new Chat.ErrorMessage(`That user is not allowing offline PMs from your rank.`);
          }
          throw new Chat.ErrorMessage('You do not meet the rank requirement to send offline PMs.');
        }
        break;
    }
  }

  /**
   * Sets view-only mode for a user. This affects who can send PMs.
   * @param user - The user object or ID.
   * @param val - The new value for the view-only mode.
   */
  setViewOnly(user: User | string, val: string | null) {
    const id = toID(user);
    return val ? PM.run(statements.setBlock, [id, val]) : PM.run(statements.deleteSettings, [id]);
  }

  /**
   * Checks whether a user is allowed to use the offline PM system.
   * Throws an error if they cannot use it.
   * @param user - The user object.
   * @param options - Additional options for handling login and other conditions.
   */
  checkCanUse(user: User, options = { forceBool: false, isLogin: false }) {
    if (!this.offlineIsEnabled) {
      if (options.forceBool) return false;
      throw new Chat.ErrorMessage(`Offline PMs are currently disabled.`);
    }
    if (!(options.isLogin ? user.registered : user.autoconfirmed)) {
      if (options.forceBool) return false;
      throw new Chat.ErrorMessage("You must be autoconfirmed to use offline messaging.");
    }
    if (!Users.globalAuth.atLeast(user, Config.usesqlitepms)) {
      if (options.forceBool) return false;
      throw new Chat.ErrorMessage("You do not have the required rank to send offline PMs.");
    }
    return true;
  }

  /**
   * Sends all received PMs to the user when they log in.
   * @param user - The user object.
   */
  async sendReceived(user: User) {
    const userid = toID(user);
    const messages = await this.fetchUnseen(userid);  // Fetch unseen messages only.
    
    messages.forEach(({ message, time, sender }) => {
      user.send(
        `|pm|${this.getIdentity(sender)}|${this.getIdentity(user)}|/html ` +
        `${Utils.escapeHTML(message)} <i>[sent offline, <time>${new Date(time).toISOString()}</time>]</i>`
      );
    });
  }

  /**
   * Fetches unseen private messages for a user.
   * @param user - The user object or ID.
   */
  async fetchUnseen(user: User | string): Promise<ReceivedPM[]> {
    const userid = toID(user);
    return (await PM.transaction('listNew', [userid])) || [];
  }

  /**
   * Fetches all private messages for a user.
   * @param user - The user object or ID.
   */
  async fetchAll(user: User | string): Promise<ReceivedPM[]> {
    return (await PM.all(statements.fetch, [toID(user)])) || [];
  }

  /**
   * Renders all received PMs in HTML format.
   * @param user - The user object.
   */
  async renderReceived(user: User) {
    const all = await this.fetchAll(user);
    let buf = `<div class="ladder pad">`;
    buf += `<h2>PMs received offline in the last ${Chat.toDurationString(SEEN_EXPIRY_TIME)}</h2>`;

    // Sort PMs by sender and time.
    const sortedPMs: { [userid: string]: ReceivedPM[] } = all.reduce((acc, curPM) => {
      if (!acc[curPM.sender]) acc[curPM.sender] = [];
      acc[curPM.sender].push(curPM);
      return acc;
    }, {});

    for (const sender in sortedPMs) {
      sortedPMs[sender].sort((a, b) => b.time - a.time);
    }

    buf += `<div class="mainmenuwrapper" style="margin-left:40px">`;
    Object.entries(sortedPMs).forEach(([sender, messages]) => {
      const group = Users.globalAuth.get(toID(sender));
      const name = Users.getExact(sender)?.name || sender;
      const id = toID(name);

      buf += Utils.html`
        <div class="pm-window pm-window-${id}" data-userid="${id}" data-name="${group}${name}" style="width:300px">
          <h3><small>${group}</small>${name}</h3>
          <div class="pm-log"><div class="pm-buttonbar">
      `;

      messages.forEach(({ message, time }) => {
        buf += Utils.html`
          <div class="chat chatmessage-${toID(sender)}">&nbsp;&nbsp;
            <small>[<time>${new Date(time).toISOString()}</time>] </small>
            <span class="username" data-roomgroup="${group}" data-name="${name}">
              <username>${name}</username>
            </span>: <em>${message}</em>
          </div>
        `;
      });

      buf += `</div></div></div><br />`;
    });

    buf += `</div></div>`;
    return buf;
  }

  /**
   * Schedules the next automatic clearing of expired PMs.
   * @returns {NodeJS.Timer} The timer for the next clearing.
   */
  scheduleNextClear(): NodeJS.Timer {
    if (!PM.isParentProcess) return null!;
    
    const time = Date.now();
    const nextMidnight = new Date(time + 24 * 60 * 60 * 1000);
    nextMidnight.setHours(0, 0, 1);

    if (this.clearInterval) clearTimeout(this.clearInterval);

    this.clearInterval = setTimeout(() => {
      void this.clearOffline();
      void this.clearSeen();
      this.scheduleNextClear();
    }, nextMidnight.getTime() - time);

    return this.clearInterval;
  }

  /**
   * Clears all seen private messages that have expired.
   */
  clearSeen() {
    return PM.run(statements.clearSeen, [Date.now(), SEEN_EXPIRY_TIME]);
  }

  /**
   * Clears all expired offline private messages.
   */
  clearOffline() {
    return PM.run(statements.clearDated, [Date.now(), EXPIRY_TIME]);
  }

  /**
   * Destroys the PM handler, shutting down the database connection.
   */
  destroy() {
    void PM.destroy();
  }
};

if (Config.usesqlite) {
  if (!process.send) {
    PM.spawn(Config.pmprocesses || 1);
    void PM.run(statements.clearDated, [Date.now(), EXPIRY_TIME]);
  } else if (process.send && process.mainModule === module) {
    global.Monitor = {
      crashlog(error: Error, source = 'A private message child process', details: AnyObject | null = null) {
        const repr = JSON.stringify([error.name, error.message, source, details]);
        process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
      },
    };
    process.on('uncaughtException', err => {
      Monitor.crashlog(err, 'A private message database process');
    });
    process.on('unhandledRejection', err => {
      Monitor.crashlog(err as Error, 'A private message database process');
    });
  }
}
