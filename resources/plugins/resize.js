import Vue from 'vue'
import iframeResize from 'iframe-resizer'

Vue.directive('resize', {
	bind(el, { value = {} }) {
		el.addEventListener('load', () => iFrameResize(value, el))
	}
})
