import { expect } from 'chai'

import { uuid1, parseUUID, stringifyUUID, UUID1Options } from '../src'

describe('UUID', function(): void {
  const uuid1RE = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F][13579BDF][0-9A-F]{10}$/i
  const sampleOptions = (): UUID1Options => ({
    clockseq: 2,
    msecs: 3,
    nsecs: 4,
    node: [5, 6, 7, 8, 9, 10],
  })
  const sampleUUID1Array = Object.freeze([
    19,
    129,
    181,
    52,
    29,
    210,
    17,
    178,
    128,
    2,
    5,
    6,
    7,
    8,
    9,
    10,
  ])
  const sampleUUID1Uint8Array = new Uint8Array([
    19,
    129,
    181,
    52,
    29,
    210,
    17,
    178,
    128,
    2,
    5,
    6,
    7,
    8,
    9,
    10,
  ])
  const sampleUUID1String = '1381b534-1dd2-11b2-8002-05060708090a'

  it('generate valid UUIDv1 strings', function(): void {
    const amount = 10000
    this.timeout(amount)

    for (let i = 0; i < amount; ++i) {
      const uuid = uuid1()

      expect(uuid1RE.test(uuid), uuid).to.be.true
    }
  })

  it('generate valid string UUIDv1 using supplied values', function(): void {
    const uuid = uuid1(sampleOptions())

    expect(uuid1RE.test(uuid), uuid).to.be.true
    expect(uuid).to.equal(sampleUUID1String)
  })

  it('generate valid binary UUIDv1 into provided buffer', function(): void {
    const buffer = new Uint8Array(16)
    const uuid = uuid1(sampleOptions(), buffer)

    expect(uuid)
      .to.be.an('uint8array')
      .that.equals(buffer, 'Provided buffer should be filled, no new buffer should be generated.')
    expect(buffer).to.deep.equal(sampleUUID1Uint8Array)
  })

  it('generate valid binary UUIDv1 into provided buffer with offset', function(): void {
    const buffer = new Uint8Array(21)
    const uuid = uuid1(sampleOptions(), buffer, 3)

    expect(uuid)
      .to.be.an('uint8array')
      .that.equals(buffer, 'Provided buffer should be filled, no new buffer should be generated.')
    expect(buffer).to.deep.equal(new Uint8Array([0, 0, 0, ...sampleUUID1Array, 0, 0]))
  })

  it('parse and unparse', function(): void {
    const uuid = uuid1()
    const parsed = parseUUID(uuid)
    const stringified = stringifyUUID(parsed)

    expect(parsed)
      .to.have.ownProperty('length')
      .that.equals(16)
    expect(stringified).to.equal(uuid)
  })
})
