<template>
	<section class="uk-dark uk-section uk-padding-remove-vertical halfbg">
		<div class="uk-container uk-container-small">
			<div class="uk-text-center uk-flex uk-flex-center">
				<div class="uk-width-4-5@m uk-margin-bottom">
					<div
						class="uk-text-center uk-margin-small-bottom uk-text-bold uk-text-primary"
					>
						{{ content.subtitle }}
					</div>
					<h2
						class="uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-text-medium uk-h3"
					>
						Pixelesq enables
						<span class="uk-text-tertiary">developers</span>,
						<span class="uk-text-primary">marketers</span>, and
						<span class="uk-text-secondary">entrepreneurs</span> to
						create scalable, SEO-optimized and performant User
						Interfaces.
					</h2>
					<div
						class="uk-text-center uk-text-medium uk-margin-small-bottom uk-margin-remove-top desc"
					>
						{{ content.desc }}
					</div>
				</div>
			</div>
			<div class="uk-flex uk-flex-center">
				<div class="uk-width-5-6@m">
					<div
						class="uk-grid uk-grid-medium"
						data-uk-grid
						data-uk-height-match="target: > div > .mheight"
					>
						<div class="uk-width-1-2@m">
							<div
								class="uk-card mheight mrk uk-overflow-hidden"
								data-uk-parallax="y:100, 0;opacity:.6,1; viewport: 0.2;"
							>
								<div class="uk-position-relative content">
									<div
										class="uk-h2 uk-text-bold uk-text-tertiary"
										data-uk-parallax="y:40,0;opacity:.5,1; viewport: 0.3;"
									>
										{{ content.items[1].title }}
									</div>
									<div
										class=""
										data-uk-parallax="y:50,0;opacity:.5,1; viewport: 0.3;"
										v-html="content.items[1].desc"
									></div>
								</div>
								<div class="">
									<img
										data-uk-parallax="y:50,0;opacity:.6,1; viewport: 0.3;"
										src="https://assets.uiaas.io/web/developers.webp"
										alt="Code block for Developers"
										width="100%"
									/>
								</div>
							</div>
						</div>
						<div class="uk-width-1-2@m">
							<!-- <div class="mheight">
								<div class="uk-card custom-margin">
									<div class="uk-grid">
										<div class="uk-width-1-2@m">
											<div
												class="
													uk-h2
													uk-text-bold
													uk-text-secondary
												"
											>
												{{ content.items[1].title }}
											</div>
											<div
												class=""
												v-html="content.items[1].desc"
											></div>
										</div>
										<div
											class="uk-width-1-2 marketers-bg"
										></div>
									</div>
								</div>
								<div
									class="uk-card uk-overflow-hidden"
									style="background-color: #fff"
								>
									<div class="uk-grid">
										<div class="uk-width-1-2@m">
											<div
												class="
													uk-h2
													uk-text-bold
													uk-text-tertiary
												"
											>
												{{ content.items[2].title }}
											</div>
											<div
												class=""
												v-html="content.items[2].desc"
											></div>
										</div>
										<div
											class="
												uk-width-1-2@m
												uk-position-relative
											"
										>
											<div class="everyone-bg">
												&nbsp;
											</div>
										</div>
									</div>
								</div>
							</div> -->
							<div
								class="uk-card mheight dev uk-overflow-hidden"
								data-uk-parallax="y:100, 0;opacity:.6,1; viewport: 0.2;"
							>
								<div
									class="uk-position-relative dev-content content"
								>
									<div
										class="uk-h2 uk-text-bold uk-text-primary"
										data-uk-parallax="y:40,0;opacity:.5,1; viewport: 0.3;"
									>
										{{ content.items[0].title }}
									</div>
									<div
										class=""
										data-uk-parallax="y:50,0;opacity:.5,1; viewport: 0.3;"
										v-html="content.items[0].desc"
									></div>
								</div>
								<div>
									<img
										data-uk-parallax="y:50,0;opacity:.6,1; viewport: 0.3;"
										src="https://assets.uiaas.io/web/marketers.webp"
										alt="graph image for Marketers"
										width="100%"
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="uk-width-1-1 custom-margin">
						<div
							class="uk-card ind uk-overflow-hidden"
							data-uk-parallax="y:60,0, 0;opacity:.6,.8,1; viewport: 0.3;"
						>
							<div class="uk-grid">
								<div class="uk-width-1-2@m">
									<div
										class="uk-position-relative dev-content content"
									>
										<div
											class="uk-h2 uk-text-bold uk-text-secondary"
											data-uk-parallax="y:40,0;opacity:.5,1; viewport: 0.3;"
										>
											{{ content.items[2].title }}
										</div>
										<div
											class=""
											data-uk-parallax="y:50,0;opacity:.5,1; viewport: 0.3;"
											v-html="content.items[2].desc"
										></div>
									</div>
								</div>
								<div class="uk-width-1-2@m">
									<div>
										<img
											data-uk-parallax="y:50,0;opacity:.6,1; viewport: 0.3;"
											src="https://assets.uiaas.io/web/individuals.webp"
											alt="Website image for Individuals"
											width="100%"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
export default {
	components: {
		// Link,
	},
	props: {
		content: {
			type: Object,
			required: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.halfbg {
	background: linear-gradient(to top, #f2f2f2 50%, #fff 50%);
}
.uk-card {
	border-radius: 10px;
	box-shadow: 0 4px 13px rgb(0 0 0 / 15%);
	// color: #fff;
	// padding: 30px;
	// background: #fff;
	background-color: #fff;
	.content {
		padding: 30px;
	}
}
.dev-content {
	z-index: 1;
	background-color: #fff;
	border-radius: 10px;
}
.uk-text-large {
	line-height: 1.6;
}

.mrk {
	border-bottom: 10px solid var(--pw-tertiary);
}
.dev {
	border-bottom: 10px solid var(--pw-primary);
}
.ind {
	border-bottom: 10px solid var(--pw-secondary);
}

.uk-h3 {
	line-height: 1.6;
}
.custom-margin {
	margin-top: 30px;
}
</style>
