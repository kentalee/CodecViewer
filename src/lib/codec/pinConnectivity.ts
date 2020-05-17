import { getBitRange, setBitRange } from '@/lib/codec/utils';

export class PinConnectivity {
	public static errInvalidValue = Error('invalid Connectivity value');
	private _physical: boolean;
	private _internal: boolean;

	constructor(value: number) {
		if (value < 0 || value > 0b11) {
			throw PinConnectivity.errInvalidValue;
		}
		this._physical = getBitRange(value, 1, 0) === 0;
		this._internal = getBitRange(value, 1, 1) === 1;
	}

	physical() {
		return this._physical;
	}

	setPhysical(val: boolean) {
		this._physical = !val;
		return this;
	}

	internal() {
		return this._physical;
	}

	setInternal(val: boolean) {
		this._internal = val;
		return this;
	}

	none() {
		return !this.physical() && !this.internal();
	}

	rawData(): number {
		let rawNumber = 0;
		rawNumber = setBitRange(rawNumber, 1, 0, (this._physical ? 0 : 1));
		rawNumber = setBitRange(rawNumber, 1, 1, (this._internal ? 1 : 0));
		return rawNumber;
	}
}