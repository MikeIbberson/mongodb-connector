# mongodb-connector
__NOTE:__ This module does not introduce application-level caching. It leverages DataLoader's memoization cache to reduce MongoDB loads only. Please fork this project if you wish to integrate such functionality or open an "enhancement" issue for me to review.

## Loader Export
|Method|Parameters|Response|Cached/Batched|
|---|---|---|---|
|`batchById`|Accepts an `array` of ObjectIds.|`array`|yes|
|`find`|Accepts an `object` for filtering MongoDB's native find query.|`array`|no|
|`findOne`|Accepts an `object` for narrowing MongoDB's search. This method is a direct abstraction; there are no modifications to its behaviour.|`object`|no|
|`createOne`|Accepts an `object` to insert into collection.|`object`|no|
|`updateById`|Accepts an `ObjectId` as its first parameter and an `object` as its second. The arguments in the second parameter should contain MongoDB operators. It will return the updated document.|`object`|yes|
