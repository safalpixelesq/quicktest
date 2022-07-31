'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')
const Logger = use('Logger')
const uuid = use('uuid')
const Mail = use('Mail')
const Env = use('Env')

class AuthController {
	// POST
	async login({ request, response, auth }) {
		const { email, password } = request.all()
		try {
			const user = await User.findBy('email', email)
			user.profile = await user.profile().fetch()
			// await auth.check();
			const result = await auth
				.withRefreshToken()
				.attempt(email, password, { user })
			if (!user.verified) {
				// revoke all tokens
				await auth.revokeTokens()
				Logger.error(`User login failed (not confirmed)`)
				return response.status(401).json({
					message:
						'Please confirm your email before trying to login.',
				})
			}
			if (user.banned) {
				// revoke all tokens
				await auth.revokeTokens()
				return response.status(401).json({
					message: 'You are banned from this site. Contact admin.',
				})
			}
			Logger.info(`User Login: ${user.email}`)
			return response.status(200).json(result)
		} catch (errors) {
			console.log(errors)
			errors.email = email
			Logger.error(`User login failed `, errors)
			return response.status(401).json({
				message: 'Sorry, could not find an account with those inputs',
				errors,
			})
		}
	}

	async verifyUser({ request, response, auth }) {
		const { email, password } = request.all()
		try {
			const user = await User.findBy('email', email)
			user.profile = await user.profile().fetch()

			if (!user.verified) {
				const ctoken = user.confirmation_token
				Logger.notice(`User verification check: ${user.email}`)
				return response.status(200).json({
					message: 'Email not confirmed',
					token: ctoken,
				})
			}

			if (user.reset_token) {
				const ctoken = user.reset_token
				Logger.notice(`User verification check: ${user.email}`)
				return response.status(200).json({
					message: 'Reset Password requested',
					token: ctoken,
				})
			}

			Logger.info(`User verified: ${user.email}`)

			return response.status(200).json({ verified: true })
		} catch (errors) {
			console.log(errors)
			Logger.error(`User verification Failed`, errors)
			return response.status(401).json({
				message: "Darn! Can't authorise you with those details.",
				errors,
			})
		}
	}

	async generateToken({ response, auth }) {
		try {
			const user = await auth.getUser()
			user.profile = await user.profile().fetch()

			// Figure out if revoke tokens is necessary
			await auth.authenticator('api').revokeTokensForUser(user)

			const jwt = await auth.authenticator('api').generate(user)
			Logger.info(`User Create Token: ${user.email}`)
			return response.status(200).json(jwt)
		} catch (errors) {
			console.log(errors)
			Logger.error(`User get token: Failed`, errors)
			return response.status(401).json({
				message: "Darn! Can't get you the token",
				errors,
			})
		}
	}

	async revokeToken({ response, auth }) {
		try {
			const user = await auth.getUser()
			await auth.authenticator('api').revokeTokensForUser(user)
			Logger.info(`User revoke Token: ${user.email}`)
			return response.status(200).json(true)
		} catch (errors) {
			console.log(errors)
			Logger.error(`User revoke token: Failed`, errors)
			return response.status(401).json({
				message: "Darn! Can't revoke token",
				errors,
			})
		}
	}

	async listTokens({ response, auth }) {
		try {
			const user = await auth.getUser()
			const tokens = await user
				.tokens()
				.where('type', 'api_token')
				.where('is_revoked', false)
				.fetch()

			const tkJson = JSON.parse(JSON.stringify(tokens))
			const hasToken = !!tkJson.length
			Logger.info(`User get tokens: ${user.email}`)
			return response.status(200).json(hasToken)
		} catch (errors) {
			console.log(errors)
			Logger.error(`User get token: Failed`, errors)
			return response.status(401).json({
				message: "Darn! Can't get you the token",
				errors,
			})
		}
	}

	async updateToken({ response, auth }) {
		try {
			const user = await auth.getUser()
			user.profile = await user.profile().fetch()

			const jwt = await auth.authenticator('api').generate(user, { user })
			Logger.info(`User Update Token: ${user.email}`)

			return response.status(200).json(jwt)
		} catch (errors) {
			console.log(errors)
			Logger.error(`User update token: Failed`, errors)
			return response.status(401).json({
				message: "Darn! Can't authorise you with those details.",
				errors,
			})
		}
	}

	async redirectToProvider({ ally, params }) {
		await ally.driver(params.provider).redirect()
	}

