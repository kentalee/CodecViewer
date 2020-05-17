import { getBitRange, numFixLength, setBitRange } from '@/lib/codec/utils';
import { NodeType } from '@/lib/codec/nodeType';

export class NodeWidgetCap {
	private _reserve: number;
	private _type: NodeType;
	private _delay: number;
	private _chanCountExt: number;
	private _CPCapability: boolean;
	private _LRSwap: boolean;
	private _powerCtrl: boolean;
	private _digital: boolean;
	private _connList: boolean;
	private _unsolCapable: boolean;
	private _procWidget: boolean;
	private _stripe: boolean;
	private _formatOverride: boolean;
	private _ampParamOverride: boolean;
	private _outAmpPresent: boolean;
	private _inAmpPresent: boolean;
	private _stereo: boolean;

	constructor(rawNumber: number) {
		this._reserve = getBitRange(rawNumber, 8, 24);
		this._type = new NodeType(getBitRange(rawNumber, 4, 20));
		this._delay = getBitRange(rawNumber, 4, 16);
		this._chanCountExt = getBitRange(rawNumber, 3, 13);
		this._CPCapability = getBitRange(rawNumber, 1, 12) === 1;
		this._LRSwap = getBitRange(rawNumber, 1, 11) === 1;
		this._powerCtrl = getBitRange(rawNumber, 1, 10) === 1;
		this._digital = getBitRange(rawNumber, 1, 9) === 1;
		this._connList = getBitRange(rawNumber, 1, 8) === 1;
		this._unsolCapable = getBitRange(rawNumber, 1, 7) === 1;
		this._procWidget = getBitRange(rawNumber, 1, 6) === 1;
		this._stripe = getBitRange(rawNumber, 1, 5) === 1;
		this._formatOverride = getBitRange(rawNumber, 1, 4) === 1;
		this._ampParamOverride = getBitRange(rawNumber, 1, 3) === 1;
		this._outAmpPresent = getBitRange(rawNumber, 1, 2) === 1;
		this._inAmpPresent = getBitRange(rawNumber, 1, 1) === 1;
		this._stereo = getBitRange(rawNumber, 1, 0) === 1;
	}

	reserve() {
		return this._reserve;
	}

	setReserve(val: number) {
		if (val < 0 || val > 0b11111111) {
			throw Error('invalid reserve value');
		}
		this._reserve = val;
		return this;
	}

	// Type defines the functionality of the widget node.
	type() {
		return this._type;
	}

	setType(val: NodeType) {
		this._type = val;
		return this;
	}

	// Delay indicates the number of sample delays through the widget. This may be 0 if the delay value
	// in the Audio Function Parameters is supplied to represent the entire path.
	delay() {
		return this._delay;
	}

	setDelay(val: number) {
		this._delay = val;
	}

	// Chan Count Ext and Chan Count LSB together these 4 bits specify the maximum number of
	// channels that the widget supports. The value contained in the 4 bit field is split with the 3 most
	// significant bits contained in bits 15:13 and the least significant bit in bit 0.
	chanCount() {
		return (this._chanCountExt << 1) | ((this.stereo() ? 1 : 0) + 1);
	}

	chanCountExt() {
		return this._chanCountExt;
	}

	// Chan Count bits combined form the channel count supported minus (-) 1. So if two channels (stereo)
	// is supported then the value would be – bits 15:13=000, bit 0=1. For 8 channels the value would be:
	// bits 15:13=011, bit 0=1.
	setChanCount(val: number) {
		this.setStereo(getBitRange(val - 1, 1, 0) === 1);
		this.setChanCountExt(getBitRange(val - 1, 3, 1));
	}

	setChanCountExt(val: number) {
		return (this._chanCountExt = val);
	}

	// CP Caps indicates that the widget supports “Content Protection”. No indication of the type of
	// protection is implied by this, but does require that the Copy Protection Control verb be supported.
	// This capability is only meaningful for pin widgets.
	contentProtection() {
		return this._CPCapability;
	}

	setContentProtection(val: boolean) {
		this._CPCapability = val;
	}

	// L-R Swap indicates the capability of swapping the left and right channels through the Audio
	// Widget. If the Audio Widget is both input and output capable (e.g., Pin Widget), then swapping
	// must be supported for both input and output paths. Default (0) is no swap capability.
	LRSwap() {
		return this._LRSwap;
	}

	setLRSwap(val: boolean) {
		this._LRSwap = val;
	}

	// PowerCntrl indicates that the Power State control is supported on this widget. This allows finer
	// grained power management than just at the Function Group level for widgets which support it.
	powerCtrl() {
		return this._powerCtrl;
	}

	setPowerCtrl(val: boolean) {
		this._powerCtrl = val;
	}

	// Digital indicates that a widget supports a digital stream. If the bit is a 1, it is a digital widget. For
	// an Input or Output converter, for instance, this means the widget is translating between the High
	// Definition Audio Link and a digital format such as S/P-DIF or I2S rather than analog data.
	digital() {
		return this._digital;
	}

	setDigital(val: boolean) {
		this._digital = val;
	}

	// ConnList indicates whether a connection list is present on the widget. If the bit is a 1, the
	// Connection List Length parameter and the Connection List Entry controls should be queried to
	// discover the input connections.
	connList() {
		return this._connList;
	}

	// ConnList must be a 1 for Input Converters, Sum Widgets, and Selector Widgets. The bit may be a 0 for
	// Output Converters if the only connection for the widget is to the High Definition Audio Link.
	setConnList(val: boolean) {
		this._connList = val;
	}

