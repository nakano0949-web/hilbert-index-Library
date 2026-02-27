const { HilbertIndex2D } = require("./hilbert2D.js");

const idx = new HilbertIndex2D(8);

for (let i = 0; i < 30000; i++) {
  idx.insert(Math.random()*256|0, Math.random()*256|0, i);
}

idx.build();

console.time("range");
console.log("range hits:", idx.range({ x0: 50, y0: 50, x1: 150, y1: 150 }).length);
console.timeEnd("range");

console.time("knn");
console.log("knn results:", idx.knn(100, 100, 20).length);
console.timeEnd("knn");
