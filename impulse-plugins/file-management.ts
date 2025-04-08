/* Server Files Management Commands
*
* Instructions:
* - Important: Obtain a GitHub "personal access token" with the "gist" permission.
* - Set this token as the environment variable `GITHUB_TOKEN` on your server.
* - (Directly adding the token to the code is strongly discouraged for security).
* - These commands are restricted to the 'development' room and whitelisted
* - users with console access for security.
*
* Credits: HoeenHero ( Original HasteBin Code )
* Updates & Typescript Conversion:
* Prince Sky
*/

import * as https from 'https';
import { FS } from '../lib/fs';

const whitelist = ['princesky'];
const GITHUB_API_URL = 'https://api.github.com/gists';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

interface GistResponse {
  id: string;
  html_url: string;
}

function fakeUnrecognizedCmd(this: CommandContext, obj: { message: string; cmdToken: string }) {
  if (obj.cmdToken === '!') return this.errorReply(`The command '${obj.message}' was unrecognized.`);
  return this.errorReply(`The command '${obj.message}' was unrecognized. To send a message starting with '${obj.message}', type '${obj.cmdToken}${obj.message}'.`);
}

async function uploadToGist(toUpload: string, originalFilenameWithPath: string, description = 'Uploaded via bot') {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not found.');
  }

  const parts = originalFilenameWithPath.split('/');
  const baseFilename = parts[parts.length - 1];

  const postData = JSON.stringify({
    description: description,
    public: false,
    files: {
      [baseFilename]: {
        content: toUpload,
      },
    },
  });

  const reqOpts = {
    hostname: 'api.github.com',
    path: '/gists',
    method: 'POST',
    headers: {
      'User-Agent': 'YourBotName',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
    },
  };

  return new Promise<string>((resolve, reject) => {
    const req = https.request(reqOpts, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 201) {
          try {
            const gistResponse: GistResponse = JSON.parse(data);
            resolve(gistResponse.html_url);
          } catch (e) {
            reject(new Error(`Failed to parse GitHub API response: ${e}`));
          }
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

export const commands: Chat.ChatCommands = {
  file: 'getfile',
  fileretrieval: 'getfile',
  retrievefile: 'getfile',
  async getfile(this: CommandContext, target, room, user) {
    if (room?.roomid !== 'development') return fakeUnrecognizedCmd.call(this, { message: target, cmdToken: this.cmdToken });
    if (!this.runBroadcast()) return;
    if (!target) return this.parse('/help getfile');
    if (!user.hasConsoleAccess(user.connections[0]) || !whitelist.includes(user.id)) return fakeUnrecognizedCmd.call(this, { message: target, cmdToken: this.cmdToken });
    const file = target.trim();

    if (!GITHUB_TOKEN) {
      return this.errorReply("The GitHub token is not set. Please configure the GITHUB_TOKEN environment variable or directly add it to the code (not recommended).");
    }

    try {
      const data = await FS(file).read();
      try {
        const gistUrl = await uploadToGist(data, file, `File: ${file} uploaded by ${user.id}`);
        this.sendReplyBox(`File: <a href="${gistUrl}">${gistUrl}</a>`);
      } catch (error) {
        this.errorReply(`An error occurred while attempting to upload to GitHub Gist: ${error}`);
      }
    } catch (error) {
      this.errorReply(`Failed to load ${file}: ${error}`);
    }
    if (room) room.update();
  },

  getfilehelp: [
    '/getgile <file name>: Uploads a server file to a private GitHub Gist.',
    'Example: /getfile config/config.js',
    'Note: Requires the GITHUB_TOKEN environment variable to be set.',
  ],

  forcewritefile: 'writefile',
  async writefile(this: CommandContext, target, room, user, connection, cmd) {
    if (room?.roomid !== 'development') return fakeUnrecognizedCmd.call(this, { message: target, cmdToken: this.cmdToken });
    if (!user.hasConsoleAccess(user.connections[0]) || !whitelist.includes(user.id)) return fakeUnrecognizedCmd.call(this, { message: target, cmdToken: this.cmdToken });
    const targets = target.split(',').map(x => x.trim());
    if (targets.length !== 2) return this.errorReply(`/writefile [github gist raw link to write from], [file to write too]`);
    if (!targets[0].startsWith('https://gist.githubusercontent.com/')) return this.errorReply(`Link must start with https://gist.githubusercontent.com/`);
    try {
      FS(targets[1]).readSync();
    } catch (e) {
      if (cmd !== 'forcewritefile') return this.errorReply(`The file "${targets[1]}" was not found. Use /forcewritefile to forcibly create & write to the file.`);
    }
    try {
      const response = await new Promise<string>((resolve, reject) => {
        https.get(targets[0], (res) => {
          let data = '';
          res.on('data', (part) => {
            data += part;
          });
          res.on('end', () => {
            if (res.statusCode === 200) {
              resolve(data);
            } else {
              reject(new Error(`Failed to fetch Gist content: ${res.statusCode}`));
            }
          });
          res.on('error', reject);
        }).on('error', reject);
      });
      FS(targets[1]).writeSync(response);
      this.sendReply(`"${targets[1]}" written successfully`);
    } catch (error) {
      this.errorReply(`An error occurred while fetching or writing the file: ${error}`);
    }
  },
};
