<template>
	<select
		v-if="connector"
		v-model="connection"
		type="select"
		:name="`${parentPath}-connect`"
		class="uk-select"
		:class="{ 'uk-text-success': connection }"
		style="width: 80px; font-size: 10px"
	>
		<option value="" disabled selected>Connect</option>
		<option
			v-for="option in connectorFieldList"
			:key="option.value"
			:value="option.value"
		>
			{{ option.label }}
		</option>
		<option value="$pq_disconnect">Disconnect</option>
	</select>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { startCase, toLower, isObject, get } from 'lodash'

export default {
	name: 'ConnectorField',
	props: {
		parentPath: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			default: '',
		},
	},
	data() {
		return { timeout: null }
	},
	computed: {
		...mapState({
			connector: (state) => state.editors.connector,
		}),
		...mapGetters({
			sectionConnection: 'editors/sectionConnection',
		}),
		connection: {
			get() {
				if (this.sectionConnection) {
					return this.sectionConnection[this.parentPath] || ''
				}

				return ''
			},
			set(connectedField) {
				const update = {
					path: this.parentPath,
					fulfillConnection: true,
				}
				if (connectedField === '$pq_disconnect') {
					update.value = 'Lorem ipsum dolor sit amet'
					this.removeConnection(this.parentPath)
				}
				if (connectedField.startsWith('$pq_connect')) {
					const field = connectedField.split('$pq_connect_')[1]
					let connectionKey = this.parentPath
					let connectionValue = connectedField
					update.value = get(this.connector, field)

					if (
						this.parentPath.includes('items') ||
						this.parentPath.includes('ctas')
					) {
						const parsedConnectedField = field.split('.')
						const parsedParentPath =
							this.parentPath.match(/(.*)\[\d*\](.*)/)
						connectionKey = parsedParentPath[1]
						connectionValue = {
							path: parsedConnectedField[0],
							connection: {
								[parsedParentPath[2]]: `[${parsedConnectedField[1]}]`,
							},
						}
					}
					this.setConnection({
						[connectionKey]: connectionValue,
					})
				}

				this.updateSectionByPath(update)
			},
		},
		connectorFieldList() {
			const fieldList = this.connector
				? Object.keys(this.connector).map((item) => {
						if (isObject(this.connector[item])) {
							const modelObj = Array.isArray(this.connector[item])
								? this.connector[item][0]
								: this.connector[item]

							return Object.keys(modelObj).map((subItem) => {
								return {
									label: startCase(
										toLower(`${item} ${subItem}`)
									),
									value: `$pq_connect_${item}.${subItem}`,
									sampleValue: modelObj[subItem],
								}
							})
						}
						return {
							label: startCase(toLower(item)),
							value: `$pq_connect_${item}`,
							sampleValue: this.connector[item],
						}
				  })
				: []

			return fieldList.flat()
		},
	},
	methods: {
		...mapActions({
			updateSectionByPath: 'editors/updateSectionByPath',
			setConnection: 'editors/setConnection',
			removeConnection: 'editors/removeConnection',
		}),
	},
}
</script>
