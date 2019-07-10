import { Bytes } from './types'

// Maps for number <-> hex string conversion
const byteToHex: string[] = []
const hexToByte: { [key: string]: number } = {}
for (let i = 0; i < 256; i++) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1)
  hexToByte[byteToHex[i]] = i
}

/**
 * Parse a string UUID representation into it's component bytes.
 *
 * @param str - String UUID.
 * @param buf - Buffer to be filled with the bytes.
 * @param offset - Offset from the start of the buffer where the UUID bytes will be saved.
 *
 * @returns An array (or Uint8Array if supplied) of bytes.
 */
export function parseUUID(str: string, buf: Bytes = [], offset?: number): Bytes {
  const i = (buf && offset) || 0
  let ii = 0

  str.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct): string {
    if (ii < 16) {
      // Don't overflow!
      buf[i + ii++] = hexToByte[oct]
    }
    return ''
  })

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0
  }

  return buf
}

/**
 * Represent binary UUID into it's string representation.
 *
 * @param buf - Buffer containing UUID bytes.
 * @param offset - Offset from the start of the buffer where the UUID is saved (not needed if the buffer starts with the UUID).
 *
 * @returns String representation of the UUID.
 */
export function stringifyUUID(buf: Bytes, offset?: number): string {
  let i = offset || 0
  const bth = byteToHex
  return (
    bth[buf[i++]] +
    bth[buf[i++]] +
    bth[buf[i++]] +
    bth[buf[i++]] +
    '-' +
    bth[buf[i++]] +
    bth[buf[i++]] +
    '-' +
    bth[buf[i++]] +
    bth[buf[i++]] +
    '-' +
    bth[buf[i++]] +
    bth[buf[i++]] +
    '-' +
    bth[buf[i++]] +
    bth[buf[i++]] +
    bth[buf[i++]] +
    bth[buf[i++]] +
    bth[buf[i++]] +
    bth[buf[i++]]
  )
}
