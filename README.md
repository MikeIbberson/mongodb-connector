# mongodb-connector
__NOTE:__ This module does not introduce application-level caching. It leverages DataLoader's memoization cache to reduce MongoDB loads only. Please fork this project if you wish to integrate such functionality or open an "enhancement" issue for me to review.

## Loader Export
As you'll see, this export wraps only the most popular collection methods. There will be instances where you must call the collection directly (i.e. to count or watch), at which point I recommend storing the collection reference externally after instantiating the Connector class.

I suspect that I will introduce new methods over time. If there's one you'd like to see, please message me and I'll implement. 

|Method|Parameters|Response|Cached/Batched|
|---|---|---|---|
|`batchById`|Accepts an `array` of ObjectIds.|`array`|yes|
|`find`|Accepts an `object` for filtering MongoDB's native find query.|`array`|no|
|`findOne`|Accepts an `object` for narrowing MongoDB's search. This method is a direct abstraction; there are no modifications to its behaviour.|`object`|no|
|`createOne`|Accepts an `object` to insert into collection.|`object`|no|
|`updateById`|Accepts an `ObjectId` as its first parameter and an `object` as its second. The arguments in the second parameter should contain MongoDB operators. It will return the updated document.|`object`|yes|
|`deleteById`|Accepts an `ObjectId` and a `string`. The ID will target a document for deletion. However, if given a string, this method assumes that your application has a visibility trigger and retains all deleted docs. For example, a user with a boolean property "active". In such cases, provide the key name and it was update to `false`.|`boolean`|yes"|
