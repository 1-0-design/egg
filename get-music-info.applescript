-- Script to get current track info from Apple Music
-- Output is in JSON format for easy integration with JavaScript

on run
	set jsonOutput to "{}"
	
	try
		tell application "Music"
			if it is running then
				if player state is playing or player state is paused then
					set theTrack to current track
					set trackId to (get id of theTrack)
					set trackName to (get name of theTrack)
					set trackArtist to (get artist of theTrack)
					set trackAlbum to (get album of theTrack)
					set playerStateString to (get player state as string)
					
					-- Get artwork data
					set hasArtwork to false
					set artworkPath to ""
					
					try
						if (count of artwork of theTrack) > 0 then
							set hasArtwork to true
							set tempFolderPath to (POSIX path of (path to temporary items from user domain)) & "album_artwork_" & trackId & ".jpg"
							set artworkPath to tempFolderPath
							
							tell artwork 1 of theTrack
								set rawData to raw data
								set fileRef to open for access tempFolderPath with write permission
								set eof fileRef to 0
								write rawData to fileRef
								close access fileRef
							end tell
						end if
					on error artworkError
						set hasArtwork to false
						set artworkPath to ""
						log "Artwork error: " & artworkError
					end try
					
					-- Create JSON output
					set jsonOutput to "{\"status\":\"" & playerStateString & "\", \"track\":{\"id\":" & trackId & ", \"name\":\"" & my replaceChars(trackName) & "\", \"artist\":\"" & my replaceChars(trackArtist) & "\", \"album\":\"" & my replaceChars(trackAlbum) & "\"}, \"artwork\":{\"available\":" & hasArtwork & ", \"path\":\"" & artworkPath & "\"}}"
				else
					set jsonOutput to "{\"status\":\"stopped\", \"message\":\"No track is playing\"}"
				end if
			else
				set jsonOutput to "{\"status\":\"not_running\", \"message\":\"Music app is not running\"}"
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
			set resultString to resultString & "\\u" & my padWithZero(my decimalToHex(asciiNum), 4)
		else
			set resultString to resultString & c
		end if
	end repeat
	return resultString
end replaceChars

on padWithZero(theString, targetLength)
	set theResult to theString
	repeat while length of theResult < targetLength
		set theResult to "0" & theResult
	end repeat
	return theResult
end padWithZero

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