const memory = require('./memory')

const testMemory = new memory

class Array {
  constructor() {
    this.length = 0
    this._capacity = 0
    this.ptr = testMemory.allocate(this.length)
  }
  // resize in memory
  _resize(mem) {
    const oldPtr = this.ptr
    this.ptr = testMemory.allocate(mem) 
    if (this.ptr === null) {
      throw new Error('Out of memory')
    }
    testMemory.copy(this.ptr, oldPtr, this.length)
    testMemory.free(oldPtr)
    // for(let i=oldPtr; i < this.length; i++) {
    //   testMemory.free(i)
    // }
    // with optimized push for O(1), include adjustment of capacity
    this._capacity = mem
  }
  // push() -- O(n) best/avg/worst
  // push(value) {
  //   this._resize(this.length + 1)
  //   testMemory.set(this.ptr + this.length, value)
  //   this.length++
  // } 

  // push -- O(1) best/avg, O(n) worst
  push(value) {
    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO)
    }
    testMemory.set(this.ptr + this.length, value)
    this.length++
  }
  // pop()
  // splice()
}

module.exports = Array
Array.SIZE_RATIO = 3

const testArray = new Array
console.log(testArray)