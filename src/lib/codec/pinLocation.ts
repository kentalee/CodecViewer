import { getBitRange } from '@/lib/codec/utils';

export const PinLocationExternal = Symbol('External');
export const PinLocationInternal = Symbol('Internal');
export const PinLocationSeparate = Symbol('Separate');
export const PinLocationOther = Symbol('Other');

export const PinLocationNA = Symbol('N/A');
export const PinLocationRear = Symbol('Rear');
export const PinLocationFront = Symbol('Front');
export const PinLocationLeft = Symbol('Left');
export const PinLocationRight = Symbol('Right');
export const PinLocationTop = Symbol('Top');
export const PinLocationBottom = Symbol('Bottom');

export const PinLocationRearPanel = Symbol('Rear Panel');
export const PinLocationDriveBay = Symbol('Drive Bay');
export const PinLocationRaiser = Symbol('Raiser');
export const PinLocationDigitalDisplay = Symbol('Digital Display');
export const PinLocationATAPI = Symbol('ATAPI');
export const PinLocationLidInside = Symbol('Lid-Inside');
export const PinLocationLidOutside = Symbol('Lid-Outside');
const PinLocationValMapChassis = [
	PinLocationExternal,
	PinLocationInternal,
	PinLocationSeparate,
	PinLocationOther,
];

const PinLocationValMapPosition: (symbol | undefined)[][] = [
	[
		PinLocationNA,
		PinLocationRear,
		PinLocationFront,
		PinLocationLeft,
		PinLocationRight,
		PinLocationTop,
		PinLocationBottom,
		PinLocationRearPanel,
		PinLocationDriveBay,
	],
	[
		PinLocationNA,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		PinLocationRaiser,
		PinLocationDigitalDisplay,
		PinLocationATAPI,
	],
	[
		PinLocationNA,
		PinLocationRear,
		PinLocationFront,
		PinLocationLeft,
		PinLocationRight,
		PinLocationTop,
		PinLocationBottom,
	],
	[
		PinLocationNA,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		PinLocationBottom,
		PinLocationLidInside,
		PinLocationLidOutside,
	],
];

export class PinLocation {
	public static errInvalidValue = Error('invalid Location value');
	private readonly value: number;

	constructor(value: number | symbol[]) {
		let chassis: number;
		let position: number;
		if (typeof value === 'number') {
			chassis = getBitRange(value as number, 2, 4);
			if (!PinLocationValMapChassis[chassis]) {
				throw PinLocation.errInvalidValue;
			}
			position = getBitRange(value as number, 4, 0);
			if (!PinLocationValMapPosition[chassis][position]) {
				throw PinLocation.errInvalidValue;
			}
		} else if (value?.length === 2 && typeof value[0] === 'symbol' && typeof value[1] === 'symbol') {
			chassis = PinLocationValMapChassis.indexOf(value[0] as symbol);
			if (chassis === -1) throw PinLocation.errInvalidValue;
			position = PinLocationValMapPosition[chassis].indexOf(value[1] as symbol);
			if (position === -1) throw PinLocation.errInvalidValue;
			value = (chassis << 4) | position;
		} else {
			throw PinLocation.errInvalidValue;
		}
		if (value < 0x0 || value > 0b111111) {
			throw PinLocation.errInvalidValue;
		}
		this.value = value;
	}

	symbols(): symbol[] {
		const chassisRaw = getBitRange(this.value, 2, 4);
		const chassisSymbol = PinLocationValMapChassis[chassisRaw];
		if (chassisSymbol === undefined) {
			return [PinLocationOther, PinLocationNA];
		}
		const positionRaw = getBitRange(this.value, 4, 0);
		const positionSymbol = PinLocationValMapPosition[chassisRaw][positionRaw];
		if (positionSymbol === undefined) {
			return [chassisSymbol, PinLocationNA];
		}
		return [chassisSymbol, positionSymbol];
	}

	texts(): string[] {
		return Array.from(this.symbols(), s => s.description);
	}

	rawData(): number {
		return this.value;
	}
}
