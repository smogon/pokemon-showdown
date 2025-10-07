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
import { FS } from "../../lib";
import { exec } from "child_process";
import { promisify } from "util";
import '../utils';

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

async function findGitRoot(startPath: string): Promise<string | null> {
  const path = require('path');
  let currentPath = path.resolve(startPath);
  const maxLevels = 10; // Safety limit to prevent infinite loops
  
  for (let i = 0; i < maxLevels; i++) {
    const gitPath = path.join(currentPath, '.git');
    try {
      const exists = await FS(gitPath).isDirectory();
      if (exists) return currentPath;
    } catch {
      // Directory doesn't exist, continue searching
    }
    
    // Go up one level
    const parentPath = path.dirname(currentPath);
    
    // Check if we've reached the filesystem root
    if (parentPath === currentPath) break;
    
    currentPath = parentPath;
  }
  
  return null;
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

  // GIT INTEGRATION COMMANDS

  async gitpull(target, room, user) {
    this.canUseConsole();
    const startPath = target.trim() || './';
    
    try {
      // Find the git repository root
      const gitRoot = await findGitRoot(startPath);
      if (!gitRoot) {
        return this.errorReply(`No git repository found in or above: ${startPath}`);
      }

      this.sendReply(`Found git repository at: ${gitRoot}`);
      this.sendReply('Pulling from remote repository...');
      
      // Get current commit before pull (for comparison)
      let beforeCommit = '';
      try {
        const { stdout: before } = await execAsync('git rev-parse HEAD', { cwd: gitRoot });
        beforeCommit = before.trim();
      } catch {
        // Ignore if we can't get it
      }
      
      const { stdout, stderr } = await execAsync('git pull', { cwd: gitRoot });
      
      // Get current commit after pull
      let afterCommit = '';
      try {
        const { stdout: after } = await execAsync('git rev-parse HEAD', { cwd: gitRoot });
        afterCommit = after.trim();
      } catch {
        // Ignore if we can't get it
      }
      
      // Check if there were any changes
      const hasChanges = beforeCommit !== afterCommit;
      const isAlreadyUpToDate = stdout.includes('Already up to date') || stdout.includes('Already up-to-date');
      
      let resultMessage = '<div class="infobox">';
      resultMessage += `<strong>[GIT PULL] ${isAlreadyUpToDate ? '✓' : '✅'}</strong><br>`;
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br>`;
      resultMessage += `<strong>Executed From:</strong> ${Chat.escapeHTML(startPath)}<br><br>`;
      
      // Show the actual git output (like terminal)
      if (stdout) {
        resultMessage += '<strong>Git Output:</strong><br>';
        resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; overflow-x: auto;">';
        resultMessage += Chat.escapeHTML(stdout);
        resultMessage += '</pre>';
      }
      
      // Show stderr if present (git often uses stderr for informational messages)
      if (stderr) {
        resultMessage += '<br><strong>Additional Info:</strong><br>';
        resultMessage += '<pre style="background: #2d2d2d; color: #ffd700; padding: 10px; border-radius: 4px; overflow-x: auto;">';
        resultMessage += Chat.escapeHTML(stderr);
        resultMessage += '</pre>';
      }
      
      // Add summary if changes were pulled
      if (hasChanges && !isAlreadyUpToDate) {
        try {
          // Get the commit log of what was pulled
          const { stdout: log } = await execAsync(
            `git log ${beforeCommit}..${afterCommit} --oneline --decorate`,
            { cwd: gitRoot }
          );
          if (log.trim()) {
            resultMessage += '<br><strong>New Commits:</strong><br>';
            resultMessage += '<pre style="background: #1e1e1e; color: #4ec9b0; padding: 10px; border-radius: 4px; overflow-x: auto;">';
            resultMessage += Chat.escapeHTML(log.trim());
            resultMessage += '</pre>';
          }
        } catch {
          // If we can't get the log, that's okay
        }
        
        // Get file change statistics
        try {
          const { stdout: diffStat } = await execAsync(
            `git diff --stat ${beforeCommit}..${afterCommit}`,
            { cwd: gitRoot }
          );
          if (diffStat.trim()) {
            resultMessage += '<br><strong>Files Changed:</strong><br>';
            resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; overflow-x: auto;">';
            resultMessage += Chat.escapeHTML(diffStat.trim());
            resultMessage += '</pre>';
          }
        } catch {
          // If we can't get the diff stat, that's okay
        }
      }
      
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      
      const logMessage = isAlreadyUpToDate ? 'Already up to date' : 
                        hasChanges ? `Pulled new changes` : 'Pull completed';
      notifyStaff(`Git pull executed - ${logMessage}`, gitRoot, user);
      
    } catch (err: any) {
      const errorMsg = err.message || err.toString();
      
      // Check if it's a merge conflict
      if (errorMsg.includes('CONFLICT') || errorMsg.includes('Automatic merge failed')) {
        // Get list of conflicted files
        let conflictedFiles: string[] = [];
        try {
          const { stdout: conflictList } = await execAsync('git diff --name-only --diff-filter=U', { cwd: gitRoot });
          conflictedFiles = conflictList.trim().split('\n').filter(Boolean);
        } catch {
          // If we can't get the list, that's okay
        }
        
        let conflictMessage = '<div class="message-error">';
        conflictMessage += '<strong>❌ MERGE CONFLICT DETECTED</strong><br><br>';
        conflictMessage += '⚠️ <strong>Git pull failed due to merge conflicts!</strong><br><br>';
        
        if (conflictedFiles.length > 0) {
          conflictMessage += `<strong>Conflicted Files (${conflictedFiles.length}):</strong><br>`;
          conflictMessage += '<pre>' + conflictedFiles.map(f => Chat.escapeHTML(f)).join('\n') + '</pre><br>';
        }
        
        conflictMessage += '<strong>Error Details:</strong><br>';
        conflictMessage += '<pre>' + Chat.escapeHTML(errorMsg) + '</pre><br>';
        
        conflictMessage += '<strong>⚠️ REPOSITORY IS NOW IN CONFLICTED STATE</strong><br><br>';
        
        conflictMessage += '<strong>To Resolve:</strong><br>';
        conflictMessage += '1. <strong>Option A - Abort the merge:</strong><br>';
        conflictMessage += '   Run manually: <code>git merge --abort</code><br>';
        conflictMessage += '   This will cancel the pull and restore your previous state.<br><br>';
        
        conflictMessage += '2. <strong>Option B - Fix conflicts manually:</strong><br>';
        conflictMessage += '   • Edit each conflicted file to resolve conflicts<br>';
        conflictMessage += '   • Look for conflict markers: <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code><br>';
        conflictMessage += '   • After fixing, commit: <code>/gitcommit ./, Resolved merge conflicts</code><br><br>';
        
        conflictMessage += '<small>Use <code>/gitstatus</code> to check current state</small>';
        conflictMessage += '</div>';
        
        this.sendReplyBox(conflictMessage);
        notifyStaff("Git pull FAILED - MERGE CONFLICT", gitRoot, user, `${conflictedFiles.length} files conflicted`);
      } else {
        // Other git errors
        let errorMessage = '<div class="message-error">';
        errorMessage += '<strong>❌ Git Pull Failed</strong><br><br>';
        errorMessage += '<strong>Error:</strong><br>';
        errorMessage += '<pre>' + Chat.escapeHTML(errorMsg) + '</pre>';
        errorMessage += '</div>';
        
        this.sendReplyBox(errorMessage);
        notifyStaff("Git pull failed", gitRoot, user, errorMsg.slice(0, 200));
      }
    }
  },

  async gitstatus(target, room, user) {
    this.canUseConsole();
    const startPath = target.trim() || './';
    
    try {
      // Find the git repository root
      const gitRoot = await findGitRoot(startPath);
      if (!gitRoot) {
        return this.errorReply(`No git repository found in or above: ${startPath}`);
      }

      // Get git status
      const { stdout: status } = await execAsync('git status', { cwd: gitRoot });
      
      // Get current branch
      const { stdout: branch } = await execAsync('git branch --show-current', { cwd: gitRoot });
      
      // Get latest commit
      const { stdout: commit } = await execAsync('git log -1 --oneline', { cwd: gitRoot });
      
      // Get remote URL
      let remoteUrl = 'Not configured';
      try {
        const { stdout: remote } = await execAsync('git remote get-url origin', { cwd: gitRoot });
        remoteUrl = remote.trim();
      } catch {
        // Remote not configured, use default message
      }
      
      let resultMessage = '<div class="infobox">';
      resultMessage += '<strong>[GIT STATUS]</strong><br>';
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br>`;
      resultMessage += `<strong>Current Directory:</strong> ${Chat.escapeHTML(startPath)}<br>`;
      resultMessage += `<strong>Branch:</strong> ${Chat.escapeHTML(branch.trim())}<br>`;
      resultMessage += `<strong>Remote:</strong> ${Chat.escapeHTML(remoteUrl)}<br>`;
      resultMessage += `<strong>Latest Commit:</strong> ${Chat.escapeHTML(commit.trim())}<br><br>`;
      resultMessage += '<details><summary><strong>Full Status</strong></summary>';
      resultMessage += '<pre>' + Chat.escapeHTML(status) + '</pre>';
      resultMessage += '</details>';
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      notifyStaff("Git status checked", gitRoot, user);
      
    } catch (err: any) {
      this.errorReply('Git status failed: ' + err.message);
      notifyStaff("Git status failed", startPath, user, err.message);
    }
  },

  async gitcommit(target, room, user) {
    this.canUseConsole();
    
    const [pathInput, ...messageParts] = target.split(',');
    const startPath = pathInput.trim() || './';
    const message = messageParts.join(',').trim();
    
    if (!message) {
      return this.errorReply('Usage: /gitcommit [path], [commit message]\nExample: /gitcommit ./, Fixed avatar system');
    }
    
    try {
      // Find the git repository root
      const gitRoot = await findGitRoot(startPath);
      if (!gitRoot) {
        return this.errorReply(`No git repository found in or above: ${startPath}`);
      }

      // Add all changes
      this.sendReply(`Found git repository at: ${gitRoot}`);
      this.sendReply('Staging changes...');
      await execAsync('git add .', { cwd: gitRoot });
      
      // Commit changes
      this.sendReply('Committing changes...');
      const { stdout, stderr } = await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: gitRoot });
      
      let resultMessage = '<div class="infobox">';
      resultMessage += '<strong>[GIT COMMIT]</strong><br>';
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br>`;
      resultMessage += `<strong>Executed From:</strong> ${Chat.escapeHTML(startPath)}<br>`;
      resultMessage += `<strong>Message:</strong> ${Chat.escapeHTML(message)}<br>`;
      resultMessage += `<strong>User:</strong> <username>${user.id}</username><br>`;
      
      if (stdout) {
        resultMessage += '<strong>Output:</strong><br><pre>' + Chat.escapeHTML(stdout) + '</pre>';
      }
      if (stderr) {
        resultMessage += '<strong>Info:</strong><br><pre>' + Chat.escapeHTML(stderr) + '</pre>';
      }
      
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      notifyStaff("Git commit created", gitRoot, user, `Message: ${message}`);
      
    } catch (err: any) {
      // Check if error is because there's nothing to commit
      if (err.message.includes('nothing to commit')) {
        this.sendReply('Nothing to commit - working tree clean.');
        return;
      }
      this.errorReply('Git commit failed: ' + err.message);
      notifyStaff("Git commit failed", startPath, user, err.message);
    }
  },

  async gitpush(target, room, user) {
    this.canUseConsole();
    const startPath = target.trim() || './';
    
    try {
      // Find the git repository root
      const gitRoot = await findGitRoot(startPath);
      if (!gitRoot) {
        return this.errorReply(`No git repository found in or above: ${startPath}`);
      }

      this.sendReply(`Found git repository at: ${gitRoot}`);
      this.sendReply('Pushing to remote repository...');
      
      const { stdout, stderr } = await execAsync('git push', { cwd: gitRoot });
      
      let resultMessage = '<div class="infobox">';
      resultMessage += '<strong>[GIT PUSH]</strong><br>';
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br>`;
      resultMessage += `<strong>Executed From:</strong> ${Chat.escapeHTML(startPath)}<br>`;
      
      if (stdout) {
        resultMessage += '<strong>Output:</strong><br><pre>' + Chat.escapeHTML(stdout) + '</pre>';
      }
      if (stderr) {
        resultMessage += '<strong>Info:</strong><br><pre>' + Chat.escapeHTML(stderr) + '</pre>';
      }
      
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      notifyStaff("Git push executed", gitRoot, user);
      
    } catch (err: any) {
      this.errorReply('Git push failed: ' + err.message);
      notifyStaff("Git push failed", startPath, user, err.message);
    }
  },

  githelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Git Integration Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/gitpull [path]</code> - Pull latest changes from remote repository<br>` +
      `<small>⚠️ Will fail with detailed error if merge conflicts occur</small></li>` +
      `<li><code>/gitstatus [path]</code> - Show git status, branch, remote, and latest commit</li>` +
      `<li><code>/gitcommit [path], [commit message]</code> - Stage and commit all changes</li>` +
      `<li><code>/gitpush [path]</code> - Push commits to remote repository</li>` +
      `</ul>` +
      `<small>All commands require Console/Owner permission.</small><br>` +
      `<small>Path is optional - defaults to current directory (./).</small><br>` +
      `<small><strong>Smart Feature:</strong> Commands automatically find the git repository root, so you can run them from any subdirectory!</small><br><br>` +
      `<strong>Recommended Workflow:</strong><br>` +
      `1. <code>/gitstatus</code> - Check what changed<br>` +
      `2. <code>/gitcommit ./, Your message</code> - Commit your changes<br>` +
      `3. <code>/gitpull</code> - Pull latest from remote<br>` +
      `4. <code>/gitpush</code> - Push your commits<br><br>` +
      `<strong>If merge conflicts occur:</strong><br>` +
      `• Abort: Run <code>git merge --abort</code> manually<br>` +
      `• Or resolve conflicts manually and commit<br>` +
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
      `<li><code>/githelp</code> - View git integration commands</li>` +
      `</ul>` +
      `<small>All commands require Console/Owner permission.</small>` +
      `</div>`
    );
  },
  
  filemanager: 'fmhelp',
};
