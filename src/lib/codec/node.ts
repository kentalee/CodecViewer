import { PinDefault } from '@/lib/codec/pinDefault';
import { getBitRange, numFixLength } from '@/lib/codec/utils';
import { NodeWidgetCap } from '@/lib/codec/nodeWidgetCap';
import { PinCap } from '@/lib/codec/pinCap';

export class CodecNode {
	private _id: number | undefined;
	private _widgetCap: NodeWidgetCap | undefined;
	private _pinCap: PinCap | undefined;
	private _pinDefault: PinDefault | undefined;

	verbs(parentAddress: number): number[] {
		if (this._id === undefined || this._pinDefault === undefined) return [];
		const address = numFixLength(parentAddress, 16, 1);
		const idHex = numFixLength(this._id, 16, 2);
		const pinDefault = this._pinDefault.rawData();
		const pinDefaultParts = [
			numFixLength(getBitRange(pinDefault, 2, 0), 16, 2),
			numFixLength(getBitRange(pinDefault, 2, 2), 16, 2),
			numFixLength(getBitRange(pinDefault, 2, 4), 16, 2),
			numFixLength(getBitRange(pinDefault, 2, 6), 16, 2),
		];
		return [
			parseInt(`${address}${idHex}71c${pinDefaultParts[0]}`, 16),
			parseInt(`${address}${idHex}71d${pinDefaultParts[1]}`, 16),
			parseInt(`${address}${idHex}71e${pinDefaultParts[2]}`, 16),
			parseInt(`${address}${idHex}71f${pinDefaultParts[3]}`, 16),
		];
	}

	id() {
		return this._id;
	}

	setId(newId: number) {
		if (newId < 0 || newId > 0xff) {
			throw Error('invalid id');
		}
		this._id = newId;
	}

	widgetCap() {
		return this._widgetCap;
	}

	setWidgetCap = (newWCaps: NodeWidgetCap) => (this._widgetCap = newWCaps);

	pinCap() {
		return this._pinCap;
	}

	setPinCap(newPinCap: PinCap) {
		this._pinCap = newPinCap;
	}

	pinDefault() {
		return this._pinDefault;
	}

	setPinDefault(newPinDefault: PinDefault) {
		this._pinDefault = newPinDefault;
	}
}