	async handleProviderCallback({ params, ally, auth, response }) {
		// eslint-disable-next-line prefer-destructuring
		const provider = params.provider
		let jwt
		try {
			const userData = await ally.driver(params.provider).getUser()
			const email = userData.getEmail()
			let user = new User()

			/** If user is already registered with SSO * */
			let authUser = await User.query()
				.where({ [`${provider}_id`]: userData.getId() })
				.first()
			if (!(authUser === null)) {
				console.log('User is already registered with sso')
				authUser.profile = await authUser.profile().fetch()
				jwt = await auth
					.withRefreshToken()
					.generate(authUser, { user: authUser })
				return response.redirect(
					`${Env.get('WEB_URL')}/login?provider=${provider}&tkn=${
						jwt.token
					}`
				)
			}

			/** If user is registered only with username/password * */
			authUser = await User.query().where({ email }).first()
			if (!(authUser === null)) {
				authUser[`${provider}_id`] = userData.getId()
				user.provider = 'social'
				await authUser.save()
				authUser.profile = await authUser.profile().fetch()

				jwt = await auth
					.withRefreshToken()
					.generate(authUser, { user: authUser })
				return response.redirect(
					`${Env.get('WEB_URL')}/login?provider=${provider}&tkn=${
						jwt.token
					}`
				)
			}

			/** If user is not registered at all * */
			user.username =
				userData.getNickname() ||
				userData.getName() ||
				userData.getEmail()
			user.email = userData.getEmail()
			user.provider = 'social'
			user[`${provider}_id`] = userData.getId()
			// const sCustomer = await Stripe.customers.create({
			// 	email: user.email,
			// });
			user.stripe_cus_id = uuid.v4()
			await user.save()

			user = await User.query().where({ email }).first()
			const profile = await user.profile().fetch()
			profile.avatar = userData.getAvatar()
			profile.name = userData.getName()
			user.profile = await profile.save()
			/* user = await User.query().where({'email': email}).first(); */
			user.profile = await user.profile().fetch()

			jwt = await auth.withRefreshToken().generate(user, { user })
			this.welcomeEmail(user)

			return response.redirect(
				`${Env.get('WEB_URL')}/login?provider=${provider}&tkn=${
					jwt.token
				}`
			)
		} catch (e) {
			console.log(e)
			return response.redirect(`${Env.get('WEB_URL')}/login`)
		}
	}

	async logout({ request, response, auth }) {
		const refreshToken = request.input('refreshToken')
		if (!refreshToken) {
			// You can throw any exception you want here
			throw BadRequestException.invoke(`Refresh Token missing`)
		}

		await auth.authenticator('jwt').revokeTokens([refreshToken], true)

		return response.send({ status: 200, message: 'success' })
	}

	// POST
	async signup({ request, auth, response }) {
		// get user data from signup form
		const { name, email, password } = request.all()
		let user = new User()
		user.uid = uuid.v4()
		user.confirmation_token = uuid.v4()
		user.username = name
		user.email = email
		user.password = password
		user.stripe_cus_id = uuid.v4()

		try {
			// save user to database
			await user.save()
			user = await User.query().where({ email }).first()
			user.profile = await user.profile().fetch()
			await this.welcomeEmail(user)
			// generate JWT token for user
			const token = await auth.withRefreshToken().generate(user, { user })
			Logger.info(`User Signup: ${user.email}`)
			return response.status(201).json(token)
		} catch (error) {
			console.log(error)
			Logger.error(`User Creation failed`, error.message)
			return response.status(400).json({
				status: 'error',
				message:
					'There was a problem creating the user, please try again later.',
			})
		}
	}

	welcomeEmail(user) {
		return Mail.send(
			'emails.welcome',
			{
				token: user.confirmation_token ? user.confirmation_token : null,
				name: user.username,
			},
			(message) => {
				message.from(
					`${Env.get('EMAIL_SENDER_NAME')}<${Env.get(
						'MAILGUN_EMAIL_SENDER'
					)}>`
				)
				message.subject(`Welcome to ${Env.get('APP_NAME')}`)
				message.to(user.email)
			}
		)
	}

	// GET
	async confirmEmail({ response, params }) {
		const token = params.token
		console.log(token, 'token')
		const user = await User.findBy('confirmation_token', token)

		// if user exists
		if (user) {
			user.confirmation_token = null
			user.verified = true
			await user.save()
			Logger.info(`User Email Verified: ${user.email}`)
			return response.status(200).json({
				message: 'Account verified, thank you. You can now log in.',
			})
		}
		Logger.error(`Invalid Varification Code`)
		return response
			.status(404)
			.json({ message: 'Invalid Varification Code.' })
	}

