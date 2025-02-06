Todos:
[x] - Next round button
[x] - Finish Homepage
[x] - Give points to player whose song it was
[x] - adjust homepage how to play section ui
[] - Display number of songs in queue
NOTE: possibly the reason why the whole line gets filled instead of just last step, is because its
recreated every time meaning it will animate from beginning, check it out, but still it would be nice
if I managed to find a way to do it without using `keyed` and just update it accordingly, currently
that does not animate the transition for some reason
[] - show song requester when playing the song + in the delay
[] - Add loading state when joining to lobby
[] - Make leaderboards when not hitting the goal as temporary or somehow make it obvious that its not final
and then show the current leaderboard whenever the game actually ends, then reset the player points
[] - try to refactor how GuessingPhase works, the fallback especially

[] - currently points are being summed on client, maybe send from server the total points and not only the gained ones

[] - fix timer bug when out of focus in browser -> Can't do much about it
