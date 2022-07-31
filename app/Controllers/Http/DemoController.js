'use strict'

const path = require('path')
const Promise = require('bluebird')
const _ = require('lodash')
const fs = Promise.promisifyAll(require('fs-extra'))
const Logger = use('Logger')
const axios = use('axios')
const Env = use('Env')

class DemoController {
	async renderPage({ params, response }) {
		try {
			const jsonpath = `../../demos/${params.proj}/${params.page}.json`
			const demos = `../../demos/${params.proj}/${params.page}.html`
			if (fs.existsSync(jsonpath)) {
				const ctx = await fs
					.readFile(jsonpath)
					.then((data) => JSON.parse(data))

				const config = {
					headers: {
						Authorization: `Bearer ${Env.get('PERSONAL_TOKEN')}`,
					},
				}
				const pghtml = await axios
					.post('http://localhost:3333/gethtml', ctx, config)
					.then((response) => response.data)

				Logger.info(`${params.page} HTML Generated for ${params.proj}`)
				// await fs.writeFile(demos, pghtml.html);
				if (ctx.meta.upload) {
					await fs.outputFile(demos, pghtml.html, function (err) {
						console.log(err) // => null

						fs.readFile(demos, 'utf8', function (err, data) {
							Logger.info(
								`${params.page}.html Generated for ${params.proj}`
							)
						})
					})
				}

				return pghtml.html
			}
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = DemoController
