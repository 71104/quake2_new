Quake2.AnimatedModel = function (model) {
  this._model = model;
  this._animation = {
    name: null,
    firstFrame: 0,
    lastFrame: 0,
    startTime: 0,
  };
};

Quake2.AnimatedModel.FRAME_DURATION = 100;

Quake2.AnimatedModel.prototype.setSkin = function (name) {
  this._skin = name;
};

Quake2.AnimatedModel.prototype.play = function (name) {
  this._animation.name = name;
  this._animation.firstFrame = 0;
  this._animation.lastFrame = this._model.animations[name].length - 1;
  this._animation.startTime = Date.now();
};

Quake2.AnimatedModel.prototype.playFrames = function (name, first, last) {
  this._animation.name = name;
  this._animation.firstFrame = first;
  this._animation.lastFrame = last;
  this._animation.start_time = Date.now();
};

Quake2.AnimatedModel.prototype.playRandom = function (name, first, last) {
  this._animation.name = name;
  this._animation.firstFrame = first;
  this._animation.lastFrame = last;
  this._animation.startTime = Math.round(Math.random() * (last - first + 1) * Quake2.AnimatedModel.FRAME_DURATION);
};

Quake2.AnimatedModel.prototype.isRestarting = function (t) {
  if (this._animation.name) {
    const elapsed = t - this._animation.startTime;
    const frameNumber = Math.floor(elapsed / Quake2.AnimatedModel.FRAME_DURATION);
    const frameCount = this._animation.lastFrame - this._animation.firstFrame + 1;
    return frameNumber >= frameCount && !(frameNumber % frameCount);
  } else {
    return false;
  }
};

Quake2.AnimatedModel.prototype.isAtFrame = function (t, i) {
  if (this._animation.name) {
    const elapsed = t - this._animation.startTime;
    const frameNumber = Math.floor(elapsed / Quake2.AnimatedModel.FRAME_DURATION);
    const frameCount = this._animation.lastFrame - this._animation.firstFrame + 1;
    return frameNumber % frameCount === i;
  } else {
    return false;
  }
};

Quake2.AnimatedModel.prototype.stop = function () {
  this._animation.name = null;
};

Quake2.AnimatedModel.prototype.render = function (x, y, z, a, t) {
  if (this._animation.name) {
    const frameTable = this._model.animations[this._animation.name];
    const elapsed = t - this._animation.startTime;
    const frameNumber = Math.floor(elapsed / Quake2.AnimatedModel.FRAME_DURATION);
    const frameCount = this._animation.lastFrame - this._animation.firstFrame + 1;
    const i = frameTable[this._animation.firstFrame + frameNumber % frameCount];
    const j = frameTable[this._animation.firstFrame + (frameNumber + 1) % frameCount];
    const t2 = elapsed / Quake2.AnimatedModel.FRAME_DURATION - frameNumber;
    this._model.render(x, y, z, a, i, j, t2, this._skin);
  }
};
