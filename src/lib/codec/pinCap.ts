import { getBitRange, numFixLength, setBitRange } from '@/lib/codec/utils';
import PinVRefControl from '@/lib/codec/pinVRefControl';

export class PinCap {
	private readonly _reserveAt31To28: number;
	private _highBitRate: boolean;
	private _DP: boolean;
	private readonly _reserveAt23To17: number;
	private _EAPDCapable: boolean;
	private _VRefControl: PinVRefControl;
	private _HDMI: boolean;
	private _balancedIOPins: boolean;
	private _inputCapable: boolean;
	private _outputCapable: boolean;
	private _headphoneDriveCapable: boolean;
	private _presenceDetectCapable: boolean;
	private _triggerRequired: boolean;
	private _impedanceSenseCapable: boolean;

	constructor(rawNumber: number) {
		this._reserveAt31To28 = getBitRange(rawNumber, 4, 28);
		this._highBitRate = getBitRange(rawNumber, 1, 27) === 1;
		this._DP = getBitRange(rawNumber, 1, 24) === 1;
		this._reserveAt23To17 = getBitRange(rawNumber, 7, 17);
		this._EAPDCapable = getBitRange(rawNumber, 1, 16) === 1;
		this._VRefControl = new PinVRefControl(this, getBitRange(rawNumber, 8, 8));
		this._HDMI = getBitRange(rawNumber, 1, 7) === 1;
		this._balancedIOPins = getBitRange(rawNumber, 1, 6) === 1;
		this._inputCapable = getBitRange(rawNumber, 1, 5) === 1;
		this._outputCapable = getBitRange(rawNumber, 1, 4) === 1;
		this._headphoneDriveCapable = getBitRange(rawNumber, 1, 3) === 1;
		this._presenceDetectCapable = getBitRange(rawNumber, 1, 2) === 1;
		this._triggerRequired = getBitRange(rawNumber, 1, 1) === 1;
		this._impedanceSenseCapable = getBitRange(rawNumber, 1, 0) === 1;
	}

	// HBR (High Bit Rate) indicates the pin widget capability in sending out audio stream using High
	// Bit Rate packet. Capable if set to 1. This bit is only applicable for HDMI pin widget.
	supportHighBitRate() {
		return this._highBitRate;
	}

	setHighBitRate(val: boolean) {
		this._highBitRate = val;
	}

	// DP (Display Port) indicates whether the Pin Complex Widget supports connection to a Display
	// Port sink. Supported if set to 1.
	supportDP() {
		return this._DP;
	}

	// Note that it is possible for the pin widget to support more than one
	// digital display connection type, e.g. HDMI and DP bit are both set to 1.
	setDP(val: boolean) {
		this._DP = val;
	}

	// EAPD Capable indicates the codec has an EAPD pin and that this Pin Widget provides support for
	// controlling that pin.
	EAPDCapable() {
		return this._EAPDCapable;
	}

	setEAPDCapable(val: boolean) {
		this._EAPDCapable = val;
	}

	// VRef Control is a bit field used to indicate what voltages may be produced on the associated
	// VRef pin(s).
	VRefControl() {
		return this._VRefControl;
	}

	// If all bits in the bit field are 0, then VRef generation is not supported by the Pin
	// Complex. Also, if the Input Capable bit is a 0, then the VRef bit field has no meaning and all bits
	// must be 0. If the Output Capable bit and any bits in the VRef field are set, then bit 0 (Hi-Z) must
	// also be set to indicate that the VRef signal can be turned off to support output devices.
	setVRefControl(val: PinVRefControl) {
		this._VRefControl = val;
	}

	// HDMI indicates whether the Pin Complex Widget supports connection to a HDMI sink. Supported
	// if set to 1.
	supportHDMI() {
		return this._HDMI;
	}

	// Note that it is possible for the pin widget to support more than one
	// digital display connection type, e.g. HDMI and DP bit are both set to 1.
	setHDMI(val: boolean) {
		this._HDMI = val;
	}

