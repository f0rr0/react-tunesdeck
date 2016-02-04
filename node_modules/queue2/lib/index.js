var EventEmitter = require('events').EventEmitter;
var util         = require('util');


/**
 * @contructor
 * @param {Function} worker1
 * @param {Function} worker2
 * @param {Number} concurrency Number of parallel workers.
 */
var Q = module.exports = function(worker1, worker2, concurrency) {
  EventEmitter.call(this);

  this.worker1 = worker1;
  this.worker2 = worker2;
  this.concurrency = concurrency;
  this.queue = [];
  this.running1 = [];
  this.running2 = [];
};

util.inherits(Q, EventEmitter);


/**
 * Instance Variables.
 */
Q.prototype.active = 0;
Q.prototype._num = 0;
Q.prototype._current = 0;


/**
 * Add new task to queue.
 *
 * @param {Object} data...
 */
Q.prototype.push = function() {
  this.queue.push({
    num: this._num++,
    args: Array.prototype.slice.call(arguments),
    injected: false
  });
  this._next1();
};


/**
 * Adds a task in place of another running task.
 *
 * @param {Array.<Object>} list
 * @param {Number} num
 */
Q.prototype._inject = function(list, num) {
  var i, len = list.length, len2 = len - 1, args;
  this.active--;

  // Edit order of items in queue and running.
  if (len2 > 0) {
    this._incrAll(num, len2);
  }

  // Inject items to the beginning of queue with custom priority.
  for (i = len - 1; i >= 0; i--) {
    args = list[i];
    if (!Array.isArray(args)) {
      args = [args];
    }
    this.queue.unshift({ num: num + i, args: args, injected: true });
    this._next1();
  }
};


/**
 * Increases `num` of all lists by given amount.
 *
 * @param {Number} num
 * @param {Number} amount
 */
Q.prototype._incrAll = function(num, amount) {
  this._incr('queue', num, amount);
  this._incr('running1', num, amount);
  this._incr('running2', num, amount);
};


/**
 * Increases `num` in tasks by given amount.
 *
 * @param {Array.<Object>} list
 * @param {Number} num
 * @param {Number} amount
 */
Q.prototype._incr = function(list, num, amount) {
  for (var i = 0, len = this[list].length; i < len; i++) {
    var task = this[list][i];
    if (task.num > num) task.num += amount;
  }
};


/**
 * Processes tasks in queue if it can.
 */
Q.prototype._next1 = function() {
  if (this.active >= this.concurrency) {
    if (this.active === this.concurrency) {
      this.emit('full');
    }
    return;
  } else if (this.active === 0) {
    this.emit('drain');
  }

  var task = this.queue.shift();
  if (!task) return this.emit('empty');

  this.running1.push(task);
  this.active++;
  var self = this;
  var world = {
    num: task.num,
    injected: task.injected,
    inject: function inject(list) {
      self._inject(list, task.num);
    }
  };

  var args = task.args;
  var callback = args.splice(this.worker1.length - 1, 1)[0];

  // Add missing arguments.
  while (args.length < this.worker1.length - 1) {
    args.push(undefined);
  }

  // Add custom callback to args.
  args.push(function worker1Callback(err) {
    self.running1.splice(self.running1.indexOf(task), 1);
    var hasCallback = typeof callback === 'function';

    if (err) {
      self._incrAll(task.num, -1);
      self.active--;
      if (!hasCallback) {
        self.emit('error', err);
      }
    }

    if (hasCallback) {
      callback.apply(null, arguments);
    }

    if (err) {
      self._next1();
      return;
    }

    self.running2.push({
      num: task.num,
      callback: callback,
      args: Array.prototype.slice.call(arguments, 1)
    });
    self._next2();

  });
  self.worker1.apply(world, args);
};


/**
 * Looks for the next task in the second queue to run.
 */
Q.prototype._next2 = function() {
  for (var i = 0, len = this.running2.length; i < len; i++) {
    var task = this.running2[i];
    if (task.num === this._current) {
      this._current++;
      this.running2.splice(i, 1);
      this._run(task);
      this._next2();
      break;
    }
  }
};


/**
 * Runs a task through the second worker.
 *
 * @param {Object} task
 */
Q.prototype._run = function(task) {
  var self = this;

  // Add missing arguments.
  while (task.args.length < this.worker2.length - 1) {
    task.args.push(undefined);
  }

  // Add callback for worker2
  task.args.push(function worker2Callback(err) {
    if (typeof task.callback === 'function') {
      task.callback.apply(null, task.args);
    } else if (err) {
      self.emit('error', err);
    }
    self.active--;
    self._next1();
  });
  this.worker2.apply(null, task.args);
  this._next2();
};


/**
 * Kills the queue.
 */
Q.prototype.die = function() {
  this.active = 0;
  this._num = 0;
  this._current = 0;
  this.queue = [];
  this.running1 = [];
  this.running2 = [];
};
