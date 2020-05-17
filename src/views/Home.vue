<template lang="pug">
	div.page
		#dropZone(
			v-if='typeof dataTree !== "object"',
			:class='{dragging:dragging}',
			@dragover='dragOver', @dragleave='dragLeave', @drop.prevent='dragDrop')
			div.center()
				h1 Drop Codec# file here
		#dataTables(v-else)
			el-table.full-width(:data='[dataTree]', border)
				el-table-column(label='codec')
					template(slot-scope='scope')
						| {{dataTree.codec}}
				el-table-column(label='address')
					template(slot-scope='scope')
						| 0x{{numFixLength(dataTree.address,16,2)}}
				el-table-column(label='vendor(dev_id)')
					template(slot-scope='scope')
						| 0x{{numFixLength(dataTree.vendor,16,8)}}
				el-table-column(label='subsystem')
					template(slot-scope='scope')
						| 0x{{numFixLength(dataTree.subsystem,16,8)}}
				el-table-column(label='revision')
					template(slot-scope='scope')
						| 0x{{numFixLength(dataTree.revision,16,8)}}
			br
			el-table.full-width(:data='dataTree.nodes', border)
				el-table-column(type='expand')
					template(slot-scope='props')
						el-collapse(
							:value='["pinDefault"]'
							v-if='props.row.pinDefault() !== undefined')
							el-collapse-item(name='pinDefault')
								template(slot='title')
									h3.expandSectionTitle
										| PinDefault =&nbsp;
										code
											| 0x{{numFixLength(props.row.pinDefault().rawData(),16,8)}}
								el-row.expandSection(:gutter='20')
									el-col.field(:span='16', :xs='24')
										h4 Binary Data
										code
											| {{props.row.pinDefault().rawBinaryText(true)}}
									el-col.field(:span='8', :xs='24')
										h4 Connectivity
										code
											| {{props.row.pinDefault().connectivity().physical()?'physical':''}}
											| {{props.row.pinDefault().connectivity().internal()?'internal':''}}
											| {{props.row.pinDefault().connectivity().none()?'none':''}}
									el-col.field(:span='8', :xs='24')
										h4 Sequence
										code
											| {{numFixLength(props.row.pinDefault().sequence(),10,2)}}&nbsp;
											| 0x{{numFixLength(props.row.pinDefault().sequence(),16,1)}}
									el-col.field(:span='8', :xs='24')
										h4 Association
										code
											| {{numFixLength(props.row.pinDefault().association(),10,2)}}&nbsp;
											| 0x{{numFixLength(props.row.pinDefault().association(),16,1)}}
									el-col.field(:span='8', :xs='24')
										h4 Misc
										code
											| Jack Detection:
											| {{props.row.pinDefault().misc().detectOverride()?'enabled':'disabled'}}
									el-col.field(:span='8', :xs='24')
										h4 Color
										code
											span.colorSign(:style='{backgroundColor:colorHex(props.row.pinDefault().color())}') &#12288;
											| {{props.row.pinDefault().color().text()}}
									el-col.field(:span='8', :xs='24')
										h4 Connection
										code
											| {{props.row.pinDefault().connection().text()}}
									el-col.field(:span='8', :xs='24')
										h4 Device & Location
										code
											| {{props.row.pinDefault().device().text()}},
											| {{props.row.pinDefault().location().texts().join(' at ')}}
				el-table-column(label='NodeId')
					template(slot-scope='scope')
						| {{numFixLength(scope.row.id(),10,2)}}
						| 0x{{numFixLength(scope.row.id(),16,2)}}
				el-table-column(label='Type')
					template(slot-scope='scope')
						| {{scope.row.widgetCap().type().text()}}
