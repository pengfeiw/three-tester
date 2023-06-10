import {AxesHelper, GridHelper, DirectionalLightHelper, Color, Scene, BoxGeometry, BufferGeometry, Mesh, WebGLRenderer, PerspectiveCamera, DirectionalLight, MeshStandardMaterial, ColorRepresentation, AmbientLight, MeshBasicMaterial} from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {setSize} from "./util/resizeWindow";
import GUI from "lil-gui";

const gui = new GUI();

const createScene = (container: Element) => {
    const renderer = new WebGLRenderer({
        antialias: true
    });
    container.appendChild(renderer.domElement);
    const scene = new Scene();
    scene.background = new Color(0xFFFFFF);
    const color = { color: 0xFFFFFF};
    const folder = gui.addFolder("Scene");
    folder.addColor(color, "color").name("background color").onChange((value: number) => {
        scene.background = new Color(value);
    });
    return { renderer, scene };
};

const createCamera = (container: Element, renderer: WebGLRenderer) => {
    const fov = 45;
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new PerspectiveCamera(fov, aspect, 0.1, 10000);
    camera.position.set(0, 0, 10);
    const orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.update();

    return { camera, orbitControls};
};

const createCube = (uiName: string, color: ColorRepresentation, x: number) => {
    const w = 1, h = 1, d = 1;
    const geo = new BoxGeometry(w, h, d);
    const mat = new MeshStandardMaterial({color});
    const basicMat = new MeshBasicMaterial({color});
    const cube = new Mesh<BufferGeometry, MeshStandardMaterial | MeshBasicMaterial>(geo, mat);
    cube.position.x = x;
    cube.position.y = 0.5;
    const folder = gui.addFolder(uiName);

    folder.addColor(basicMat, "color").onChange((value: number) => {
        cube.material.color.set(value);
        cube.material.needsUpdate = true;
    });

    const _matFlag = {
        useStandardMat: true
    };

    folder.add(_matFlag, "useStandardMat").name("affected by light").onChange((useStandardMat: boolean) => {
        const color = cube.material.color;
        if (!useStandardMat) {
            const mat = new MeshBasicMaterial({color});
            cube.material = mat;
        } else {
            const mat = new MeshStandardMaterial({color});
            cube.material = mat;
        }
        cube.material.needsUpdate = true;
    });

    return cube;
};

const createDirectionLight = () => {
    const directionalLight = new DirectionalLight(0xFFFFFF);
    directionalLight.position.set(5, 5, 5);
    directionalLight.intensity = 0.2;
    const directionalLightHelper = new DirectionalLightHelper(directionalLight, 1, 0xFF0000);
    const onChange = () => {
        directionalLight.target.updateMatrixWorld();
        directionalLightHelper.update();
    };
    const lightUI = gui.addFolder("DirectionLight");
    lightUI.addColor(directionalLight, "color");
    lightUI.add(directionalLight, "intensity", 0, 10);
    const lightPositionUI = lightUI.addFolder("Position");
    lightPositionUI.add(directionalLight.position, "x", -5, 5).onChange(onChange);
    lightPositionUI.add(directionalLight.position, "y", -5, 5).onChange(onChange);
    lightPositionUI.add(directionalLight.position, "z", -5, 5).onChange(onChange);

    return { directionalLight, directionalLightHelper};
};

const createAmbientLight = () => {
    const light = new AmbientLight(0xFFFFFF);
    light.intensity = 0.5;
    const lightUI = gui.addFolder("AmbientLight")
    lightUI.addColor(light, "color");
    lightUI.add(light, "intensity", 0, 10);
    return light;
};

const createGrid = () => {
    const grid = new GridHelper(1000, 1000);
    return grid;
};

const createAxes = () => {
    const axes = new AxesHelper(3);
    return axes;
};

((container: Element) => {
    const { renderer, scene } = createScene(container);
    const { directionalLight, directionalLightHelper } = createDirectionLight();
    scene.add(directionalLight, directionalLightHelper);
    scene.add(createAmbientLight());
    [
        createCube("cube1", "red", -3),
        createCube("cube2", "green", 0),
        createCube("cube3", "blue", 3),
    ].forEach((cube) => scene.add(cube));
    scene.add(new GridHelper());
    scene.add(createGrid());
    scene.add(createAxes());

    const { orbitControls, camera } = createCamera(container, renderer);
    scene.add(camera);
    setSize(container, camera, renderer);

    function animate() {
        requestAnimationFrame( animate );
        orbitControls.update();
        renderer.render( scene, camera );
    }
    animate();

    window.addEventListener("resize", () => setSize(container, camera, renderer));
})(document.body);
