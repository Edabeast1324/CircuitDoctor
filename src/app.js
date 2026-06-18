const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const wglogo = document.querySelector('.wglogo');
const cdlogo = document.querySelector('.cdlogo');

wglogo.addEventListener('animationend', () => {
    wglogo.classList.remove('fade');
    cdlogo.classList.add('fade');
}, { once: true });

cdlogo.addEventListener('animationend', () => {
    cdlogo.classList.remove('fade');
    createScene().then(scene => {
        engine.runRenderLoop(() => { scene.render(); });
    });
}, { once: true });

wglogo.classList.add('fade');

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(1, 0, 0.41, 1); // Dark backdrop

    // 1. Create a standard mouse/trackpad controlled camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // 2. Add realistic ambient studio lighting for CAD parts
    const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light1.intensity = 1.2;
    const light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(1, -1, -1), scene);
    light2.intensity = 0.8;

    // 3. Load your FreeCAD binary export file from your local src folder
    // Change "circuitboard.glb" to your exact file name
    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./3d/", "hi.glb", scene);

    // 4. Automatically center and scale the camera tracking view onto your model
    if (result.meshes.length > 0) {
        // Create a bounding box around all imported shapes
        const boundingInfo = result.meshes[0].getHierarchyBoundingVectors(true);
        const lookAtPoint = BABYLON.Vector3.Center(boundingInfo.min, boundingInfo.max);

        // Point the camera and light directly at the geometric center of your model
        camera.setTarget(lookAtPoint);
        light2.setDirectionToTarget(lookAtPoint);
    }

    return scene;
};

window.addEventListener("resize", () => { engine.resize(); });
