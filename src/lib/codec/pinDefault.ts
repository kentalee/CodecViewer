import { PinColor } from '@/lib/codec/pinColor';
import { getBitRange, numFixLength, setBitRange } from '@/lib/codec/utils';
import { PinDevice } from '@/lib/codec/pinDevice';
import { PinConnection } from '@/lib/codec/pinConnection';
import { PinLocation } from '@/lib/codec/pinLocation';
import { PinMisc } from '@/lib/codec/pinMisc';
import { PinConnectivity } from '@/lib/codec/pinConnectivity';

export class PinDefault {
	private _sequence: number;
	private _association: number;
	private _misc: PinMisc;
	private _color: PinColor;
	private _connection: PinConnection;
	private _device: PinDevice;
	private _location: PinLocation;
	private _connectivity: PinConnectivity;

	constructor(rawNumber: number) {
		this._sequence = getBitRange(rawNumber, 4, 0);
		this._association = getBitRange(rawNumber, 4, 4);
		this._misc = new PinMisc(getBitRange(rawNumber, 4, 8));
		this._color = new PinColor(getBitRange(rawNumber, 4, 12));
		this._connection = new PinConnection(getBitRange(rawNumber, 4, 16));
		this._device = new PinDevice(getBitRange(rawNumber, 4, 20));
		this._location = new PinLocation(getBitRange(rawNumber, 6, 24));
		this._connectivity = new PinConnectivity(getBitRange(rawNumber, 2, 30));
	}

	sequence() {
		return this._sequence;
	}

	setSequence(val: number) {
		this._sequence = val;
	}

	association() {
		return this._association;
	}

	setAssociation(val: number) {
		this._association = val;
	}

	misc() {
		return this._misc;
	}

	setMisc(val: PinMisc) {
		this._misc = val;
	}

	color() {
		return this._color;
	}

	setColor(val: PinColor) {
		this._color = val;
	}

	connection() {
		return this._connection;
	}

	setConnection(val: PinConnection) {
		this._connection = val;
	}

	device() {
		return this._device;
	}

	setDevice(val: PinDevice) {
		this._device = val;
	}

	location() {
		return this._location;
	}

	setLocation(val: PinLocation) {
		this._location = val;
	}

	connectivity() {
		return this._connectivity;
	}

	setConnectivity(val: PinConnectivity) {
		this._connectivity = val;
	}

	rawData(): number {
		let rawNumber = 0;
		rawNumber = setBitRange(rawNumber, 2, 30, this._connectivity.rawData());
		console.log(rawNumber.toString(2), this._connectivity.rawData());
		rawNumber = setBitRange(rawNumber, 6, 24, this._location.rawData());
		console.log(rawNumber.toString(2), this._location.rawData());
		rawNumber = setBitRange(rawNumber, 4, 20, this._device.rawData());
		console.log(rawNumber.toString(2), this._device.rawData());
		rawNumber = setBitRange(rawNumber, 4, 16, this._connection.rawData());
		rawNumber = setBitRange(rawNumber, 4, 12, this._color.rawData());
		rawNumber = setBitRange(rawNumber, 4, 8, this._misc.rawData());
		rawNumber = setBitRange(rawNumber, 4, 4, this._association);
		rawNumber = setBitRange(rawNumber, 4, 0, this._sequence);
		return rawNumber;
	}

	rawBinaryText(space = false): string {
		return Array.from([
			[this._connectivity.rawData(), 2],
			[this._location.rawData(), 6],
			[this._device.rawData(), 4],
			[this._connection.rawData(), 4],
			[this._color.rawData(), 4],
			[this._misc.rawData(), 4],
			[this._association, 4],
			[this._sequence, 4],
		], part => numFixLength(part[0], 2, part[1])).join(space ? '\x20' : '');
	}
}
