import { Bytes } from './types'

/**
 * Generate 16 random bytes to be used as a base for UUID.
 *
 * @ignore
 */
export const random: () => Bytes = (function(): () => Bytes {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    // Moderately fast, high quality
    const _rnds8 = new Uint8Array(16)
    return function whatwgRNG(): Uint8Array {
      crypto.getRandomValues(_rnds8)
      return _rnds8
    }
  }

  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().
  // It's fast, but is of unspecified quality.
  const _rnds = new Array(16)
  return function(): number[] {
    for (let i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) {
        r = Math.random() * 0x100000000
      }
      _rnds[i] = ((r as number) >>> ((i & 0x03) << 3)) & 0xff
    }

    return _rnds
  }

  //     uuid.js
  //
  //     Copyright (c) 2010-2012 Robert Kieffer
  //     MIT License - http://opensource.org/licenses/mit-license.php

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required

  // return require('./rng');
})()
