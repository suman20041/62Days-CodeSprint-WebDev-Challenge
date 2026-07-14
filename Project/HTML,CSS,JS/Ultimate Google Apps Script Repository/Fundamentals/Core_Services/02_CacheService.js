/**
 * The Cache Service lets you store data for short-term access. It's faster than
 * Properties Service but the data is not guaranteed to persist.
 * It's great for caching results from expensive operations or API calls.
 */
function demonstrateCacheService() {
  // Get a cache that is shared by all users of the script.
  const scriptCache = CacheService.getScriptCache();

  const cacheKey = 'expensive_api_result';
  let result = scriptCache.get(cacheKey);

  if (result == null) {
    // If the result is not in the cache, we simulate fetching it.
    Logger.log("Cache miss. Fetching data from the 'API'...");
    result = expensiveOperation();
    
    // Put the result in the cache for next time.
    // The second argument is the expiration time in seconds. Max is 21600 (6 hours).
    scriptCache.put(cacheKey, result, 300); // Cache for 5 minutes
    Logger.log("Data has been cached.");

  } else {
    // If the result was in the cache, we can use it directly.
    Logger.log("Cache hit! Using cached data.");
  }

  Logger.log("The final result is: " + result);
}

/**
 * A placeholder for a function that takes a long time to run,
 * like fetching data from an external API.
 */
function expensiveOperation() {
  // Simulate a delay
  Utilities.sleep(2000); // sleep for 2 seconds
  return "This is some very important data generated at " + new Date();
}