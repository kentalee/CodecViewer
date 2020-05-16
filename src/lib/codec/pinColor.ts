export const PinColorUnknown = Symbol('Unknown');
export const PinColorBlack = Symbol('Black');
export const PinColorGrey = Symbol('Grey');
export const PinColorBlue = Symbol('Blue');
export const PinColorGreen = Symbol('Green');
export const PinColorRed = Symbol('Red');
export const PinColorOrange = Symbol('Orange');
export const PinColorYellow = Symbol('Yellow');
export const PinColorPurple = Symbol('Purple');
export const PinColorPink = Symbol('Pink');
export const PinColorWhite = Symbol('White');
export const PinColorReserved = Symbol('Reserved');
export const PinColorOther = Symbol('Other');
const PinColorValMap = [
	PinColorUnknown,
	PinColorBlack,
	PinColorGrey,
	PinColorBlue,
	PinColorGreen,
	PinColorRed,
	PinColorOrange,
	PinColorYellow,
	PinColorPurple,
	PinColorPink,
	PinColorReserved,
	PinColorReserved,
	PinColorReserved,
	PinColorReserved,
	PinColorWhite,
	PinColorOther,
];

export class PinColor {
	public static errInvalidValue = Error('invalid color value');
	private readonly value: number;

	constructor(value: number | symbol) {
		switch (typeof value) {
			case 'number':
				if (value < 0 || value > PinColorValMap.length) {
					throw PinColor.errInvalidValue;
				}
				break;
			case 'symbol':
				value = PinColorValMap.indexOf(value);
				if (value === -1) {
					throw PinColor.errInvalidValue;
				}
				break;
			default:
				throw PinColor.errInvalidValue;
		}
		if (value < 0x0 || value > 0xf) {
			throw Error('invalid color value');
		}
		this.value = value;
	}

	symbol(): symbol {
		return PinColorValMap[this.value] || PinColorUnknown;
	}

	text(): string {
		return this.symbol().description;
	}

	rawData(): number {
		return this.value;
	}
}
