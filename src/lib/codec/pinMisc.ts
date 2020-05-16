import { getBitRange, setBitRange } from '@/lib/codec/utils';

export class PinMisc {
	public static errInvalidValue = Error('invalid misc value');
	private _detectOverride: boolean;

	constructor(value: number) {
		if (value < 0 || value > 0b1111) {
			throw PinMisc.errInvalidValue;
		}
		this._detectOverride = getBitRange(value, 1, 0) === 1;
	}

	detectOverride() {
		return this._detectOverride;
	}

	setDetectOverride(val: boolean) {
		this._detectOverride = val;
		return this;
	}

	rawData(): number {
		let rawNumber = 0;
		rawNumber = setBitRange(rawNumber, 1, 0, this._detectOverride ? 1 : 0);
		return rawNumber;
	}
}