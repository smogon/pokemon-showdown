/*
* Pokemon Showdown
* File Management
* @license MIT
* Instructions:
* - Obtain a GitHub "personal access token" with the "gist" permission.
* - Set this token as Config.githubToken in your configuration.
* - These commands are restricted to console/owner accounts for security.
*/

import * as https from "https";
import { FS } from "../../../lib";
import { exec } from "child_process";
import { promisify } from "util";
import '../../../impulse/utils';

const execAsync = promisify(exec);
const GITHUB_API_URL = "https://api.github.com/gists";
const GITHUB_TOKEN: string | undefined = Config.githubToken;

interface GistResponse {
  id: string;
  html_url: string;
}

function notifyStaff(action: string, file: string, user: User, info = "") {
  const staffRoom = Rooms.get("staff");
  if (!staffRoom) return;

  const safeFile = Chat.escapeHTML(file);
  const safeUser = Chat.escapeHTML(user.id);

  const message =
    '<div class="infobox">' +
    '<strong>[FILE MANAGEMENT]</strong> ' + action + '<br>' +
    '<strong>File:</strong> ' + safeFile + '<br>' +
    '<strong>User:</strong> <username>' + safeUser + '</username><br>' +
    (info ? Chat.escapeHTML(info) : '') +
    '</div>';

  staffRoom.addRaw(message).update();
}

function notifyUserBox(
  context: Chat.CommandContext,
  action: string,
  file: string,
  user: User,
  link = "",
  info = ""
) {
  const safeFile = Chat.escapeHTML(file);
  const safeUser = Chat.escapeHTML(user.id);

  const message =
    '<div class="infobox">' +
    '<strong>[FILE MANAGEMENT]</strong> ' + action + '<br>' +
    '<strong>File:</strong> ' + safeFile + '<br>' +
    '<strong>User:</strong> <username>' + safeUser + '</username>' +
    (link ? '<br><strong>Source:</strong> ' + Chat.escapeHTML(link) : '') +
    (info ? '<br>' + Chat.escapeHTML(info) : '') +
    '</div>';

  context.sendReplyBox(message);
}

