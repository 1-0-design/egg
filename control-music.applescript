-- Script to control Apple Music playback
-- Usage: osascript control-music.applescript [command]
-- Commands: play, pause, playpause, next, previous

on run argv
	set jsonOutput to "{}"
	
	if (count of argv) < 1 then
		return "{\"status\":\"error\", \"message\":\"No command specified. Use: play, pause, playpause, next, previous\"}"
	end if
	
	set command to item 1 of argv
	
	try
		tell application "Music"
			if it is running then
				if command is "play" then
					play
					set jsonOutput to "{\"status\":\"success\", \"command\":\"play\", \"playerState\":\"playing\"}"
				else if command is "pause" then
					pause
					set jsonOutput to "{\"status\":\"success\", \"command\":\"pause\", \"playerState\":\"paused\"}"
				else if command is "playpause" then
					playpause
					delay 0.5 -- Small delay to get updated player state
					set playerStateStr to player state as string
					set jsonOutput to "{\"status\":\"success\", \"command\":\"playpause\", \"playerState\":\"" & playerStateStr & "\"}"
				else if command is "next" then
					next track
					delay 0.5 -- Small delay to ensure track has changed
					set trackName to name of current track
					set jsonOutput to "{\"status\":\"success\", \"command\":\"next\", \"currentTrack\":\"" & my replaceChars(trackName) & "\"}"
				else if command is "previous" then
					previous track
					delay 0.5 -- Small delay to ensure track has changed
					set trackName to name of current track
					set jsonOutput to "{\"status\":\"success\", \"command\":\"previous\", \"currentTrack\":\"" & my replaceChars(trackName) & "\"}"
				else
					set jsonOutput to "{\"status\":\"error\", \"message\":\"Unknown command: " & command & "\"}"
				end if
			else
				set jsonOutput to "{\"status\":\"error\", \"message\":\"Music app is not running\"}"
			end if
		end tell
	on error errMsg
		set jsonOutput to "{\"status\":\"error\", \"message\":\"" & my replaceChars(errMsg) & "\"}"
	end try
	
	return jsonOutput
end run

-- Helper function to escape JSON string content
on replaceChars(inputString)
	set resultString to ""
	repeat with c in the characters of inputString
		set asciiNum to ASCII number of c
		if asciiNum = 34 then -- Double quote
			set resultString to resultString & "\\\""
		else if asciiNum = 92 then -- Backslash
			set resultString to resultString & "\\\\"
		else if asciiNum = 10 then -- Line feed
			set resultString to resultString & "\\n"
		else if asciiNum = 13 then -- Carriage return
			set resultString to resultString & "\\r"
		else if asciiNum = 9 then -- Tab
			set resultString to resultString & "\\t"
		else if asciiNum < 32 then -- Other control characters
			set resultString to resultString & "\\u00" & my decimalToHex(asciiNum)
		else
			set resultString to resultString & c
		end if
	end repeat
	return resultString
end replaceChars

on decimalToHex(decimalValue)
	set hexChars to "0123456789abcdef"
	set hexValue to ""
	set tempValue to decimalValue
	
	repeat until tempValue < 1
		set remainder to tempValue mod 16
		set tempValue to tempValue div 16
		set hexValue to (character (remainder + 1) of hexChars) & hexValue
	end repeat
	
	if hexValue is "" then
		return "0"
	else
		return hexValue
	end if
end decimalToHex