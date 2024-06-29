const v8 = require('v8');

const statistics = v8.getHeapStatistics();
// const totalHeapSizeAvail = statistics.total_available_size
// let totalHeapSizeAvailInGB = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2)
// const heapSizeLimit = statistics.heap_size_limit
// const

module.exports = {
  statistics,
};
