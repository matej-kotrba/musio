Todos:
[x] - Next round button
[x] - Finish Homepage
[x] - Give points to player whose song it was
[x] - adjust homepage how to play section ui
[x] - Display number of songs in queue
NOTE: possibly the reason why the whole line gets filled instead of just last step, is because its
recreated every time meaning it will animate from beginning, check it out, but still it would be nice
if I managed to find a way to do it without using `keyed` and just update it accordingly, currently
RESULT: So I actually used `keyed`, the problem of it coming from beginning was issue in SongQueueProgress
yet it still does not really spark joy to use keyed there
that does not animate the transition for some reason
[x] - Add loading state when joining to lobby
[x] - Make leaderboards when not hitting the goal as temporary or somehow make it obvious that its not final
and then show the current leaderboard whenever the game actually ends, then reset the player points
[x] - on leaderboards players are still not ordered by points
[x] - make sure that game options are only available for host, show them only for him
[x] - show song requester when playing the song + in the delay
[x] - create new lobby component for displaying it when points limit was not reached, so basically for the
temporary round lobby
[-] - WONT DO: try to refactor how GuessingPhase works, the fallback especially
[x] - change host when host leaves
[] - limit game start to have at least 2 players
[] - add alert when player does not choose song

[] - add rate limiting for sending messages
[x] - limit the length of the message
[] - remove lobby when last player leaves smartly, currently it does not happen at all
[] - host reloading page in lobby causes wierd bugs
[] - now new lobby is created when hitting the rest endpoint, just check if the lobby exist there and create it
only on join
[x] - currently points are being summed on client, maybe send from server the total points and not only the gained ones
[] - remove all the ws calls from regular code and move it to some actions layer for ws communication
[] - when user requests new lobby but does not join it, it should get deleted
[] - I disabled setting an expiration of the cookies beacuse it caused issues, look into it

[-] - fix timer bug when out of focus in browser -> Can't do much about it
