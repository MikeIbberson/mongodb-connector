# mongodb-connector
Simple MongoDB connector for Apollo Server using Facebook's DataLoader

__coming soon__

## Loader Export
|Method|Parameters|Response|Cached/Batched|
|---|---|---|---|
|`find`|Accepts an `object` for filtering MongoDB's native find query.|`array`|no|
|`findOne`|Accepts an `object` for narrowing MongoDB's search. This method is a direct abstraction; there are no modifications to its behaviour.|`object`|no|