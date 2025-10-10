/*
* Pokemon Showdown
* Custom Animations
* @license MIT
*/

import { FS } from '../../lib';
import { ImpulseDB } from '../../impulse/impulse-db';

const STAFF_ROOM_ID = 'staff';
const ANIMATION_LOG_PATH = 'logs/customanimations.txt';

interface CustomAnimationDocument {
  _id: string; // userid
  animation: string; // Animation name/key
  duration?: number; // Animation duration in seconds
  delay?: number; // Animation delay in seconds
  iteration?: string; // Animation iteration count
  direction?: string; // Animation direction
  fillMode?: string; // Animation fill mode
  timingFunction?: string; // Animation timing function
  createdAt: Date;
  updatedAt: Date;
}

// Get typed MongoDB collection for custom animations
const CustomAnimationDB = ImpulseDB<CustomAnimationDocument>('customanimations');

// Predefined animations
const PREDEFINED_ANIMATIONS = {
  pulse: {
    name: 'Pulse',
    description: 'Gentle pulsing effect',
    keyframes: '0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); }',
    duration: 2,
    iteration: 'infinite',
    timingFunction: 'ease-in-out'
  },
  bounce: {
    name: 'Bounce',
    description: 'Bouncing effect',
    keyframes: '0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); }',
    duration: 1,
    iteration: 'infinite',
    timingFunction: 'ease-in-out'
  },
  glow: {
    name: 'Glow',
    description: 'Glowing effect',
    keyframes: '0% { box-shadow: 0 0 5px rgba(0,255,0,0.5); } 50% { box-shadow: 0 0 20px rgba(0,255,0,0.8); } 100% { box-shadow: 0 0 5px rgba(0,255,0,0.5); }',
    duration: 2,
    iteration: 'infinite',
    timingFunction: 'ease-in-out'
  },
  shake: {
    name: 'Shake',
    description: 'Shaking effect',
    keyframes: '0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); }',
    duration: 0.5,
    iteration: 'infinite',
    timingFunction: 'ease-in-out'
  },
  rotate: {
    name: 'Rotate',
    description: 'Rotating effect',
    keyframes: '0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }',
    duration: 3,
    iteration: 'infinite',
    timingFunction: 'linear'
  },
  fade: {
    name: 'Fade',
    description: 'Fading effect',
    keyframes: '0%, 100% { opacity: 1; } 50% { opacity: 0.5; }',
    duration: 2,
    iteration: 'infinite',
    timingFunction: 'ease-in-out'
  },
  slide: {
    name: 'Slide',
    description: 'Sliding effect',
    keyframes: '0% { transform: translateX(-100%); } 100% { transform: translateX(100%); }',
    duration: 2,
    iteration: 'infinite',
    timingFunction: 'ease-in-out'
  },
  rainbow: {
    name: 'Rainbow',
    description: 'Rainbow color cycling',
    keyframes: '0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); }',
    duration: 3,
    iteration: 'infinite',
    timingFunction: 'linear'
  }
} as const;

