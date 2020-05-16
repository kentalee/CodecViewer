export const NodeTypeAudioInput = Symbol('Audio Input');
export const NodeTypeAudioOutput = Symbol('Audio Output');
export const NodeTypeAudioMixer = Symbol('Audio Mixer');
export const NodeTypeAudioSelector = Symbol('Audio Selector');
export const NodeTypePinComplex = Symbol('Pin Complex');
export const NodeTypePowerWidget = Symbol('Power Widget');
export const NodeTypeVolumeKnobWidget = Symbol('Volume Knob Widget');
export const NodeTypeBeepGeneratorWidget = Symbol('Beep Generator Widget');
export const NodeTypeVendorWidget = Symbol('Vendor Defined Widget');
export const NodeTypeReserved = Symbol('Reserved');
const NodeTypeValMap = [
	NodeTypeAudioInput,
	NodeTypeAudioOutput,
	NodeTypeAudioMixer,
	NodeTypeAudioSelector,
	NodeTypePinComplex,
	NodeTypePowerWidget,
	NodeTypeVolumeKnobWidget,
	NodeTypeBeepGeneratorWidget,
	NodeTypeReserved,
	NodeTypeReserved,
	NodeTypeReserved,
	NodeTypeReserved,
	NodeTypeReserved,
	NodeTypeReserved,
	NodeTypeReserved,
	NodeTypeVendorWidget,
] as symbol[];

export class NodeType {
	public static errInvalidValue = Error('invalid type value');
	private readonly value: number;

	constructor(value: number | symbol) {
		switch (typeof value) {
			case 'number':
				if (NodeTypeValMap[value] === undefined) {
					throw NodeType.errInvalidValue;
				}
				break;
			case 'symbol':
				value = Object.values(NodeTypeValMap).indexOf(value);
				if (value === -1) {
					throw NodeType.errInvalidValue;
				}
				break;
			default:
				throw NodeType.errInvalidValue;
		}
		if (value < 0 || value > NodeTypeValMap.length) {
			throw NodeType.errInvalidValue;
		}
		this.value = value;
	}

	symbol() {
		return NodeTypeValMap[this.value];
	}

	text() {
		return this.symbol().description;
	}

	rawData() {
		return this.value;
	}
}
