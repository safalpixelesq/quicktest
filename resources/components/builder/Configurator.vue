<template>
	<div class="config-accordion-box uk-padding-small">
		<ul uk-accordion>
			<li
				v-if="
					config.includes('justify') ||
					config.includes('container') ||
					config.includes('spacing')
				"
			>
				<a class="uk-accordion-title uk-text-sm" href="#">
					Alignment & Spacing
				</a>
				<div class="uk-accordion-content">
					<Justify
						v-if="config.includes('justify')"
						class="uk-margin-bottom"
						:config="styleobj.justify ? styleobj.justify : 'left'"
						attr="justify"
						@updateModule="updateModule"
					></Justify>

					<Container
						v-if="config.includes('container')"
						class="uk-margin-bottom"
						:config="styleobj.container || 'md'"
						attr="container"
						@updateModule="updateModule"
					></Container>

					<Spacing
						v-if="config.includes('spacing')"
						class="uk-margin-bottom"
						:config="styleobj.spacing || 'md'"
						attr="spacing"
						@updateModule="updateModule"
					></Spacing>
				</div>
			</li>
			<li v-if="config.includes('background')">
				<a class="uk-accordion-title" href="#"> Background </a>
				<div class="uk-accordion-content">
					<Background
						class="uk-margin-bottom"
						:config="{
							background: styleobj.background || '#fff',
							invert: styleobj.invert || false,
						}"
						@updateModule="updateModule"
					></Background>
				</div>
			</li>
			<li v-if="config.includes('align') || config.includes('color')">
				<a class="uk-accordion-title" href="#"> Text </a>
				<div class="uk-accordion-content">
					<Align
						v-if="config.includes('align')"
						class="uk-margin-bottom"
						:config="styleobj.align ? styleobj.align : 'left'"
						attr="align"
						@updateModule="updateModule"
					></Align>
					<Color
						v-if="config.includes('color')"
						class="uk-margin-bottom"
						:config="{
							color: styleobj.color || '',
						}"
						@updateModule="updateModule"
					></Color>
				</div>
			</li>
			<li
				v-if="
					config.includes('mediaPos') || config.includes('mediaWidth')
				"
			>
				<a class="uk-accordion-title" href="#"> Media </a>
				<div class="uk-accordion-content">
					<Media
						class="uk-margin-bottom"
						:config="{
							mediaPos: config.includes('mediaPos')
								? styleobj.mediaPos
								: false,
							mediaWidth: config.includes('mediaWidth')
								? styleobj.mediaWidth
								: false,
						}"
						:attr="{
							pos: 'mediaPos',
							width: 'mediaWidth',
						}"
						@updateModule="updateModule"
					></Media>
				</div>
			</li>
			<li v-if="collection.length">
				<a href="#" class="uk-accordion-title"
					>Collection Style Config
					<br />
					<span class="uk-text-meta">
						Edit your section's collection style
					</span>
				</a>
				<div class="uk-accordion-content">
					<ul uk-accordion>
						<li
							v-if="
								config.includes('itemJustify') ||
								config.includes('columns')
							"
						>
							<a class="uk-accordion-title" href="#">
								Alignment & Spacing
							</a>
							<div class="uk-accordion-content">
								<Justify
									v-if="config.includes('itemJustify')"
									class="uk-margin-bottom"
									:config="
										styleobj.itemJustify
											? styleobj.itemJustify
											: 'left'
									"
									attr="itemJustify"
									@updateModule="updateModule"
								></Justify>

								<Column
									v-if="config.includes('columns')"
									class="uk-margin-bottom"
									:config="{
										columns: styleobj.columns || 3,
										columnGap: styleobj.columnGap || 'md',
									}"
									@updateModule="updateModule"
								></Column>
							</div>
						</li>
						<li v-if="config.includes('itemBackground')">
							<a class="uk-accordion-title" href="#">
								Background
							</a>
							<div class="uk-accordion-content">
								<Background
									class="uk-margin-bottom"
									:config="{
										background:
											styleobj.itemBackground || false,
										invert: styleobj.itemInvert || false,
									}"
									:item="true"
									@updateModule="updateModule"
								></Background>
							</div>
						</li>
						<li
							v-if="
								config.includes('itemAlign') ||
								config.includes('itemColor')
							"
						>
							<a class="uk-accordion-title" href="#"> Text </a>
							<div class="uk-accordion-content">
								<Align
									v-if="config.includes('itemAlign')"
									class="uk-margin-bottom"
									:config="styleobj.itemAlign"
									attr="itemAlign"
									@updateModule="updateModule"
								></Align>
								<Color
									v-if="config.includes('itemColor')"
									class="uk-margin-bottom"
									:config="{
										color: styleobj.itemColor || '',
									}"
									:item="true"
									@updateModule="updateModule"
								></Color>
							</div>
						</li>
						<li
							v-if="
								config.includes('itemMediaPos') ||
								config.includes('mediaWidth')
							"
						>
							<a class="uk-accordion-title" href="#"> Media </a>
							<div class="uk-accordion-content">
								<Media
									class="uk-margin-bottom"
									:config="{
										mediaPos: styleobj.itemMediaPos,
										mediaWidth: styleobj.itemMediaWidth,
									}"
									:attr="{
										pos: 'itemMediaPos',
										width: 'itemMediaWidth',
									}"
									@updateModule="updateModule"
								></Media>
							</div>
						</li>
						<li v-if="isIcon">
							<a class="uk-accordion-title" href="#"> Icon </a>
							<div class="uk-accordion-content">
								<Icon
									class="uk-margin-bottom"
									:config="{
										iconPos: config.includes('itemIconPos')
											? styleobj.itemIconPos
											: false,
										iconBg: config.includes(
											'itemIconBackground'
										)
											? styleobj.itemIconBackground
											: false,
										iconShape: config.includes(
											'itemIconShape'
										)
											? styleobj.itemIconShape
											: false,
										iconSize: config.includes(
											'itemIconSize'
										)
											? styleobj.itemIconSize
											: false,
										iconColor: config.includes(
											'itemIconColor'
										)
											? styleobj.itemIconColor
											: false,
									}"
									:attr="{
										pos: 'itemIconPos',
										bg: 'itemIconBackground',
										color: 'itemIconColor',
										size: 'itemIconSize',
										shape: 'itemIconShape',
									}"
									@updateModule="updateModule"
								></Icon>
							</div>
						</li>
					</ul>
				</div>
			</li>
			<li v-if="styleobj.item && typeof styleobj.item === 'object'">
				<a href="#" class="uk-accordion-title">
					Items Style <br />
					<span class="uk-text-meta">
						Edit your each item's style
					</span>
				</a>
				<div class="uk-accordion-content">
					<ul uk-accordion>
						<li
							v-for="(item, i) in collection"
							:key="`item_style_${i + 1}`"
						>
							<a href="#" class="uk-accordion-title">
								Item {{ i }}
							</a>
							<div class="uk-accordion-content">
								<Configurator
									:config="Object.keys(styleobj.item)"
									:styleobj="item.style"
									:collection="[]"
									:item-index="i"
									:update-item-style="updateItemStyle"
									@updateModule="updateModule"
								/>
							</div>
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import Align from '@/components/config/Align'
import Justify from '@/components/config/Justify'
import Background from '@/components/config/Background'
import Color from '@/components/config/Color'
import Container from '@/components/config/Container'
import Spacing from '@/components/config/Spacing'
import Media from '@/components/config/Media'
import Icon from '@/components/config/Icon'
import Column from '@/components/config/Column'

