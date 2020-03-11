# Motive, variations, AI? (Tuesday, 10 March 2020, 10:36AM)

## Motive

I just pushed a working version of __Reversal__ chess which works surprisingly well.

Overall, the point of _Chesses 2_ is just to make some more variations, not least because I've been trying and failing to work on _v r 4_ and also because I feel depressed by the (non) reception of _The Artist is Present 2_ (other than Marina herself, hilariously). Seems like a time to work on something conceptually simple that just requires having a few ideas and implementing them. Plus it's the semester etc. and it's hard to get anything terribly sophisticated done. All that spells: variations.

## The variations

I had a backlog of potential variations (many of which are terrible), so I basically need to establish a solid eight and implement them. Again focusing on things that are plausible within the chess.js/chessboard.js frame. At present, then, the list looks like this:

1. __REVERAL__: when you make a move you piece turns into the opponent's colour at the end. (I suppose we need an exception for the king, because that wouldn't make a whole lot of sense. Obviously there are also issues around checkmate since you could checkmate yourself in the process of moving a piece in some circumstances.)
2. __FOG__: implement fog of war in chess. Relies on turn taking and players agreeing not to look at the board when it's not their turn. Two potential representations of vision are: complete fog until you select a piece, at which point you see what it sees (maybe capture potentials, maybe some kind of generic view) (maybe you're locked to that piece, maybe you can survey the landscape before making your move); or your side shows you everything you can see based on the combined vision of all pieces, and then you make your move.
3. __LIFE__: Some version of the Game of Life but for chess pieces. A specific number of adjacent pieces leads to survival/death. It could be something that just doesn't work. Have to think about how you choose new pieces, possible by adding up piece value and averaging to get the value of the new piece? Could also perform life calculations based on adjacent piece value instead of just pieces. Related would be the idea of a "Go Chess" or "Othello" chess.
4. __AR__: Just display a chessboard with the idea that they put chess pieces on the screen and play chess? How to communicate that idea? It's pretty fucking funny. (I've also called this 4'33" in the past, though I don't think that necessarily makes sense?) Is this actually AR or is in augmented virtuality? Or some other thing? AR: "an interactive experience of a real-world environment where the objects that reside in the real world are enhanced by computer-generated perceptual information" ([Wikipedia](https://en.wikipedia.org/wiki/Augmented_reality)). So in a sense the game augments reality by creating a virtual chess board. It's maybe silly enough to work? Might need an "i" button for info about each game though.
5. __MUSICAL__: The board as a tone matrix, pieces each have a sound they make. Pawns as drums?
6. __TRACES__: A move piece leaves a trail behind it (either just on the square it left or on all intermediate squares?) leading to a kind of heatmap (could be HEATMAP) of action on the board (if they fade over time), or just a kind of painting (if no fading). Could also consider drawing literal lines (ala SOL LEWITT) to create a kind of drawing out of the game. Save the resulting artwork at the end.
7. __DHARMA__: (Is that what the concept is called?) When you move a piece it turns into the next piece in series (either going up or down, probably down).
8. __SOLOMON__: (Kind of?) where one player chooses the piece and the other player chooses the move.

Maybe pending technology...

1. __ENHANCE__ - I like the idea of voice controlled chess, especially if it has built-in disobedience, and especially if the computer uses that to beat you? With voice too so it can "apologise" when it puts you in harm's way. Alternatively it could be a blind chess game, where you speak moves but can't see the board.
2. __SKILLS__ - I like the idea of a golf-swing kind of approach where you have to use some kind of timing skill to get the move you want. Most obvious would be that a selected piece cycles all its moves and you click again to trigger the move, requiring skill to hit the move you want. (Harder alternative would be a kind of Angry Bird/Pool thing where you apply a force to a piece and it ends up on the square you manage to get to, but there are a lot of problems with that?)
3. __GREYS__ - I still like the idea of a completely grey chess set where every piece can move in both black and white directions and can capture any piece etc. Unclear how you handle check and checkmate in a scenario like this, but there's just something kind of captivating about such a miasma? If both kings are grey there's literally no end, whereas if you maintained a black and white king the game ends on move one through a queen capture of a king.

## AI?

One of the things lacking with the original game was the lack of an AI for people to play against solo. The obvious problem being that an AI is probably going to suck pretty bad. Though THAT said I suppose so long as you have a simulating function that returns board positions it's still possible to evaluate? But no doubt it would still be kind of horrible? Maybe still not worth the amount of effort it would cost?

---

# How does the grey fog fog? (Wednesday, 11 March 2020, 14:06PM)

Since last we spoke I have REVERSAL, SAMSARA, and (a version of) FOG going. REVERSAL and SAMSARA work pretty great just as they are (with the obvious need to tweak for a few special circumstances like check).

FOG is giving me some trouble. But it's design trouble mostly. The question is "what can a chess piece see?" And I'm not sure how to answer. Here are some possibilities, is one of them right?

- __A chess piece can see all (eight) adjacent squares and nothing more.__ This implies many circumstances in which a piece can't see a square it might move to, leading to blind moves. It might be possible to deduce whether there's a piece (or not) based on the potential moves of multiple of your pieces, which might be interesting (or not). This has the advantage of never revealing "too much" of the board at any one time, but may strip enough information that the game feels random.
- __A chess piece can see all (eight) adjacent squares and all squares that it could move to (including captures)__. This is what I've got implemented right now and it allows you to see a lot of squares pretty swiftly. It's not bad though actually? Playing into a game a bit, you still can't see much at the start, as the ends of the board are very mysterious. I also like that you can have asymmetric sighting here, like a bishop seeing a knight it could capture but the knight not seeing the bishop. Also obviously the capture of a piece is significant because of the visibility change. (I think the biggesting thing I don't love is just the aesthetics, it might be that you could have an additive visibility thing... every sighting subtracts 0.1 opacity of the fog or something - doesn't really change anything but just makes more distant/less seen things more murky, more liable to lead to a mistake?)
- __A chess piece can see adjacent squares and move squares, but with diminishing ability__. So here the further the square the less clearly you can see it, with a kind of fall-off. This could be part of the "additive/subtractive" idea in the previous one too.

I suppose what I'm seeing here is: I like the implications of adjacent+moves, though there MAY be something to be said for only moves. But the key is it needs to look a little more mysterious and fun, and I think some kind of version where squares' visibility are controlled by how many units can see them is a solid choice, rather than just on and off.

---

# XR and LeWitt and Next? (Wednesday, 11 March 2020, 16:02PM)

## XR

I made the XR (cross reality) game of my dreams (name courtesy of Rilla after some consultation about the correct buzzy term to apply here). It's literally just a chess board with no pieces on it, with the idea that it's cross-reality because it provides a "virtual" chess board and the player brings some pieces and plays the game on top, maybe by tipping their laptop over or by playing with tiny pieces on a phone, say.

I like this because I think it perfectly meets my desire to make a game of chess that's just a board (or some other ultra-static version). I'd originally been thinking about it as 4'33" but pitching it as next-gen technology is much funnier.

The one "issue" it introduces is the need for an information panel to explain the joke in case it's not totally clear. That's not ideal by any means, but having information panels might be a way to invite more people in and to clarify specific rules.

## LeWitt

Got a prototype of LeWitt up and running with a p5 canvas laid over the chess board. It's already quite satisfying, with just the potential hurdle of making the lines themselves a bit more "human" in keeping with the idea/spirit of LeWitt's wall drawings. Each piece draws a line through its trajectory. I like the idea you can save out the work you create after finishing the game. It should even be an automatic thing that prompts you to download the image.

Remaining experiments are around humanising. I'll try p5.scribble and maybe my own line drawing function with noise() added to wobble it. Can even lerp the line over the move time. It may end up better rolling my own just because I'll have some control.

## Next?

So I have five that I'm genuinely satisfied with. I think FOG is the crowd pleaser here (just as Gravity was previously), and I'm fine with that. I need three more for a set and I have six possibilities: music, traces/heatmap, cut/choose, greys, life, skill...

Unsurprisingly I've left these ones until later because less immediately jazzed by them. The heatmap won't be very hard, so that may make the most sense. Could either map generic activity or could map black and white separately. Could make captures "hotter" that not. Could mark out trajectories of movement or could not. I wonder if it will just look unintelligible.

Music is semi easy but I wonder if it will sound just terrible. If it does... so be it? But if it's not interesting then... meh?

There's the problem right? They might just not actually be interesting. But obviously I just make them and see what happens. So I should make: heatmap, music, and probably life just because that's such a weird idea. But I also really like cut/choose.
