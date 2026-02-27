class HilbertIndex2D {
  constructor(order) {
    this.order = order;
    this.items = [];
  }

  insert(x, y, value) {
    const h = hilbertXY2D(this.order, x, y);
    this.items.push({ h, x, y, value });
    return this;
  }

  build() {
    this.items.sort((a, b) => a.h - b.h);
  }

  range(rect) {
    const ranges = hilbertRange(this.order, rect);
    const results = [];

    for (const [hMin, hMax] of ranges) {
      const start = lowerBound(this.items, hMin);
      const end = upperBound(this.items, hMax);

      for (let i = start; i < end; i++) {
        const p = this.items[i];
        if (
          p.x >= rect.x0 &&
          p.x <= rect.x1 &&
          p.y >= rect.y0 &&
          p.y <= rect.y1
        ) {
          results.push(p);
        }
      }
    }
    return results;
  }

  knn(qx, qy, k) {
    const hq = hilbertXY2D(this.order, qx, qy);
    const pos = lowerBound(this.items, hq);

    const candidates = [];
    let left = pos - 1;
    let right = pos;

    while (candidates.length < k && (left >= 0 || right < this.items.length)) {
      if (right < this.items.length) candidates.push(this.items[right++]);
      if (left >= 0) candidates.push(this.items[left--]);
    }

    let radius = 1;
    while (candidates.length < k) {
      const rect = {
        x0: qx - radius,
        y0: qy - radius,
        x1: qx + radius,
        y1: qy + radius
      };

      const ranges = hilbertRange(this.order, rect);

      for (const [hMin, hMax] of ranges) {
        const start = lowerBound(this.items, hMin);
        const end = upperBound(this.items, hMax);
        for (let i = start; i < end; i++) {
          candidates.push(this.items[i]);
        }
      }

      radius *= 2;
    }

    candidates.sort((a, b) => {
      const da = (a.x - qx) ** 2 + (a.y - qy) ** 2;
      const db = (b.x - qx) ** 2 + (b.y - qy) ** 2;
      return da - db;
    });

    return candidates.slice(0, k);
  }
}

function hilbertXY2D(order, x, y) {
  let h = 0;
  for (let i = order - 1; i >= 0; i--) {
    const rx = (x >> i) & 1;
    const ry = (y >> i) & 1;
    h += (1 << (2 * i)) * ((3 * rx) ^ ry);
    if (ry === 0) {
      if (rx === 1) {
        x = (1 << order) - 1 - x;
        y = (1 << order) - 1 - y;
      }
      [x, y] = [y, x];
    }
  }
  return h;
}

function lowerBound(arr, h) {
  let l = 0, r = arr.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (arr[m].h < h) l = m + 1;
    else r = m;
  }
  return l;
}

function upperBound(arr, h) {
  let l = 0, r = arr.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (arr[m].h <= h) l = m + 1;
    else r = m;
  }
  return l;
}

function hilbertRange(order, rect) {
  const max = 1 << order;
  const ranges = [];

  function recurse(x0, y0, size, h0) {
    const x1 = x0 + size - 1;
    const y1 = y0 + size - 1;

    if (x1 < rect.x0 || x0 > rect.x1 || y1 < rect.y0 || y0 > rect.y1) return;

    if (x0 >= rect.x0 && x1 <= rect.x1 && y0 >= rect.y0 && y1 <= rect.y1) {
      const h1 = h0 + size * size - 1;
      ranges.push([h0, h1]);
      return;
    }

    const half = size >> 1;
    if (half === 0) return;

    recurse(x0,        y0,        half, h0);
    recurse(x0,        y0+half,   half, h0 + half*half);
    recurse(x0+half,   y0+half,   half, h0 + 2*half*half);
    recurse(x0+half,   y0,        half, h0 + 3*half*half);
  }

  recurse(0, 0, max, 0);
  return ranges;
}

module.exports = { HilbertIndex2D };
