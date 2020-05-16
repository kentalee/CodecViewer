export const PinDeviceLineOut = Symbol('Line Out');
export const PinDeviceSpeaker = Symbol('Speaker');
export const PinDeviceHPOut = Symbol('HP Out');
export const PinDeviceCD = Symbol('CD');
export const PinDeviceSPDIFOut = Symbol('SPDIF Out');
export const PinDeviceDigitalOtherOut = Symbol('Digital Other Out');
export const PinDeviceModemLineSide = Symbol('Modem Line Side');
export const PinDeviceModemHandsetSide = Symbol('Modem Handset Side');
export const PinDeviceLineIn = Symbol('Line In');
export const PinDeviceAUX = Symbol('AUX');
export const PinDeviceMicIn = Symbol('Mic In');
export const PinDeviceTelephony = Symbol('Telephony');
export const PinDeviceSPDIFIn = Symbol('SPDIF In');
export const PinDeviceDigitalOtherIn = Symbol('Digital Other In');
export const PinDeviceReserved = Symbol('Reserved');
export const PinDeviceOther = Symbol('Other');
const PinDeviceValMap = [
	PinDeviceLineOut,
	PinDeviceSpeaker,
	PinDeviceHPOut,
	PinDeviceCD,
	PinDeviceSPDIFOut,
	PinDeviceDigitalOtherOut,
	PinDeviceModemLineSide,
	PinDeviceModemHandsetSide,
	PinDeviceLineIn,
	PinDeviceAUX,
	PinDeviceMicIn,
	PinDeviceTelephony,
	PinDeviceSPDIFIn,
	PinDeviceDigitalOtherIn,
	PinDeviceReserved,
	PinDeviceOther,
];

export class PinDevice {
	public static errInvalidValue = Error('invalid device value');
	private readonly value: number;

	constructor(value: number | symbol) {
		switch (typeof value) {
			case 'number':
				if (value < 0 || value > PinDeviceValMap.length) {
					throw PinDevice.errInvalidValue;
				}
				break;
			case 'symbol':
				value = PinDeviceValMap.indexOf(value);
				if (value === -1) {
					throw PinDevice.errInvalidValue;
				}
				break;
			default:
				throw PinDevice.errInvalidValue;
		}
		if (value < 0x0 || value > 0xf) {
			throw Error('invalid color value');
		}
		this.value = value;
	}

	symbol(): symbol {
		return PinDeviceValMap[this.value] || PinDeviceLineOut;
	}

	text(): string {
		return this.symbol().description;
	}

	rawData(): number {
		return this.value;
	}
}
