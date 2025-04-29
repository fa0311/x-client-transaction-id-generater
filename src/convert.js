/*
https://github.com/BANKA2017/twitter-monitor/blob/node/libs/core/Core.xClientTransactionID.mjs


MIT License

Copyright (c) 2022-present BANKA2017

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const totalTime = 4096;

const calculateScaledValue = (scalingFactor, baseValue, targetValue, roundToInteger) => {
  const result = (scalingFactor * (targetValue - baseValue)) / 255 + baseValue;
  return roundToInteger ? Math.floor(result) : Number(result.toFixed(2));
};

function interpolate(from, to, value) {
  const out = Array.from(from.length);
  for (let i = 0; i < from.length; i++) {
    out[i] = interpolateNum(from[i], to[i], value);
  }
  return out;
}

function interpolateNum(from, to, value) {
  return from * (1 - value) + to * value;
}

function convertRotationToMatrix(degrees) {
  // ! first convert degrees to radians
  const radians = (degrees * Math.PI) / 180;
  // ! now we do this:
  /*
  [cos(r), -sin(r), 0]
  [sin(r), cos(r), 0]

  in this order:
  [cos(r), sin(r), -sin(r), cos(r), 0, 0]
*/
  const c = Math.cos(radians).toFixed(6);
  const s = Math.sin(radians).toFixed(6);
  return [c, s, -s, c, 0, 0];
}

// cubic
// https://github.com/web-animations/web-animations-js/blob/480630912ad1e6e1b462363a88c0b8e93b5168fb/src/timing-utilities.js#L172-L210
function cubic(a, b, c, d) {
  if (a < 0 || a > 1 || c < 0 || c > 1) {
    return function (x) {
      return x;
    };
  }
  return function (x) {
    if (x <= 0) {
      var start_gradient = 0;
      if (a > 0) start_gradient = b / a;
      else if (!b && c > 0) start_gradient = d / c;
      return start_gradient * x;
    }
    if (x >= 1) {
      var end_gradient = 0;
      if (c < 1) end_gradient = (d - 1) / (c - 1);
      else if (c == 1 && a < 1) end_gradient = (b - 1) / (a - 1);
      return 1 + end_gradient * (x - 1);
    }

    var start = 0,
      end = 1;
    function f(a, b, m) {
      const _1_m = 1 - m;
      return 3 * a * _1_m * _1_m * m + 3 * b * _1_m * m * m + m * m * m;
    }
    while (start < end) {
      var mid = start + (end - start) / 2;
      var xEst = f(a, c, mid);
      // Servo 1e-6 https://searchfox.org/mozilla-central/rev/7ff7fe028c99154cac1bf7ad9c76eb8613f412d1/servo/components/style/bezier.rs#127
      // WebKit 1e-7 https://github.com/WebKit/WebKit/blob/57d42a4b3757962b89cc88e7da3ae63ac38eba32/Source/WebCore/platform/graphics/UnitBezier.h#L39
      if (Math.abs(x - xEst) < 1e-6) {
        return f(b, d, mid);
      }
      if (xEst < x) {
        start = mid;
      } else {
        end = mid;
      }
    }
    return f(b, d, mid);
  };
}

function doAnimation(numArr, frameTime) {
  // console.log(numArr[6], 60, 360, !0)
  // console.log(...numArr.slice(7).map((n, W) => calculateScaledValue(n, W % 2 ? -1 : 0, 1, false)))
  const _cubic = cubic(...numArr.slice(7).map((n, W) => calculateScaledValue(n, W % 2 ? -1 : 0, 1, false)));
  const currentTime = Math.round(frameTime / 10) * 10;
  // console.log('currentTime', currentTime)
  const cubicValue = _cubic(currentTime / totalTime);
  // console.log('cubicValue', cubicValue)
  const frameColor = interpolate([numArr[0], numArr[1], numArr[2]], [numArr[3], numArr[4], numArr[5]], cubicValue);
  const frameRotate = interpolate([0], [calculateScaledValue(numArr[6], 60, 360, !0)], cubicValue);
  const frameMatrix = convertRotationToMatrix(frameRotate);
  // console.log('matrix', frameMatrix)

  return {
    color: frameColor.map((c) => Math.round(c)),
    transform: frameMatrix.slice(0, 4).map((m) => Number(Number(m).toFixed(2))),
  };
}

module.exports = { getAnimationKey };
