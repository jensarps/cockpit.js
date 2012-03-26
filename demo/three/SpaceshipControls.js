/**
 * @author Jens Arps
 *
 * Based on FlyControls by James Baicoianu / http://www.baicoianu.com/
 */

THREE.SpacheshipControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );

  this.onContainerDimensionsChanged();

  // initial values
	this.movementSpeed = 0;
  this.velocity = 0;

  // influence
  this.breakingForce = 0;

  // ship stats
  this.maxSpeed = 1000;
  this.inertia = 100;
  this.rollSpeed = 0.005;

	this.autoForward = false;

	// disable default target object behavior

	this.object.useQuaternion = true;

	// internals

	this.tmpQuaternion = new THREE.Quaternion();

	this.mouseStatus = 0;

	this.moveState = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    forward: 1,
    back: 0,
    pitchUp: 0,
    pitchDown: 0,
    yawLeft: 0,
    yawRight: 0,
    rollLeft: 0,
    rollRight: 0
  };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	this.keydown = function( event ) {

		if ( event.altKey ) {

			return;

		}

		switch( event.keyCode ) {

      case 87: /*W*/ this.velocity = Math.min(1, this.velocity + 0.015); break;
      case 83: /*S*/ this.velocity = Math.max(0, this.velocity - 0.015); break;

			// case 65: /*A*/ this.moveState.left = 1; break;
			// case 68: /*D*/ this.moveState.right = 1; break;

			// case 82: /*R*/ this.moveState.up = 1; break;
			// case 70: /*F*/ this.moveState.down = 1; break;

			// case 37: /*left*/ this.moveState.yawLeft = 1; break;
			// case 39: /*right*/ this.moveState.yawRight = 1; break;

			case 81: /*Q*/ this.moveState.rollLeft = 1; break;
			case 69: /*E*/ this.moveState.rollRight = 1; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

  this.keyup = function( event ) {

  		switch( event.keyCode ) {

  			// case 87: /*W*/ this.moveState.forward = 0; break;
  			// case 83: /*S*/ this.moveState.back = 0; break;

  			// case 65: /*A*/ this.moveState.left = 0; break;
  			// case 68: /*D*/ this.moveState.right = 0; break;

  			// case 82: /*R*/ this.moveState.up = 0; break;
  			// case 70: /*F*/ this.moveState.down = 0; break;

  			// case 38: /*up*/ this.moveState.pitchUp = 0; break;
  			// case 40: /*down*/ this.moveState.pitchDown = 0; break;

  			// case 37: /*left*/ this.moveState.yawLeft = 0; break;
  			// case 39: /*right*/ this.moveState.yawRight = 0; break;

  			case 81: /*Q*/ this.moveState.rollLeft = 0; break;
  			case 69: /*E*/ this.moveState.rollRight = 0; break;

  		}

  		this.updateMovementVector();
  		this.updateRotationVector();

  	};

	this.mousemove = function( event ) {

			var container = this.containerDimensions;
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.pitchDown = - ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();

	};

	this.update = function( delta ) {

    var factor = Math.max(0, this.velocity - this.breakingForce);
    var diff = factor - this.movementSpeed;
    this.movementSpeed += (diff / this.inertia);

    var speed = this.movementSpeed * this.maxSpeed;

		var moveMult = delta * speed;
		var rotMult = delta * this.rollSpeed;

		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateY( this.moveVector.y * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult );

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiplySelf( this.tmpQuaternion );

		this.object.matrix.setPosition( this.object.position );
		this.object.matrix.setRotationFromQuaternion( this.object.quaternion );
		this.object.matrixWorldNeedsUpdate = true;


	};

	this.updateMovementVector = function() {

		var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
		this.moveVector.z = ( -forward + this.moveState.back );

		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	};

	this.updateRotationVector = function() {

		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	};

	this.onContainerDimensionsChanged = function() {

    var dimensions;

		if ( this.domElement != document ) {
			dimensions = {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};
		} else {
			dimensions = {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};
		}
    this.containerDimensions = dimensions;
	};

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	};

	this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.keydown ), false );
  this.domElement.addEventListener( 'keyup', bind( this, this.keyup ), false );

	this.updateMovementVector();
	this.updateRotationVector();

};
