function promiseThrottle(func, delay) {
  let cache = new Map();
  let timers = new Map();
  const cachedCache = localStorage.getItem('throttleCache');
  const cachedTimers = localStorage.getItem('throttleTimers');
  if (cachedCache) {
    cache = new Map(JSON.parse(cachedCache));
  }
  if (cachedTimers) {
    timers = new Map(JSON.parse(cachedTimers));
  }

  return async (...args) => {
    console.log(args);
    const argHash = JSON.stringify(args);
    let promise;
    if (!cache.has(argHash)) {
      console.log('Making API call for', argHash);
      promise = func(...args).catch((e) => {
        clearTimeout(timers.get(argHash));
        timers.delete(argHash);
        throw e;
      });
      cache.set(argHash, true);
      timers.set(
        argHash,
        setTimeout(() => {
          cache.delete(argHash);
          timers.delete(argHash);
          localStorage.setItem('throttleCache', JSON.stringify(Array.from(cache.entries())));
          localStorage.setItem('throttleTimers', JSON.stringify(Array.from(timers.entries())));
        }, delay)
      );
    } else {
      console.log('Retrieving from cache for', argHash);
    }
    return await promise;
  };
}

export const throttledUpdatePortfolio = promiseThrottle(updatePortfolio, 60000);
