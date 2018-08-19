Quake2.start = function () {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');

  const loadMap = function () {
    const hash = Object.create(null);
    window.location.search
        .replace(/^\?/, '')
        .split('&')
        .forEach(function (parameter) {
          const index = parameter.indexOf('=');
          if (index < 0) {
            hash[decodeURIComponent(parameter)] = true;
          } else {
            const key = decodeURIComponent(parameter.slice(0, index));
            const value = decodeURIComponent(parameter.slice(index + 1));
            hash[key] = value;
          }
        });
    const loader = new Quake2.Loader();
    if ('map' in hash) {
      return loader.loadMap(hash.map);
    } else {
      return loader.loadMap('base1');
    }
  };

  loadMap().then(function (assets) {
    const game = new Quake2.Game(gl, assets);

    const keys = Object.create(null);

    // We store the left click flag separately because clicks can be faster than
    // a tick cycle sometimes, but we still want to fire the weapon.
    var leftClick = false;

    const resolution = 0.75;
    var dimension;

    const resize = function () {
      dimension = Math.max(window.innerWidth, window.innerHeight);
      const width = window.innerWidth * resolution;
      const height = window.innerHeight * resolution;
      canvas.width = width;
      canvas.height = height;
      game.resize(width, height);
    };

    resize();

    var t0 = Date.now();
    window.setInterval(function () {
      const controlDown = keys[17];
      if (leftClick) {
        keys[17] = true;
      }
      const t1 = Date.now();
      game.tick(t0, t1, keys);
      t0 = t1;
      if (leftClick) {
        keys[17] = controlDown;
        leftClick = false;
      }
    }, 33);

    $(canvas).on('click', function () {
      canvas.requestPointerLock();
    });

    canvas.addEventListener('mousemove', function (event) {
      game.camera.rotate(
          -(event.movementY || 0) * 2 / dimension,
          -(event.movementX || 0) * 2 / dimension);
    }, true);

    $(window).on('resize', function () {
      resize();
    }).on('keydown', function (event) {
      event.preventDefault();
      keys[event.which] = true;
    }).on('keyup', function (event) {
      event.preventDefault();
      keys[event.which] = false;
    }).on('mousedown', function (event) {
      if (event.which === 1) {
        leftClick = true;
        keys[17] = true;
      }
    }).on('mouseup', function (event) {
      if (event.which === 1) {
        keys[17] = false;
      }
    });

    (function render() {
      game.render();
      window.requestAnimationFrame(render);
    }());

  });

};

$(function () {
  window.setTimeout(function () {
    window.scrollTo(0, 1);
    Quake2.start();
  }, 0);
});
