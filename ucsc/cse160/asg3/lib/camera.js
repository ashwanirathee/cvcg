class Camera {
    constructor(g_eye, g_at, g_up, field_angle, asp_ratio, near_plane, far_plane) {
        console.log("Camera");
        this.cameraX = g_eye[0];
        this.cameraY = g_eye[1];
        this.cameraZ = g_eye[2];

        this.directionX = g_at[0];
        this.directionY = g_at[1];
        this.directionZ = g_at[2];

        this.upX = 0;
        this.upY = 1;
        this.upZ = 0;

        this.pitch = 0;
        this.yaw = -Math.PI/2;
        this.roll = 0;

        this.fov = field_angle;
        this.aspect = asp_ratio;
        this.near = near_plane;
        this.far = far_plane;
        this.mode = null;

        this.projMat = new Matrix4();
        this.viewMat = new Matrix4();

        this.projMat.setPerspective(this.fov, this.aspect, this.near, this.far);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projMat.elements);

        this.viewMat.setLookAt(this.cameraX, this.cameraY,this.cameraZ,this.directionX, this.directionY, this.directionZ,this.upX, this.upY, this.upZ);
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);

        console.log("Camera Initialized")
    }

    update(){
        this.projMat = new Matrix4();
        this.viewMat = new Matrix4();
        this.projMat.setPerspective(this.fov, this.aspect, this.near, this.far);
        this.viewMat.setLookAt(this.cameraX, this.cameraY,this.cameraZ,this.directionX, this.directionY, this.directionZ,this.upX, this.upY, this.upZ);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projMat.elements);
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }



    changeFov (fov) {
        this.fov = fov;
        this.updateProjectiveMatrix();
    }

    updateProjectionMatrix () {
        this.projMat.setPerspective(this.fov, this.aspect, this.near, this.far);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projMat.elements);
        // gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projMat.elements);
        // gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }

    moveForward (step) {
        // this.move(step, 0);
        // co
        this.cameraX += step * this.directionX;
        this.cameraY += step * this.directionY;
        this.cameraZ += step * this.directionZ;

        this.viewMat.setLookAt(
            this.cameraX, this.cameraY, this.cameraZ,
            this.directionX + this.cameraX, this.directionY + this.cameraY, this.directionZ + this.cameraZ,
            this.upX, this.upY, this.upZ);
        
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }

    moveBackward (step) {
        this.cameraX -= step * this.directionX;
        this.cameraY -= step * this.directionY;
        this.cameraZ -= step * this.directionZ;

        this.viewMat.setLookAt(
            this.cameraX, this.cameraY, this.cameraZ,
            this.directionX + this.cameraX, this.directionY + this.cameraY, this.directionZ + this.cameraZ,
            this.upX, this.upY, this.upZ);
        
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);

    }

    moveLeft (step) {
        // We do the cross product to get the right vector (according to the camera)
        let crossX = this.directionY * this.upZ - this.directionZ * this.upY;
        let crossY = this.directionX * this.upZ - this.directionZ * this.upX;
        let crossZ = this.directionX * this.upY - this.directionY * this.upX;

        // Then we normalize it otherwise it may return different vectors based on the direction vector
        let length = Math.sqrt(crossX**2 + crossY**2 + crossZ**2);

        let normX = crossX / length;
        let normY = crossY / length;
        let normZ = crossZ / length;

        this.cameraX -= normX * step;
        this.cameraY -= normY * step;
        this.cameraZ -= normZ * step;

        this.viewMat.setLookAt(
            this.cameraX, this.cameraY, this.cameraZ,
            this.directionX + this.cameraX, this.directionY + this.cameraY, this.directionZ + this.cameraZ,
            this.upX, this.upY, this.upZ);
        
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }

    moveRight (step) {
        // We do the cross product to get the right vector (according to the camera)
        let crossX = this.directionY * this.upZ - this.directionZ * this.upY;
        let crossY = this.directionX * this.upZ - this.directionZ * this.upX;
        let crossZ = this.directionX * this.upY - this.directionY * this.upX;

        // Then we normalize it otherwise it may return different vectors based on the direction vector
        let length = Math.sqrt(crossX**2 + crossY**2 + crossZ**2);

        let normX = crossX / length;
        let normY = crossY / length;
        let normZ = crossZ / length;

        this.cameraX += normX * step;
        this.cameraY += normY * step;
        this.cameraZ += normZ * step;

        this.viewMat.setLookAt(
            this.cameraX, this.cameraY, this.cameraZ,
            this.directionX + this.cameraX, this.directionY + this.cameraY, this.directionZ + this.cameraZ,
            this.upX, this.upY, this.upZ);
        
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }

    panYaw(anglechange){
        let toRad = Math.PI/180;
        // this.yaw += anglechange * toRad;
        // console.log(this.yaw, this.pitch)
        this.constrainPitch = true
        if (this.constrainPitch) {
            if (this.pitch > (Math.PI/2.0) - Math.PI/180.0)
                this.pitch = (Math.PI / 2.0) - Math.PI / 180.0;
            if (this.pitch < -((Math.PI / 2.0) - Math.PI / 180.0))
                this.pitch = -((Math.PI / 2.0) - Math.PI / 180.0);
        }
        // console.log(Math.cos(this.yaw) * Math.cos(this.pitch));
        // console.log(Math.sin(this.pitch));
        // console.log(Math.sin(this.yaw) * Math.cos(this.pitch))
        var front = new Vector3([Math.cos(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch),  Math.sin(this.yaw) * Math.cos(this.pitch)])
        console.log(front)
        front.normalize();
        console.log(front)
        
        this.directionX = front[0];
        this.directionY = front[1];
        this.directionZ = front[2];

        var worldUp = new Vector3([0,0,1]);
        var right = Vector3.cross(front, worldUp);
        right.normalize();


        var camUp = Vector3.cross(right, front);
        camUp.normalize();
        this.upX = camUp[0];
        this.upY = camUp[1];
        this.upZ = camUp[2]

        this.viewMat.setLookAt(
            this.cameraX, this.cameraY, this.cameraZ,
            this.directionX + this.cameraX, this.directionY + this.cameraY, this.directionZ + this.cameraZ,
            this.upX, this.upY, this.upZ);
        
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }

    moveTo (x, y, z) {
        this.cameraX = x;
        this.cameraY = y;
        this.cameraZ = z;
        this.updateViewMatrix();
    }

    headTo (rx, ry, rz) {
        this.pitch = rx;
        this.yaw = ry;
        this.roll = rz;
        this.updateViewMatrix();
    }

    move (step, direction) {
        // step, 0.001
        // direction, 0
        if (direction === 1 || direction === 2) step *= -1;

        if (direction === 0 || direction === 1) {
            console.log("After:", this.cameraX, this.cameraY, this.cameraZ)
            this.cameraX += step * this.directionX;
            this.cameraY += step * this.directionY;
            this.cameraZ += step * this.directionZ;
            console.log("Before:", this.cameraX, this.cameraY, this.cameraZ)
        } else {
            // We do the cross product to get the right vector (according to the camera)
            let crossX = this.directionY * this.upZ - this.directionZ * this.upY;
            let crossY = this.directionX * this.upZ - this.directionZ * this.upX;
            let crossZ = this.directionX * this.upY - this.directionY * this.upX;

            // Then we normalize it otherwise it may return different vectors based on the direction vector
            let length = Math.sqrt(crossX**2 + crossY**2 + crossZ**2);

            let normX = crossX / length;
            let normY = crossY / length;
            let normZ = crossZ / length;

            this.cameraX += normX * step;
            this.cameraY += normY * step;
            this.cameraZ += normZ * step;
        }
        this.updateViewMatrix();
    }

    rotateX(alpha) {
        this.pitch += alpha;
        if (this.pitch > 89) this.pitch = 89;
        if (this.pitch < -89) this.pitch = -89;
        this.updateViewMatrix();
    }

    rotateY(alpha) {
        this.yaw += alpha;
        this.updateViewMatrix();
    }

    rotateZ (alpha) {
        this.roll += alpha;
        this.updateViewMatrix();
    }

    setFirstPerson (x, y, z, lx, ly, lz) {
        // Move the camera to the player's eyes
        this.cameraX = x;
        this.cameraY = y;
        this.cameraZ = z;

        // Set the rotation to 0
        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;

        // Change what the camera is looking at
        this.directionX = lx;
        this.directionY = ly;
        this.directionZ = lz;

        // Change the mode
        this.mode = Camera.FIRST_PERSON;

        this.updateViewMatrix();
    }

    updateViewMatrix() {
        this.viewMatrix = new Matrix4();
        let toRad = Math.PI/180;
        // Calculate direction according to pitch and yaw
        // this.directionX = Math.cos(this.yaw * toRad) * Math.cos(this.pitch * toRad);
        // this.directionY = Math.sin(this.pitch * toRad);
        // this.directionZ = Math.sin(this.yaw * toRad) * Math.cos(this.pitch * toRad);

        // // Calculate up vector according to roll
        // if (this.roll !== this.lastRoll) {
        //     this.upX = this.upX * Math.cos(this.roll * toRad) - this.upY * Math.sin(this.roll * toRad);
        //     this.upY = this.upX * Math.sin(this.roll * toRad) + this.upY * Math.cos(this.roll * toRad);
        //     this.lastRoll = this.roll;
        // }

        this.viewMat.lookAt(
            this.cameraX, this.cameraY, this.cameraZ,
            this.directionX + this.cameraX, this.directionY + this.cameraY, this.directionZ + this.cameraZ,
            this.upX, this.upY, this.upZ);
        
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }
}