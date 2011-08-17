 Array.prototype.shuffle = function() {
 	var len = this.length;
	var i = len;
	 while (i--) {
	 	var p = parseInt(Math.random()*len);
		var t = this[i];
  	this[i] = this[p];
  	this[p] = t;
 	}
};
 
 function animatePulsate(canvas, image1, image2) {
   var ctx = canvas.getContext('2d')
   
  width = parseInt(canvas.getAttribute("width"));
  height = parseInt(canvas.getAttribute("height"));
 
  ctx.drawImage(image2, 0, 0)
  var imageData2 = ctx.getImageData(0, 0, width, height)
   
   ctx.drawImage(image1, 0, 0)
   
  var imageData1 = ctx.getImageData(0,0, width, height) 
  
  var buffer = ctx.createImageData(width, height)
  
  var MAX_STEPS = 25
  var direction = 1
  var step = 0
  
  function animate() {
    if( direction == 1) {
      if( step >= MAX_STEPS) {
        direction = -1
      }
    } else {
      if (step <= 0 ) {
        direction = +1
      }
    }
    step += direction
    
     var c = 0.5 - Math.cos(step / MAX_STEPS *  3.14159265  ) / 2
    for(var x = 0; x < width; x ++) {
       for(var y = 0; y < height; y ++) {
         var color1 = getPixel(imageData2, x, y)
         var color2 = getPixel(imageData1, x, y)

         var color = {}
           color.r = color1.r * c + color2.r * (1- c)
           color.g = color1.g * c + color2.g * (1- c)
           color.b = color1.b * c + color2.b * (1- c)
          color.a = color1.a * c + color2.a * (1- c)
          setPixel(buffer, x, y, color)
       }
     }
     
     ctx.putImageData(buffer, 0, 0)

   }
    setInterval(animate, 60)
 }
 
/////////////////////////////

function animateExplode(canvas, image1, image2) {
   var ctx = canvas.getContext('2d')
   
  // read the width and height of the canvas
  width = parseInt(canvas.getAttribute("width"));
  height = parseInt(canvas.getAttribute("height"));
 
   
  ctx.drawImage(image2, 0, 0)
  var imageData2 = ctx.getImageData(0, 0, width, height)
   
   ctx.drawImage(image1, 0, 0)
   
  var imageData1 = ctx.getImageData(0,0, width, height) 
  
  var buffer = ctx.createImageData(width + 1, height + 1) 
  
  var MAX_STEPS = 35
  var direction = 1
  var step = 0
  
  
  function initTargets(imageData) {
    var targets = []      
     for(var x = 0; x < imageData.width; x ++) {
       for(var y = 0; y < imageData.height; y ++) {
         targets.push([x,y])
       }
    }
    targets.shuffle()
    return targets
  }
  
  var targets = initTargets(imageData2)
  function animate() {
    
    if( direction == 1) {
      if( step >= MAX_STEPS) {
        direction = -1
        targets = initTargets(imageData2)
        
      }
    } else {
      if (step <= 0 ) {
        direction = +1
        targets = initTargets(imageData2)
      }
    }
    step += direction

     var c = 0.5 - Math.cos(step / MAX_STEPS *  3.14159265  ) / 2
    
    for(var x = 0; x < width; x ++) {
       for(var y = 0; y < height; y ++) {
         var targetCoord = targets[y*width + x]
         var targetX = targetCoord[0]
         var targetY = targetCoord[1]
         var color1 = getPixel(imageData2, targetX, targetY)
         var color2 = getPixel(imageData1, x, y)
         
         var dirX = targetX - x
         var dirY = targetY - y
         
         var currX = Math.round(x + dirX * c)
         var currY = Math.round(y + dirY * c)
         
         var color = {}
           color.r = color1.r * c + color2.r * (1- c)
           color.g = color1.g * c + color2.g * (1- c)
           color.b = color1.b * c + color2.b * (1- c)
          color.a = color1.a * c + color2.a * (1- c)
          setPixel(buffer, currX, currY, color)
       }
     }
     
     ctx.putImageData(buffer, 0, 0)

   }
    setInterval(animate, 50)
 }
 
 function setPixel(imageData, x, y, color) {
   var index = getIndex(imageData, x, y)
   var data = imageData.data
    data[index+0] = color.r;
    data[index+1] = color.g;
    data[index+2] = color.b;
    data[index+3] = color.a;
}

function getPixel(imageData, x, y) {
  var index = getIndex(imageData, x, y)
  return { 
    r: imageData.data[index+0],
    g: imageData.data[index+1],
    b: imageData.data[index+2],
    a: imageData.data[index+3],
    }
}

function getIndex(imageData, x, y) {
    return (x + y * imageData.width) * 4;  
}

function startDemo() {
   var canvasPulsate = document.getElementById('pulsate')
var canvasExplode = document.getElementById('explode')
   if(canvasPulsate.getContext) {
    var chromeImage = document.getElementById("chrome-logo")
    var firefoxImage = document.getElementById('firefox-logo')

     animateExplode(canvasExplode, chromeImage, firefoxImage)
     animatePulsate(canvasPulsate, chromeImage, firefoxImage)
   } else {
    console.log("Canvas not supported")
   }
 }