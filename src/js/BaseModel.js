Quake2.BaseModel = function (gl, program, name, data, skins, normalTable) {
  this._gl = gl;
  this._program = program;

  this.name = name;
  this.animations = Quake2.BaseModel._loadAnimations(data);
  this._vertexBuffer = gl.createBuffer();
  this._textureCoordinateBuffer = gl.createBuffer();
  this._size = data.triangles.vertices.length;

  const vertices = new Float32Array(data.frames.names.length * data.triangles.vertices.length * 3);
  for (var i = 0; i < data.frames.names.length; i++) {
    for (var j = 0; j < data.triangles.vertices.length; j++) {
      vertices[(i * data.triangles.vertices.length + j) * 3 + 0] = data.frames.vertices[(i * data.frames.vertexCount + data.triangles.vertices[j]) * 3 + 0] * data.frames.scale[i * 3 + 0] + data.frames.translate[i * 3 + 0];
      vertices[(i * data.triangles.vertices.length + j) * 3 + 2] = data.frames.vertices[(i * data.frames.vertexCount + data.triangles.vertices[j]) * 3 + 1] * data.frames.scale[i * 3 + 1] + data.frames.translate[i * 3 + 1];
      vertices[(i * data.triangles.vertices.length + j) * 3 + 1] = data.frames.vertices[(i * data.frames.vertexCount + data.triangles.vertices[j]) * 3 + 2] * data.frames.scale[i * 3 + 2] + data.frames.translate[i * 3 + 2];
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  delete vertices;

  const textureCoordinates = new Float32Array(data.triangles.textureCoordinates.length * 2);
  for (var i = 0; i < data.triangles.textureCoordinates.length; i++) {
    const j = data.triangles.textureCoordinates[i] * 2;
    textureCoordinates[i * 2 + 0] = data.textureCoordinates[j + 0] / data.skin.width;
    textureCoordinates[i * 2 + 1] = data.textureCoordinates[j + 1] / data.skin.height;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, this._textureCoordinateBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
  delete textureCoordinates;

  this._textures = {};
  gl.activeTexture(gl.TEXTURE2);
  for (var name in skins) {
    this._textures[name] = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._textures[name]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skins[name]);
  }

};


Quake2.BaseModel._loadAnimations = function (data) {
  const animations = Object.create(null);

  data.frames.names.forEach(function (name, index) {
    const re = /^([a-z_]+)(\d*)$/.exec(name);
    if (re) {
      if (!(re[1] in animations)) {
        animations[re[1]] = Object.create(null);
      }
      animations[re[1]][parseInt(re[2], 10)] = index;
    }
  });

  for (var name in animations) {
    animations[name] = Object.keys(animations[name]).map(function (key) {
      return parseInt(key, 10);
    }).sort(function (a, b) {
      return a - b;
    }).map(function (key) {
      return animations[name][key];
    });
  }

  return animations;
};


Quake2.BaseModel.prototype.render = function (x, y, z, a, i, j, t, skin) {
  const gl = this._gl;
  const program = this._program;

  gl.uniform3f(program.locations.position, x, y, z);
  gl.uniform1f(program.locations.angle, a);
  gl.uniform1f(program.locations.step, t);

  gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, this._size * 12 * i);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, this._size * 12 * j);

  gl.bindBuffer(gl.ARRAY_BUFFER, this._textureCoordinateBuffer);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, this._textures[skin]);

  gl.drawArrays(gl.TRIANGLES, 0, this._size);

};
