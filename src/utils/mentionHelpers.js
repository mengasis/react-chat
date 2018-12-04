import escapeHtml from './escape-html'

export function createMention(mentionOption, index) {
	return {
		id: mentionOption.id,
		type: mentionOption.type,
		name: mentionOption.name,
		length: mentionOption.name.length,
		offset: index
	}
}

export function updateMentions(mentions, message) {
	// ** IMPORTANT **
	// We don't want to return a new mentions array if nothing has really changed

	// Don't return anything new if mentions array is empty
	if (mentions.length === 0) return mentions

	let changed = false
	let lookupPos = 0
	let verifiedMentions = []

	for (let i = 0; i < mentions.length; i++) {
		const currentMention = mentions[i]

		// find current mention name in message
		const matchPos = message.indexOf(currentMention.name, lookupPos)

		if (matchPos === -1) {
			// if not found, finish loop and mark as changed
			// this causes the omission/removal of subsequent mentions
			changed = true
			break
		} else {
			// if found, let's keep it
			let verifiedMention = currentMention

			// and if position has changed, update mention with new offset
			if (currentMention.offset !== matchPos) {
				verifiedMention = { ...currentMention, offset: matchPos }
				changed = true
			}

			// add it to verified mentions array
			verifiedMentions.push(verifiedMention)

			// move lookup position ahead of current mention,
			// so that we don't check it in next iteration
			lookupPos = matchPos + currentMention.name.length
		}
	}

	// Only return new verified mentions if something has changed
	return changed ? verifiedMentions : mentions
}

export function getMentionQueryAtCaret(message, caretPosition) {
	const textUpToCaret = message.slice(0, caretPosition)

	// Check @mentions up to 50 chars [a-zA-Z0-9]
	const re = /(?:^|\s)@([a-zA-Z0-9]{0,50})$/g
	const match = re.exec(textUpToCaret)

	if (!match) return null

	return {
		text: match[1],
		index: message[match.index] === '@' ? match.index : match.index + 1
	}
}

export function replaceMentionQuery(message, mentionQuery, replacement) {
	let fragments = []
	fragments.push(message.substring(0, mentionQuery.index))
	fragments.push(replacement)
	fragments.push(message.substring(mentionQuery.index + mentionQuery.text.length + 1))
	return fragments.join('')
}

export function getTaggedMessage(message, mentions) {
	const tagPlaceholders = {
		open: '__OPEN__',
		close: '__CLOSE__'
	}

	let currentPos = 0
	let fragments = []

	for (let i = 0; i < mentions.length; i++) {
		fragments.push(message.substring(currentPos, mentions[i].offset))
		fragments.push(tagPlaceholders.open + mentions[i].name + tagPlaceholders.close)
		currentPos = mentions[i].offset + mentions[i].name.length
	}

	fragments.push(message.substring(currentPos))

	let result = fragments.join('')

	result = escapeHtml(result)
	result = result.replace(new RegExp(tagPlaceholders.open, 'g'), '<span>')
	result = result.replace(new RegExp(tagPlaceholders.close, 'g'), '</span>')
	result = result.replace(/\n/g, '<br>')

	return { __html: result }
}

export function getCaretPosition(el) {
	if (el.selectionStart) {
		return el.selectionStart
	} else if (document.selection) {
		el.focus()

		let r = document.selection.createRange()
		if (r === null) {
			return 0
		}

		let re = el.createTextRange()
		let rc = re.duplicate()
		re.moveToBookmark(r.getBookmark())
		rc.setEndPoint('EndToStart', re)

		return rc.text.length
	}
	return 0
}

export function setCaretPosition(el, pos) {
	if (el.createTextRange) {
		let range = el.createTextRange()
		range.move('character', pos)
		range.select()
	} else if (el.selectionStart !== null) {
		el.focus()
		el.setSelectionRange(pos, pos)
	}
}
