<template>
	<div v-if="open" class="modal-container">
		<div class="modal-content" :style="contentStyle">
			<button
				class="uk-modal-close-default"
				type="button"
				uk-close
				@click.prevent="closeHandler"
			></button>
			<slot> </slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Modal',
	props: {
		open: { type: Boolean, required: true },
		contentStyle: { type: Object, default: () => {} },
		closeHandler: {
			type: Function,
			required: true,
		},
	},
}
</script>
<style lang="scss" scoped>
.modal-container {
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	background: rgba(1, 1, 1, 0.7);
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: flex-start;
}

.modal-content {
	position: relative;
	background-color: white;
	margin: 40px;
	width: 600px;
}
</style>
