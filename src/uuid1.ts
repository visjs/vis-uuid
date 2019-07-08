import { Bytes } from './types'
import { random } from './random'
import { stringifyUUID } from './parsing'

// Maps for number <-> hex string conversion
const byteToHex: string[] = []
const hexToByte: { [key: string]: number } = {}
for (let i = 0; i < 256; i++) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1)
  hexToByte[byteToHex[i]] = i
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
const seedBytes = random()

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
const defaultNodeId = [
  seedBytes[0] | 0x01,
  seedBytes[1],
  seedBytes[2],
  seedBytes[3],
  seedBytes[4],
  seedBytes[5],
]

// Per 4.2.2, randomize (14 bit) clockseq
let defaultClockseq = ((seedBytes[6] << 8) | seedBytes[7]) & 0x3fff

// Previous uuid creation time
let lastMSecs = 0
let lastNSecs = 0

/**
 * UUIDv1 options.
 */
export interface UUID1Options {
  /**
   * Sequence number.
   */
  clockseq?: number

  /**
   * Time in milliseconds since the Gregorian epoch.
   */
  msecs?: number

  /**
   * 100-nanoseconds since msecs (if missing it will be simulated using a counter).
   */
  nsecs?: number

  /**
   * 6 bytes long node id, for example MAC address.
   */
  node?: Bytes
}
// See https://github.com/broofa/node-uuid for API details
export function uuid1(options?: UUID1Options): string
export function uuid1(options: UUID1Options, buf: Bytes, offset?: number): Bytes
/**
 * Generate UUIDv1
 *
 * @param options - Options to be used instead of default values.
 * @param buf - If present the buffer will be filled with the generated UUID.
 * @param offset - Offset of the UUID from the start of the buffer.
 *
 * @returns UUIDv1
 */
export function uuid1(options: UUID1Options = {}, buf?: Bytes, offset?: number): string | Bytes {
  let i = (buf && offset) || 0
  const b = buf || []

  let clockseq = options.clockseq !== undefined ? options.clockseq : defaultClockseq

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  let msecs = options.msecs !== undefined ? options.msecs : new Date().getTime()

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  let nsecs = options.nsecs !== undefined ? options.nsecs : lastNSecs + 1

  // Time since last uuid creation (in msecs)
  const dt = msecs - lastMSecs + (nsecs - lastNSecs) / 10000

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = (clockseq + 1) & 0x3fff
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > lastMSecs) && options.nsecs === undefined) {
    nsecs = 0
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec")
  }

  lastMSecs = msecs
  lastNSecs = nsecs
  defaultClockseq = clockseq

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000

  // `time_low`
  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000
  b[i++] = (tl >>> 24) & 0xff
  b[i++] = (tl >>> 16) & 0xff
  b[i++] = (tl >>> 8) & 0xff
  b[i++] = tl & 0xff

  // `time_mid`
  const tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff
  b[i++] = (tmh >>> 8) & 0xff
  b[i++] = tmh & 0xff

  // `time_high_and_version`
  b[i++] = ((tmh >>> 24) & 0xf) | 0x10 // include version
  b[i++] = (tmh >>> 16) & 0xff

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = (clockseq >>> 8) | 0x80

  // `clock_seq_low`
  b[i++] = clockseq & 0xff

  // `node`
  const node = options.node || defaultNodeId
  for (let n = 0; n < 6; n++) {
    b[i + n] = node[n]
  }

  return buf ? buf : stringifyUUID(b)
}
