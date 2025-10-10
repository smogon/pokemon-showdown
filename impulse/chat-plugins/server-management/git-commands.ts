/*
* Pokemon Showdown
* Git Management
* @license MIT
* Instructions:
* - These commands allow git operations from the PS console
* - Commands are restricted to console/owner accounts for security.
*/

import { exec } from "child_process";
import { promisify } from "util";
import { FS } from "../../../lib";
import '../../../impulse/utils';

const execAsync = promisify(exec);

function notifyStaff(action: string, file: string, user: User, info = "") {
  const staffRoom = Rooms.get("staff");
  if (!staffRoom) return;

  // Extract just the directory name from the full path
  const path = require('path');
  const dirName = path.basename(file);

  let message = "";
  
  if (action === "Git pull executed - Already up to date") {
    message = `<username>${user.name}</username> executed git pull on ${Chat.escapeHTML(dirName)} - Already up to date.`;
  } else if (action === "Git pull executed - Pulled new changes") {
    message = `<username>${user.name}</username> pulled new changes from ${Chat.escapeHTML(dirName)}.`;
  } else if (action === "Git pull executed - Pull completed") {
    message = `<username>${user.name}</username> executed git pull on ${Chat.escapeHTML(dirName)}.`;
  } else if (action === "Git pull FAILED - MERGE CONFLICT") {
    message = `<username>${user.name}</username> git pull FAILED on ${Chat.escapeHTML(dirName)} - MERGE CONFLICT (${Chat.escapeHTML(info)}).`;
  } else if (action === "Git pull failed") {
    message = `<username>${user.name}</username> git pull failed on ${Chat.escapeHTML(dirName)}. Error: ${Chat.escapeHTML(info)}`;
  } else if (action === "Git status checked") {
    message = `<username>${user.name}</username> checked git status on ${Chat.escapeHTML(dirName)}.`;
  } else if (action === "Git status failed") {
    message = `<username>${user.name}</username> git status failed. Error: ${Chat.escapeHTML(info)}`;
  } else if (action === "Git diff viewed") {
    message = `<username>${user.name}</username> viewed git diff on ${Chat.escapeHTML(dirName)} (${Chat.escapeHTML(info)}).`;
  } else if (action === "Git diff failed") {
    message = `<username>${user.name}</username> git diff failed. Error: ${Chat.escapeHTML(info)}`;
  } else if (action.startsWith("Git stash ")) {
    const stashAction = action.replace("Git stash ", "");
    if (stashAction.includes("failed")) {
      message = `<username>${user.name}</username> git stash ${stashAction}. Error: ${Chat.escapeHTML(info)}`;
    } else {
      message = `<username>${user.name}</username> executed git stash ${stashAction} on ${Chat.escapeHTML(dirName)}.`;
    }
  }

  staffRoom.addRaw(`<div class="infobox">${message}</div>`).update();
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

export const commands: Chat.ChatCommands = {
  async gitpull(target, room, user) {
    this.canUseConsole();
    
    try {
      // Find the git repository root from current directory
      const gitRoot = await findGitRoot('./');
      if (!gitRoot) {
        return this.errorReply(`No git repository found in current directory.`);
      }

      this.sendReply(`Found git repository at: ${gitRoot}`);
      this.sendReply('Pulling from remote repository...');
      
      // Get current commit before pull (for comparison)
      let beforeCommit = '';
      try {
        const { stdout: before } = await execAsync('sudo git rev-parse HEAD', { cwd: gitRoot });
        beforeCommit = before.trim();
      } catch {
        // Ignore if we can't get it
      }
      
      const { stdout, stderr } = await execAsync('sudo git pull', { cwd: gitRoot });
      
      // Get current commit after pull
      let afterCommit = '';
      try {
        const { stdout: after } = await execAsync('sudo git rev-parse HEAD', { cwd: gitRoot });
        afterCommit = after.trim();
      } catch {
        // Ignore if we can't get it
      }
      
      // Check if there were any changes
      const hasChanges = beforeCommit !== afterCommit;
      const isAlreadyUpToDate = stdout.includes('Already up to date') || stdout.includes('Already up-to-date');
      
      let resultMessage = '<div class="infobox">';
      resultMessage += `<strong>[GIT PULL] ${isAlreadyUpToDate ? '✓' : '✅'}</strong><br>`;
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br><br>`;
      
      // Show the actual git output (like terminal)
      if (stdout) {
        resultMessage += '<details><summary><strong>Git Output</strong></summary>';
        resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; overflow-x: auto;">';
        resultMessage += Chat.escapeHTML(stdout);
        resultMessage += '</pre>';
        resultMessage += '</details>';
      }
      
      // Show stderr if present (git often uses stderr for informational messages)
      if (stderr) {
        resultMessage += '<details><summary><strong>Additional Info</strong></summary>';
        resultMessage += '<pre style="background: #2d2d2d; color: #ffd700; padding: 10px; border-radius: 4px; overflow-x: auto;">';
        resultMessage += Chat.escapeHTML(stderr);
        resultMessage += '</pre>';
        resultMessage += '</details>';
      }
      
      // Add summary if changes were pulled
      if (hasChanges && !isAlreadyUpToDate) {
        try {
          // Get the commit log of what was pulled
          const { stdout: log } = await execAsync(
            `sudo git log ${beforeCommit}..${afterCommit} --oneline --decorate`,
            { cwd: gitRoot }
          );
          if (log.trim()) {
            resultMessage += '<details><summary><strong>New Commits</strong></summary>';
            resultMessage += '<pre style="background: #1e1e1e; color: #4ec9b0; padding: 10px; border-radius: 4px; overflow-x: auto;">';
            resultMessage += Chat.escapeHTML(log.trim());
            resultMessage += '</pre>';
            resultMessage += '</details>';
          }
        } catch {
          // If we can't get the log, that's okay
        }
        
        // Get file change statistics
        try {
          const { stdout: diffStat } = await execAsync(
            `sudo git diff --stat ${beforeCommit}..${afterCommit}`,
            { cwd: gitRoot }
          );
          if (diffStat.trim()) {
            resultMessage += '<details><summary><strong>Files Changed</strong></summary>';
            resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; overflow-x: auto;">';
            resultMessage += Chat.escapeHTML(diffStat.trim());
            resultMessage += '</pre>';
            resultMessage += '</details>';
          }
        } catch {
          // If we can't get the diff stat, that's okay
        }
      }
      
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      
      const logMessage = isAlreadyUpToDate ? 'Git pull executed - Already up to date' : 
                        hasChanges ? `Git pull executed - Pulled new changes` : 'Git pull executed - Pull completed';
      notifyStaff(logMessage, gitRoot, user);
      
    } catch (err: any) {
      const errorMsg = err.message || err.toString();
      
      // Check if it's a merge conflict
      if (errorMsg.includes('CONFLICT') || errorMsg.includes('Automatic merge failed')) {
        // Get list of conflicted files
        let conflictedFiles: string[] = [];
        try {
          const gitRoot = await findGitRoot('./');
          if (gitRoot) {
            const { stdout: conflictList } = await execAsync('sudo git diff --name-only --diff-filter=U', { cwd: gitRoot });
            conflictedFiles = conflictList.trim().split('\n').filter(Boolean);
          }
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
        conflictMessage += '   Run manually: <code>sudo git merge --abort</code><br>';
        conflictMessage += '   This will cancel the pull and restore your previous state.<br><br>';
        
        conflictMessage += '2. <strong>Option B - Fix conflicts manually:</strong><br>';
        conflictMessage += '   • Edit each conflicted file to resolve conflicts<br>';
        conflictMessage += '   • Look for conflict markers: <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code><br>';
        conflictMessage += '   • After fixing, commit: <code>/gitcommit ./, Resolved merge conflicts</code><br><br>';
        
        conflictMessage += '<small>Use <code>/gitstatus</code> to check current state</small>';
        conflictMessage += '</div>';
        
        this.sendReplyBox(conflictMessage);
        const gitRoot = await findGitRoot('./');
        notifyStaff("Git pull FAILED - MERGE CONFLICT", gitRoot || './', user, `${conflictedFiles.length} files conflicted`);
      } else {
        // Other git errors
        let errorMessage = '<div class="message-error">';
        errorMessage += '<strong>❌ Git Pull Failed</strong><br><br>';
        errorMessage += '<strong>Error:</strong><br>';
        errorMessage += '<pre>' + Chat.escapeHTML(errorMsg) + '</pre>';
        errorMessage += '</div>';
        
        this.sendReplyBox(errorMessage);
        const gitRoot = await findGitRoot('./');
        notifyStaff("Git pull failed", gitRoot || './', user, errorMsg.slice(0, 200));
      }
    }
  },

  async gitstatus(target, room, user) {
    this.canUseConsole();
    
    try {
      // Find the git repository root from current directory
      const gitRoot = await findGitRoot('./');
      if (!gitRoot) {
        return this.errorReply(`No git repository found in current directory.`);
      }

      // Get git status
      const { stdout: status } = await execAsync('sudo git status', { cwd: gitRoot });
      
      // Get current branch
      const { stdout: branch } = await execAsync('sudo git branch --show-current', { cwd: gitRoot });
      
      // Get latest commit
      const { stdout: commit } = await execAsync('sudo git log -1 --oneline', { cwd: gitRoot });
      
      // Get remote URL
      let remoteUrl = 'Not configured';
      try {
        const { stdout: remote } = await execAsync('sudo git remote get-url origin', { cwd: gitRoot });
        remoteUrl = remote.trim();
      } catch {
        // Remote not configured, use default message
      }
      
      let resultMessage = '<div class="infobox">';
      resultMessage += '<strong>[GIT STATUS]</strong><br>';
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br>`;
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
      notifyStaff("Git status failed", './', user, err.message);
    }
  },

  async gitdiff(target, room, user) {
    this.canUseConsole();
    
    const filePath = target.trim();
    
    try {
      // Find the git repository root from current directory
      const gitRoot = await findGitRoot('./');
      if (!gitRoot) {
        return this.errorReply(`No git repository found in current directory.`);
      }

      // Build the git diff command
      let command = 'sudo git diff';
      if (filePath) {
        command += ` -- ${filePath}`;
      }
      
      const { stdout: diff } = await execAsync(command, { cwd: gitRoot });
      
      if (!diff.trim()) {
        if (filePath) {
          return this.sendReply(`No changes in file: ${filePath}`);
        } else {
          return this.sendReply('No uncommitted changes in working directory.');
        }
      }
      
      // Get stats about the changes
      let statsCommand = 'sudo git diff --stat';
      if (filePath) {
        statsCommand += ` -- ${filePath}`;
      }
      const { stdout: stats } = await execAsync(statsCommand, { cwd: gitRoot });
      
      let resultMessage = '<div class="infobox">';
      resultMessage += '<strong>[GIT DIFF]</strong><br>';
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br>`;
      if (filePath) {
        resultMessage += `<strong>File:</strong> ${Chat.escapeHTML(filePath)}<br>`;
      } else {
        resultMessage += '<strong>Showing:</strong> All uncommitted changes<br>';
      }
      resultMessage += '<br>';
      
      // Show stats summary
      if (stats.trim()) {
        resultMessage += '<details open><summary><strong>Summary (Click to collapse)</strong></summary>';
        resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">';
        resultMessage += Chat.escapeHTML(stats);
        resultMessage += '</pre>';
        resultMessage += '</details><br>';
      }
      
      // Show full diff in a collapsible section
      resultMessage += '<details><summary><strong>Full Diff (Click to expand)</strong></summary>';
      resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; max-height: 400px; overflow: auto; font-size: 11px; white-space: pre-wrap; word-wrap: break-word;">';
      resultMessage += Chat.escapeHTML(diff);
      resultMessage += '</pre>';
      resultMessage += '</details>';
      
      resultMessage += '<br><small>💡 Use <code>/gitstash save</code> to temporarily save these changes</small>';
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      notifyStaff("Git diff viewed", gitRoot, user, filePath || 'all files');
      
    } catch (err: any) {
      this.errorReply('Git diff failed: ' + err.message);
      notifyStaff("Git diff failed", './', user, err.message);
    }
  },

  async gitstash(target, room, user) {
    this.canUseConsole();
    
    const action = target.trim().toLowerCase() || 'list';
    const validActions = ['save', 'pop', 'list', 'show', 'drop', 'clear'];
    
    if (!validActions.includes(action)) {
      return this.errorReply(
        `Invalid action. Valid actions: ${validActions.join(', ')}\n` +
        `Usage: /gitstash [action]`
      );
    }
    
    try {
      // Find the git repository root from current directory
      const gitRoot = await findGitRoot('./');
      if (!gitRoot) {
        return this.errorReply(`No git repository found in current directory.`);
      }

      let command = '';
      let actionTitle = '';
      
      switch (action) {
        case 'save':
          command = 'sudo git stash push -u';
          actionTitle = 'STASH SAVE';
          this.sendReply('Stashing changes...');
          break;
        case 'pop':
          command = 'sudo git stash pop';
          actionTitle = 'STASH POP';
          this.sendReply('Applying and removing latest stash...');
          break;
        case 'list':
          command = 'sudo git stash list';
          actionTitle = 'STASH LIST';
          break;
        case 'show':
          command = 'sudo git stash show -p';
          actionTitle = 'STASH SHOW';
          break;
        case 'drop':
          command = 'sudo git stash drop';
          actionTitle = 'STASH DROP';
          this.sendReply('Dropping latest stash...');
          break;
        case 'clear':
          command = 'sudo git stash clear';
          actionTitle = 'STASH CLEAR';
          this.sendReply('Clearing all stashes...');
          break;
      }
      
      const { stdout, stderr } = await execAsync(command, { cwd: gitRoot });
      
      // Handle empty stash list
      if (action === 'list' && !stdout.trim()) {
        return this.sendReply('No stashes found.');
      }
      
      let resultMessage = '<div class="infobox">';
      resultMessage += `<strong>[GIT ${actionTitle}]</strong><br>`;
      resultMessage += `<strong>Repository Root:</strong> ${Chat.escapeHTML(gitRoot)}<br><br>`;
      
      if (stdout) {
        // For list action, format nicely
        if (action === 'list') {
          const stashes = stdout.trim().split('\n');
          resultMessage += `<strong>Stashes (${stashes.length}):</strong><br>`;
          resultMessage += '<details open><summary><strong>Stash List (Click to collapse)</strong></summary>';
          resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; overflow-x: auto;">';
          resultMessage += Chat.escapeHTML(stdout);
          resultMessage += '</pre>';
          resultMessage += '</details>';
        } else {
          resultMessage += '<details open><summary><strong>Output (Click to collapse)</strong></summary>';
          resultMessage += '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; max-height: 400px; overflow: auto;">';
          resultMessage += Chat.escapeHTML(stdout);
          resultMessage += '</pre>';
          resultMessage += '</details>';
        }
      }
      
      if (stderr) {
        resultMessage += '<details><summary><strong>Info</strong></summary>';
        resultMessage += '<pre style="background: #2d2d2d; color: #ffd700; padding: 10px; border-radius: 4px; overflow-x: auto;">';
        resultMessage += Chat.escapeHTML(stderr);
        resultMessage += '</pre>';
        resultMessage += '</details>';
      }
      
      // Add helpful tips based on action
      if (action === 'save') {
        resultMessage += '<br><small>💡 Use <code>/gitstash pop</code> to restore these changes later</small>';
      } else if (action === 'list' && stdout.trim()) {
        resultMessage += '<br><small>💡 Use <code>/gitstash pop</code> to restore the latest stash</small>';
      }
      
      resultMessage += '</div>';
      
      this.sendReplyBox(resultMessage);
      notifyStaff(`Git stash ${action}`, gitRoot, user);
      
    } catch (err: any) {
      const errorMsg = err.message || err.toString();
      
      // Handle common errors
      if (errorMsg.includes('No stash entries found') || errorMsg.includes('No local changes')) {
        if (action === 'pop' || action === 'drop') {
          return this.sendReply('No stashes to restore. Use /gitstash list to see available stashes.');
        } else if (action === 'save') {
          return this.sendReply('No local changes to stash. Working tree is clean.');
        }
      }
      
      this.errorReply(`Git stash ${action} failed: ` + errorMsg);
      notifyStaff(`Git stash ${action} failed`, './', user, errorMsg);
    }
  },

  githelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Git Integration Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/gitpull</code> - Pull latest changes from remote repository</li>` +
      `<li><code>/gitstatus</code> - Show git status, branch, remote, and latest commit</li>` +
      `<li><code>/gitdiff [file]</code> - Show uncommitted changes (all files or specific file)</li>` +
      `<li><code>/gitstash [action]</code> - Manage stashed changes (save/pop/list/show/drop/clear)</li>` +
      `</ul>` +
      `<small>All commands require Console/Owner permission.</small><br>` +
      `<small><strong>Smart Feature:</strong> Commands automatically find the git repository root from current directory!</small><br><br>` +
      `<strong>Recommended Workflow:</strong><br>` +
      `1. <code>/gitstatus</code> - Check current repository state<br>` +
      `2. <code>/gitdiff</code> - Review your uncommitted changes<br>` +
      `3. <code>/gitstash save</code> - Stash any local changes (if needed)<br>` +
      `4. <code>/gitpull</code> - Pull latest from remote<br>` +
      `5. <code>/gitstash pop</code> - Restore your stashed changes (if needed)<br><br>` +
      `<strong>Stash Actions:</strong><br>` +
      `• <code>/gitstash save</code> - Temporarily save uncommitted changes<br>` +
      `• <code>/gitstash list</code> - View saved stashes<br>` +
      `• <code>/gitstash pop</code> - Restore and remove latest stash<br>` +
      `• <code>/gitstash show</code> - Preview latest stash changes<br>` +
      `• <code>/gitstash drop</code> - Delete latest stash<br>` +
      `• <code>/gitstash clear</code> - Delete all stashes<br><br>` +
      `<strong>Examples:</strong><br>` +
      `• <code>/gitdiff config/config.ts</code> - Show changes in specific file<br>` +
      `• <code>/gitdiff</code> - Show all uncommitted changes<br><br>` +
      `<strong>If merge conflicts occur:</strong><br>` +
      `• Abort: Run <code>sudo git merge --abort</code> manually in terminal<br>` +
      `• Or resolve conflicts manually and commit via terminal<br><br>` +
      `<small><strong>Note:</strong> For committing and pushing changes, use git commands directly in your VPS terminal to avoid conflicts.</small>` +
      `</div>`
    );
  },
};
