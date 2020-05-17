export const getBitRange = (num: number, length: number, offset: number): number => {
	const mask = Math.pow(2, length) - 1;
	return (num & (mask << offset)) >> offset;
};

export const setBitRange = (num: number, length: number, offset: number, value: number): number => {
	return num | (value << offset);
};

export const strFixLength = (str: string, len: number, posAtStart = false, glue = ' ') => {
	const space = Array(len > str.length ? len - str.length + 1 : 0).join(glue);
	return posAtStart ? space + str : str + space;
};

export const numFixLength = (num: number, radix: number, len: number) => {
	return strFixLength(num.toString(radix), len, true, '0');
};

export const eachLine = (
	handler: (content: string, lineOffset: number) => boolean | number,
	lines: string[],
	offset?: number,
) => {
	if (typeof offset !== 'number' || offset <= 0) {
		offset = 0;
	}
	for (let _break = false; !_break && offset < lines.length; !_break ? offset++ : undefined) {
		const lineContent = lines[offset];
		if (lineContent === '') continue;
		const result = handler(lineContent, offset);
		switch (typeof result) {
			case 'boolean':
				_break = !result;
				break;
			case 'number':
				offset = result > offset ? result : offset;
				break;
		}
	}
	return offset;
};
