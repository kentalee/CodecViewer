<template lang="pug">
	div.page
		#dropZone(
			:class='{dragging:dragging}',
			@dragover='dragOver', @dragleave='dragLeave', @drop.prevent='dragDrop')
			div.center()
				h1 Drop Codec# file here
		#dataTables(v-if='typeof dataTree === "object"')
			table
				tr
					th codec
					th address
					th vendor(dev_id)
					th subsystem
					th revision
				tr
					td {{dataTree.codec}}
					td 0x{{numFixLength(dataTree.address,16,2)}}
					td 0x{{numFixLength(dataTree.vendor,16,8)}}
					td 0x{{numFixLength(dataTree.subsystem,16,8)}}
					td 0x{{numFixLength(dataTree.revision,16,8)}}
			table
				tr
					th NodeId
					th Type
					th CapInfo
					th Association
					th Sequence
					th Color
					th Device
					th Connection
					th Connectivity
					th Location
					th Misc
				tr(v-for="node of dataTree.nodes")
					td {{numFixLength(node.id(),10,2)}} 0x{{numFixLength(node.id(),16,2)}}
					td {{node.widgetCap().type().text()}}
					td
						| {{node.widgetCap().inAmpPresent()?'AmpIn':''}}
						| {{node.widgetCap().outAmpPresent()?'AmpOut':''}}
						| {{node.widgetCap().stereo()?'Stereo':''}}
					template(v-if="node.pinDefault() === undefined")
						td(colspan="8") -
					template(v-else)
						td
							| {{numFixLength(node.pinDefault().association(),10,2)}}
							| 0x{{numFixLength(node.pinDefault().association(),16,1)}}
						td
							| {{numFixLength(node.pinDefault().sequence(),10,2)}}
							| 0x{{numFixLength(node.pinDefault().sequence(),16,1)}}
						td {{node.pinDefault().color().text()}}
						td {{node.pinDefault().device().text()}}
						td {{node.pinDefault().connection().text()}}
						td
							| {{node.pinDefault().connectivity().internal()?'internal':''}}
							| {{node.pinDefault().connectivity().physical()?'physical':''}}
						td {{node.pinDefault().location().texts().join(', ')}}
						td
							| {{node.pinDefault().misc().detectOverride()?'Detect':''}}
							| {{node.pinCap().getEAPDCapable()?'EAPD':''}}
</template>
<script lang="ts">
	import vue from 'vue';
	import { CodecTreeIf, processCodec } from '@/lib/codec';
	import { numFixLength, setBitRange } from '@/lib/codec/utils';
	import { CodecNode } from '@/lib/codec/node';
	import { NodeType, NodeTypePinComplex, NodeTypeReserved } from '@/lib/codec/nodeType';
	import { PinConnectivity } from '@/lib/codec/pinConnectivity';

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
				const emptyConnectivity = new PinConnectivity(0).setPhysical(false).setInternal(false);
				if (pdA.connectivity().rawData() === emptyConnectivity.rawData()) {
					return -1;
				}
				if (pdB.connectivity().rawData() === emptyConnectivity.rawData()) {
					return 1;
				}
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
		},
	});
</script>
<style lang="scss" scoped>
	.page {
		font-size: 16px;
		padding: 0.5em;
	}

	h1 {
		margin: 0;
		font-size: 32px;
		font-weight: 700;
	}

	#dropZone {
		width: 100%;
		border: 2px dashed gray;

		&.dragging {
			border: 2px dashed orange;
		}

		.center {
			height: 150px;
			line-height: 150px;
			text-align: center;
		}
	}

	#dataTables {
		width: 100%;

		table {
			border-collapse: collapse;
			margin-top: 1em;
			width: 100%;

			td,
			th {
				padding: 0.25em;
				border: 2px #808080 solid;
			}

			tr > th {
				font-weight: 400;
			}

			tr > td {
				font-family: 'Cascadia Code PL', Menlo, Monaco, 'Courier New', monospace;
			}
		}
	}
</style>
