const selectors = {
  canvas: document.querySelector('#vortex'),
  modulus: document.querySelector("#modulus"),
  multiplier: document.querySelector("#multiplier")

}


const {x, y, r} = {
  x: 250,
  y: 250,
  r: 50
}

const ctx = selectors.canvas.getContext('2d');
const endPoints = new Map()
console.log(ctx)

function findEndPoints (angle, radius = r) {
  return [x + Math.cos(angle) * radius,y + Math.sin(angle) * radius]
}

function drawDot(dotX, dotY) {
  ctx.beginPath();
  ctx.arc(dotX, dotY, 3, 0 , Math.PI *2)
  ctx.fill()
}

function drawText (textX, textY, textContent,) {
  ctx.beginPath()
  ctx.fillText(textContent, textX, textY)
}

function drawCircle(multiplier){
    ctx.beginPath();
    console.log("hi")
    for (let i = 0; i < multiplier; i++){
      ctx.arc(x, y, r,  ((Math.PI * 2) / multiplier) * i, ((Math.PI * 2) / multiplier ) * (i+1));
      endPoints.set(i+1, ((Math.PI * 2) / multiplier ) * (i+1))
    }
    ctx.stroke()
    createIndexes()
    drawLines(selectors.modulus.valueAsNumber, 1)

}


function createIndexes(){
  let dotsCordinates = []
  let numbersCordinates = []
  endPoints.forEach((endPoint, index )=> {
    dotsCordinates.push(findEndPoints(endPoint))
    numbersCordinates.push([findEndPoints(endPoint, r+12), index])
  })
  dotsCordinates.forEach(cordinates => {
    drawDot(...cordinates)
  })
  numbersCordinates.forEach(numberItem => {
    drawText(...numberItem.flat(1))
  })

}




let seenedPoints = []
function drawLines(modulus, startingPoint){
  console.log(modulus)
  ctx.beginPath()
  const pointsCordinates = new Map()
  endPoints.forEach((endPoint, index )=> {
    pointsCordinates.set(index,findEndPoints(endPoint))
  })
  let startingCordinates = pointsCordinates.get(startingPoint)
  ctx.moveTo(startingCordinates[0], startingCordinates[1])
  let currentPoint = startingPoint
 do{
    seenedPoints.push(currentPoint)
    currentPoint = currentPoint * modulus
    while(currentPoint > selectors.multiplier.valueAsNumber){
      console.log(currentPoint)

      currentPoint = currentPoint % selectors.multiplier.valueAsNumber; 
      console.log(currentPoint)
    }

    if(currentPoint === 0 ) currentPoint = selectors.multiplier.valueAsNumber
    console.log(currentPoint)
    let newCordinates = pointsCordinates.get(currentPoint ) 
    ctx.lineTo(newCordinates[0], newCordinates[1])
    ctx.stroke()
    
  }
  while(!(seenedPoints.includes(currentPoint)))
  pointsCordinates.forEach((point, index) => {
   if (!(seenedPoints.includes(index)))
   drawLines(modulus, index)
  })

}






function createVortex(){
  seenedPoints= []
  ctx.clearRect(0, 0, selectors.canvas.width, selectors.canvas.height)
  endPoints.clear()
  drawCircle(selectors.multiplier.valueAsNumber)
}

selectors.multiplier.addEventListener("input",()=>{
  createVortex()
})
selectors.modulus.addEventListener("input", ()=> {
  createVortex()
})

