<template>
	<div class="">
		<div
			data-uk-filter="target: .js-filter; animation: delayed-fade"
			class="uk-grid"
			data-uk-grid
		>
			<div class="uk-width-auto@m">
				<ul class="uk-tab uk-tab-left uk-text-left">
					<li
						v-for="(grp, index) in groups"
						:key="grp.key"
						:data-uk-filter-control="'.tag-' + grp.key"
						:class="index === 1 ? 'uk-active' : ''"
					>
						<a
							class="uk-text-left"
							style="padding-right: 30px"
							href="#"
							>{{ grp.title }}</a
						>
					</li>
				</ul>
			</div>
			<div
				class="
					uk-width-expand@m uk-panel-scrollable uk-resize-vertical
					well
				"
				uk-height-viewport="offset-top:true; offset-bottom: 40px"
			>
				<!-- <ul > -->
				<draggable
					class="dragArea list-group js-filter"
					:list="modinitlist"
					:group="{
						name: 'page',
						pull: 'clone',
						put: false,
						sort: false,
					}"
					style="padding: 0 10px"
					@change="log"
				>
					<div
						v-for="mod in modinitlist"
						:key="mod.id"
						class="uk-margin-medium-bottom"
						:class="'tag-' + mod.group"
					>
						<!-- <div class="uk-text-small">
							{{ mod.label }}
						</div> -->
						<!-- <img
							:data-src="
								'https://assets.uiaas.io/web/section/' +
								mod.name +
								'.xl.png'
							"
							data-uk-img
							alt="mod.name"
							class="
								mod-image
								uk-border uk-border-rounded uk-sortable-handle
							"
						/> -->
						<div
							v-if="mod.isPartial"
							class="
								uk-card
								uk-card-default
								uk-card-body
								uk-sortable-handle
							"
						>
							Partial: {{ mod.name }}
						</div>
						<div v-else>
							<img
								:id="mod.name"
								class="mod-image uk-sortable-handle"
								width="2400px"
								:src="
									'https://assets.uiaas.io/web/modules/' +
									mod.name +
									'.xl.webp'
								"
								:alt="mod.handle"
							/>
							<p>
								{{ mod.label }}
							</p>
						</div>
					</div>
				</draggable>
				<!-- </ul> -->
			</div>
		</div>
	</div>
</template>

<script>
// import { mapState } from 'vuex'
// const _ = require('lodash')

export default {
	name: 'ModuleMenu',
	props: {
		groups: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {}
	},
	computed: {
		modinitlist() {
			const modules = []
			for (let i = 0; i < this.groups.length; i++) {
				const grp = this.groups[i]
				for (let j = 0; j < grp.modules.length; j++) {
					const ecmod = grp.modules[j]
					modules.push(ecmod)
				}
			}
			return modules
		},
	},
	methods: {
		log(evt) {
			window.console.log(evt)
		},
	},
}
</script>
<style lang="scss" scoped>
#moduleMenu .uk-offcanvas-bar {
	// background: rgba(224, 201, 166, 0.95);
	background: var(--muted-bg);
	// border-right: 1px solid #ddd;
	width: 500px;
	box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
}
.uk-panel-scrollable {
	border: 0;
	padding-top: 20px;
}
.uk-tab-left {
	padding-top: 20px;
	&::before {
		border: 0;
	}
}
.uk-tab-left > * > a {
	border-width: 2px;
	text-align: left !important;
	justify-content: flex-start !important;
	font-size: 1rem;
	line-height: 1.8;
	&:hover {
		color: var(--pw-primary);
	}
}
.uk-tab > .uk-active > a {
	background: var(--pw-primary);
	color: #fff;
	border-top-left-radius: 6px;
	border-bottom-left-radius: 6px;
	font-weight: 500;
}
.mod-image {
	border: 1px solid #efefef;
	box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
	&:hover {
		box-shadow: 0 5px 10px rgb(0 0 0 / 15%);
	}
}

.well {
	// box-shadow: inset 0 5px 12px rgb(0 0 0 / 15%);
	border-left: 1px solid var(--pw-primary);
	// border-radius: 10px;
	// border: 0;
}
</style>
