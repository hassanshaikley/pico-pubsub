# pico-pubsub

The smallest PubSub library possible. Zero Dependencies. 160 bytes.

The competition is more than twice the size:

- [`nano-pubsub`](https://github.com/bjoerge/nano-pubsub)
- [`tiny-pubusb`](https://github.com/LukeWood/tiny-pubsub)

I wrote [this article](https://hassanshaikley.medium.com/pubsub-in-half-a-kilobyte-b6cf6a66d674) a while back. But I realized...why not just publish the code?

Built with JS13K games in mind. Such as [cred](https://cred.fly.dev/html/index.html) which is unfortunately in need of some weight loss soon, it is almost 25KB after all.

### Usage

```javascript
import pubSub from "pico-pubsub"

const unsub = pubSub.s('jump', function () {
  console.log("someone jumped")
});

pubSub.p('jump')
>> "someone jumped"

unsub()

pubSub.p('jump')
>> Nothing happens now
```

Maybe I'll add TS in the future. Probably not.

Also it's likely less effort for you to copy paste the source and change the way its exported if you run into issues with that. I typically run all my stuff through esbuild.

### The Sauce

This is the entire source ([index.js](https://github.com/hassanshaikley/pico-pubsub/blob/master/index.js)).

```javascript
let t = new EventTarget();

export default {
  s: (e, c) => (t.addEventListener(e, c), () => t.removeEventListener(e, c)),
  p: (n, d) => t.dispatchEvent(new CustomEvent(n, { detail: d })),
};
```

Compare that to:

[nano-pubsub](https://github.com/bjoerge/nano-pubsub/blob/main/src/index.ts)

```typescript
/**
 * @public
 */
export interface Subscriber<Event> {
  (event: Event): void;
}
/**
 * @public
 */
export interface PubSub<Message> {
  publish: (message: Message) => void;
  subscribe: (subscriber: Subscriber<Message>) => () => void;
}

/**
 * @public
 */
export default function createPubSub<Message = void>(): PubSub<Message> {
  const subscribers: { [id: string]: Subscriber<Message> } =
    Object.create(null);
  let nextId = 0;
  function subscribe(subscriber: Subscriber<Message>) {
    const id = nextId++;
    subscribers[id] = subscriber;
    return function unsubscribe() {
      delete subscribers[id];
    };
  }

  function publish(event: Message) {
    for (const id in subscribers) {
      subscribers[id](event);
    }
  }

  return {
    publish,
    subscribe,
  };
}
```

Or [tiny-pubsub](https://github.com/LukeWood/tiny-pubsub/blob/master/pubsub.js) if you want to see two additional functions that are not critical! The agony!

```javascript
let subscriptions = Object.create(null);

function subscribe(evt, func) {
  if (typeof func !== "function") {
    throw "Subscribers must be functions";
  }
  const oldSubscriptions = subscriptions[evt] || [];
  oldSubscriptions.push(func);
  subscriptions[evt] = oldSubscriptions;
}

function publish(evt) {
  let args = Array.prototype.slice.call(arguments, 1);
  const subFunctions = subscriptions[evt] || [];
  for (let i = 0; i < subFunctions.length; i++) {
    subFunctions[i].apply(null, args);
  }
}

function unsubscribe(evt, func) {
  const oldSubscriptions = subscriptions[evt] || [];
  const newSubscriptions = oldSubscriptions.filter((item) => item !== func);
  subscriptions[evt] = newSubscriptions;
}

function cancel(evt) {
  delete subscriptions[evt];
}

module.exports = { subscribe, publish, unsubscribe, cancel };
```
