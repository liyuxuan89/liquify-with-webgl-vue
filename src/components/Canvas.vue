<template>
  <div id="canvas-container">
    <canvas id="canvas"
            :style="{transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}, ${scale})`}"
            @mousedown="mouseDown($event)"
            @mousemove="mouseMove($event)"
            @mouseup="mouseUp"
            @mouseout="mouseUp"
    ></canvas>
    <ol id="canvas-sidebar">
      <li @click="mode = 0" :class="{selected: mode === 0}"><img src="../assets/arrow.png" width=20></li>
      <li @click="mode = 1" :class="{selected: mode === 1}"><img src="../assets/liquify.png" width=20></li>
      <li @click="zoom"><img src="../assets/zoom.png" width=20></li>
      <li @click="shrink"><img src="../assets/shrink.png" width=20></li>
      <li @click="resetScale"><img src="../assets/org.png" width=20></li>
      <li @click="upload">
        <input id="image-upload" type="file" accept="image/png, image/jpeg"
               style="display: none" @change="display($event)">
        <img src="../assets/upload.png" width=20>
      </li>
      <li @click="save"><img src="../assets/save.png" width=20></li>
    </ol>
    <a id="download-link" style="display: none"></a>
  </div>
</template>

<script>
import Tools from "@/lib/tools";
export default {
  name: "Canvas",
  data: function () {
    return {
      canvas: {},
      ctx : {},
      image: {},
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      down: false,
      mode: 0, // 0 拖拽 1 液化
    }
  },
  mounted() {
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext("webgl", {preserveDrawingBuffer: true})
    Tools.initShader(this.ctx)
    //this.ctx = this.canvas.getContext("2d")
    this.image = new Image()
    this.image.src = require("../assets/test.jpg")
    this.image.onload = () => {
      Tools.setImage(this.image)
      this.resetScale()
    }
  },
  methods: {
    resetScale(){
      let scale_x = window.innerWidth / this.image.width
      let scale_y = window.innerHeight / this.image.height
      this.scale = scale_x < scale_y ? scale_x : scale_y
      this.offsetX = (window.innerWidth - this.image.width * this.scale) / 2
      this.offsetY = (window.innerHeight - this.image.height * this.scale) / 2
    },
    upload(){
      document.getElementById("image-upload").click()
    },
    display(e){
      let file = e.target.files[0]
      let re = new FileReader()
      re.readAsDataURL(file)
      re.onload = event => {
        this.image.src = event.target.result
        document.getElementById("image-upload").value = null
      }
    },
    save(){
      let link = document.getElementById(`download-link`)
      link.href = this.canvas.toDataURL();
      link.download = "output.png";
      link.click()
    },
    zoom() {
      this.scale += 0.1
    },
    shrink() {
      this.scale -= 0.1
    },
    mouseDown(e){
      this.down = true
      this.startX = e.x
      this.startY = e.y
      this.startOffsetX = this.offsetX
      this.startOffsetY = this.offsetY
    },
    mouseMove(e) {
      if(this.down && this.mode === 0){
        this.offsetX = this.startOffsetX + e.x - this.startX
        this.offsetY = this.startOffsetY + e.y - this.startY
      }
      else if(this.down && this.mode === 1) {
        let startX = (this.startX - this.offsetX)/  (this.canvas.width*this.scale) * 2 - 1
        let startY = (this.startY - this.offsetY) / (this.canvas.height*this.scale) * 2 - 1
        let x = (e.x - this.offsetX) / (this.canvas.width*this.scale) * 2 - 1
        let y = (e.y - this.offsetY) / (this.canvas.height*this.scale) * 2 - 1
        // startY = -startY
        // y = -y
        Tools.processImage(startX, startY, x - startX, y - startY)
      }
    },
    mouseUp(){
      this.down = false
      if(this.mode === 1){
        let startX = (this.startX - this.offsetX)/  (this.canvas.width*this.scale) * 2 - 1
        let startY = (this.startY - this.offsetY) / (this.canvas.height*this.scale) * 2 - 1
        Tools.next(startX, startY)
      }
    }
  }
}
</script>

<style scoped>

#canvas-container{
  background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0.01) 10%),
  linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0.01) 10%);
  background-size: 10px 10px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

#canvas{
  position: absolute;
  margin: 0;
  padding: 0;
  transform-origin: top left;
}

ol {
  list-style:none;
  position: absolute;
  left: 2px;
  top: 50%;
  width: 40px;
  padding: 0;
  z-index: 100;
  border: 2px solid white;
  border-radius: 4px;
  box-shadow: 3px 3px 3px #888888;
  transform: translate(0, -50%);
}

li {
  padding: 10px 10px 10px 10px;
  background-color: white;
}

li:hover, li.selected{
  background-color: whitesmoke;
}

</style>