</template>
<script lang="ts">
	import vue from 'vue';
	import { CodecTreeIf, processCodec } from '@/lib/codec';
	import { numFixLength } from '@/lib/codec/utils';
	import { CodecNode } from '@/lib/codec/node';
	import { NodeType, NodeTypePinComplex, NodeTypeReserved } from '@/lib/codec/nodeType';
	import {
		PinColor,
		PinColorBlack,
		PinColorBlue,
		PinColorGreen,
		PinColorGrey,
		PinColorOrange,
		PinColorPink,
		PinColorPurple,
		PinColorRed,
		PinColorWhite,
		PinColorYellow,
	} from '@/lib/codec/pinColor';

	const nodeSorter = (a: CodecNode, b: CodecNode) => {
		const typeA = a?.widgetCap()?.type() || new NodeType(NodeTypeReserved);
		const typeB = b?.widgetCap()?.type() || new NodeType(NodeTypeReserved);
		if (typeA.rawData() != typeB.rawData()) {
			if (typeA.symbol() === NodeTypePinComplex) return -1;
			if (typeB.symbol() === NodeTypePinComplex) return 1;
			return (typeA.rawData() ?? 0xff) > (typeB.rawData() ?? 0xff) ? 1 : -1;
		}

		const pdA = a.pinDefault();
		const pdB = b.pinDefault();
		if (pdA !== undefined && pdB !== undefined) {
			if (pdA.connectivity().rawData() !== pdB.connectivity().rawData()) {
				if (pdA.connectivity().none()) return 1;
				if (pdB.connectivity().none()) return -1;
			}
			if (pdA.association() !== pdB.association()) {
				return pdA.association() > pdB.association() ? 1 : -1;
			}
			if (pdA.sequence() !== pdB.sequence()) {
				return pdA.sequence() > pdB.sequence() ? 1 : -1;
			}
		}

		return (a.id() ?? 0xff) > (b.id() ?? 0xff) ? 1 : -1;
	};

	export default vue.extend({
		data() {
			return {
				optionEnableVendorWidget: false,
				optionEnableAudioInput: false,
				optionEnableAudioOutput: false,
				optionEnableAudioMixer: false,

				dragging: false,
				dataTree: undefined as CodecTreeIf | undefined,
			};
		},
		methods: {
			numFixLength,
			dragOver(ev: DragEvent) {
				ev.stopPropagation();
				ev.preventDefault();
				this.dragging = true;
			},
			dragLeave(ev: DragEvent) {
				ev.stopPropagation();
				ev.preventDefault();
				this.dragging = false;
			},
			dragDrop(ev: DragEvent) {
				ev.stopPropagation();
				ev.preventDefault();
				this.dragging = false;
				this.dataTree = undefined;
				if (ev.dataTransfer === null || ev.dataTransfer.files.length === 0) {
					return;
				}
				const element = ev.dataTransfer.files[0];
				const fr = new FileReader();
				fr.onload = () => {
					try {
						const dataTree = processCodec(fr.result as string);
						dataTree.nodes = dataTree.nodes.sort(nodeSorter);
						console.log(dataTree);
						this.dataTree = dataTree;
					} catch (e) {
						console.log(e);
					}
				};
				fr.readAsText(element);
			},
			colorHex(c: PinColor) {
				switch (c.symbol()) {
					case PinColorBlack:
						return '#000';
					case PinColorGrey:
						return '#666';
					case PinColorBlue:
						return '#0078d7';
					case PinColorGreen:
						return '#16c60c';
					case PinColorRed:
						return '#e81224';
					case PinColorOrange:
						return '#f7630c';
					case PinColorYellow:
						return '#fff100';
					case PinColorPurple:
						return '#886ce4';
					case PinColorPink:
						return '#ff69b4';
					case PinColorWhite:
						return '#fff';
					default:
						return '';
				}
			},
		},
	});
</script>
<style lang="scss">
	@import '~@/styles/defines.scss';

	.page {
		font-size: 16px;
		padding: 0.5em;
		height: 100%;
	}

	#dropZone {
		width: 100%;
		height: 100%;
		border: 2px dashed gray;

		&.dragging {
			border: 2px dashed orange;
		}

		.center {
			height: 100%;
			text-align: center;

			h1 {
				margin: 0;
				font-size: 32px;
				font-weight: 700;
				position: relative;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}

	#dataTables {
		width: 100%;

		code {
			font-family: 'Cascadia Code PL', Menlo, Monaco, 'Courier New', monospace;
		}

		.expandSectionTitle {
			&,
			& > * {
				font-size: 1rem * (1 + 3/7) !important;
				/*font-weight: 600 !important;*/
			}
		}

		.expandSection {
			h4 {
				color: $cDark_B63;
			}

			code {
				display: block;
				padding: 1rem * (1.5 / 7) 0.5rem 1rem * (5.5 / 7) 0;

				.colorSign {
					height: 1.15em;
					width: 1.15em;
					display: inline-block;
					box-sizing: border-box;
					border: black 1px solid;
					vertical-align: text-bottom;
					margin-right: 0.25em;
				}
			}
		}
	}
</style>
