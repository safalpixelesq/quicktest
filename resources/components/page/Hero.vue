<template>
	<div class="">
		<Header :dark="false" :hero-bg-styles="heroBgStyles" />
		<section class="uk-section herobg">
			<div class="uk-container">
				<div class="uk-grid uk-grid-large" data-uk-grid>
					<div class="uk-width-2-5@m eg-container">
						<h1
							class="uk-h1 uk-text-left uk-text-bold uk-margin-bottom uk-margin-large-top"
						>
							Introducing <br />
							<span class="uk-text-primary">UI</span> as a
							<span class="uk-text-primary">Service</span>
							<!-- <span class="uk-text-primary">(UIaaS)</span> -->
						</h1>
						<div
							class="uk-margin-small-bottom uk-margin-remove-top uk-h3"
						>
							{{ content.title }}
						</div>

						<div class="uk-text-large">
							<div class="uk-margin-medium-top uk-dark">
								<nuxt-link
									to="/signup"
									class="uk-button uk-button-primary btn uk-margin-right uk-margin-bottom"
									>Sign up
								</nuxt-link>
							</div>
						</div>
					</div>
					<div class="uk-width-3-5@m">
						<div class="" tabindex="-1">
							<div class="uk-height-medium uk-hidden@m"></div>
							<div class="height-spacer">
								<!-- <div class="macbook"></div> -->
								<div class="browser-fr">
									<div class="uk-position-absolute red-trig">
										<img
											width="100%"
											alt="red-triangle"
											src="red.png"
										/>
									</div>
									<div
										class="uk-position-absolute yellow-trig"
									>
										<img
											width="250px"
											alt="yellow-triangle"
											src="yellow.png"
										/>
									</div>
									<div class="try-this">
										<div
											class="try-text uk-flex uk-flex-top"
										>
											<img
												src="try.webp"
												alt=""
												width="70px"
											/>
											<span class="arrow-line"> → </span>
										</div>
									</div>

									<div class="code-block">
										<div class="macbook">
											<!-- <img
													class="mockup-img"
													src="mockup.png"
												/> -->
											<pre class="editor"><code>{
  ...
  style: {
    align: <span  class="uk-text-secondary uk-text-bold">{{ hero.align }}</span>  
    background: <span  class="uk-text-secondary uk-text-bold">{{ hero.bg }}</span>
    columns: <span  class="uk-text-secondary uk-text-bold">{{ cards }}</span>
  },
  title: <span>Create Beautiful</span>
		 <span>Websites</span>
  desc:  <span>Lorem ipsum dolor</span>
  		 <span>sit amet, consectetur </span>
		 <span>adipisicing elit. </span>
		 <span>Voluptatem, suscipit.</span>
}</code>
</pre>
											<div
												class="keyboard uk-flex uk-flex-center"
											>
												<div class="groove"></div>
											</div>
										</div>
										<div class="view-block">
											<div class="urlbar">
												<div
													class="uk-flex uk-flex-between uk-flex-middle"
												>
													<div class="btns">
														<div></div>
														<div></div>
														<div></div>
													</div>
													<div
														class="uk-text-primary"
													>
														+
													</div>
												</div>
											</div>
											<div class="website">
												<div
													class="wb-hero uk-flex"
													:class="
														'uk-flex-' +
														hero.align +
														' uk-text-' +
														hero.align
													"
													:style="
														'background:' + hero.bg
													"
												>
													<div
														class="uk-width-2-3"
														:class="
															isDark
																? 'uk-light'
																: 'uk-dark'
														"
													>
														<div
															class="hero-txt pw-font-heading"
														>
															Create Beautiful
															Websites
														</div>
														<div class="hero-desc">
															Lorem ipsum dolor
															sit amet consectetur
															adipisicing elit.
															Dolor, cumque!
														</div>
														<!-- <a
														href=""
														class="
															uk-button
															btn
															uk-button-small
															uk-button-primary
														"
														>Sign Up</a
													> -->
													</div>
												</div>
											</div>
											<div class="wb-cards">
												<div
													class="uk-grid uk-grid-small uk-child-width-expand"
												>
													<div
														v-for="index in cards"
														:key="index"
													>
														<div
															class="wb-card"
															:class="
																'card-' + index
															"
														>
															<div
																class="title"
															></div>
															<div
																class="desc"
															></div>
															<div
																class="descr"
															></div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
