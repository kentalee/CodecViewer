import { PinDefault } from './pinDefault';
import { CodecNode } from '@/lib/codec/node';
import { eachLine } from '@/lib/codec/utils';
import { NodeWidgetCap } from '@/lib/codec/nodeWidgetCap';
import { PinCap } from '@/lib/codec/pinCap';

export interface CodecTreeIf {
	codec: string | undefined;
	address: number | undefined;
	vendor: number | undefined;
	subsystem: number | undefined;
	revision: number | undefined;
	nodes: CodecNode[];
}

const processNode = (lines: string[], line: number, codecTree: CodecTreeIf) => {
	const node = new CodecNode();
	const nextLine =
		eachLine(
			(content, _line) => {
				if (line !== _line && content.charAt(0) !== '\x20') return false;

				let matchResult: RegExpMatchArray | null;
				if ((matchResult = content.match(/Node\s?(0x[\da-f]+)\s?\[[a-z\s]+\]\s?wcaps\s?(0x[\da-f]+)/i))) {
					node.setId(parseInt(matchResult[1], 16));
					node.setWidgetCap(new NodeWidgetCap(parseInt(matchResult[2], 16)));
				}
				if ((matchResult = content.match(/Pin Default\s?(0x[\da-f]+)/i)))
					node.setPinDefault(new PinDefault(parseInt(matchResult[1], 16)));
				if ((matchResult = content.match(/Pincap\s?(0x[\da-f]+)/i)))
					node.setPinCap(new PinCap(parseInt(matchResult[1])));

				return true;
			},
			lines,
			line,
		) - 1;
	codecTree.nodes.push(node);
	return nextLine;
};

const sortGt = (a: number, b: number) => {
	if (a > b) {
		return 1;
	}
	if (a < b) {
		return -1;
	}
	return 0;
};

export const processCodec = (raw: string) => {
	const codecLines = raw.split('\n');
	const codecTree = {
		codec: undefined,
		address: undefined,
		vendor: undefined,
		subsystem: undefined,
		revision: undefined,
		nodes: [],
	} as CodecTreeIf;

	eachLine(function(content, _line) {
		let [fieldName, fieldContent] = content.split(':', 2);
		fieldName = fieldName.trim();
		fieldContent = fieldContent ? fieldContent.trim() : '';
		switch (fieldName) {
			case 'Codec':
				codecTree.codec = fieldContent;
				break;
			case 'Address':
				codecTree.address = parseInt(fieldContent, 16);
				break;
			case 'Vendor Id':
				codecTree.vendor = parseInt(fieldContent, 16);
				break;
			case 'Subsystem Id':
				codecTree.subsystem = parseInt(fieldContent, 16);
				break;
			case 'Revision Id':
				codecTree.revision = parseInt(fieldContent, 16);
				break;
			default:
				if (fieldName.split(' ')[0] === 'Node') {
					return processNode(codecLines, _line, codecTree);
				}
		}
		return true;
	}, codecLines);
	codecTree.nodes = codecTree.nodes.sort((nodeA, nodeB) => {
		return sortGt(nodeA.id() || 0xff, nodeB.id() || 0xff);
	});

	return codecTree;
};
