import { expect } from 'chai'

import oldUUID, { v1, v4, parse, unparse, uuid1, uuid4, parseUUID, stringifyUUID } from '../src'

describe('UUID old API', function(): void {
  it('default export', function(): void {
    expect(oldUUID).to.be.a('function')

    expect(oldUUID())
      .to.be.a('string')
      .that.has.ownProperty('14')
      .that.equals('4', 'Default export function should generate UUIDv4.')

    expect(oldUUID)
      .to.have.ownProperty('v1')
      .that.is.a('function')
      .and.equals(uuid1)

    expect(oldUUID)
      .to.have.ownProperty('v4')
      .that.is.a('function')
      .and.equals(uuid4)

    expect(oldUUID)
      .to.have.ownProperty('parse')
      .that.is.a('function')
      .and.equals(parseUUID)

    expect(oldUUID)
      .to.have.ownProperty('unparse')
      .that.is.a('function')
      .and.equals(stringifyUUID)
  })

  it('named exports', function(): void {
    expect(v1)
      .to.be.a('function')
      .and.equal(uuid1)

    expect(v4)
      .to.be.a('function')
      .and.equal(uuid4)

    expect(parse)
      .to.be.a('function')
      .and.equal(parseUUID)

    expect(unparse)
      .to.be.a('function')
      .and.equal(stringifyUUID)
  })
})
