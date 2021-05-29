class Tools {
    static initShader(gl){
        this.gl = gl
        this.canvas = gl.canvas
        this.vs = require("./vertex-shader.glsl").default
        this.fs = require("./fragment-shader.glsl").default
        let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.vs)
        let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fs)
        let program = this.createProgram(gl, vertexShader, fragmentShader)
        gl.useProgram(program)
        this.program = program

        // buffer 存放数据
        let positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        let positions = [-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

        // 设置attribute
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position")
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    static setImage(image) {
        let gl = this.gl
        this.image = image
        this.idx = 0;
        this.textures = [];
        this.frameBuffers = [];
        this.canvas.width = this.image.width
        this.canvas.height = this.image.height

        this.textures.push(this.createAndSetupTexture(gl));
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        this.textures.push(this.createAndSetupTexture(gl));
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        for(let i=0; i<2; i++){
            let fbo = gl.createFramebuffer();
            this.frameBuffers.push(fbo);
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[i], 0);
        }
        this.processUniformLocation = gl.getUniformLocation(this.program, "u_process");
        this.radiusUniformLocation = gl.getUniformLocation(this.program, "u_radius");
        this.moveUniformLocation = gl.getUniformLocation(this.program, "u_move");
        this.centerUniformLocation = gl.getUniformLocation(this.program, "u_center");
        this.resolutionUniformLocation = gl.getUniformLocation(this.program, "u_resolution")
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        this.processImage()
    }

    static processImage(center_x=0, center_y=0, move_x=0, move_y=0, radius=0.2){
        // 进行图像处理
        let gl = this.gl
        this.idx_f = (this.idx + 1) % 2
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[this.idx_f])
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.idx])
        gl.uniform2f(this.centerUniformLocation, center_x, center_y) // 鼠标点击中心
        gl.uniform2f(this.moveUniformLocation, move_x, move_y); // 移动距离
        gl.uniform2f(this.resolutionUniformLocation, this.image.width, this.image.height); // 图像分辨率
        gl.uniform1f(this.processUniformLocation, true)
        gl.uniform1f(this.radiusUniformLocation, radius);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // 渲染最终结果
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.idx_f]);
        gl.uniform1f(this.processUniformLocation, false);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    static next(){
        this.idx = (this.idx + 1) % 2
    }

    // 创建着色器方法
    static createShader(gl, type, source) {
        let shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader
        }
        console.log(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
    }

    // 创建程序
    static createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program
        }
        console.log(gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
    }

    // 创建texture
    static createAndSetupTexture(gl) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // 设置材质，这样我们可以对任意大小的图像进行像素操作
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        return texture;
    }
}

export default Tools