	// If Unsol Capable is a 1, the audio widget supports unsolicited responses. The Unsolicited
	// Response command can be used to configure and enable Unsolicited Response generation. When
	// this parameter is associated with a Pin Widget, then setting this bit requires that the Pin Widget
	// generate an unsolicited response (when enabled) whenever the “Presence Detect” bit changes state
	unsolCapable() {
		return this._unsolCapable;
	}

	setUnsolCapable(val: boolean) {
		this._unsolCapable = val;
	}

	// If ProcWidget is a 1, the “Processing Controls” parameter should be queried for more information
	// about the widget‟s processing controls.
	procWidget() {
		return this._procWidget;
	}

	setProcWidget(val: boolean) {
		this._procWidget = val;
	}

	// The Stripe bit defines whether the Audio Output Converter Widget supports striping. If Stripe is a 1,
	// the Audio Output Converter Widget must support the Stripe Control verb. Stripe is only defined for
	// Audio Output Converter Widgets; for all other widget types, this bit must be 0.
	stripe() {
		return this._stripe;
	}

	setStripe(val: boolean) {
		this._stripe = val;
	}

	// If Format Override is a 1, the widget contains format information, and the “Supported Formats”
	// and “Supported PCM Bits, Rates” should be queried for the widget‟s format capabilities. If this bit
	// is a 0, then the Audio Function node must contain default amplifier parameters, and that node's
	// format related parameters should be queried to determine the format parameters. This bit is not
	// applicable to, and is always 0 for, Pin Complex Widgets.
	formatOverride() {
		return this._formatOverride;
	}

	setFormatOverride(val: boolean) {
		this._formatOverride = val;
	}

	// If Amp Param Override is a 1, the widget contains its own amplifier parameters. If this bit is a 0,
	// then the Audio Function node must contain default amplifier parameters, and they should be used to
	// define all amplifier parameters (both input and output) in this widget.
	ampParamOverride() {
		return this._ampParamOverride;
	}

	setAmpParamOverride(val: boolean) {
		this._ampParamOverride = val;
	}

	// If Out AmpPresent is a 1, the widget contains an output amplifier, as indicated. The
	// Amp Param Override bit should be examined to determine whether the widget contains default
	// amplifier parameters or has amplifier parameters that need to be explicitly queried. The “Out
	// Amp Present” bit is only relevant for Selector Widgets, Sum Widgets, Output Converter Widgets,
	// and Pin Complex Widgets.
	outAmpPresent() {
		return this._outAmpPresent;
	}

	setOutAmpPresent(val: boolean) {
		this._outAmpPresent = val;
	}

	// If In AmpPresent is a 1, the widget contains an input amplifier, as indicated. The
	// Amp Param Override bit should be examined to determine whether the widget contains default
	// amplifier parameters or has amplifier parameters that need to be explicitly queried. The “In Amp
	// Present” bit is only relevant for Sum Widgets, Input Converters, and Pin Complexes.
	inAmpPresent() {
		return this._inAmpPresent;
	}

	setInAmpPresent(val: boolean) {
		this._inAmpPresent = val;
	}

	// The Stereo bit determines if the widget is a stereo or mono widget. If the “Stereo” bit is a 1, the
	// widget is a stereo widget.
	stereo() {
		return this._stereo;
	}

	setStereo(val: boolean) {
		this._stereo = val;
	}

	rawData() {
		let rawNumber = 0;
		rawNumber = setBitRange(rawNumber, 8, 24, this._reserve);
		rawNumber = setBitRange(rawNumber, 4, 20, this._type.rawData());
		rawNumber = setBitRange(rawNumber, 4, 16, this._delay);
		rawNumber = setBitRange(rawNumber, 3, 13, this._chanCountExt);
		rawNumber = setBitRange(rawNumber, 1, 12, this._CPCapability ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 11, this._LRSwap ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 10, this._powerCtrl ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 9, this._digital ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 8, this._connList ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 7, this._unsolCapable ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 6, this._procWidget ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 5, this._stripe ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 4, this._formatOverride ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 3, this._ampParamOverride ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 2, this._outAmpPresent ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 1, this._inAmpPresent ? 1 : 0);
		rawNumber = setBitRange(rawNumber, 1, 0, this._stereo ? 1 : 0);
		return rawNumber;
	}

	rawBinaryText(space = false): string {
		return Array.from(
			[
				[this._reserve, 8],
				[this._type.rawData(), 4],
				[this._delay, 4],
				[this._chanCountExt, 3],
				[this._CPCapability ? 1 : 0, 1],
				[this._LRSwap ? 1 : 0, 1],
				[this._powerCtrl ? 1 : 0, 1],
				[this._digital ? 1 : 0, 1],
				[this._connList ? 1 : 0, 1],
				[this._unsolCapable ? 1 : 0, 1],
				[this._procWidget ? 1 : 0, 1],
				[this._stripe ? 1 : 0, 1],
				[this._formatOverride ? 1 : 0, 1],
				[this._ampParamOverride ? 1 : 0, 1],
				[this._outAmpPresent ? 1 : 0, 1],
				[this._inAmpPresent ? 1 : 0, 1],
				[this._stereo ? 1 : 0, 1],
			],
			part => numFixLength(part[0], 2, part[1]),
		).join(space ? '\x20' : '');
	}
}
