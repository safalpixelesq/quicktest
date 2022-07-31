<template>
	<div class="triangles">
		<div class="tleft"></div>
		<div class="tright"></div>
	</div>
</template>
<script>
export default {
	name: 'Splitbg',
	components: {},
	props: {
		mobile: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {}
	},
	computed: {},
}
</script>
<style lang="scss" scoped>
.tleft {
	position: absolute;
	width: 220px;
	height: 220px;
	top: -55px;
	left: -40px;
	background-image: url('/svgs/ylw_ml.svg');
	background-size: contain;
	background-repeat: no-repeat;
}

.tright {
	position: absolute;
	width: 220px;
	height: 220px;
	right: -50px;
	bottom: -40px;
	background-image: url('/svgs/blu_mr.svg');
	background-size: contain;
	background-repeat: no-repeat;
}
</style>