	// Balanced I/O Pins indicates that the Pin Complex Widget has balanced pins.
	hasBalancedIOPins() {
		return this._balancedIOPins;
	}

	setBalancedIOPins(val: boolean) {
		this._balancedIOPins = val;
	}

	// Input Capable indicates whether the pin complex supports input. If Input Capable is a 1, the pin is
	// capable of input.
	inputCapable() {
		return this._inputCapable;
	}

	setInputCapable(val: boolean) {
		this._inputCapable = val;
	}

	// Output Capable indicates whether the pin complex supports output. If Output Capable is a 1, the
	// pin is capable of output.
	outputCapable() {
		return this._outputCapable;
	}

	setOutputCapable(val: boolean) {
		this._outputCapable = val;
	}

	// Headphone Drive Capable indicates that the pin has an amplifier with sufficient current drive to
	// drive headphones. If Output Capable is a 0, then this bit has no meaning and must be 0.
	headphoneDriveCapable() {
		return this._headphoneDriveCapable;
	}

	setHeadphoneDriveCapable(val: boolean) {
		this._headphoneDriveCapable = val;
	}

	// Presence Detect Capable indicates whether the pin complex can perform presence detect to
	// determine whether there is anything plugged in. Presence detect does not indicate what is plugged
	// in, only that something is plugged in.
	presenceDetectCapable() {
		return this._presenceDetectCapable;
	}

	setPresenceDetectCapable(val: boolean) {
		this._presenceDetectCapable = val;
	}

	// Trigger Required indicates whether a trigger is required for an impedance measurement
	triggerRequired() {
		return this._triggerRequired;
	}

	setTriggerRequired(val: boolean) {
		this._triggerRequired = val;
	}

	// Impedance Sense Capable indicates whether the pin complex supports impedance sense on the
	// attached peripheral to determine what it is. More accurate (possibly sequenced) forms of peripheral
	// discrimination may be supported independent of this capability
	impedanceSenseCapable() {
		return this._impedanceSenseCapable;
	}

	setImpedanceSenseCapable(val: boolean) {
		this._impedanceSenseCapable = val;
	}

	rawData() {
		let rawNumber = 0;
		rawNumber = setBitRange(rawNumber, 4, 28, this._reserveAt31To28);
		rawNumber = setBitRange(rawNumber, 1, 27, this._highBitRate ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 24, this._DP ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 7, 17, this._reserveAt23To17);
		rawNumber = setBitRange(rawNumber, 1, 16, this._EAPDCapable ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 8, 8, this._VRefControl.rawData());
		rawNumber = setBitRange(rawNumber, 1, 7, this._HDMI ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 6, this._balancedIOPins ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 5, this._inputCapable ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 4, this._outputCapable ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 3, this._headphoneDriveCapable ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 2, this._presenceDetectCapable ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 1, this._triggerRequired ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 0, this._impedanceSenseCapable ? 1 : 0);
		return rawNumber;
	}

	rawBinaryText(space = false): string {
		return Array.from(
			[
				[this._reserveAt31To28, 4],
				[this._highBitRate ? 1 : 0, 1],
				[this._DP ? 1 : 0, 1],
				[this._reserveAt23To17, 7],
				[this._EAPDCapable ? 1 : 0, 1],
				[this._VRefControl.rawData(), 8],
				[this._HDMI ? 1 : 0, 1],
				[this._balancedIOPins ? 1 : 0, 1],
				[this._inputCapable ? 1 : 0, 1],
				[this._outputCapable ? 1 : 0, 1],
				[this._headphoneDriveCapable ? 1 : 0, 1],
				[this._presenceDetectCapable ? 1 : 0, 1],
				[this._triggerRequired ? 1 : 0, 1],
				[this._impedanceSenseCapable ? 1 : 0, 1],
			],
			part => numFixLength(part[0], 2, part[1]),
		).join(space ? '\x20' : '');
	}
}
