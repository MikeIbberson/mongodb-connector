# mongodb-connector
Simple MongoDB connector for Apollo Server using Facebook's DataLoader

__NOTE:__ This module does not introduce application-level caching. It leverages DataLoader's memoization cache to reduce MongoDB loads.

## Loader Export
|Method|Parameters|Response|Cached/Batched|
|---|---|---|---|
|`find`|Accepts an `object` for filtering MongoDB's native find query.|`array`|no|
|`findOne`|Accepts an `object` for narrowing MongoDB's search. This method is a direct abstraction; there are no modifications to its behaviour.|`object`|no|