async function logAnimationAction(action: string, staff: string, target: string, details?: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} | Staff: ${staff} | Target: ${target}${details ? ` | ${details}` : ''}\n`;
    await FS(ANIMATION_LOG_PATH).append(logEntry);
  } catch (err) {
    console.error('Error writing to custom animation log:', err);
  }
}

async function updateAnimations(): Promise<void> {
  try {
    // Fetch all animation documents from MongoDB
    const animationDocs = await CustomAnimationDB.find({});
    
    let newCss = '/* CUSTOM ANIMATIONS START */\n';
    
    // Add keyframe definitions
    for (const [key, animation] of Object.entries(PREDEFINED_ANIMATIONS)) {
      newCss += `@keyframes ${key} {\n  ${animation.keyframes}\n}\n`;
    }
    
    // Add user-specific animations
    for (const doc of animationDocs) {
      const userid = doc._id;
      const animation = doc.animation;
      const duration = doc.duration || PREDEFINED_ANIMATIONS[animation as keyof typeof PREDEFINED_ANIMATIONS]?.duration || 2;
      const delay = doc.delay || 0;
      const iteration = doc.iteration || PREDEFINED_ANIMATIONS[animation as keyof typeof PREDEFINED_ANIMATIONS]?.iteration || 'infinite';
      const direction = doc.direction || 'normal';
      const fillMode = doc.fillMode || 'both';
      const timingFunction = doc.timingFunction || PREDEFINED_ANIMATIONS[animation as keyof typeof PREDEFINED_ANIMATIONS]?.timingFunction || 'ease-in-out';
      
      // Apply to userlist
      newCss += `[id$="-userlist-user-${userid}"] {\n`;
      newCss += `  animation: ${animation} ${duration}s ${timingFunction} ${delay}s ${iteration} ${direction};\n`;
      newCss += `  animation-fill-mode: ${fillMode};\n`;
      newCss += `}\n`;
      
      // Apply to chat messages
      newCss += `[class$="chatmessage-${userid}"] {\n`;
      newCss += `  animation: ${animation} ${duration}s ${timingFunction} ${delay}s ${iteration} ${direction};\n`;
      newCss += `  animation-fill-mode: ${fillMode};\n`;
      newCss += `}\n`;
    }
    
    newCss += '/* CUSTOM ANIMATIONS END */\n';

    const file = FS('config/custom.css').readIfExistsSync().split('\n');
    const start = file.indexOf('/* CUSTOM ANIMATIONS START */');
    const end = file.indexOf('/* CUSTOM ANIMATIONS END */');
    
    if (start !== -1 && end !== -1) {
      file.splice(start, (end - start) + 1);
    }
    
    await FS('config/custom.css').writeUpdate(() => file.join('\n') + newCss);
    Impulse.reloadCSS();
  } catch (err) {
    console.error('Error updating custom animations:', err);
  }
}

export const commands: Chat.ChatCommands = {
  customanimation: 'animation',
  ca: 'animation',
  animation: {
    ''(target, room, user) {
      this.parse(`/animationhelp`);
    },
    
    async set(target, room, user) {
      this.checkCan('globalban');
      const parts = target.split(',').map(s => s.trim());
      const [name, animation, ...options] = parts;
      
      if (!name || !animation) return this.parse('/help animation');
      
      const userId = toID(name);
      if (userId.length > 19) return this.errorReply('Usernames are not this long...');
      
      // Validate animation
      if (!PREDEFINED_ANIMATIONS[animation as keyof typeof PREDEFINED_ANIMATIONS]) {
        return this.errorReply(`Invalid animation. Available: ${Object.keys(PREDEFINED_ANIMATIONS).join(', ')}`);
      }
      
      // Parse options
      const duration = options.find(opt => opt.startsWith('duration:'))?.split(':')[1];
      const delay = options.find(opt => opt.startsWith('delay:'))?.split(':')[1];
      const iteration = options.find(opt => opt.startsWith('iteration:'))?.split(':')[1];
      const direction = options.find(opt => opt.startsWith('direction:'))?.split(':')[1];
      const fillMode = options.find(opt => opt.startsWith('fill:'))?.split(':')[1];
      const timingFunction = options.find(opt => opt.startsWith('timing:'))?.split(':')[1];
      
      const now = new Date();
      
      // Check if user already has a custom animation
      if (await CustomAnimationDB.exists({ _id: userId })) {
        return this.errorReply('This user already has a custom animation. Remove it first with /animation delete [user] or use /animation update [user], [animation].');
      }
      
      // Insert the custom animation document
      await CustomAnimationDB.insertOne({
        _id: userId,
        animation,
        duration: duration ? parseFloat(duration) : undefined,
        delay: delay ? parseFloat(delay) : undefined,
        iteration: iteration || undefined,
        direction: direction || undefined,
        fillMode: fillMode || undefined,
        timingFunction: timingFunction || undefined,
        createdAt: now,
        updatedAt: now,
      });
      
      await updateAnimations();
      
      // Log the action
      await logAnimationAction('SET', user.name, userId, `Animation: ${animation}`);
      
      this.sendReply(`|raw|You have given ${Impulse.nameColor(name, true, false)} the custom animation: ${animation}`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has set your custom animation to: <strong>${animation}</strong><br /><center>Refresh to see the changes.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} set custom animation for ${Impulse.nameColor(name, true, false)}: <strong>${animation}</strong></div>`).update();
      }
    },
    
    async update(target, room, user) {
      this.checkCan('globalban');
      const parts = target.split(',').map(s => s.trim());
      const [name, animation, ...options] = parts;
      
      if (!name || !animation) return this.parse('/help animation');
      
      const userId = toID(name);
      
      // Check if user has a custom animation
      if (!await CustomAnimationDB.exists({ _id: userId })) {
        return this.errorReply('This user does not have a custom animation. Use /animation set to create one.');
      }
      
      // Validate animation
      if (!PREDEFINED_ANIMATIONS[animation as keyof typeof PREDEFINED_ANIMATIONS]) {
        return this.errorReply(`Invalid animation. Available: ${Object.keys(PREDEFINED_ANIMATIONS).join(', ')}`);
      }
      
      // Parse options
      const duration = options.find(opt => opt.startsWith('duration:'))?.split(':')[1];
      const delay = options.find(opt => opt.startsWith('delay:'))?.split(':')[1];
      const iteration = options.find(opt => opt.startsWith('iteration:'))?.split(':')[1];
      const direction = options.find(opt => opt.startsWith('direction:'))?.split(':')[1];
      const fillMode = options.find(opt => opt.startsWith('fill:'))?.split(':')[1];
      const timingFunction = options.find(opt => opt.startsWith('timing:'))?.split(':')[1];
      
      // Build update object
      const updateFields: any = {
        animation,
        updatedAt: new Date(),
      };
      
      if (duration) updateFields.duration = parseFloat(duration);
      if (delay) updateFields.delay = parseFloat(delay);
      if (iteration) updateFields.iteration = iteration;
      if (direction) updateFields.direction = direction;
      if (fillMode) updateFields.fillMode = fillMode;
      if (timingFunction) updateFields.timingFunction = timingFunction;
      
      // Update the animation
      await CustomAnimationDB.updateOne(
        { _id: userId },
        { $set: updateFields }
      );
      
      await updateAnimations();
      
      // Log the action
      await logAnimationAction('UPDATE', user.name, userId, `New Animation: ${animation}`);
      
      this.sendReply(`|raw|You have updated ${Impulse.nameColor(name, true, false)}'s custom animation to: ${animation}`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has updated your custom animation to: <strong>${animation}</strong><br /><center>Refresh to see the changes.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} updated custom animation for ${Impulse.nameColor(name, true, false)} to: <strong>${animation}</strong></div>`).update();
      }
    },
    
    async delete(target, room, user) {
      this.checkCan('globalban');
      const userId = toID(target);
      
      // Check if user has a custom animation
      if (!await CustomAnimationDB.exists({ _id: userId })) {
        return this.errorReply(`${target} does not have a custom animation.`);
      }
      
      // Get animation details before deletion for logging
      const animationDoc = await CustomAnimationDB.findOne(
        { _id: userId },
        { projection: { animation: 1 } }
      );
      
      // Delete the custom animation
      await CustomAnimationDB.deleteOne({ _id: userId });
      
      await updateAnimations();
      
      // Log the action
      const animationDetails = animationDoc ? `Removed Animation: ${animationDoc.animation}` : 'Animation removed';
      await logAnimationAction('DELETE', user.name, userId, animationDetails);
      
      this.sendReply(`You removed ${target}'s custom animation.`);
      
      const targetUser = Users.get(userId);
      if (targetUser?.connected) {
        targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has removed your custom animation.<br /><center>Refresh to see the changes.</center>`);
      }
      
      const staffRoom = Rooms.get(STAFF_ROOM_ID);
      if (staffRoom) {
        staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed custom animation for ${Impulse.nameColor(target, true, false)}.</div>`).update();
      }
    },
    
    async list(target, room, user) {
      this.checkCan('globalban');
      
      const page = parseInt(target) || 1;
      
      // Use findPaginated() for paginated results
      const result = await CustomAnimationDB.findPaginated({}, {
        page,
        limit: 20,
        sort: { _id: 1 }
      });
      
      if (result.total === 0) {
        return this.sendReply('No custom animations have been set.');
      }
      
      let output = `<div class="ladder pad"><h2>Custom Animations (Page ${result.page}/${result.totalPages})</h2><table style="width: 100%"><tr><th>User</th><th>Animation</th><th>Duration</th><th>Created</th></tr>`;
      
      for (const doc of result.docs) {
        const created = doc.createdAt ? doc.createdAt.toLocaleDateString() : 'Unknown';
        const duration = doc.duration || PREDEFINED_ANIMATIONS[doc.animation as keyof typeof PREDEFINED_ANIMATIONS]?.duration || 2;
        output += `<tr><td>${doc._id}</td><td><strong>${doc.animation}</strong></td><td>${duration}s</td><td>${created}</td></tr>`;
      }
      
      output += `</table></div>`;
      
      if (result.totalPages > 1) {
        output += `<div class="pad"><center>`;
        if (result.hasPrev) {
          output += `<button class="button" name="send" value="/animation list ${result.page - 1}">Previous</button> `;
        }
        if (result.hasNext) {
          output += `<button class="button" name="send" value="/animation list ${result.page + 1}">Next</button>`;
        }
        output += `</center></div>`;
      }
      
      this.sendReply(`|raw|${output}`);
    },
    
    async view(target, room, user) {
      const userId = toID(target);
      if (!userId) return this.parse('/help animation');
      
      // Get animation document
      const animationDoc = await CustomAnimationDB.findOne(
        { _id: userId },
        { projection: { animation: 1, duration: 1, delay: 1, iteration: 1, direction: 1, fillMode: 1, timingFunction: 1, createdAt: 1, updatedAt: 1 } }
      );
      
      if (!animationDoc) {
        return this.sendReply(`${target} does not have a custom animation.`);
      }
      
      const created = animationDoc.createdAt ? animationDoc.createdAt.toLocaleString() : 'Unknown';
      const updated = animationDoc.updatedAt ? animationDoc.updatedAt.toLocaleString() : 'Unknown';
      const animationInfo = PREDEFINED_ANIMATIONS[animationDoc.animation as keyof typeof PREDEFINED_ANIMATIONS];
      
      this.sendReplyBox(
        `<strong>Custom Animation for ${target}:</strong><br />` +
        `<strong>Animation:</strong> ${animationDoc.animation} (${animationInfo?.name || 'Unknown'})<br />` +
        `<strong>Description:</strong> ${animationInfo?.description || 'No description'}<br />` +
        `<strong>Duration:</strong> ${animationDoc.duration || animationInfo?.duration || 2}s<br />` +
        `<strong>Delay:</strong> ${animationDoc.delay || 0}s<br />` +
        `<strong>Iteration:</strong> ${animationDoc.iteration || animationInfo?.iteration || 'infinite'}<br />` +
        `<strong>Direction:</strong> ${animationDoc.direction || 'normal'}<br />` +
        `<strong>Fill Mode:</strong> ${animationDoc.fillMode || 'both'}<br />` +
        `<strong>Timing:</strong> ${animationDoc.timingFunction || animationInfo?.timingFunction || 'ease-in-out'}<br />` +
        `<strong>Created:</strong> ${created}<br />` +
        `<strong>Last Updated:</strong> ${updated}`
      );
    },
    
    async preview(target, room, user) {
      if (!this.runBroadcast()) return;
      
      const animation = target.toLowerCase();
      if (!PREDEFINED_ANIMATIONS[animation as keyof typeof PREDEFINED_ANIMATIONS]) {
        return this.errorReply(`Invalid animation. Available: ${Object.keys(PREDEFINED_ANIMATIONS).join(', ')}`);
      }
      
      const animationInfo = PREDEFINED_ANIMATIONS[animation as keyof typeof PREDEFINED_ANIMATIONS];
      
      this.sendReplyBox(
        `<strong>Animation Preview: ${animationInfo.name}</strong><br />` +
        `<strong>Description:</strong> ${animationInfo.description}<br />` +
        `<strong>Duration:</strong> ${animationInfo.duration}s<br />` +
        `<strong>Iteration:</strong> ${animationInfo.iteration}<br />` +
        `<strong>Timing:</strong> ${animationInfo.timingFunction}<br />` +
        `<div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc; display: inline-block; animation: ${animation} ${animationInfo.duration}s ${animationInfo.timingFunction} infinite;">` +
        `Preview: ${user.name}` +
        `</div>`
      );
    },
    
    async available(target, room, user) {
      if (!this.runBroadcast()) return;
      
      let output = `<div class="ladder pad"><h2>Available Animations</h2><table style="width: 100%"><tr><th>Key</th><th>Name</th><th>Description</th><th>Duration</th><th>Preview</th></tr>`;
      
      for (const [key, animation] of Object.entries(PREDEFINED_ANIMATIONS)) {
        output += `<tr>`;
        output += `<td><strong>${key}</strong></td>`;
        output += `<td>${animation.name}</td>`;
        output += `<td>${animation.description}</td>`;
        output += `<td>${animation.duration}s</td>`;
        output += `<td><button class="button" name="send" value="/animation preview ${key}">Preview</button></td>`;
        output += `</tr>`;
      }
      
      output += `</table></div>`;
      this.sendReply(`|raw|${output}`);
    },
    
    async search(target, room, user) {
      this.checkCan('globalban');
      
      if (!target) return this.errorReply('Please provide a search term.');
      
      const searchTerm = toID(target);
      
      // Search for usernames containing the search term
      const animations = await CustomAnimationDB.find(
        { _id: { $regex: searchTerm, $options: 'i' } as any },
        { projection: { _id: 1, animation: 1, duration: 1 } }
      );
      
      if (animations.length === 0) {
        return this.sendReply(`No custom animations found matching "${target}".`);
      }
      
      let output = `<div class="ladder pad"><h2>Search Results for "${target}"</h2><table style="width: 100%"><tr><th>User</th><th>Animation</th><th>Duration</th></tr>`;
      
      for (const doc of animations) {
        const duration = doc.duration || PREDEFINED_ANIMATIONS[doc.animation as keyof typeof PREDEFINED_ANIMATIONS]?.duration || 2;
        output += `<tr><td>${doc._id}</td><td><strong>${doc.animation}</strong></td><td>${duration}s</td></tr>`;
      }
      
      output += `</table></div>`;
      this.sendReply(`|raw|${output}`);
    },
    
    async count(target, room, user) {
      this.checkCan('globalban');
      
      const total = await CustomAnimationDB.countDocuments({});
      this.sendReply(`There are currently ${total} custom animation(s) set.`);
    },
    
    async logs(target, room, user) {
      this.checkCan('globalban');
      
      try {
        const logContent = await FS(ANIMATION_LOG_PATH).readIfExists();
        
        if (!logContent) {
          return this.sendReply('No custom animation logs found.');
        }
        
        const lines = logContent.trim().split('\n');
        const numLines = parseInt(target) || 50;
        
        if (numLines < 1 || numLines > 500) {
          return this.errorReply('Please specify a number between 1 and 500.');
        }
        
        // Get the last N lines and reverse to show latest first
        const recentLines = lines.slice(-numLines).reverse();
        
        let output = `<div class="ladder pad"><h2>Custom Animation Logs (Last ${recentLines.length} entries - Latest First)</h2>`;
        output += `<div style="max-height: 370px; overflow: auto; font-family: monospace; font-size: 11px;">`;
        
        // Add each log entry with a horizontal line separator
        for (let i = 0; i < recentLines.length; i++) {
          output += `<div style="padding: 8px 0;">${Chat.escapeHTML(recentLines[i])}</div>`;
          if (i < recentLines.length - 1) {
            output += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 0;">`;
          }
        }
        
        output += `</div></div>`;
        
        this.sendReply(`|raw|${output}`);
      } catch (err) {
        console.error('Error reading custom animation logs:', err);
        return this.errorReply('Failed to read custom animation logs.');
      }
    },
  },
  
  animationhelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Custom Animation Commands</center></b><br>` +
      `<ul>` +
      `<li><code>/animation set [username], [animation] [options]</code> - Gives [user] a custom animation</li>` +
      `<li><code>/animation update [username], [animation] [options]</code> - Updates an existing custom animation</li>` +
      `<li><code>/animation delete [username]</code> - Removes a user's custom animation</li>` +
      `<li><code>/animation list [page]</code> - Lists all custom animations with pagination</li>` +
      `<li><code>/animation view [username]</code> - View details about a user's custom animation</li>` +
      `<li><code>/animation preview [animation]</code> - Preview an animation effect</li>` +
      `<li><code>/animation available</code> - List all available animations</li>` +
      `<li><code>/animation search [term]</code> - Search for custom animations by username</li>` +
      `<li><code>/animation count</code> - Show total number of custom animations</li>` +
      `<li><code>/animation logs [number]</code> - View recent custom animation log entries (default: 50, max: 500)</li>` +
      `</ul>` +
      `<h4>Available Animations:</h4>` +
      `<ul>` +
      `<li><code>pulse</code> - Gentle pulsing effect</li>` +
      `<li><code>bounce</code> - Bouncing effect</li>` +
      `<li><code>glow</code> - Glowing effect</li>` +
      `<li><code>shake</code> - Shaking effect</li>` +
      `<li><code>rotate</code> - Rotating effect</li>` +
      `<li><code>fade</code> - Fading effect</li>` +
      `<li><code>slide</code> - Sliding effect</li>` +
      `<li><code>rainbow</code> - Rainbow color cycling</li>` +
      `</ul>` +
      `<h4>Options:</h4>` +
      `<ul>` +
      `<li><code>duration:X</code> - Animation duration in seconds</li>` +
      `<li><code>delay:X</code> - Animation delay in seconds</li>` +
      `<li><code>iteration:X</code> - Number of iterations (infinite, 1, 2, etc.)</li>` +
      `<li><code>direction:X</code> - Animation direction (normal, reverse, alternate, alternate-reverse)</li>` +
      `<li><code>fill:X</code> - Animation fill mode (none, forwards, backwards, both)</li>` +
      `<li><code>timing:X</code> - Timing function (ease, linear, ease-in, ease-out, ease-in-out)</li>` +
      `</ul>` +
      `<small>All commands except view, preview, and available require @ or higher permission.<br>` +
      `Aliases: /customanimation, /ca</small>` +
      `</div>`
    );
  },
  cahelp: 'animationhelp',
};