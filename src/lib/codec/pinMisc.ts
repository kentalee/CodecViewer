import { getBitRange, setBitRange } from '@/lib/codec/utils';

export class PinMisc {
	public static errInvalidValue = Error('invalid misc value');
	private _reserve: number;
	private _detectOverride: boolean;

	constructor(value: number) {
		if (value < 0 || value > 0b1111) {
			throw PinMisc.errInvalidValue;
		}
		this._reserve = getBitRange(value, 3, 1);
		this._detectOverride = getBitRange(value, 1, 0) === 1;
	}

	detectOverride() {
		return this._detectOverride;
	}

	setDetectOverride(val: boolean) {
		this._detectOverride = val;
		return this;
	}

	reserve() {
		return this._reserve;
	}

	setReserve(val: number) {
		if (val < 0 || val > 0b111) {
			throw PinMisc.errInvalidValue;
		}
		this._reserve = val;
		return this;
	}

	rawData(): number {
		let rawNumber = 0;
		rawNumber = setBitRange(rawNumber, 3, 1, this._reserve ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 0, this._detectOverride ? 1 : 0);
		return rawNumber;
	}
}