import Logo from '~/components/Logo.vue'
import Header from '~/components/Header.vue'
// import Link from '~/components/Link.vue'
export default {
	name: 'Hero',
	components: {
		// eslint-disable-next-line vue/no-unused-components
		Logo,
		Header,
		// Link,
	},
	props: {
		content: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			notification: {
				message: '',
				type: '',
			},
			light: false,
			heroBgStyles: '',
			swatches: ['#064e89', '#fdc430', '#4323a5', '#4776ED', '#ef413f'],
			hero: {
				align: 'center',
				bg: '#fdc430',
			},
			cards: 3,
		}
	},
	computed: {
		isDark() {
			let r, g, b, hsp
			let color = this.hero.bg
			if (color.match(/^rgb/)) {
				color = color.match(
					/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
				)
				r = color[1]
				g = color[2]
				b = color[3]
			} else {
				color = +(
					'0x' +
					color.slice(1).replace(color.length < 5 && /./g, '$&$&')
				)
				r = color >> 16
				g = (color >> 8) & 255
				b = color & 255
			}
			// eslint-disable-next-line prefer-const
			hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
			// If HSP is more than 127 its considered light
			return hsp < 127
		},
	},
	methods: {
		toggleMediaPos(key, attr) {
			return this.hero.mediaPos === 'right'
				? (this.hero.mediaPos = 'left')
				: (this.hero.mediaPos = 'right')
		},
	},
}
</script>
<style lang="scss" scoped>
.herobg {
	padding-bottom: 30px;
}
.mockup-img {
	position: relative;
	z-index: 1;
}
.eg-container {
	height: 100px;
}

.uk-height-medium {
	height: 220px;
}
.eg-title {
	list-style-type: none;
	position: absolute;
	visibility: hidden;
	opacity: 0;
	transition: visibility 0s, opacity 0.5s linear;
	&.uk-active {
		visibility: visible;
		opacity: 1;
	}
	.uk-h1 {
		font-size: 46px;
	}
}

.height-spacer {
	min-height: 400px;
	margin-top: 20px;
}

.macbook {
	background-color: #fff;
	height: 240px;
	border-radius: 10px;
	box-sizing: border-box;
	padding: 10px;
	position: relative;
	// overflow: hidden;
	margin: 0 15px;
	// margin-bottom: 30px;
	box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
	.keyboard {
		position: absolute;
		height: 15px;
		background-color: #fff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom-left-radius: 50px;
		border-bottom-right-radius: 50px;
		// width: 100%;
		left: -40px;
		right: -40px;
		z-index: 4;
		bottom: -12px;
		box-shadow: 0 10px 20px -1px rgba(0, 0, 0, 0.3);
		border-top: 1px solid #efefef;
		// text-align: center;
		.groove {
			display: inline-block;
			width: 200px;
			margin: auto;
			position: absolute;
			height: 5px;
			// background-color: #ddd;
			box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.3);
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
		}
	}
}

.browser-fr {
	// max-height: 440px;

	// background-color: white;
	// border-top-left-radius: 10px;
	// border-top-right-radius: 10px;
	position: relative;
	// overflow: hidden;
	// &.uk-box-shadow-large {
	// 	box-shadow: 0 3px 12px rgb(0 0 0 / 16%);
	// }
}
.red-trig {
	width: 300px;
	right: -250px;
	top: -60px;
}
.yellow-trig {
	// right: -250px;
	bottom: -20px;
	left: -30px;
}

