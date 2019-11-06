'use strict';

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

  get(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    return testMemory.get(this.ptr + index);
  }

  pop() {
    if (this.length - 1 < 0) {
      throw new Error('Index error');
    }
    const value = testMemory.get(this.ptr + this.length - 1);
    this.length--;
    return value;
  }

  insert(index, value) {
    if (index < 0 || index > this.length){
      throw new Error('Index error');
    }
    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    testMemory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
    testMemory.set(this.ptr + index, value);
    this.length++;
  }

  remove(index) {
    if(index < 0 || index > this.length){
      throw new Error('Index error');
    }
    testMemory.copy(this.ptr + index, this.ptr + index + 1, this.length - index - 1);
    this.length--;
  }
}

module.exports = Array;

function main() {
  Array.SIZE_RATIO = 3;

  let newArray = new Array;
  
  newArray.push(3);
  // Array { length: 1, _capacity: 3, ptr: 0 }

  newArray.push(5);
  newArray.push(15);
  newArray.push(19);
  newArray.push(45);
  newArray.push(10);

  //#2 Array { length: 6, _capacity: 12, ptr: 3 }
  //After the third push the length exceeds capacity then allocates the length * size ratio + length and moves pointer to 3

  newArray.pop();
  newArray.pop();
  newArray.pop();

  //Removes the last item of the array decreasing the length three times, O(1) operation

  //#4
  // console.log(testMemory.get(3));

  newArray.pop();
  newArray.pop();
  newArray.pop();

  newArray.push('tauhida');
  console.log(testMemory.get(3));
  //Inputting a string returns NaN because the Array class is defined as type 64-bit float values
  //The resize is to accomodate adding values to an array where length exceeds capacity by reallocating the array
}

main();