export default {
	name: 'Configurator',
	components: {
		Align,
		Justify,
		Background,
		Color,
		Container,
		Spacing,
		Media,
		Icon,
		Column,
	},
	props: {
		config: {
			type: Array,
			required: true,
		},
		styleobj: {
			type: Object,
			required: true,
		},
		collection: {
			type: Array,
			default: () => [],
		},
		itemIndex: {
			type: Number,
			default: -1,
		},
		updateItemStyle: {
			type: Function,
			default: () => {},
		},
	},
	computed: {
		isIcon() {
			return (
				this.config.includes('itemIconPos') ||
				this.config.includes('itemIconBackground') ||
				this.config.includes('itemIconColor') ||
				this.config.includes('itemIconShape') ||
				this.config.includes('itemIconSize')
			)
		},
	},
	methods: {
		updateModule(payload) {
			if (this.itemIndex > -1) {
				this.updateItemStyle(payload, this.itemIndex)
			} else {
				this.$emit('updateModule', payload)
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.config-accordion-box {
	box-sizing: border-box;
	padding: 20px;
	width: 100%;
	height: 480px;
	overflow-y: auto;
	li {
		border: 0.5px solid #ddd;
	}

	.uk-accordion-title {
		font-size: 16px;
		background-color: rgb(247, 247, 247);
		padding: 8px;
		border-radius: 4px;
	}

	.uk-accordion-content {
		padding: 20px 10px;
		margin: 0;
	}

	.config-accordion-box {
		padding: 0;
		height: auto;
	}
}
</style>
