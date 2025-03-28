# nano-pubsub

PubSub in 173b bytes

```
import pubsub from "nano-pubsub"

const unsubscribe = pubsub.s('jump', function () {
  console.log("jump")
});

pubsub.p('jump')
>> "jump"

unsubscribe()

pubsub.p('jump')
>> ...no op


```
