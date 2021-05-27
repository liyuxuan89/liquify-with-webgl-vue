<template>
  <div id="canvas-container">
    <canvas id="canvas" :style="{transform: `translate(${offset_x}px, ${offset_y}px) scale(${scale}, ${scale})`}"></canvas>
    <ol id="canvas-sidebar">
      <li><img src="../assets/zoom.png" width=20></li>
      <li><img src="../assets/shrink.png" width=20></li>
      <li><img src="../assets/org.png" width=20 @click="reset"></li>
    </ol>
  </div>
</template>

<script>
export default {
  name: "Canvas",
  data: function () {
    return {
      canvas: {},
      ctx : {},
      gl : {},
      image: {},
      scale: 1,
      offset_x: 0,
      offset_y: 0
    }
  },
  mounted() {
    this.canvas = document.getElementById("canvas")
    //this.gl = this.canvas.getContext("webgl")
    this.ctx = this.canvas.getContext("2d")
    this.image = new Image()
    this.image.src = require("../assets/test.jpg")
    this.image.onload = () => {
      this.reset()
    }
  },
  methods: {
    reset(){
      this.canvas.width = this.image.width
      this.canvas.height = this.image.height
      this.ctx.drawImage(this.image, 0, 0)
      let scale_x = window.innerWidth / this.image.width
      let scale_y = window.innerHeight / this.image.height
      this.scale = scale_x < scale_y ? scale_x : scale_y
      this.offset_x = (window.innerWidth - this.image.width) / 2
      this.offset_y = (window.innerHeight - this.image.height) / 2
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
}

#canvas{
  position: absolute;
  margin: 0;
  padding: 0;
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

li:hover{
  background-color: whitesmoke;
}

</style>
