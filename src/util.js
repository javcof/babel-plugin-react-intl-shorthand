import murmur from 'murmurhash3js'

// https://stackoverflow.com/questions/15761790/convert-a-32bit-integer-into-4-bytes-of-data-in-javascript
function toBytesInt32(num) {
  const arr = new ArrayBuffer(4)
  const view = new DataView(arr)
  view.setUint32(0, num, false)
  return arr
}

export function murmur3Hash(value) {
  const hashValue = murmur.x86.hash32(value)
  return Buffer.from(toBytesInt32(hashValue)).toString('base64')
}
