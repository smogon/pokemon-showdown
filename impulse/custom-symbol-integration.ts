/*
* Pokemon Showdown
* Custom Symbol Integration
* Modifies User.getIdentity to support custom symbols
* @license MIT
*/

// This file hooks into the User class to add custom symbol support
// It should be loaded after the User class is defined

const originalGetIdentity = Users.User.prototype.getIdentity;

Users.User.prototype.getIdentity = function(room: BasicRoom | null = null) {
  // Check if user has a custom symbol
  const customSymbol = (this as any).customSymbol;
  
  if (customSymbol) {
    const punishgroups = Config.punishgroups || { locked: null, muted: null };
    if (this.locked || this.namelocked) {
      const lockedSymbol = (punishgroups.locked?.symbol || '\u203d');
      return lockedSymbol + this.name;
    }
    if (room) {
      if (room.isMuted(this)) {
        const mutedSymbol = (punishgroups.muted?.symbol || '!');
        return mutedSymbol + this.name;
      }
      // In rooms, still use room auth if it's higher than custom symbol
      const roomGroup = room.auth.get(this);
      // Only use custom symbol if user doesn't have a higher room rank
      if (roomGroup === this.tempGroup || roomGroup === ' ') {
        return customSymbol + this.name;
      }
      return roomGroup + this.name;
    }
    if (this.semilocked) {
      const mutedSymbol = (punishgroups.muted?.symbol || '!');
      return mutedSymbol + this.name;
    }
    // Use custom symbol instead of tempGroup
    return customSymbol + this.name;
  }
  
  // If no custom symbol, use original getIdentity method
  return originalGetIdentity.call(this, room);
};
