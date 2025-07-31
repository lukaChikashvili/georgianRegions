import * as THREE from 'three'

export class RopeCurve extends THREE.Curve {
    constructor(start, end) {
        super();
        this.start = new THREE.Vector3(...start);
        this.end = new THREE.Vector3(...end);

    }

    getPoint(t) {
        const point = new THREE.Vector3().lerpVectors(this.start, this.end, t);

        const sag = Math.sin(Math.PI * t) * -1.5;
        point.y += sag;


        return point;
    }
}