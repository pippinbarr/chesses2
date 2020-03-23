# General to-dos

- ~~Add an information window to explain any given game~~
- ~~Make the actual info panel look better~~
- ~~Really would prefer the menu not to be offset left by the info button~~
- ~~Need to say "TAP" instead of click for mobile in Fog instructions~~
- ~~Font size of FOG instructions on mobile?~~
- ~~CSS for FOG on mobile is hideous (borders all broken up...)~~

- Wording of the info panels needs help?

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
- ~~BUG with turn instructions not going away on quit~~
- ~~__FUCK IT__ Consider fancy turn-taking fog stuff like fading the fog to the current situation (painful for some reason, create extreme lag... probably trigger too many animations at the same time)~~

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
- ~~Consider the timing of the drawing version appearing relative to game over~~

## SAMSARA

- ~~Make basic working version~~
- ~~__NOTHING__ What happens if you move a king?~~
- ~~__IT WORKS AS TESTED__ Think about check and checkmate (basically just need to check checkmate after the transformation...)~~

## 3D

- ~~__YUP, THAT WORKS I GUESS.__ Make a prototype~~

## CHECK-RS

- ~~__IT'S KIND OF HARD BUT WORTH DOING__ Start prototype and see if it's super hard or not~~
- ~~Improve prototype to display actual destination square, not capture square~~
- ~~__VERY SATISFYING. QUEEN IS FUCKING SCARY.__ Basic multiple jumps~~
- ~~__FOR NOW: NO CAPTURES WITH KNIGHTS__ Deal with knights~~
- ~~Remove captures for knights~~
- ~~En passant???~~
- ~~__ALSO JUST TOO CONFUSING TO ONLY BE ALLOWED TO SELECT PIECES WHICH CAN CAPTURE AND REDUCES THE MOVE SET TOO MUCH__ Should you force capturing moves against all other movement forms? Or only enforce on a piece once it's selected for movement? (Suspect the other version could end up being too much like suicide?)~~
- ~~__CHECK-RS FOR NOW__ The name, man... it's been done so many times in so many ways with so many names. Taken seem to be: Chesskers, chessers, ... I thought about CHECK-ERS, but it's nine letters which is non-ideal. Also ironic if my game ends up not including check?!~~
- ~~Check and checkmate (need to calculate legality of moves relative to check myself... but oh dear got this could include arbitrarily deep multijump moves... it may be that we just have to say that you win when you capture the king instead, and disable check and checkmate altogether). A good thing about this would be the ability to force a win by make the king jump into danger, which might actually be a way you can avoid stalemates!!~~
- ~~Allow all illegal moves so that it's possible to play into and through check as needed~~
- ~~Allow king to capture pieces (wasn't working)~~
- ~~Other weird shit??? There are probably stalemate cases that this version introduces, but I suspect it's not worth pursuing seriously (as with Gravity chess)~~
- ~~Recognize end of game on king captured!~~
- ~~__HAVEN'T SEEN IT IN A WHILE...__ BUG: Think a saw a bug where a move made a sound but didn't execute?~~
- ~~__NO THERE WOULD STILL BE VARIOUS STALEMATES LIKE K and P versus K I IMAGINE__ Is it possible that all positions other than KvK is winnable because you can force a jump into danger?~~
- ~~Castling through check (note that just asking for non-legal moves won't give you a castling move unfortunately)~~
    - ~~Maintain castling flag in game myself (e.g. any king or rook move disables forms of castling, including jumps)~~
    - ~~When moving king from e1/e8 check castling squares + flags and add castling move to the set of moves (may need special data like the jump captures to be able to carry it out correctly)~~
- ~~Check for win on first jump of sequences, not on move completed!~~

## ~~LIFE~~

- ~~Shitty prototype~~
- ~~__SUSPECT THIS IS BETTER__ Try step per turn (after turn completes)~~

- Different values? It's really not working terribly well. DisapPOINTed.

## ~~ABRAHAM / I CUT YOU CHOOSE~~

- Starting to feel like this one just doesn't work...? Like, whichever way it might lead to super boring games. If you choose the piece for your opponent you'll obviously just choose useless pieces. If you choose the move you'll obviously just choose the worst move. So you'd end up with just a bad game since neither side of the equation really give decisive good/bad control over the game. Sad.

## ~~ENHANCE~~

## ~~SKILLS~~

## ~~GREYS~~
