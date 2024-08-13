const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    optionsSuccessStatus: 200 // For legacy browser support
  }
  
app.use(cors(corsOptions));
const port = 3000;
const { pastesToBattleState, getPossibleActions, updateBattleStateWithActions } = require("./smogon_wrappers");

app.use(express.json());


const battleStates = new Map();

app.get('/getA', (req, res) => {
    res.send('A');
});

app.post('/pastesToBattleState', (req, res) => {
    const battle_state = pastesToBattleState(
        req.body.human_paste,
        req.body.ai_paste
    );
    const battleId = Date.now().toString(); // Simple unique ID
    battleStates.set(battleId, battle_state);
    res.json({ battleId });
});

app.get('/getPossibleActions', (req, res) => {
    const battle_state = battleStates.get(req.query.battleId);
    if (!battle_state) {
        return res.status(404).send('Battle state not found');
    }
    const possible_choices = getPossibleActions(battle_state)
    console.log('Possible choices:', possible_choices);
    res.send(possible_choices);
});

app.post('/updateBattleStateWithActions/:battleId', (req, res) => {
    console.log('Received battleId:', req.params.battleId);
    console.log('Received body:', req.body);

    const battle_state = battleStates.get(req.params.battleId);
    if (!battle_state) {
        console.log('Battle state not found for id:', req.params.battleId);
        return res.status(404).send('Battle state not found');
    }

    try {
        const updated_battle_state = updateBattleStateWithActions(
            battle_state,
            req.body.human_choice,
            req.body.ai_choice
        );
        battleStates.set(req.params.battleId, updated_battle_state);
        res.json({ battleId: req.params.battleId });
    } catch (error) {
        console.error('Error in updateBattleStateWithActions:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Add this catch-all route at the end of your file
app.use((req, res) => {
    console.log('404 - Not Found:', req.method, req.url);
    res.status(404).send('Not Found');
});