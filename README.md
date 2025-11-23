# pico-pubsub

The smallest PubSub library possible. Zero Dependencies. 99 bytes.

I wrote [this article](https://hassanshaikley.medium.com/pubsub-in-half-a-kilobyte-b6cf6a66d674) a while back. But I realized...why not just publish the code?

Smaller than the competition.

- [`nano-pubsub`](https://github.com/bjoerge/nano-pubsub)
- [`nanoevents`](https://github.com/ai/nanoevents)
- [`tiny-pubusb`](https://github.com/LukeWood/tiny-pubsub)

Built with JS13K games in mind. Such as [cred](https://cred.fly.dev/html/index.html) which is unfortunately in need of some weight loss soon, it is almost 25KB now.

<sup><sub>If you have any ideas that may trim off even one single byte please share it. Create an issue! I don't mind.</sup></sub>

### The Source

This is the entire source ([index.js](https://github.com/hassanshaikley/pico-pubsub/blob/master/index.js)).

```javascript
let t = {};
sub = (e, c) => ((t[e] ??= new Set()).add(c), (_) => t[e].delete(c));
pub = (e, d) => t[e]?.forEach((f) => f(d));
```

### Usage

```bash
npm install pico-pubsub
```

```javascript
const unsub = sub('jump', function (anything) {
  console.log("someone jumped - " + anything)
});

pub('jump', "a_user_id")
>> "someone jumped - a_user_id"

unsub()

pub('jump', "another_user_id")
>> Nothing happens now
```

### Troubleshoot

- Might add TS support in the future. For now you can use the following snippet.

```typescript
declare global {
  function pub(event: string, data: any): VoidFunction;
  function sub(event: string, callback: (data: any) => void): void;
}
```

- If you have export issues just copy paste and change export type.

### Prove it

The following command will produce a `99b` file:

`npx esbuild index.js --bundle --minify --format=esm --outfile=bundle.js`

### The Competition

#### #2

[nano-pubsub](https://github.com/bjoerge/nano-pubsub/blob/main/src/index.ts) which slims down to an impressive `194b`...Not bad at all! But we are looking for the absolute minimal implementation.

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

#### #3

[nanoevents](https://github.com/ai/nanoevents) which compresses down to `231b`.

They advertise it as 107 bytes but they are including `brotli` compression which occurs during transfer. Also I am seeing `146b` after brotli on my end. Not sure how they are calculating that.

```javascript
export let createNanoEvents = () => ({
  emit(event, ...args) {
    for (
      let callbacks = this.events[event] || [],
        i = 0,
        length = callbacks.length;
      i < length;
      i++
    ) {
      callbacks[i](...args);
    }
  },
  events: {},
  on(event, cb) {
    (this.events[event] ||= []).push(cb);
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  },
});
```

#### #4

[tiny-pubsub](https://github.com/LukeWood/tiny-pubsub/blob/master/pubsub.js) which brings a non critical function to the table as well as an extra function with the way it handles unsubscribing! The agony! This comes in at a whopping `401b`, more than 4 times `pico-pubsub`!

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

### Notes

This library adds `pub` and `sub` to the global namespace.
