const PinConnectionUnknown = Symbol('Unknown');
const PinConnection1Of8stereoMono = Symbol('1/8" stereo/mono');
const PinConnection1Of4stereoMono = Symbol('1/4" stereo/mono');
const PinConnectionATAPIInternal = Symbol('ATAPI internal');
const PinConnectionRCA = Symbol('RCA');
const PinConnectionOptical = Symbol('Optical');
const PinConnectionOtherDigital = Symbol('Other Digital');
const PinConnectionOtherAnalog = Symbol('Other Analog');
const PinConnectionMultichannelAnalogDIN = Symbol('Multichannel Analog(DIN)');
const PinConnectionXLRProfessional = Symbol('XLR/Professional');
const PinConnectionRJ11Modem = Symbol('RJ-11 (Modem)');
const PinConnectionCombination = Symbol('Combination');
const PinConnectionReserved = Symbol('Reserved');
const PinConnectionOther = Symbol('Other');
const PinConnectionValMap = [
	PinConnectionUnknown,
	PinConnection1Of8stereoMono,
	PinConnection1Of4stereoMono,
	PinConnectionATAPIInternal,
	PinConnectionRCA,
	PinConnectionOptical,
	PinConnectionOtherDigital,
	PinConnectionOtherAnalog,
	PinConnectionMultichannelAnalogDIN,
	PinConnectionXLRProfessional,
	PinConnectionRJ11Modem,
	PinConnectionCombination,
	PinConnectionReserved,
	PinConnectionReserved,
	PinConnectionReserved,
	PinConnectionOther,
];

export class PinConnection {
	public static errInvalidValue = Error('invalid color value');
	private readonly value: number;

	constructor(value: number | symbol) {
		switch (typeof value) {
			case 'number':
				if (value < 0 || value > PinConnectionValMap.length) {
					throw PinConnection.errInvalidValue;
				}
				break;
			case 'symbol':
				value = PinConnectionValMap.indexOf(value);
				if (value === -1) {
					throw PinConnection.errInvalidValue;
				}
				break;
			default:
				throw PinConnection.errInvalidValue;
		}
		if (value < 0x0 || value > 0xf) {
			throw Error('invalid color value');
		}
		this.value = value;
	}

	symbol(): symbol {
		return PinConnectionValMap[this.value] || PinConnectionUnknown;
	}

	text(): string {
		return this.symbol().description;
	}

	rawData(): number {
		return this.value;
	}
}
