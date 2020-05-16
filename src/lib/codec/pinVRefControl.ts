import { NodeType } from '@/lib/codec/nodeType';
import { getBitRange, setBitRange } from '@/lib/codec/utils';
import { PinCap } from '@/lib/codec/pinCap';

export default class PinVRefControl {
	private readonly parent: PinCap | undefined;
	private value: number;

	constructor(parent: PinCap | undefined, rawNumber: number) {
		this.parent = parent;
		this.value = rawNumber;
	}

	getSupport100Percent(): boolean {
		if (this.parent && !this.parent.getInputCapable()) return false;
		return getBitRange(this.value, 1, 5) === 1;
	}

	setSupport100Percent(val: boolean): PinVRefControl {
		this.value = setBitRange(this.value, 1, 5, val ? 1 : 0);
		return this;
	}

	getSupport80Percent(): boolean {
		if (this.parent && !this.parent.getInputCapable()) return false;
		return getBitRange(this.value, 1, 4) === 1;
	}

	setSupport80Percent(val: boolean): PinVRefControl {
		this.value = setBitRange(this.value, 1, 4, val ? 1 : 0);
		return this;
	}

	getSupport50Percent(): boolean {
		if (this.parent && !this.parent.getInputCapable()) return false;
		return getBitRange(this.value, 1, 1) === 1;
	}

	setSupport50Percent(val: boolean): PinVRefControl {
		this.value = setBitRange(this.value, 1, 1, val ? 1 : 0);
		return this;
	}

	getSupportGround(): boolean {
		if (this.parent && !this.parent.getInputCapable()) return false;
		return getBitRange(this.value, 1, 2) === 1;
	}

	setSupportGround(val: boolean): PinVRefControl {
		this.value = setBitRange(this.value, 1, 2, val ? 1 : 0);
		return this;
	}

	getHiZ() {
		if (this.parent) {
			if (!this.parent.getInputCapable()) return false;
			if (
				this.parent.getOutputCapable() &&
				(this.getSupport50Percent() ||
					this.getSupport80Percent() ||
					this.getSupport100Percent() ||
					this.getSupportGround())
			)
				return true;
		}
		return new NodeType(getBitRange(this.value, 1, 0));
	}

	setHiZ(val: boolean): PinVRefControl {
		this.value = setBitRange(this.value, 1, 0, val ? 1 : 0);
		return this;
	}

	rawData(encode = false) {
		if (encode) {
			return parseInt(
				[
					0, // Reserved
					0, // Reserved
					this.getSupport100Percent() ? 1 : 0,
					this.getSupport80Percent() ? 1 : 0,
					0, // Reserved
					this.getSupportGround() ? 1 : 0,
					this.getSupport50Percent() ? 1 : 0,
					this.getHiZ() ? 1 : 0,
				].join(''),
				2,
			);
		}
		return this.value;
	}
}
