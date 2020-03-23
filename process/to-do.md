# General to-dos

- ~~Add an information window to explain any given game~~
- ~~Make the actual info panel look better~~

# ~~AI?~~

- Do I dare implement some kind of primitive AI? Do I have the right kind of possibilities for lookahead? I suspect it's just not worth it as per usual, too hard, not enough part of the idea. Let people play themselves.

# The variations

## REVERSAL

- ~~Make basic working version~~
- ~~What happens if you move a king? (Nothing.)~~
- ~~__IF YOU PUT YOURSELF IN CHECK FROM THE REVERSED PIECE YOU LOSE MY FRIEND__ Think about check and checkmate (can you move a piece such that its final position would put you in check? Would have to be able to undo moves... ugh no) - will have to allow for checkmate that occurs when you check yourself and the turn changes over~~

## FOG

- ~~Make a shitty prototype~~
- ~~Make a better prototype~~
- ~~Add turn taking interface~~
- ~~__DONE__ Consider showing fog result of move before switching turns~~
- ~~Need first turn instructions~~
- ~~Reveal full board on checkmate (fade all fog away)~~

- Consider fancy turn-taking fog stuff like fading the fog to the current situation (painful for some reason, create extreme lag... probably trigger too many animations at the same time)

## XR (Cross-Reality)

- ~~__THAT WAS EASY__ Make a perfect first version~~

## MUSICAL

- ~~__SOUNDS SHIT__ Basic tone matrix prototype~~
- ~~__TRIED THIS AND IT'S BETTER__ Square by square for a melody, with per-piece tones? Per color synths?~~
- ~~__I THINK THE PER SQUARE MELODY IS THE RIGHT CHOICE__ How to make this sound interesting enough?~~
- ~~Fix the sound going on when you return to the menu~~
- ~~Improve the sound though~~
- ~~Visual indication of pieces currently playing~~
- ~~Welllll?~~

## LEWITT

- ~~Get a basic prototype working~~
- ~~__IT'S GREAT__ Consider p5.scribble~~
- ~~__NO NEED__ Consider writing your own line-drawing code with noise()~~
- ~~Fix pixel density of saved image?~~
- ~~__TOO HARD AND TOO WEIRD ON MOBILE, PLUS I FEEL I CAN ARGUE THAT THE DRAWING IT MADE IN SITU AND YOU SHOULDN'T TREAT IT AS SOMETHING TO SAVE SEPARATE FROM THAT__ Provide the option to save rather than doing it instantly (since on my phone at least it leads to just a weird screen with the image and it's unclear how to save it)~~

- Consider the timing of the drawing version appearing relative to game over

## SAMSARA

- ~~Make basic working version~~
- ~~__NOTHING__ What happens if you move a king?~~
- ~~__IT WORKS AS TESTED__ Think about check and checkmate (basically just need to check checkmate after the transformation...)~~

## 3D

- ~~__YUP, THAT WORKS I GUESS.__ Make a prototype~~

## CHESSQUERS/DRAUGHTS

- ~~__IT'S KIND OF HARD BUT WORTH DOING__ Start prototype and see if it's super hard or not~~
- ~~Improve prototype to display actual destination square, not capture square~~
- ~~__VERY SATISFYING. QUEEN IS FUCKING SCARY.__ Basic multiple jumps~~
- ~~__FOR NOW: NO CAPTURES WITH KNIGHTS__ Deal with knights~~
- ~~Remove captures for knights~~
- ~~En passant???~~
- ~~__ALSO JUST TOO CONFUSING TO ONLY BE ALLOWED TO SELECT PIECES WHICH CAN CAPTURE AND REDUCES THE MOVE SET TOO MUCH__ Should you force capturing moves against all other movement forms? Or only enforce on a piece once it's selected for movement? (Suspect the other version could end up being too much like suicide?)~~

- Check and checkmate?!?!?!?!
- Other weird shit???
- Think a saw a bug where a move made a sound but didn't execute?

## ~~LIFE~~

- ~~Shitty prototype~~
- ~~__SUSPECT THIS IS BETTER__ Try step per turn (after turn completes)~~

- Different values? It's really not working terribly well. DisapPOINTed.

## ~~ABRAHAM / I CUT YOU CHOOSE~~

- Starting to feel like this one just doesn't work...? Like, whichever way it might lead to super boring games. If you choose the piece for your opponent you'll obviously just choose useless pieces. If you choose the move you'll obviously just choose the worst move. So you'd end up with just a bad game since neither side of the equation really give decisive good/bad control over the game. Sad.

## ~~ENHANCE~~

## ~~SKILLS~~

## ~~GREYS~~
