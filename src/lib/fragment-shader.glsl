precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_scale;
uniform vec2 u_offset;
uniform vec2 u_move;
uniform vec2 u_center;
uniform vec2 u_resolution;
uniform float u_radius;
uniform bool u_process; // 是否进行图像处理
varying vec2 v_position; // 渲染位置
void main() {
    vec2 pos = v_position;
    if(!u_process){
        pos.y = -pos.y;
        pos = (pos + 1.0) / 2.0;
        gl_FragColor = texture2D(u_image, pos);
    } else {
        float dis = length(pos - u_center);
        if(dis > u_radius){
            pos = (pos + 1.0) / 2.0;
            gl_FragColor = texture2D(u_image, pos);
        } else {
            vec2 move = u_move;
            if(length(move) > 0.3 * u_radius) {
                move = move * u_radius / length(move) * 0.3;
            }
            pos = pos - move * (1.0 - dis / u_radius);
            pos = (pos + 1.0) / 2.0;
            pos = pos * u_resolution;
            vec2 pos1 = vec2(floor(pos.x), floor(pos.y));
            vec2 pos2 = vec2(floor(pos.x), ceil(pos.y));
            vec2 pos3 = vec2(ceil(pos.x), floor(pos.y));
            vec2 pos4 = vec2(ceil(pos.x), ceil(pos.y));
            vec4 c1 = texture2D(u_image, pos1 / u_resolution);
            vec4 c2 = texture2D(u_image, pos2 / u_resolution);
            vec4 c3 = texture2D(u_image, pos3 / u_resolution);
            vec4 c4 = texture2D(u_image, pos4 / u_resolution);
            // vec4 c12 = (pos.y - floor(pos.y)) * c2 + (ceil(pos.y) - pos.y) * c1; 这样数值稳定性差
            vec4 c12 = (pos.y - floor(pos.y)) * c2 + (1. - pos.y + floor(pos.y)) * c1;
            vec4 c34 = (pos.y - floor(pos.y)) * c4 + (1. - pos.y + floor(pos.y)) * c3;
            gl_FragColor = (pos.x - floor(pos.x)) * c34 + (1. - pos.x + floor(pos.x)) * c12;
        }

    }
}
