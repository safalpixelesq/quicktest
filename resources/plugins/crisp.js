export default () => {
	window.$crisp = []
	window.CRISP_WEBSITE_ID =
		process.env.CRISP_ID || 'ee80a322-524e-498e-8c15-123b60de35a7'
	;(function () {
		const d = document
		const s = d.createElement('script')

		s.src = 'https://client.crisp.chat/l.js'
		s.async = 1
		d.getElementsByTagName('head')[0].appendChild(s)
	})()
}
