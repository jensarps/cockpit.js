
;(function(global){

  var Cockpit = function(url){
    this.imageUrl = url;

    this.setup();
  };

  Cockpit.prototype = {

    imageUrl: null,

    cockpitNode: null,

    wrapperNode: null,

    textNodes: null,

    currentVertical: 0,

    currentHorizontal: 0,

    isVibrating: false,

    setup: function() {
      this.textNodes = {};
      this.setupNodes();
    },

    setupNodes: function() {
      var wrapperNode = this.wrapperNode = document.createElement('div');
      var wrapperNodeStyle = wrapperNode.style;
      wrapperNodeStyle.width = '100%';
      wrapperNodeStyle.height = '100%';
      wrapperNodeStyle.position = 'absolute';
      wrapperNodeStyle.left = '0';
      wrapperNodeStyle.top = '0';
      wrapperNodeStyle.overflow = 'hidden';
      wrapperNodeStyle.zIndex = '100000';
      wrapperNodeStyle.pointerEvents = 'none';
      document.body.appendChild(wrapperNode);

      var cockpitNode = this.cockpitNode = document.createElement('div');
      var cockpitNodeStyle = cockpitNode.style;
      cockpitNodeStyle.background = 'url(' + this.imageUrl + ') center';
      cockpitNodeStyle.backgroundSize = 'cover';
      cockpitNodeStyle.width = '130%';
      cockpitNodeStyle.height = '130%';
      cockpitNodeStyle.position = 'absolute';
      cockpitNodeStyle.left = '-15%';
      cockpitNodeStyle.top = '-15%';
      wrapperNode.appendChild(cockpitNode);
    },

    /**
     * Moves the cockpit around.
     *
     * Pass two values, one for vertical movement and one for horizontal
     * movement. Range for these values is from -1 (max negative movement) to
     * 1 (max positive movement). 0 means no movement.
     *
     * @param {number} horizontalValue The horizontal movement
     * @param {number} verticalValue The vertical movement
     */
    move: function(horizontalValue, verticalValue){
      var cockpitNodeStyle = this.cockpitNode.style;
      var left = ( horizontalValue * 10 - 15 ).toFixed(2) + '%';
      var top = ( verticalValue * 10 - 15 ).toFixed(2) + '%';
      cockpitNodeStyle.left = left;
      cockpitNodeStyle.top = top;
      this.currentHorizontal = horizontalValue;
      this.currentVertical = verticalValue;
    },

    /**
     * Creates a random position around current position
     *
     * @param {number} current The current position value
     * @param {number} intensity Thr random intensity, from 0 to 1, where 0
     *    equals no randomization and 1 equals full randomization
     */
    getRandomPosition: function(current, intensity){
      return Math.max(Math.min((( Math.random() - 0.5 ) * intensity * 0.5) + current, 1.5), -1.5);
    },

    /**
     * Shakes the cockpit.
     *
     * You can pass an optional intensity value from 0 to 1 (defaults to 0.5)
     * and and optional duration value (defaults to 300).
     *
     * @param {number} [intensity] The shake intensity from 0 to 1
     * @param {number} [duration] The shake duration in ms
     */
    shake: function(intensity, duration){
      intensity = intensity || 0.5;
      duration = duration || 300;

      var hits = ~~(duration / 50);
      var prevHor = this.currentHorizontal;
      var prevVert = this.currentVertical;

      for (var i = 0; i < hits; i++) {
        setTimeout(function(){
          //this.move(this.getRandomPosition(prevHor, intensity), this.getRandomPosition(prevVert, intensity));
          this.move(this.getRandomPosition(this.currentHorizontal, intensity), this.getRandomPosition(this.currentVertical, intensity));
        }.bind(this), 50 * i);
      }
      setTimeout(function(){
        //this.move(prevHor, prevVert);
      }.bind(this), 50 * hits);
    },

    /**
     * Vibrates the cockpit
     *
     * You can pass an optional duration value.
     *
     * @param {number} [duration] The vibration duration
     */
    vibrate: function(duration){
      duration = duration || 600;

      var moves = ~~(duration / 30);
      var curHor = this.currentHorizontal;
      var curVert = this.currentVertical;
      for (var i=0; i < moves; i++) {
        var modificator = 0.01 * (i % 2 ? 1 : -1);
        setTimeout((function(cockpit, mod){
          return function(){
            //cockpit.move(curHor + mod, curVert + mod);
            cockpit.move(cockpit.currentHorizontal + mod, cockpit.currentVertical + mod);
          };
        })(this, modificator), 30 * i);
      }
    },

    beginVibrate: function(){
      this.isVibrating = true;
      var direction = 1;
      var interval;

      interval = setInterval(function(){
        if (!this.isVibrating) {
          clearInterval(interval);
          return;
        }
        direction *= -1;
        var modificator = 0.01 * direction;
        this.move(this.currentHorizontal + modificator, this.currentVertical + modificator);
      }.bind(this), 30);

    },

    endVibrate: function(){
      this.isVibrating = false;
    },

    addText: function(id, initialValue){
      var node = document.createElement('span');
      node.innerText = initialValue;
      node.id = id;
      node.className = 'cockpit-text';
      this.cockpitNode.appendChild(node);
      this.textNodes[id] = node;
    },

    updateText: function(id, value){
      this.textNodes[id].innerText = value;
    }
  };

  global.Cockpit = Cockpit;

})(this);
