<template>
	<div class="uk-display-inline-block uk-position-relative">
		<div
			class="uk-position-absolute w-0 h-0"
			:style="
				'border-style: solid;border-width: ' +
				size * 0.2 +
				'px ' +
				size * 0.3 +
				'px ' +
				size * 0.2 +
				'px 0; border-color: transparent ' +
				colors[0].color +
				' transparent transparent;left: -' +
				size * 0.625 +
				'px; top:' +
				size * 0.05 +
				'px'
			"
		></div>
		<div
			class="cube"
			:style="'height:' + size + 'px; width:' + size + 'px;'"
		>
			<div
				:style="
					'width: 0; height: 0; border-style: solid; border-width: ' +
					size * 0.75 +
					'px ' +
					size * 0.75 +
					'px 0 0; border-color: ' +
					colors[2].color +
					' transparent transparent transparent;left: -' +
					size * 0.625 +
					'px; top:-' +
					size * 0.35 +
					'px'
				"
			></div>

			<div
				class="side1"
				:style="
					'background-color:' +
					colors[0].color +
					'; height:' +
					size +
					'px; width:' +
					size +
					'px; transform: rotatex(90deg) translateX(0px) translateY(0px) translateZ(' +
					halfWidth +
					')'
				"
			></div>
			<div
				class="side2"
				:style="
					'transform: rotateY(-90deg) translateX(0px) translateY(0px) translateZ(' +
					halfWidth +
					');'
				"
			></div>
			<div
				class="side3"
				:style="
					'background-color:' +
					colors[1].color +
					'; height:' +
					size +
					'px; width:' +
					size +
					'px; transform: translateX(0px) translateY(' +
					halfWidth +
					') translateZ(' +
					halfWidth +
					');'
				"
			></div>
			<div
				class="side4"
				:style="
					'background-color:' +
					colors[2].color +
					'; height:' +
					size +
					'px; width:' +
					size +
					'px; transform: rotateY(90deg) translateX(0px) translateY(0px) translateZ(' +
					halfWidth +
					');'
				"
			></div>
			<div
				class="side5"
				:style="
					'background-color:' +
					colors[3].color +
					';height:' +
					size +
					'px; width:' +
					size +
					'px; transform: rotateY(180deg) translateX(0px) translateY(0px) translateZ(' +
					halfWidth +
					');'
				"
			></div>
			<div
				class="side6"
				:style="
					'background-color:' +
					colors[4].color +
					';height:' +
					size +
					'px; width:' +
					size +
					'px; transform: rotateX(-90deg) translateX(0px) translateY(0px) translateZ(' +
					halfWidth +
					');'
				"
			></div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Logo',
	props: {
		size: {
			type: Number,
			default() {
				return 60
			},
		},
		colors: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {}
	},
	computed: {
		halfWidth() {
			return `${this.size / 2}px`
		},
	},
	methods: {},
}
</script>
<style lang="css" scoped>
.cube {
	transform-style: preserve-3d;
	-moz-transform-style: preserve-3d;
	-webkit-transform-style: preserve-3d;
	transform: rotateX(-35deg) rotateY(-45deg) rotateZ(0deg);
	-moz-transform: rotateX(-35deg) rotateY(-45deg) rotateZ(0deg);
	-webkit-transform: rotateX(-35deg) rotateY(-45deg) rotateZ(0deg);
	margin: auto;
	position: relative;
	-webkit-transition: all 0.5s ease-in-out;
	transition: all 0.5s ease-in-out;
}
.cube div {
	position: absolute;
	-webkit-transition: all 0.5s ease-in-out;
	transition: all 0.5s ease-in-out;
	float: left;
	overflow: hidden;
	opacity: 0.85;
}

.side1 {
	/* transform: rotatex(90deg) translateX(0px) translateY(0px) translateZ(56px);
	-moz-transform: rotatex(90deg) translateX(0px) translateY(0px)
		translateZ(56px);
	-webkit-transform: rotatex(90deg) translateX(0px) translateY(0px)
		translateZ(56px); */
	background-color: #77c045;
	opacity: 1 !important;
}
.side2 {
	/* transform: rotateY(-90deg) translateX(0px) translateY(0px) translateZ(56px);
	-moz-transform: rotateY(-90deg) translateX(0px) translateY(0px)
		translateZ(56px);
	-webkit-transform: rotateY(-90deg) translateX(0px) translateY(0px)
		translateZ(56px); */
	background-color: transparent;
}
.side3 {
	/* transform: translateX(0px) translateY(0px) translateZ(56px);
	-moz-transform: translateX(0px) translateY(0px) translateZ(56px);
	-webkit-transform: translateX(0px) translateY(56px) translateZ(56px);
	background-color: #f33c1a; */
	opacity: 1 !important;
}
.side4 {
	/* transform: rotateY(90deg) translateX(0px) translateY(0px) translateZ(56px);
	-moz-transform: rotateY(90deg) translateX(0px) translateY(0px)
		translateZ(56px);
	-webkit-transform: rotateY(90deg) translateX(0px) translateY(0px)
		translateZ(56px); */
	background-color: #f6cc13;
	opacity: 0.8 !important;
}
.side5 {
	/* transform: rotateY(180deg) translateX(0px) translateY(0px) translateZ(56px);
	-moz-transform: rotateY(180deg) translateX(0px) translateY(0px)
		translateZ(56px);
	-webkit-transform: rotateY(180deg) translateX(0px) translateY(0px)
		translateZ(56px); */
	background-color: #77c045;
}
.side6 {
	/* transform: rotateX(-90deg) translateX(0px) translateY(0px) translateZ(56px);
	-moz-transform: rotateX(-90deg) translateX(0px) translateY(0px)
		translateZ(56px);
	-webkit-transform: rotateX(-90deg) translateX(0px) translateY(0px)
		translateZ(56px); */
	background-color: #f6cc13;
	opacity: 0.8 !important;
}
</style>
