import Vue from 'vue'
import Prism from 'vue-prism-component'

import 'prismjs'

import 'prismjs/themes/prism-okaidia.css'

import 'prismjs/components/prism-scss.min'
import 'prismjs/components/prism-json.min'
import 'prismjs/components/prism-markup.min'
import 'prismjs/components/prism-javascript.min'

import 'prismjs/plugins/autolinker/prism-autolinker.min'
import 'prismjs/plugins/autolinker/prism-autolinker.css'

import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min'
import 'prismjs/plugins/toolbar/prism-toolbar.min'
import 'prismjs/plugins/toolbar/prism-toolbar.css'

import '~/assets/css/prism.css'

Vue.component('prism', Prism)
