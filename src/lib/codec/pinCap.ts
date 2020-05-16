import { getBitRange, setBitRange } from '@/lib/codec/utils';
import PinVRefControl from '@/lib/codec/pinVRefControl';

export class PinCap {
	private value: number;

	constructor(rawNumber: number) {
		this.value = rawNumber;
	}

	// HBR (High Bit Rate) indicates the pin widget capability in sending out audio stream using High
	// Bit Rate packet. Capable if set to 1. This bit is only applicable for HDMI pin widget.
	supportHighBitRate() {
		return getBitRange(this.value, 1, 27) === 1;
	}

	setHighBitRate(val: boolean) {
		this.value = setBitRange(this.value, 1, 27, val ? 1 : 0);
	}

	// DP (Display Port) indicates whether the Pin Complex Widget supports connection to a Display
	// Port sink. Supported if set to 1.
	supportDP() {
		return getBitRange(this.value, 1, 24) === 1;
	}

	// Note that it is possible for the pin widget to support more than one
	// digital display connection type, e.g. HDMI and DP bit are both set to 1.
	setDP(val: boolean) {
		this.value = setBitRange(this.value, 1, 24, val ? 1 : 0);
	}

	// EAPD Capable indicates the codec has an EAPD pin and that this Pin Widget provides support for
	// controlling that pin.
	getEAPDCapable() {
		return getBitRange(this.value, 1, 16) === 1;
	}

	setEAPDCapable(val: boolean) {
		this.value = setBitRange(this.value, 1, 16, val ? 1 : 0);
	}

	// VRef Control is a bit field used to indicate what voltages may be produced on the associated
	// VRef pin(s).
	getVRefControl() {
		return new PinVRefControl(this, getBitRange(this.value, 8, 8));
	}

	// If all bits in the bit field are 0, then VRef generation is not supported by the Pin
	// Complex. Also, if the Input Capable bit is a 0, then the VRef bit field has no meaning and all bits
	// must be 0. If the Output Capable bit and any bits in the VRef field are set, then bit 0 (Hi-Z) must
	// also be set to indicate that the VRef signal can be turned off to support output devices.
	setVRefControl(val: PinVRefControl) {
		this.value = setBitRange(this.value, 8, 8, val.rawData(true));
	}

	// HDMI indicates whether the Pin Complex Widget supports connection to a HDMI sink. Supported
	// if set to 1.
	supportHDMI() {
		return getBitRange(this.value, 1, 7) === 1;
	}

	// Note that it is possible for the pin widget to support more than one
	// digital display connection type, e.g. HDMI and DP bit are both set to 1.
	setHDMI(val: boolean) {
		this.value = setBitRange(this.value, 1, 7, val ? 1 : 0);
	}

	// Balanced I/O Pins indicates that the Pin Complex Widget has balanced pins.
	hasBalancedIOPins() {
		return getBitRange(this.value, 1, 6) === 1;
	}

	setBalancedIOPins(val: boolean) {
		this.value = setBitRange(this.value, 1, 6, val ? 1 : 0);
	}

	// Input Capable indicates whether the pin complex supports input. If Input Capable is a 1, the pin is
	// capable of input.
	getInputCapable() {
		return getBitRange(this.value, 1, 5) === 1;
	}

	setInputCapable(val: boolean) {
		this.value = setBitRange(this.value, 1, 5, val ? 1 : 0);
	}

	// Output Capable indicates whether the pin complex supports output. If Output Capable is a 1, the
	// pin is capable of output.
	getOutputCapable() {
		return getBitRange(this.value, 1, 4) === 1;
	}

	setOutputCapable(val: boolean) {
		this.value = setBitRange(this.value, 1, 4, val ? 1 : 0);
	}

	// Headphone Drive Capable indicates that the pin has an amplifier with sufficient current drive to
	// drive headphones. If Output Capable is a 0, then this bit has no meaning and must be 0.
	getHeadphoneDriveCapable() {
		return getBitRange(this.value, 1, 3) === 1;
	}

	setHeadphoneDriveCapable(val: boolean) {
		this.value = setBitRange(this.value, 1, 3, val ? 1 : 0);
	}

	// Presence Detect Capable indicates whether the pin complex can perform presence detect to
	// determine whether there is anything plugged in. Presence detect does not indicate what is plugged
	// in, only that something is plugged in.
	getPresenceDetectCapable() {
		return getBitRange(this.value, 1, 2) === 1;
	}

	setPresenceDetectCapable(val: boolean) {
		this.value = setBitRange(this.value, 1, 2, val ? 1 : 0);
	}

	// Trigger Required indicates whether a trigger is required for an impedance measurement
	getTriggerRequired() {
		return getBitRange(this.value, 1, 1) === 1;
	}

	setTriggerRequired(val: boolean) {
		this.value = setBitRange(this.value, 1, 1, val ? 1 : 0);
	}

	// Impedance Sense Capable indicates whether the pin complex supports impedance sense on the
	// attached peripheral to determine what it is. More accurate (possibly sequenced) forms of peripheral
	// discrimination may be supported independent of this capability
	getImpedanceSenseCapable() {
		return getBitRange(this.value, 1, 0) === 1;
	}

	setImpedanceSenseCapable(val: boolean) {
		this.value = setBitRange(this.value, 1, 0, val ? 1 : 0);
	}

	rawData() {
		return this.value;
	}
}
