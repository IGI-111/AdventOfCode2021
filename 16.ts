type Packet = {
  version: number;
  type: number;
  value?: number;
  sub?: Packet[];
  bitLength: number;
};

function binFromHex(hex: string): string {
  return hex
    .split('')
    .map((c) => {
      switch (c) {
        case '0':
          return '0000';
        case '1':
          return '0001';
        case '2':
          return '0010';
        case '3':
          return '0011';
        case '4':
          return '0100';
        case '5':
          return '0101';
        case '6':
          return '0110';
        case '7':
          return '0111';
        case '8':
          return '1000';
        case '9':
          return '1001';
        case 'A':
          return '1010';
        case 'B':
          return '1011';
        case 'C':
          return '1100';
        case 'D':
          return '1101';
        case 'E':
          return '1110';
        case 'F':
          return '1111';
      }
    })
    .join('');
}

function parsePacket(p: string): Packet {
  const version = parseInt(p.slice(0, 3), 2);
  const type = parseInt(p.slice(3, 6), 2);

  if (type === 4) {
    // literal
    const groups = [];
    let i = 6;
    while (p[i] === '1') {
      groups.push(i);
      i += 5;
    }
    groups.push(i);
    const value = parseInt(
      groups.map((i) => p.slice(i + 1, i + 5)).join(''),
      2
    );
    const bitLength = i + 5;
    return {
      version,
      type,
      value,
      bitLength,
    };
  } else {
    // operator
    const lengthTypeId = p[6];
    if (lengthTypeId === '0') {
      // 15 bits total length
      let totalLength = parseInt(p.slice(7, 15 + 7), 2);

      const sub = [];
      let bits =
        totalLength === 0 ? p.slice(22) : p.slice(22, 22 + totalLength);
      while (bits.length > 0) {
        const subPacket = parsePacket(bits);
        sub.push(subPacket);
        bits = bits.slice(subPacket.bitLength);
      }
      const bitLength = 22 + totalLength;
      return {
        version,
        type,
        sub,
        bitLength,
      };
    } else {
      // 11 bits sub-packet count
      const subCount = parseInt(p.slice(7, 11 + 7), 2);
      const sub = [];
      let packetStart = 18;
      for (let i = 0; i < subCount; ++i) {
        const subPacket = parsePacket(p.slice(packetStart));
        sub.push(subPacket);
        packetStart += subPacket.bitLength;
      }
      const bitLength = packetStart;
      return {
        version,
        type,
        sub,
        bitLength,
      };
    }
  }
}

function totalVersionNumbers(packet: Packet): number {
  return (
    packet.version +
    (packet.sub !== undefined
      ? packet.sub.map(totalVersionNumbers).reduce((acc, x) => acc + x, 0)
      : 0)
  );
}

function evaluate(packet: Packet): number {
  switch (packet.type) {
    case 0:
      // sum
      return packet.sub!.reduce((acc, x) => acc + evaluate(x), 0);
    case 1:
      // product
      return packet.sub!.reduce((acc, x) => acc * evaluate(x), 1);
    case 2:
      // min
      return packet.sub!.reduce(
        (acc, x) => Math.min(acc, evaluate(x)),
        Infinity
      );
    case 3:
      // max
      return packet.sub!.reduce(
        (acc, x) => Math.max(acc, evaluate(x)),
        -Infinity
      );
    case 5:
      // greater
      return evaluate(packet.sub![0]) > evaluate(packet.sub![1]) ? 1 : 0;
    case 6:
      // less
      return evaluate(packet.sub![0]) < evaluate(packet.sub![1]) ? 1 : 0;
    case 7:
      // equal
      return evaluate(packet.sub![0]) === evaluate(packet.sub![1]) ? 1 : 0;
    case 4:
      // literal
      return packet.value!;
    default:
      throw new Error('Unknown packet type');
  }
}

const f = await Deno.readTextFile('./16.txt');
const packet = parsePacket(binFromHex(f.trim()));
console.log(totalVersionNumbers(packet), evaluate(packet));
