import { expect } from 'chai'

import { parseUUID, stringifyUUID } from '../src'

describe('UUID parsing', function(): void {
  it('00000000-0000-0000-0000-000000000000', function(): void {
    const uuid = '00000000-0000-0000-0000-000000000000'
    const parsed = parseUUID(uuid)
    const stringified = stringifyUUID(parsed)

    expect(parsed[0]).to.equal(0)
    expect(parsed[1]).to.equal(0)
    expect(parsed[2]).to.equal(0)
    expect(parsed[3]).to.equal(0)
    expect(parsed[4]).to.equal(0)
    expect(parsed[5]).to.equal(0)
    expect(parsed[6]).to.equal(0)
    expect(parsed[7]).to.equal(0)
    expect(parsed[8]).to.equal(0)
    expect(parsed[9]).to.equal(0)
    expect(parsed[10]).to.equal(0)
    expect(parsed[11]).to.equal(0)
    expect(parsed[12]).to.equal(0)
    expect(parsed[13]).to.equal(0)
    expect(parsed[14]).to.equal(0)
    expect(parsed[15]).to.equal(0)
    expect(parsed[16]).to.be.undefined

    expect(stringified).to.equal(uuid)
  })

  it('00010203-0405-0607-0809-0a0b0c0D0E0F', function(): void {
    const uuid = '00010203-0405-0607-0809-0a0b0c0D0E0F'
    const parsed = parseUUID(uuid)
    const stringified = stringifyUUID(parsed)

    expect(parsed[0]).to.equal(0)
    expect(parsed[1]).to.equal(1)
    expect(parsed[2]).to.equal(2)
    expect(parsed[3]).to.equal(3)
    expect(parsed[4]).to.equal(4)
    expect(parsed[5]).to.equal(5)
    expect(parsed[6]).to.equal(6)
    expect(parsed[7]).to.equal(7)
    expect(parsed[8]).to.equal(8)
    expect(parsed[9]).to.equal(9)
    expect(parsed[10]).to.equal(10)
    expect(parsed[11]).to.equal(11)
    expect(parsed[12]).to.equal(12)
    expect(parsed[13]).to.equal(13)
    expect(parsed[14]).to.equal(14)
    expect(parsed[15]).to.equal(15)
    expect(parsed[16]).to.be.undefined

    expect(stringified).to.equal(uuid.toLowerCase())
  })

  it('parse into and from an array', function(): void {
    const uuid = '00010203-0405-0607-0809-0a0b0c0d0e0f'
    const array: number[] = []
    const parsed = parseUUID(uuid, array)
    const stringified = stringifyUUID(parsed)

    expect(parsed)
      .to.be.an('array')
      .that.equals(array, 'The passed array instance should be filled with data.')
    expect(stringified).to.equal(uuid)
  })

  it('parse into and from an Uint8Array', function(): void {
    const uuid = '00010203-0405-0607-0809-0a0b0c0d0e0f'
    const array: Uint8Array = new Uint8Array(16)
    const parsed = parseUUID(uuid, array)
    const stringified = stringifyUUID(parsed)

    expect(parsed)
      .to.be.an('uint8array')
      .that.equals(array, 'The passed typed array instance should be filled with data.')
    expect(stringified).to.equal(uuid)
  })

  it('parse with offset', function(): void {
    const uuid = '01020304-0506-0708-090a-0b0c0d0e0f10'
    const parsed = parseUUID(uuid, new Uint8Array(24), 3)
    const stringified = stringifyUUID(parsed, 3)

    expect(parsed).to.be.an('uint8array')

    expect(parsed[0]).to.equal(0)
    expect(parsed[1]).to.equal(0)
    expect(parsed[2]).to.equal(0)
    expect(parsed[3]).to.equal(1)
    expect(parsed[4]).to.equal(2)
    expect(parsed[5]).to.equal(3)
    expect(parsed[6]).to.equal(4)
    expect(parsed[7]).to.equal(5)
    expect(parsed[8]).to.equal(6)
    expect(parsed[9]).to.equal(7)
    expect(parsed[10]).to.equal(8)
    expect(parsed[11]).to.equal(9)
    expect(parsed[12]).to.equal(10)
    expect(parsed[13]).to.equal(11)
    expect(parsed[14]).to.equal(12)
    expect(parsed[15]).to.equal(13)
    expect(parsed[16]).to.equal(14)
    expect(parsed[17]).to.equal(15)
    expect(parsed[18]).to.equal(16)
    expect(parsed[19]).to.equal(0)
    expect(parsed[20]).to.equal(0)
    expect(parsed[21]).to.equal(0)
    expect(parsed[22]).to.equal(0)
    expect(parsed[23]).to.equal(0)
    expect(parsed[24]).to.be.undefined

    expect(stringified).to.equal(uuid)
  })
})
