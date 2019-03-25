# mongodb-connector

**Under development. Some unit tests left to write and additional methods.**

This module does not introduce application-level caching. It leverages DataLoader's memoization cache to reduce MongoDB loads only. Please fork this project if you wish to integrate such functionality or open an "enhancement" issue for me to review.

## Connector Export

|Method|Description|Parameters|Response|
|---|---|---|---|
|`connect`|Establishes database connection|URI (`string`), database name (`string`), MongoClient options(`object`)|`object`|
|`disconnect`|Terminates active database connection|n/a|`undefined`|
|`getCollection`|Creates a collection or loads an existing one|Collection name (`string`), options `object`|`object`|

## Loader Export
As you'll see, this export wraps only the most popular collection methods. There will be instances where you must call the collection directly (i.e. to count or watch), at which point I recommend storing the collection reference externally after instantiating the Connector class.

I suspect that I will introduce new methods over time. If there's one you'd like to see, please message me and I'll implement. 

|Method|Description|Parameters|Response|Cached/Batched|
|---|---|---|---|---|
|`batchById`|Batch find requests|ObjectId(`array`)|`array`|yes|
|`find`|Lookup paginated results|Query options(`object`)|`array`|no|
|`findOne`|Find single document by query|Query options(`object`)|`object`|no|
|`findOne`|Find single document by ID|ObjectId(`string`)|`object`|no|
|`createOne`|Insert new document|Payload(`object`)|`object`|no|
|`updateById`|Update an existing document|ObjectId(`string`), payload with operators(`object`)|`object`|yes|
|`deleteById`|Remove an existing document or mark it invisible with custom property|ObjectId(`string`),property name(`string`)|`boolean`|yes|
