Quake2.Entities.Brain = function (models, descriptor) {
  const position = {
    x: descriptor.origin[0],
    y: descriptor.origin[1],
    z: descriptor.origin[2],
  };
  const angle = descriptor.angle || 0;
  this._model = models.spawn('monsters/brain', position, angle);
  this._model.setSkin('models/monsters/brain/skin');
  this._model.play('stand');
};

Quake2.Entities.Brain.MODELS = ['monsters/brain'];

Quake2.Entities.Brain.prototype.tick = function () {};

Quake2.Entities.dictionary['monster_brain'] = Quake2.Entities.Brain;