async function githubRequest<T>(
  method: "POST" | "PATCH",
  path: string,
  data: Record<string, any>
): Promise<T> {
  if (!GITHUB_TOKEN) {
    throw new Error("GitHub token not configured in Config.githubToken");
  }

  const postData = JSON.stringify(data);

  const options: https.RequestOptions = {
    hostname: "api.github.com",
    path,
    method,
    headers: {
      "User-Agent": Config.serverid || "PS-FileManager",
      Authorization: "Bearer " + GITHUB_TOKEN,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise<T>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (!res.statusCode || res.statusCode >= 400) {
          return reject(
            new Error("GitHub API error " + res.statusCode + ": " + body)
          );
        }
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error("Failed to parse GitHub API response"));
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function fetchFromGistRaw(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error("Failed to fetch gist (HTTP " + res.statusCode + ")"));
      }
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function validateGistRawURL(url: string): void {
  const allowedPrefixes = [
    "https://gist.githubusercontent.com/",
    "https://raw.githubusercontent.com/"
  ];
  
  const isAllowed = allowedPrefixes.some(prefix => url.startsWith(prefix));
  
  if (!isAllowed) {
    throw new Error("Invalid URL. Only raw URLs from gist.githubusercontent.com or raw.githubusercontent.com are allowed.");
  }
}

class FileManager {
  static async uploadToGist(
    content: string,
    filePath: string,
    description = "Uploaded via bot"
  ): Promise<string> {
    const baseFilename = filePath.split("/").pop()!;
    const response = await githubRequest<GistResponse>("POST", "/gists", {
      description,
      public: false,
      files: {
        [baseFilename]: { content },
      },
    });
    return response.html_url;
  }

  static async readFile(filePath: string): Promise<string> {
    return FS(filePath).readIfExists();
  }

  static async writeFile(filePath: string, data: string): Promise<void> {
    await FS(filePath).write(data);
  }

  static async deleteFile(filePath: string): Promise<void> {
    await FS(filePath).unlinkIfExists();
  }
}

export const commands: Chat.ChatCommands = {
  async fileupload(target, room, user) {
    this.runBroadcast();
    this.canUseConsole();
    const filePath = target.trim();
    const fileContent = await FileManager.readFile(filePath);

    if (!fileContent) return this.errorReply("File not found: " + filePath);

    try {
      const url = await FileManager.uploadToGist(
        fileContent,
        filePath,
        "Uploaded by " + user.name
      );
      notifyUserBox(this, "Uploaded file", filePath, user, url);
      notifyStaff("Uploaded file", filePath, user);
    } catch (err: any) {
      this.errorReply("Upload failed: " + err.message);
      notifyUserBox(this, "Upload failed", filePath, user, "", err.message);
      notifyStaff("Upload failed", filePath, user, err.message);
    }
  },
  fu: 'fileupload',

  async fileread(target, room, user) {
    this.runBroadcast();
    this.canUseConsole();
    const filePath = target.trim();

    try {
      const content = await FileManager.readFile(filePath);
      if (!content) return this.errorReply("File not found: " + filePath);

      this.sendReplyBox(
        "<b>Contents of " + Chat.escapeHTML(filePath) + ":</b><br>" +
        "<details><summary>Show/Hide File</summary>" +
        "<div style=\"max-height:320px; overflow:auto;\"><pre>" +
          Chat.escapeHTML(content) +
        "</pre></div></details>"
      );
    } catch (err: any) {
      this.errorReply("Error reading file: " + err.message);
    }
  },
  fr: 'fileread',

  async filesave(target, room, user) {
    this.runBroadcast();
    this.canUseConsole();

    const [path, url] = target.split(",").map(p => p.trim());
    if (!path || !url) {
      return this.errorReply("Usage: /filesave path, raw-gist-url");
    }

    try {
      validateGistRawURL(url);
      const content = await fetchFromGistRaw(url);
      await FileManager.writeFile(path, content);

      notifyUserBox(this, "Saved file from Gist", path, user, url);
      notifyStaff("Saved file from Gist", path, user);
    } catch (err: any) {
      this.errorReply("File save failed: " + err.message);
      notifyUserBox(this, "File save failed", path, user, url, err.message);
      notifyStaff("File save failed", path, user, err.message);
    }
  },
  fs: 'filesave',

  async filedelete(target, room, user) {
    this.runBroadcast();
    this.canUseConsole();

    const [flag, ...pathParts] = target.split(",");
    const confirm = flag.trim().toLowerCase() === "confirm";
    const filePath = pathParts.join(",").trim();

    if (!confirm || !filePath) {
      return this.errorReply(
        "Usage: /filedelete confirm, path\nExample: /filedelete confirm, data/test.txt"
      );
    }

    try {
      await FileManager.deleteFile(filePath);
      notifyUserBox(this, "Deleted file", filePath, user);
      notifyStaff("Deleted file", filePath, user);
    } catch (err: any) {
      this.errorReply("File deletion failed: " + err.message);
      notifyUserBox(this, "File deletion failed", filePath, user, "", err.message);
      notifyStaff("File deletion failed", filePath, user, err.message);
    }
  },
  fd: 'filedelete',
  
  async filelist(target, room, user) {
    this.canUseConsole();
    this.runBroadcast();
    
    const dirPath = target.trim() || './';
    try {
      const entries = await FS(dirPath).readdir();
      if (!entries || entries.length === 0) {
        return this.errorReply("Directory is empty or not found: " + dirPath);
      }
      
      const files: string[] = [];
      const directories: string[] = [];
      
      for (const entry of entries) {
        const fullPath = dirPath + '/' + entry;
        const isDir = await FS(fullPath).isDirectory();
        if (isDir) {
          directories.push(entry);
        } else {
          files.push(entry);
        }
      }
      
      let content = `<b>Contents of ${Chat.escapeHTML(dirPath)}:</b><br>`;

      if (directories.length > 0) {
        content += `<b>Directories (${directories.length}):</b><br>`;
        content += directories.map(dir => `📁 ${Chat.escapeHTML(dir)}`).join('<br>') + '<br><br>';
      }
      
      if (files.length > 0) {
        content += `<b>Files (${files.length}):</b><br>`;
        content += files.map(file => `📄 ${Chat.escapeHTML(file)}`).join('<br>');
      }

      this.sendReplyBox(content);
      notifyStaff("Listed directory", dirPath, user);

    } catch (err: any) {
      this.errorReply("Failed to list directory: " + err.message);
      notifyStaff("Directory listing failed", dirPath, user, err.message);
    }
  },
  fl: 'filelist',

  async pm2logs(target, room, user) {
    this.canUseConsole();
    
    // Parse parameters: [process name/id] [number of lines]
    const params = target.trim().split(/\s+/);
    const processName = params[0] || '';
    const lines = parseInt(params[1]) || 100;
    
    if (lines > 1000) {
      return this.errorReply('Maximum 1000 lines allowed.');
    }
    
    try {
      // If no process name specified, show list of PM2 processes
      if (!processName) {
        const { stdout } = await execAsync('pm2 jlist');
        const processes = JSON.parse(stdout);
        
        if (processes.length === 0) {
          return this.sendReply('No PM2 processes found.');
        }
        
        let processList = '<div class="infobox">';
        processList += '<strong>[PM2 PROCESSES]</strong><br><br>';
        processList += '<table style="border-collapse: collapse; width: 100%;">';
        processList += '<tr><th style="text-align: left; padding: 5px; border-bottom: 1px solid #ccc;">Name</th>';
        processList += '<th style="text-align: left; padding: 5px; border-bottom: 1px solid #ccc;">ID</th>';
        processList += '<th style="text-align: left; padding: 5px; border-bottom: 1px solid #ccc;">Status</th>';
        processList += '<th style="text-align: left; padding: 5px; border-bottom: 1px solid #ccc;">Uptime</th></tr>';
        
        for (const proc of processes) {
          const uptime = Math.floor((Date.now() - proc.pm2_env.pm_uptime) / 1000);
          const uptimeStr = uptime < 60 ? `${uptime}s` : 
                           uptime < 3600 ? `${Math.floor(uptime / 60)}m` : 
                           `${Math.floor(uptime / 3600)}h`;
          const statusColor = proc.pm2_env.status === 'online' ? 'green' : 'red';
          
          processList += '<tr>';
          processList += `<td style="padding: 5px;">${Chat.escapeHTML(proc.name)}</td>`;
          processList += `<td style="padding: 5px;">${proc.pm_id}</td>`;
          processList += `<td style="padding: 5px; color: ${statusColor};">${Chat.escapeHTML(proc.pm2_env.status)}</td>`;
          processList += `<td style="padding: 5px;">${uptimeStr}</td>`;
          processList += '</tr>';
        }
        
        processList += '</table><br>';
        processList += '<small>Usage: <code>/pm2logs [process name/id] [lines]</code></small>';
        processList += '</div>';
        
        return this.sendReplyBox(processList);
      }
      
      // Get logs for specific process
      this.sendReply(`Fetching last ${lines} lines of logs for: ${processName}`);
      
      const { stdout } = await execAsync(`pm2 logs ${processName} --nostream --lines ${lines} --raw`);
      
      if (!stdout.trim()) {
        return this.sendReply(`No logs found for process: ${processName}`);
      }
      
      let resultMessage = '<div class="infobox">';
      resultMessage += '<strong>[PM2 LOGS]</strong><br>';
      resultMessage += `<strong>Process:</strong> ${Chat.escapeHTML(processName)}<br>`;
      resultMessage += `<strong>Lines:</strong> ${lines}<br><br>`;
      resultMessage += '<details open><summary><strong>Show/Hide Logs</strong></summary>';
      resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; max-height: 400px; overflow: auto; font-size: 12px;">';
      resultMessage += Chat.escapeHTML(stdout);
      resultMessage += '</pre>';
      resultMessage += '</details>';
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      notifyStaff("PM2 logs viewed", processName, user, `${lines} lines`);
      
    } catch (err: any) {
      const errorMsg = err.message || err.toString();
      
      if (errorMsg.includes('Process or Namespace') || errorMsg.includes('not found')) {
        return this.errorReply(`Process not found: ${processName}. Use /pm2logs to see available processes.`);
      }
      
      this.errorReply('PM2 logs failed: ' + errorMsg);
      notifyStaff("PM2 logs failed", processName || 'list', user, errorMsg);
    }
  },

  pm2help(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>PM2 Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/pm2logs</code> - List all PM2 processes</li>` +
      `<li><code>/pm2logs [process name/id]</code> - Show last 100 lines of logs</li>` +
      `<li><code>/pm2logs [process name/id] [lines]</code> - Show last N lines (max 1000)</li>` +
      `</ul>` +
      `<small>All commands require Console/Owner permission.</small>` +
      `</div>`
    );
  },
  
  fmhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>File Management Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/fileupload [path]</code> OR <code>/fu [path]</code> - Upload file to GitHub Gist</li>` +
      `<li><code>/fileread [path]</code> OR <code>/fr [path]</code> - Read file contents</li>` +
      `<li><code>/filesave [path], [raw gist url]</code> OR <code>/fs [path], [raw gist url]</code> - Save/overwrite file</li>` +
      `<li><code>/filedelete confirm, [path]</code> OR <code>/fd confirm, [path]</code> - Delete file</li>` +
      `<li><code>/filelist [directory]</code> OR <code>/fl [directory]</code> - List directory contents</li>` +
      `<li><code>/pm2help</code> - View PM2 management commands</li>` +
      `</ul>` +
      `<small>All commands require Console/Owner permission.</small><br>` +
      `<small>For git commands, see: <code>/githelp</code> (loaded from git-management plugin)</small>` +
      `</div>`
    );
  },
  
  filemanager: 'fmhelp',
};
