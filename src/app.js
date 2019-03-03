const canvas = document.getElementById("canvas")

document.getElementById('file').onchange = function() {
  let img = this.files[0]
  let reader = new FileReader()
  reader.readAsDataURL(img)
  reader.onload = function() {
    detectObjects(reader.result)
  }
}

function detectObjects(url) {
  let ctx = canvas.getContext('2d')
  let image = new Image()
  let debug_dom = document.getElementById("debug")
  image.src = url

  image.onload = () => {
    canvas.width = image.width
    canvas.height = image.height

    ctx.drawImage(image, 0, 0)
    cocoSsd.load().then(model => {
      model.detect(canvas).then(predictions => {
        for (var i = 0; i < predictions.length; i++) {
          var obj = predictions[i]
          var box = obj.bbox
          console.log(i)
          drawRect(box[0], box[1], box[2], box[3])
          drawLabel(
            obj["class"] +
            " : " +
            parseInt(obj["score"] * 100 ,10) +
            "%",
            box[0],
            box[1]
          )
        }
        debug_dom.innerHTML = JSON.stringify(predictions, null, "\t")
      });
    });
  }
}

function drawRect(x, y, w, h) {
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.rect(
    parseInt(x, 10),
    parseInt(y, 10),
    parseInt(w, 10),
    parseInt(h, 10)
  )
  ctx.strokeStyle = "rgb(50, 240, 60)"
  ctx.lineWidth = 8
  ctx.stroke()
  ctx.closePath()
}

function drawLabel(text, x, y) {
  var ctx = canvas.getContext('2d')

  ctx.beginPath()
  ctx.rect(x -5, y-20, 140, 20)
  ctx.fillStyle = "rgb(50, 240, 60)"
  ctx.fill()
  ctx.closePath()

  ctx.beginPath()
  ctx.font = "18px 'ＭＳ Ｐゴシック'"
  ctx.fillStyle = "red"
  ctx.fillText(text, parseInt(x, 10), parseInt(y, 10))
  ctx.closePath()
}
