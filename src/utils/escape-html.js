export const escapeHtml = text => {
	if (!text) {
		return ''
	} else {
		var entityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			'\'': '&#39;',
			'/': '&#x2F;'
		}
		return String(text).replace(/[&<>"'/]/g, function(s) {
			return entityMap[s]
		})
	}
}
