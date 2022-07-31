<template>
	<div v-if="config.iconPos">
		<div class="uk-margin-bottom">
			<p class="uk-text-meta uk-margin-small-bottom">Icon position</p>
			<div class="uk-flex uk-flex-wrap cgroup">
				<button
					v-for="(item, index) in posOptions"
					:key="item"
					title="Move Icon"
					class="
						config-button
						uk-flex
						uk-flex-middle
						uk-flex-center
						uk-margin-small-right
						uk-margin-small-bottom
					"
					:class="[config.iconPos === item ? 'is-active' : '']"
					@click="handleClick('pos', item)"
				>
					<i
						class="material-icons"
						:style="
							'transform: rotate(' + (index + 1) * 90 + 'deg)'
						"
					>
						get_app
					</i>
				</button>
			</div>
		</div>

		<div v-if="config.iconSize" class="uk-margin-bottom">
			<p class="uk-text-meta uk-margin-small-bottom">Icon Size</p>
			<div class="uk-flex uk-flex-wrap cgroup">
				<button
					v-for="item in iconSizeOptions"
					:key="item"
					class="
						config-button
						uk-flex
						uk-flex-middle
						uk-flex-center
						uk-margin-small-right
						uk-margin-small-bottom
					"
					:class="[config.iconSize === item ? 'is-active' : '']"
					@click=";[handleClick('size', item)]"
				>
					<i class="icon text">{{ item }} </i>
				</button>
			</div>
		</div>

		<div class="uk-margin-small-bottom">
			<p class="uk-text-meta uk-margin-small-bottom">Icon color</p>
			<div class="uk-flex uk-flex-top">
				<v-swatches
					v-model.lazy="iconColor"
					shapes="circles"
					popover-x="right"
					:trigger-style="{
						width: '38px',
						height: '38px',
						border: '1px solid var(--pw-tertiary)',
					}"
					show-border
					show-fallback
					fallback-input-type="color"
					class="uk-margin-small-right"
				></v-swatches>
				<input
					v-model="iconColor"
					placeholder="Choose or input icon color"
					type="text"
					class="config-button text-input"
				/>
			</div>
		</div>

		<div v-if="config.iconShape" class="uk-margin-bottom">
			<p class="uk-text-meta uk-margin-small-bottom">Icon Shape</p>
			<div class="uk-flex uk-flex-wrap cgroup">
				<button
					v-for="item in iconShapeOptions"
					:key="item"
					class="
						config-button
						uk-flex
						uk-flex-middle
						uk-flex-center
						uk-margin-small-right
						uk-margin-small-bottom
					"
					:class="[
						config.iconShape === item
							? `is-active ${item}`
							: `${item}`,
					]"
					@click=";[handleClick('shape', item)]"
				>
					<i class="icon text" :class="item"></i>
					<span
						v-if="item === 'none'"
						class="uk-text-medium uk-text-small"
						>NA</span
					>
				</button>
			</div>
		</div>

		<div v-if="config.iconBg">
			<p class="uk-text-meta uk-margin-small-bottom">Icon Background</p>
			<div class="uk-flex uk-flex-top">
				<v-swatches
					v-model.lazy="bgColor"
					shapes="circles"
					popover-x="right"
					:trigger-style="{
						width: '38px',
						height: '38px',
						border: '1px solid var(--pw-tertiary)',
					}"
					show-border
					show-fallback
					fallback-input-type="color"
					class="uk-margin-small-right"
				></v-swatches>

				<input
					v-model="bgColor"
					placeholder="Choose or input icon background color"
					type="text"
					class="config-button text-input"
				/>
			</div>
		</div>
	</div>
</template>

<script>
const _ = require('lodash')

export default {
	name: 'Icon',

	props: {
		config: {
			type: Object,
			required: true,
		},
		attr: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			colorTimeout: null,
			bgTimeout: null,
			posOptions: ['left', 'top', 'right', 'bottom'],
			currSize: _.findIndex(this.iconSizeOptions, function (o) {
				return o === this.config.iconSize
			}),
			iconSizeOptions: ['xs', 'sm', 'md', 'lg', 'xl'],
			iconShapeOptions: ['rounded', 'circle', 'square', 'none'],
		}
	},
	computed: {
		bgColor: {
			get() {
				return this.config.iconBg
			},
			set(col) {
				if (this.bgTimeout) clearTimeout(this.bgTimeout)
				this.bgTimeout = setTimeout(() => {
					this.$emit('updateModule', {
						itemIconBackground:
							col.includes('.') && !col.includes('url')
								? `url(${col})`
								: col,
					})
				}, 500)
			},
		},
		iconColor: {
			get() {
				return this.config.iconColor
			},
			set(col) {
				if (this.colorTimeout) clearTimeout(this.colorTimeout)
				this.colorTimeout = setTimeout(() => {
					this.$emit('updateModule', {
						itemIconColor: col,
					})
				}, 500)
			},
		},
		imgUrl() {
			return this.config.iconBg
		},
	},
	methods: {
		handleClick(key, val) {
			this.$emit('updateModule', { [this.attr[key]]: val })
		},
		onBackgroundChange(value) {
			this.$emit('updateModule', {
				itemIconBackground:
					value.includes('.') && !value.includes('url')
						? `url(${value})`
						: value,
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.config-button.text-input {
	border: 1px solid #ddd;
	outline: none;
	transition: width ease-in-out 0.5s;
	width: 100%;
	border-radius: 21px;
	border-color: var(--pw-tertiary);
	text-align: left;
	padding-left: 15px;
	padding-right: 15px;
	&:hover,
	&:focus {
		outline: none;
	}
}

.config-button.square {
	border-radius: 0;
	margin-left: 5px;
	margin-right: 15px !important;
}
.config-button.rounded {
	border-radius: 8px;
	margin-right: 15px !important;
}

.config-button.none {
	border-radius: 0;
	margin-right: 15px !important;
}
</style>
