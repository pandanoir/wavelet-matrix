'use strict';
var FID = require('fid');
class WM {
    constructor(array) {
        this.matrix = copy(array);
        this.bitSequence = [];
        this.zeroOffset = [];
        this.startPoint = [];
        var sorted = this.matrix;
        for (let n = 4; n >= 1; n--) {
            this.bitSequence.push(sorted.map(function(val) {return bit(val, n)}));
            sorted = bucketsort(sorted, n);
        }
        this.startPoint[sorted[0]] = 0;
        for (let i = 0, _i = sorted.length, before = sorted[0]; i < _i; i++) {
            if (sorted[i] !== before) {
                this.startPoint[sorted[i]] = i;
                before = sorted[i];
            }
        }
        this.bitSequence = this.bitSequence.map(function(matrix) {
            return new FID(matrix);
        });
        this.zeroOffset = this.bitSequence.map(function(dic) {
            return array.length - dic.rank(array.length);
        });
    }
    rank(_n, key) {
        var n = _n;
        for (let i = 0, _i = this.bitSequence.length; i < _i; i++) {
            let keyBit = bit(key, this.bitSequence.length - i);
            if (keyBit === 1) {
                n = this.bitSequence[i].rank(n) + this.zeroOffset[i];
            } else if (keyBit === 0) {
                n = n - this.bitSequence[i].rank(n);
            }
        }
        return n - this.startPoint[key];
    }
    select(n, key) {
        var len = this.matrix.length;
        var start = 1, end = len;
        while (start < end) {
            var mid = 0 | (start + end) / 2;
            if (this.rank(mid, key) < n) start = mid + 1;
            else if (this.rank(mid, key) >= n) end = mid;
        }
        if (this.rank(start, key) === n) return start;
        return -1;
    }
}
function copy(array) {
    return array.concat();
}
function bit(n, m) {
    return (n & Math.pow(2, m - 1)) > 0 ? 1 : 0;
}
function bucketsort(_src, digit) {
    var range = 2;
    var len = _src.length;
    var count = [];
    var offset = [0];
    var i;
    var dst = [];
    var src = _src.map(function(val) { return bit(val, digit)});
    for (i = 0; i < len; i++) {
        if (!count[src[i]]) count[src[i]] = 0;
        count[src[i]]++;
    }
    for (i = 1; i < range; i++) {
        offset[i] = offset[i - 1] + count[i - 1];
    }
    for (i = 0; i < len; i++) {
        var target = _src[i];
        dst[offset[src[i]]] = target;
        offset[src[i]]++;
    }
    return dst;
}
module.exports = WM;
