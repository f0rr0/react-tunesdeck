# queue2 [![Build Status](https://secure.travis-ci.org/fent/queue2.js.png)](http://travis-ci.org/fent/queue2.js)

A queue with a unique use case.


# Motive
I created this queue data structure because of the unique use case I ran into. I needed to open files in an asynchronous way, to maximize efficiency. But I needed to read from them in order, including subdirectories. This queue helped me do that, although for now I can't think of other use cases for this.

I've also tried to think of a way to simplify this and possibly break it down into 2 type of queues. But since both workers depend on each other and share the same concurrency, I'm starting to think this is what the simplified solution is.


# API

### new Queue2(worker1, worker2, concurrency)

Creates a queue with the given workers and concurrency. Jobs will be executed asynchronously with no more than `concurrency` running at once. `worker1` will be alled the arguments which `Queue2#push()` was called with plus a callback function that should be called with either an error or results when the task finishes.

```js
function worker1(a, b, c, callback) {
  someAsyncOp(a, b, c, callback);
}
```

The `worker1` function is also called with a context which contains a method named `inject` for placing additional tasks in place, in the same position, of the current running task. The context also includes an `injected` key which will be `true` if the current task was added using the `inject` function.

```js
function worker1(a, b, c, callback) {
  this.inject([
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5]
  ]);
}
```

The `callback` should not be called when `inject` is used. Since the tasks injected are supposed to replace the current one.

### Queue2#push(arg1, arg2, arg3...)

Pushes a task onto the queue. If the last argument is a function and it corresponds with the position of the callback from the first worker, then it will be called once there is an error with the task, or the task finishes.

For example:

```js
var q = new Queue2(function worker1(a, callback) {
  // a === 1
  callback(null);
}, worker2);

q.push(1, function(err) {
 if (err) throw err;

 // will be called once this finishes
});

q.push(1);
```

### Queue#active

Number of active tasks that are running.

### Queue2#die()

Kills the queue.

### Event: 'full'

Queue is full.

### Event: 'empty'

Queue is empty, with tasks still running.

### Event: 'drain'

Queue is empty and tasks have finished.


# Install

    npm install queue2


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```

# License
MIT
