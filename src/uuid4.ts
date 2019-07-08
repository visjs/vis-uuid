import { Bytes } from './types'
import { random } from './random'
import { stringifyUUID } from './parsing'

/**
 * UUIDv4 options.
 */
export interface UUID4Options {
  /**
   * Random data (16 bytes) to be used instead of generated.
   *
   * **Warning**: the data will be modified and returned.
   */
  random?: Bytes

  /**
   * Random data (16 bytes) generator to be used instead of default generator.
   *
   * **Warning**: the returned data will be modified and returned.
   */
  rng?: () => Bytes
}

// See https://github.com/broofa/node-uuid for API details
export function uuid4(options: 'binary'): number[]
export function uuid4(options?: UUID4Options): string
export function uuid4(options: 'binary' | UUID4Options, buf: Bytes, offset?: number): Bytes
/**
 * Generate UUIDv4
 *
 * @param options - Options to be used instead of default generated values.
 * String 'binary' is a shorthand for uuid4({}, new Array(16)).
 * @param buf - If present the buffer will be filled with the generated UUID.
 * @param offset - Offset of the UUID from the start of the buffer.
 *
 * @returns UUIDv4
 */
export function uuid4(
  options: 'binary' | UUID4Options = {},
  buf?: Bytes,
  offset?: number
): string | Bytes {
  // Deprecated - 'format' argument, as supported in v1.2
  const i = (buf && offset) || 0

  if (typeof options === 'string') {
    buf = options === 'binary' ? new Array(16) : undefined
    options = {}
  }

  const rnds = options.random || (options.rng || random)()

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40
  rnds[8] = (rnds[8] & 0x3f) | 0x80

  // Copy bytes to buffer, if provided
  if (buf) {
    for (let ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii]
    }
  }

  return buf || stringifyUUID(rnds)
}