.editor {
	border-radius: 3px;
}
.config-block {
	background: #fff;
	border-radius: 5px;
	padding: 15px;
	box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
	.uk-text-meta {
		color: #888;
		margin-bottom: 5px;
	}
	.cfg-button {
		// width: 30px;
		background: transparent !important;
		padding: 0;
		border: 0;
		// height: 30px;
	}
	.material-icons {
		font-size: 23px;
		color: #888;
		cursor: pointer;
		padding: 5px 6px !important;
		border-radius: 4px;
	}

	.vue-swatches__trigger {
		border-radius: 4px !important;
	}

	.cust-margin {
		margin-top: 15px;
	}

	.uk-input {
		border: 1px solid #aaa;
		margin-left: 8px;
		border-radius: 4px;
		font-size: 14px;
		height: 30px;
		color: var(--pw-tertiary);
		&:focus,
		&:active {
			border: 1px solid #aaa;
			color: var(--pw-tertiary);
		}
	}

	.col-num {
		font-size: 18px;
		color: #333;
		padding: 4px 10px;
		border-radius: 3px;
		line-height: 22px;
		cursor: pointer;
	}
	.active {
		.material-icons {
			background-color: var(--pw-primary);
			color: #fff;
		}
		.col-num {
			background-color: var(--pw-primary);
			color: #fff;
		}
	}
}
.try-this {
	color: var(--pw-primary);

	.try-text {
		position: absolute;
	}
	.arrow {
		position: absolute;
		right: -30px;
		font-size: 40px;
	}
	.arrow-line {
		font-size: 36px;
		line-height: 26px;
		margin-left: 5px;
	}
}

// .code-block {
// 	// background: var(--pw-darkbg);
// 	top: 35px;
// 	left: 105px;
// 	z-index: 2;
// 	right: 105px;
// 	bottom: 70px;
// 	border-radius: 4px;
// 	padding: 20px;
// 	font-size: 10px;
// 	font-family: monospace;
// 	pre {
// 		font-size: 15px;
// 		background: var(--pw-darkbg) !important;
// 		border: 0;
// 		.uk-text-secondary {
// 			color: var(--pw-secondary) !important;
// 			font-weight: bold;
// 		}
// 	}
// }

.view-block {
	border-radius: 10px;
	font-size: 10px;
	box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);

	.wb-hero {
		padding: 40px 20px 60px;
		.hero-txt {
			font-size: 18px;
			font-weight: 400;
			line-height: 1.3;
			font-family: 'Calistoga', serif;
		}
		.uk-light {
			color: rgba(255, 255, 255, 0.9) !important;
		}
		.uk-dark {
			color: rgba(0, 0, 0, 0.9) !important;
		}
	}

	.wb-cards {
		position: absolute;
		left: 0;
		right: 0;
		padding: 0 20px;
		margin-top: -20px;
		.wb-card {
			background: #fff;
			min-height: 50px;
			box-shadow: 0 4px 13px rgba(0, 0, 0, 0.15);
			border-radius: 3px;
			text-align: center;
			padding: 15px;
			box-sizing: border-box;
			// border: 2px solid #ddd;
			.title {
				width: 75%;
				background-color: var(--pw-primary) !important;
				height: 5px;
			}
			.desc {
				margin-top: 7px;
				width: 100%;
				background-color: #ddd !important;
				height: 4px;
			}
			.descr {
				margin-top: 4px;
				width: 80%;
				background-color: #ddd !important;
				height: 4px;
			}
		}
		.card-1 {
			.title {
				background-color: var(--pw-primary) !important;
			}
		}
		.card-2 {
			.title {
				background-color: var(--pw-secondary) !important;
			}
		}
		.card-3 {
			.title {
				background-color: var(--pw-tertiary) !important;
			}
		}

		.card-4 {
			.title {
				background-color: var(--pw-darkbg) !important;
			}
		}
	}
}
.urlbar {
	background-color: #fff;
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
	padding: 5px;
	.btns > div {
		border: 2px solid #ddd;
		width: 6px;
		height: 6px;
		display: inline-block;
		border-radius: 50%;
		margin-left: 1px;
		&:nth-child(1) {
			border-color: var(--pw-primary);
		}
		&:nth-child(2) {
			border-color: var(--pw-secondary);
		}
		&:nth-child(3) {
			border-color: var(--pw-tertiary);
		}
	}
}
.uk-hero {
	font-size: 46px;
}
// New styles

