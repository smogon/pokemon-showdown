/*************************
* RPG REVAMP - STEP 1
**************************/

/* === Text & Utility Classes === */
.rpg-text-error {
    color: #E63946; /* Strong red for errors */
}
.dark .rpg-text-error {
    color: #ff6677; /* Lighter red for dark mode */
}

.rpg-text-success {
    color: #28a745; /* Green for success */
}
.dark .rpg-text-success {
    color: #40c040; /* Lighter green */
}

.rpg-text-warning {
    color: #FF8C00; /* Orange for warnings */
}
.dark .rpg-text-warning {
    color: #ffaa33; /* Lighter orange */
}

.rpg-text-info {
    color: #007bff; /* Blue for info */
}
.dark .rpg-text-info {
    color: #55aaff; /* Lighter blue */
}

.rpg-text-muted {
    color: #6c757d; /* Muted gray for less important text */
}
.dark .rpg-text-muted {
    color: #aaaaaa; /* Lighter gray for dark mode */
}

.rpg-text-center {
    text-align: center;
}
.rpg-margin-top {
    margin-top: 15px;
}

/* === Grid & Layout === */
.rpg-grid-2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}
.rpg-grid-3col {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

/* === HP Bar Colors === */
.rpg-hp-high {
    background-color: #32CD32; /* Lime Green */
}
.dark .rpg-hp-high {
    background-color: #40c040; /* Slightly darker green */
}

.rpg-hp-mid {
    background-color: #F8D030; /* Yellow */
}
.dark .rpg-hp-mid {
    background-color: #e8c020; /* Slightly darker yellow */
}

.rpg-hp-low {
    background-color: #E63946; /* Red */
}
.dark .rpg-hp-low {
    background-color: #d84040; /* Slightly darker red */
}

/* === Battle UI Layout === */
.rpg-battle-ui {
    display: grid;
    grid-template-rows: 1fr 1fr;
    height: 320px; /* Creates a good 4:3-ish aspect for the battle area */
    position: relative;
    background: #f0f0f0; /* Fallback background */
    border-radius: 8px;
    overflow: hidden; /* Ensures sprites don't bleed out */
}
.dark .rpg-battle-ui {
    background: #222;
}

.rpg-opponent-side {
    position: relative; /* Container for opponent sprite + info box */
}
.rpg-player-side {
    position: relative; /* Container for player sprite + info box */
}

/* === Battle Sprites === */
.rpg-pokemon-sprite-front {
    position: absolute;
    bottom: -10px; /* Sits on the dividing line */
    left: 60%;
    width: 60px; /* Reduced from 120px */
    height: 60px; /* Reduced from 120px */
    image-rendering: pixelated; /* Keeps the pixel art sharp */
    z-index: 10;
}
.rpg-pokemon-sprite-back {
    position: absolute;
    bottom: -20px; /* Sits on the bottom edge */
    left: 20px;
    width: 60px; /* Reduced from 160px */
    height: 60px; /* Reduced from 160px */
    image-rendering: pixelated;
    z-index: 10;
}

/* === Battle Info Boxes (Name/HP/Status) === */
.rpg-battle-infobox {
    background: #f8f8f8;
    border: 4px solid #555;
    border-radius: 12px;
    padding: 8px;
    width: 220px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: absolute;
    z-index: 20; /* Sits on top of sprites */
}
.dark .rpg-battle-infobox {
    background: #333;
    border-color: #aaa;
    color: #eee;
}

.rpg-player-infobox {
    bottom: 20px;
    right: 20px;
}
.rpg-opponent-infobox {
    top: 20px;
    left: 20px;
}

/* === Party/Menu Layouts === */
.rpg-party-grid {
    display: grid;
    /* 2-wide grid for the party, like in modern games */
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.rpg-party-card {
    background: #fff;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    /* Grid to align psicon and info */
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 10px;
    align-items: center;
}
.dark .rpg-party-card {
    background: #444;
    border-color: #777;
}

.rpg-party-card psicon {
    width: 48px;
    height: 48px;
    image-rendering: pixelated;
}
