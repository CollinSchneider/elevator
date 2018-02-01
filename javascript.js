currentFloor = 1;
upQueue = [];
downQueue = [];
elevatorIsMoving = false;
elevatorDirection = null;
lastFloor = 1;

$(document).ready(function() {

  var element = $('.elevator');

  var args = {
    domElement: element,
    numFloors: 3,
    widthPercent: '15%',
    heightPixels: '150px'
  };
  var elevator = new Elevator(args);
  elevator.init();
});

////////////////////
//    ELEVATOR    //
////////////////////


function Elevator(args) {
  if(!args['domElement']) {
    throw('cannot create an elevator without giving a dom element');
  }

  this.domElement = args['domElement'];
  this.numFloors = args['numFloors']|| 3;
  this.width = args['widthPercent'] || '25%';
  this.height = args['heightPixels'] || '200px';
  this.animationTime = args['animationTime'] || 2000;

  this.init = function() {
    this.domElement.css({
      'bottom': 5,
      'width': this.width,
      'height': this.height,
      'marginLeft': this.determineMarginLeft()
    });

    this._initFloors();
  };

  this.determineMarginLeft = function() {
    return (100 - parseInt(this.width))/2 + '%'
  };

  this.enqueueUpFloor = function(floorNumber) {
    window.upQueue.push(floorNumber);
    this.goToNextFloor();
    window.lastFloor = floorNumber;
    window.upQueue.pop();
  };

  this.enqueueDownFloor = function(floorNumber) {
    window.downQueue.push(floorNumber);
    this.goToNextFloor();
    window.lastFloor = floorNumber;
    window.upQueue.pop();
  };

  // this.enqueueFloor = function(floorNumber) {
  //   window.queue.push(floorNumber);
  //   this.goToNextFloor();
  //   window.lastFloor = floorNumber;
  //   window.queue.pop();
  // };

  this.goToNextFloor = function() {
    debugger;
    var nextFloor = this.direction() === 'down' ? this.getNextFloorBelow() : maxArray(window.queue) || 0;
    this.goToFloor(nextFloor);
  };

  this.getNextFloorBelow = function() {
    for(var i = 0; i < window.queue.length; i++) {
      var floor = window.queue[i];
      var nextLowestFloor = 0;
      if(floor > nextLowestFloor && floor < window.currentFloor) {
        nextLowestFloor = floor;
      }
      return floor;
    }
  };

  this.goToFloor = function(floorNumber) {
    floorNumber = parseInt(floorNumber);
    if(floorNumber === window.floorNumber) {
      return true;
    }
    window.elevatorDirection = window.currentFloor > floorNumber
    window.elevatorIsMoving = true;
    window.floorNumber = floorNumber;
    this.domElement.animate({
      'bottom': this.getFloor(floorNumber).css('bottom')
    }, this.animationTime);
    setTimeout(function() {
      window.elevatorIsMoving = false;
      window.currentFloor = floorNumber;
      // for(var i = 0; $('.floor-number-display').length; i++) {
      //   var display = $('.floor-number-display')[i];
      //   debugger;
      //   $(display).text(i+1);
      // }
      // TODO determine which button to de-light
      $('.up-button[data-floor='+floorNumber+']').removeClass('lit');
      $('.down-button[data-floor='+floorNumber+']').removeClass('lit');
    }, this.animationTime);
  };

  this.getFloor = function(floorNumber) {
    return $('.floor[data-floor='+floorNumber+']')
  };

  this.direction = function() {
    return window.lastFloor > window.currentFloor ? 'down' : 'up'
  };

  this._initFloors = function() {
    for(var i = 0; i < this.numFloors; i++) {
      var floorArgs = {
        floorNumber: i,
        totalFloors: this.numFloors
      };
      var floor = new Floor(floorArgs);
      // floor.init()

      var panelArgs = {
        floorNumber: i+1,
        elevator: this
      };
      var panel = new ControlPanel(panelArgs);
      panel.init();

      var floorNumberDisplayArgs = {
        floorLocation: i+1,
        elevator: this
      };

      var floorNumberDisplay = new FloorNumberDisplay(floorNumberDisplayArgs);
      floorNumberDisplay.init();
    }
  };
}


////////////////////
//      FLOOR     //
////////////////////


function Floor(args) {
  if(args === undefined) {
    throw('Cannot init floor without arguments')
  }
  if(args['floorNumber'] === undefined) {
    throw('Cannot init a floor without floorNumber')
  }

  this.floorNumber = args['floorNumber'];
  this.totalFloors = args['totalFloors'];

  this.init = function() {
    var floorElement = $('<div class="floor"></div>');
    $('body').append(floorElement);

    if(this.floorNumber === 0) {
      this.marginBottom = 5;
    } else {
      // this.marginBottom = this.totalFloors * ;
    }

    floorElement.css({
      'marginBottom': this.marginBottom
    })

    $('body').append(floorElement);
  }
}


////////////////////
// CONTROL PANEL  //
////////////////////


function ControlPanel(args) {
  this.floorNumber = args['floorNumber'];
  this.elevator = args['elevator'];
  this.floorBottom = $('.floor[data-floor='+this.floorNumber+']').css('bottom');
  this.elevatorElement = $(".elevator");

  this.init = function() {
    this.panelElement = $("<div class='control-panel'><div class='up-button panel-button' data-floor="+this.floorNumber+"></div><div class='down-button panel-button' data-floor="+this.floorNumber+"></div></div>");
    this.panelElement.css({
      'bottom': parseInt(this.floorBottom) + 30 + 'px',
      'marginLeft': parseInt(this.elevatorElement.css('marginLeft')) + 30 + parseInt(this.elevatorElement.css('width')) + 'px'
    });

    $('body').append(this.panelElement);

    $.proxy(function() {
      this.panelElement.find('.up-botton').click(function(event) {
        this.panelElement.find('.up-botton').addClass('lit');
        this.elevator.enqueueUpFloor(floorNumber);
      });
    }, this);
    this.bindUpButtonListener(this.panelElement.find('.up-button'), this.elevator);
    this.bindDownButtonListener(this.panelElement.find('.down-button'), this.elevator);
  };

  this.bindUpButtonListener = function(element, elevator) {
    $(element).click(function(event) {
      element.addClass('lit');
      var floorNumber = $(event.currentTarget).data('floor');
      elevator.enqueueUpFloor(floorNumber);
      // elevator.enqueueFloor()
    })
  };

  this.bindDownButtonListener = function(element, elevator) {
    $(element).click(function(event) {
      element.addClass('lit');
      var floorNumber = $(event.currentTarget).data('floor');
      elevator.enqueueDownFloor(floorNumber);
    })
  };

}

//////////////////////////
// FLOOR NUMBER DISPLAY //
//////////////////////////

function FloorNumberDisplay(args) {
  this.floorLocation = parseInt(args['floorLocation']);
  this.elevator = args['elevator'];
  this.aboveFloorElement = this.elevator.getFloor(this.floorLocation + 1);

  this.init = function() {
    this.element = $('<div class="floor-number-display">'+window.currentFloor+'</div>');
    this.element.css({
      'bottom': (parseInt(this.aboveFloorElement.css('bottom')) - 50) + 'px'
    });
    $('body').append(this.element);
  }
}


////////////////////
//    HELPERS     //
////////////////////

function maxArray(array) {
  return array.sort()[array.length - 1];
}