	async me({ auth, response }) {
		const user = await auth.getUser()
		const profile = await user.profile().first()
		if (!profile) {
			return response
				.status(404)
				.json({ message: "User doen't have any profile." })
		}
		return response.status(200).json({ ...user.toJSON(), profile })
	}

	async profile({ auth, response, ally }) {
		const userData = await ally.driver('google').getUser()
		// const email = userData.getEmail();
		// let user = new User();

		/** If user is already registered with SSO * */
		const authUser = await User.query()
			.where({ [`${provider}_id`]: userData.getId() })
			.first()
		if (!(authUser === null)) {
			console.log('User is already registered with sso')
			authUser.profile = await authUser.profile().fetch()
			console.log('User is already registered with sso', authUser)

			return response.status(200).json(authUser)
		} else {
			return response
				.status(404)
				.json({ message: "User doen't have any profile." })
		}
	}

	// POST
	async forgotPassword({ request, response }) {
		try {
			const data = request.only(['email'])

			// find or fail user by email
			const user = await User.findBy('email', data.email)
			if (!user) {
				return response.status(400).json({ message: 'Wrong email.' })
			}

			// add reset token to user
			user.reset_token = uuid.v4()
			await user.save()

			// resend verification
			await Mail.send(
				'emails.forgot',
				{ token: user.reset_token, name: user.username },
				(message) => {
					message.from(
						`${Env.get('EMAIL_SENDER_NAME')}<${Env.get(
							'MAILGUN_EMAIL_SENDER'
						)}>`
					)
					message.subject('Reset password')
					message.to(user.email)
				}
			)

			Logger.info(`User Forgot Password: ${user.email}`)
			return response
				.status(200)
				.json({ message: 'Reset password email has been sent.' })
		} catch (error) {
			console.log(error)
			Logger.error(`Forgot password failed`, error.message)
			return response.status(400).json({
				status: 'error',
				message: 'Could not update profile',
			})
		}
	}

	// POST
	async resetPassword({ request, response }) {
		const data = request.only(['token', 'password'])

		// find or fail user by reset token
		const user = await User.findBy('reset_token', data.token)
		if (!user) {
			return response.status(400).json({ message: 'Invalid reset code.' })
		}

		// add new password to user
		user.password = await Hash.make(data.password)
		user.reset_token = null
		await user.save()

		Logger.info(`User Reset Password: ${user.email}`)

		return response.status(200).json({
			message: 'Password has been updated',
		})
	}

	async updateProfile({ request, response, auth }) {
		try {
			const { username } = request.all()

			const user = await auth.getUser()
			user.username = username
			await user.save()

			Logger.info(`User profile updated: ${user.email}`)
			return response.status(200).json(user.toJSON())
		} catch (error) {
			console.log(error)
			Logger.error(`User profile update failed`, error.message)
			return response.status(400).json({
				status: 'error',
				message: 'Could not update profile',
			})
		}
	}

	// GET
	async users({ request, response }) {
		// eslint-disable-next-line no-restricted-globals,max-len,radix
		const page =
			request.all().page && !isNaN(parseInt(request.all().page))
				? parseInt(request.all().page)
				: 1

		let result = await User.query().paginate(page)

		result = result.toJSON()

		result.data = await Promise.all(
			result.data.map(async (el) => {
				// const usr = await User.find(el.id);
				// const profile = await usr.profile().first();
				// el.profile = profile;
				return el
			})
		)

		return response.status(200).json(result)
	}

	// Pages with views
	async confirmEmailRender({ params, view }) {
		const token = params.token
		const user = await User.findBy('confirmation_token', token)

		// if user exists
		if (user) {
			user.confirmation_token = null
			user.verified = true
			await user.save()
			Logger.info(`User Email Verified: ${user.email}`)
			return view.render('notify', {
				type: 'info',
				message:
					'Email verified, thank you. You may close this window now.',
			})
		}

		return view.render('notify', {
			type: 'warning',
			message: 'Invalid email verification code.',
		})
	}

	// GET
	async resetPasswordForm({ params, view }) {
		const token = params.token

		// find or fail user by reset token
		const user = await User.findBy('reset_token', token)
		if (!user) {
			return view.render('notify', {
				type: 'warning',
				message: 'Invalid reset code.',
			})
		}
		return view.render('auth.reset', { token })
	}
}

module.exports = AuthController