/* Phone */
@media only screen and (max-width: 640px) {
	.placeholder {
		background: #000;
	}

	.yellow-trig {
		top: 80px;
		left: -50px;
	}
	.red-trig {
		right: -120px;
		width: 300px;
		top: 100px;
		// left: -50px;
	}
	.config-block {
		right: 5px !important;
		position: absolute;
		z-index: 10;
		margin-top: 20px;
		width: 130px;
		padding: 10px;
		top: -100px;
	}
	.try-text {
		top: -50px;
		right: 180px;
	}
	.code-block {
		position: relative;
		margin-top: 100px;
		.macbook {
			max-width: 420px;
		}
		.editor {
			position: absolute;
			z-index: 2;
			left: 10px;
			right: 10px;
			// display: none;
			// height: 200px;
			background: var(--pw-darkbg);
			top: 10px;
			bottom: 0;
			// bottom: 55px;
			font-size: 9px;
			overflow: hidden;
		}
	}
	.view-block {
		position: absolute;
		// margin-top: 230px;
		max-width: 355px;
		top: 180px;
		left: 45px;
		right: 45px;
		// width: 100%;
		z-index: 5;
		.wb-hero {
			padding: 20px 10px 40px;
			.hero-txt {
				font-size: 16px;
				font-weight: 400;
			}
			.hero-desc {
				font-size: 8px;
			}
		}
	}
}

/* Phone landscape and bigger */
@media (min-width: 640px) {
	.placeholder {
		background: #000;
	}
	.yellow-trig {
		top: 110px;
		left: -50px;
	}
	.red-trig {
		right: -100px;
		width: 420px;
		top: 20px;
		// left: -50px;
	}
	.height-spacer {
		margin-bottom: 40px;
	}
	.config-block {
		right: 25px !important;
		position: absolute;
		z-index: 10;
		margin-top: 20px;
		width: 180px;
		padding: 20px;
		top: -100px;
	}
	.try-text {
		top: -50px;
		right: 400px;
	}
	.code-block {
		position: relative;
		margin-top: 100px;
		.macbook {
			max-width: 600px;
			height: 380px;
		}
		.editor {
			position: absolute;
			z-index: 2;
			left: 10px;
			right: 10px;
			// display: none;
			// height: 200px;
			background: var(--pw-darkbg);
			top: 10px;
			bottom: 0;
			// bottom: 55px;
			font-size: 12px;
			overflow: hidden;
		}
	}
	.view-block {
		position: absolute;
		// margin-top: 230px;
		min-width: 400px;
		max-width: 600px;
		top: 180px;
		// left: 300px;
		right: 45px;
		// width: 100%;
		z-index: 5;
		.wb-hero {
			padding: 30px 20px 50px;
			.hero-txt {
				font-size: 24px;
				font-weight: 400;
			}
			.hero-desc {
				font-size: 8px;
			}
		}
	}
}

/* Tablet landscape and bigger */
@media (min-width: var(960px)) {
	.placeholder {
		background: #000;
	}
}

/* Desktop and bigger */
@media (min-width: 1200px) {
	.placeholder {
		background: #000;
	}

	.yellow-trig {
		top: 250px;
		left: -50px;
		width: 320px;
	}
	.red-trig {
		right: -250px;
		width: 550px;
		top: -80px;
		// left: -50px;
	}
	.height-spacer {
		margin-bottom: 120px;
	}
	.config-block {
		left: -65px;
		position: absolute;
		z-index: 10;
		margin-top: 20px;
		width: 150px;
		padding: 20px;
		top: 70px;
		height: 205px;
		bottom: 20px;
	}
	.try-text {
		top: 50px;
		left: -65px;
	}
	.code-block {
		position: relative;
		margin-top: 10px;
		text-align: center;
		.macbook {
			display: inline-block;
			width: 100%;
			text-align: left;
			// height: 380px;
		}
		.editor {
			position: absolute;
			z-index: 2;
			left: 10px;
			right: 10px;
			// display: none;
			// height: 200px;
			background: var(--pw-darkbg);
			top: 10px;
			bottom: 0;
			// bottom: 55px;
			font-size: 15px;
			overflow: hidden;
		}
	}
	.view-block {
		position: absolute;
		// margin-top: 230px;
		min-width: 360px;
		max-width: 380px;
		top: 80px;
		// left: 300px;
		right: 0;
		// width: 100%;
		z-index: 5;
		.wb-hero {
			padding: 30px 20px 50px;
			.hero-txt {
				font-size: 24px;
				font-weight: 400;
			}
			.hero-desc {
				font-size: 11px;
			}
		}
	}
}
</style>
