
`markdown

HilbertIndex2D — Fast 2D Spatial Index using Hilbert Curve

A high-performance 2D spatial index based on Hilbert curves, designed for fast range search and k-nearest neighbors (kNN) queries.  
Provides strong spatial locality, making it ideal for large-scale point data.

---

Features

- High locality ordering using Hilbert curves  
- Fast rectangular range search  
- Efficient kNN search  
- Pure JavaScript, no dependencies  
- Works in Node.js and browser environments  

---

Installation

（npm 公開前のため、ローカルファイルとして読み込み）

`js
const { HilbertIndex2D } = require("./hilbert2D.js");
`

---

Usage

Insert points

`js
const idx = new HilbertIndex2D(8); // order 8 → 256×256 grid

for (let i = 0; i < 30000; i++) {
  idx.insert(
    Math.random() * 256 | 0,
    Math.random() * 256 | 0,
    i
  );
}

idx.build();
`

---

Range search

矩形領域に含まれる点を高速に検索します。

`js
const hits = idx.range({
  x0: 50, y0: 50,
  x1: 150, y1: 150
});

console.log("range hits:", hits.length);
`

---

kNN search

指定した座標から k 個の最近傍点を検索します。

`js
const results = idx.knn(100, 100, 20);
console.log("knn results:", results.length);
`

---

API

new HilbertIndex2D(order)
- order: Hilbert curve order  
  - order 8 → 256×256  
  - order 9 → 512×512  

---

.insert(x, y, value)
点をインデックスに追加します。

---

.build()
全ての点を Hilbert index でソートします。  
挿入が終わった後に必ず呼ぶ必要があります。

---

.range(rect)
矩形領域検索。

rect:
`js
{
  x0, y0,   // top-left
  x1, y1    // bottom-right
}
`

返り値：{h, x, y, value} の配列

---

.knn(qx, qy, k)
k 最近傍点検索。

---

Benchmark (Node.js / GitHub Codespaces)

| Operation     | 30,000 points | Time     |
|---------------|----------------|----------|
| Range search  | 3190 hits      | ~9.7 ms  |
| kNN (k=20)    | 20 results     | ~0.25 ms |

---

License

MIT License
`

---

