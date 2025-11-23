# pico-pubsub

The smallest PubSub library possible. Zero Dependencies. 149 bytes.

I wrote [this article](https://hassanshaikley.medium.com/pubsub-in-half-a-kilobyte-b6cf6a66d674) a while back. But I realized...why not just publish the code?

Smaller than the competition.

- [`nano-pubsub`](https://github.com/bjoerge/nano-pubsub)
- [`tiny-pubusb`](https://github.com/LukeWood/tiny-pubsub)

Built with JS13K games in mind. Such as [cred](https://cred.fly.dev/html/index.html) which is unfortunately in need of some weight loss soon, it is almost 25KB now.

<sup><sub>If you have any ideas that may trim off even one single byte please share it. Create an issue! I don't mind.</sup></sub>

### The Source

This is the entire source ([index.js](https://github.com/hassanshaikley/pico-pubsub/blob/master/index.js)).

```javascript
let t = new EventTarget();

sub = (e, c) => (t.addEventListener(e, c), (_) => t.removeEventListener(e, c));
pub = (n, d) => t.dispatchEvent(new CustomEvent(n, { detail: d }));
```

### Usage

```bash
npm install pico-pubsub
```

```javascript
import "pico-pubsub"

const unsub = sub('jump', function (anything) {
  console.log("someone jumped - " + anything.detail)
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
  function sub(event: string, callback: (data: CustomEvent) => void): void;
}
```

- If you have export issues just copy paste and change export type.

### Prove it

The following command will produce a `149b` file:

`npx esbuild index.js --bundle --minify --format=esm --outfile=bundle.js`

### The Competition

Coming in at #2 we have [nano-pubsub](https://github.com/bjoerge/nano-pubsub/blob/main/src/index.ts) which slims down to an impressive `194b`...Not bad at all! Only ~`30%` larger.

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

And at #3 we have [tiny-pubsub](https://github.com/LukeWood/tiny-pubsub/blob/master/pubsub.js) which brings a non critical function to the table as well as an extra function with the way it handles unsubscribing! The agony! This comes in at a whopping `401b`, more than twice `nano-pubsub`!

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

If you don't want to use the `window` object just do this, just know it'll cost ya 7 bytes:

```javascript
let t = new EventTarget();

export default {
  s: (e, c) => (t.addEventListener(e, c), () => t.removeEventListener(e, c)),
  p: (n, d) => t.dispatchEvent(new CustomEvent(n, { detail: d })),
};
```

If you want to save an additional 5 bytes remove the `let` and make `t` global. If you choose to do that then proceed with caution.
