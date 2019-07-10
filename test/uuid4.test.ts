import { expect } from 'chai'

import { uuid4, parseUUID, stringifyUUID } from '../src'

describe('UUIDv4', function(): void {
  const uuid4RE = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  const sampleRandom = (): number[] => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const sampleUUID4Array = Object.freeze([0, 1, 2, 3, 4, 5, 70, 7, 136, 9, 10, 11, 12, 13, 14, 15])
  const sampleUUID4Uint8Array = new Uint8Array([
    0,
    1,
    2,
    3,
    4,
    5,
    70,
    7,
    136,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
  ])
  const sampleUUID4String = '00010203-0405-4607-8809-0a0b0c0d0e0f'

  it('generate valid UUIDv4 strings', function(): void {
    const amount = 10000
    this.timeout(amount)

    for (let i = 0; i < amount; ++i) {
      const uuid = uuid4()

      expect(uuid4RE.test(uuid), uuid).to.be.true
    }
  })

  it('generate valid binary UUIDv4', function(): void {
    const uuid = uuid4('binary')

    expect(uuid)
      .to.be.an('array')
      .that.has.ownProperty('length')
      .that.equals(16)
  })

  it('generate valid UUIDv4 using supplied bytes', function(): void {
    const uuid = uuid4({ random: sampleRandom() })

    expect(uuid)
      .to.be.a('string')
      .that.equals(sampleUUID4String)
  })

  it('generate valid UUIDv4 using supplied random number generator', function(): void {
    const uuid = uuid4({ rng: (): number[] => sampleRandom() })

    expect(uuid)
      .to.be.a('string')
      .that.equals(sampleUUID4String)
  })

  it('generate valid binary UUIDv4 into provided buffer', function(): void {
    const buffer = new Uint8Array(16)
    const uuid = uuid4({ random: sampleRandom() }, buffer)

    expect(uuid)
      .to.be.an('uint8array')
      .that.equals(buffer, 'Provided buffer should be filled, no new buffer should be generated.')
    expect(buffer).to.deep.equal(sampleUUID4Uint8Array)
  })

  it('generate valid binary UUIDv4 into provided buffer with offset', function(): void {
    const buffer = new Uint8Array(21)
    const uuid = uuid4({ random: sampleRandom() }, buffer, 3)

    expect(uuid)
      .to.be.an('uint8array')
      .that.equals(buffer, 'Provided buffer should be filled, no new buffer should be generated.')
    expect(buffer).to.deep.equal(new Uint8Array([0, 0, 0, ...sampleUUID4Array, 0, 0]))
  })

  it('parse and unparse', function(): void {
    const uuid = uuid4()
    const parsed = parseUUID(uuid)
    const stringified = stringifyUUID(parsed)

    expect(parsed)
      .to.have.ownProperty('length')
      .that.equals(16)
    expect(stringified).to.equal(uuid)
  })
})
