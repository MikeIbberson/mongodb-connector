# mongodb-connector
__NOTE:__ This module does not introduce application-level caching. It leverages DataLoader's memoization cache to reduce MongoDB loads only. Please fork this project if you wish to integrate such functionality or open an "enhancement" issue for me to review.

## Loader Export
|Method|Parameters|Response|Cached/Batched|
|---|---|---|---|
|`batchById`|Accepts an `array` of ObjectIds.|`array`|yes|
|`find`|Accepts an `object` for filtering MongoDB's native find query.|`array`|no|
|`findOne`|Accepts an `object` for narrowing MongoDB's search. This method is a direct abstraction; there are no modifications to its behaviour.|`object`|no|
