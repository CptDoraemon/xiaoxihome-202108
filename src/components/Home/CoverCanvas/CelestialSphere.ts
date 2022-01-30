import * as BABYLON from 'babylonjs';

interface StarData {
  rightAscension: number[];
  declination: number[];
  apparentMagnitude: number[];
  colorIndexBV: number[];
  color: number[][];
  asterismIndices: number[];
}

class CelestialSphere extends BABYLON.TransformNode {

  private _starData: StarData;

  private _radius: number;

  private _starLimit: number; // Show this many of the brightest stars as mapped triangles.
  private _starScale: number; // 0.4 // Size of largest star (larger/brighter stars are factors of this number).

  private _showAsterisms: boolean;
  private _asterismColor: BABYLON.Color3;

  private _twinkleStars: boolean = true;

  private declinationCutoff = 0.1; // only show the stars above this angle
  private declinationMax = 1.2; // 1.56 calculated from starData, but won't see if too high
  private declinationMin = -1.55; // calculated from starData
  private opacityUvs: number[][] = [];

  constructor(name: string, scene: BABYLON.Scene, starData: StarData, radius: number, starLimit: number, starScale: number, showAsterisms: boolean, asterismColor: BABYLON.Color3, twinkleStars: boolean) {

    super(name, scene);

    this._starData = starData;
    this._radius = radius;
    this._starLimit = starLimit;
    this._starScale = starScale;
    this._showAsterisms = showAsterisms;
    this._asterismColor = asterismColor;
    this._twinkleStars = twinkleStars;

    // Add empty celestial sphere mesh.
    let starMesh = new BABYLON.Mesh('starMesh', scene);
    starMesh.parent = this;
    starMesh.alphaIndex = 20;

    // Mesh vertex data arrays.
    let positions = [];
    let indices = [];
    let colors = [];
    let uvs: number[] = [];
    let uvs2 = [];

    let vertexIndex = 0;

    // filter stars
    const filteredStarData: StarData = {
      rightAscension: [],
      declination: [],
      apparentMagnitude: [],
      colorIndexBV: [],
      color: [],
      asterismIndices: []
    };
    this._starData.declination.forEach((dec, i) => {
      if (dec > this.declinationCutoff) {
        filteredStarData.rightAscension.push(this._starData.rightAscension[i]);
        filteredStarData.declination.push(dec);
        filteredStarData.apparentMagnitude.push(this._starData.apparentMagnitude[i]);
        filteredStarData.colorIndexBV.push(this._starData.colorIndexBV[i]);
      }
    });
    filteredStarData.color = this._starData.color;
    filteredStarData.asterismIndices = this._starData.asterismIndices;
    this._starData = filteredStarData;

    // init opacity UVs
    const base = [0.5, 1.0, 0.0, 0.0, 1.0, 0.0];
    const grid = 0.33;
    for (let col=2; col>=0; col--) {
      for (let row = 0; row < 3; row++) {
        this.opacityUvs.push(base.map((num, i) => {
          return i % 2 === 0 ?
            grid * (row + num) : //u
            grid * (col + num);  //v
        }))
      }
    }

    // Populate vertex data arrays for each star.
    const numberOfStars = Math.min(this._starData.rightAscension.length, this._starLimit);
    for (let starIndex = 0; starIndex < numberOfStars; starIndex++) {

      // Star celestial coordinates.
      let ra = this._starData.rightAscension[starIndex]; // eastward in radians (around Y axis - yaw)
      let dec = this._starData.declination[starIndex]; // north-south in radians (around X axis - pitch)

      // Star scale factor (based on apparent magnitude).
      var s = this._starScaleFactor(starIndex);

      // Create star vertices around +Z axis & scale to size.
      let v1 = new BABYLON.Vector3( 0.0 * s,  0.7 * s, this._radius);
      let v2 = new BABYLON.Vector3(-0.5 * s, -0.3 * s, this._radius);
      let v3 = new BABYLON.Vector3( 0.5 * s, -0.3 * s, this._radius);

      // Rotate vertices into position on celestial sphere.
      let rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(-ra, -dec, 0);
      v1 = BABYLON.Vector3.TransformCoordinates(v1, rotationMatrix);
      v2 = BABYLON.Vector3.TransformCoordinates(v2, rotationMatrix);
      v3 = BABYLON.Vector3.TransformCoordinates(v3, rotationMatrix);

      // Add vertex positions.
      positions.push(
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z
      );

      // Add vertex color.
      let c = this._starColor(starIndex);
      colors.push(
        c.r, c.g, c.b, c.a,
        c.r, c.g, c.b, c.a,
        c.r, c.g, c.b, c.a
      );

      // Add star texture UV coordinates.
      // used by opacity texture
      const clampedDec = Math.min(dec, this.declinationMax);
      const opacityAtThisDec1 = Math.floor(
        ((clampedDec - this.declinationCutoff) / ((this.declinationMax + 0.01) - this.declinationCutoff)) * 10
      ); // 0-9
      const opacityAtThisDec2 = Math.floor(opacityAtThisDec1 * 0.9) // 0-8;
      this.opacityUvs[opacityAtThisDec2].forEach(num => uvs.push(num));

      // Add 'twinkle' (noise) texture UV coordinates.
      let u = Math.random();
      let v = Math.random();
      uvs2.push(u, v, u, v, u, v);

      // Add indices.
      indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
      vertexIndex += 3;
    }

    // Create & assign vertex data to mesh.
    let vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.colors = colors;
    vertexData.uvs = uvs;
    vertexData.uvs2 = uvs2;
    vertexData.applyToMesh(starMesh);

    // Create & assign star material.
    let starMaterial = new BABYLON.StandardMaterial('starMaterial', scene);
    let opacityTexture = new BABYLON.Texture('/assets/star/starWithLevel.png', scene);
    starMaterial.opacityTexture = opacityTexture;
    starMaterial.disableLighting = true;
    starMesh.material = starMaterial;

    // Twinkle stars (simulate atmospheric turbulence).
    if (this._twinkleStars) {
      let emissiveTexture = new BABYLON.Texture('/assets/star/noise.png', scene);
      starMaterial.emissiveTexture = emissiveTexture;
      emissiveTexture.coordinatesIndex = 1; // uvs2

      // Animate emissive texture to simulate star 'twinkle' effect.
      scene.registerBeforeRender(()=> {
        emissiveTexture.uOffset += 0.002;
      });
    }
    else {
      starMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    }

    // Draw asterism lines.
    // if (this._showAsterisms) {
    //
    //   let points = [];
    //
    //   for (let i = 0; i < this._starData.asterismIndices.length; i++) {
    //
    //     let starIndex = this._starData.asterismIndices[i];
    //     if (starIndex != -1) {
    //
    //       // Compute star position.
    //       let ra = this._starData.rightAscension[starIndex];
    //       let dec = this._starData.declination[starIndex];
    //
    //       let x = this._radius * Math.cos(dec) * Math.sin(ra);
    //       let y = this._radius * Math.sin(dec);
    //       let z = this._radius * Math.cos(dec) * Math.cos(ra);
    //
    //       points.push(new BABYLON.Vector3(-x, y, z));
    //     }
    //     else {
          //
          // // Create lines.
          // let asterismLines = BABYLON.Mesh.CreateLines("asterismLines", points, scene);
          // asterismLines.color = this._asterismColor;
          // asterismLines.parent = this;
          // asterismLines.alphaIndex = 10;
          //
          // // Clear points array.
          // points = [];
    //     }
    //   }
    // }

    // // Draw helpers (celestial equator and axis).
    // let helperColor = new BABYLON.Color3(1, 0, 0);

    // Draw celestial equator.
    // let points = [];
    // let steps = 100;
    // for (let i = 0; i < steps + 1; i++) {
    //
    //   let a = (Math.PI * 2 * i / steps);
    //   let x = Math.cos(a) * this._radius;
    //   let y = 0;
    //   let z = Math.sin(a) * this._radius;
    //
    //   points.push(new BABYLON.Vector3(x, y, z));
    // }
    //
    // radius += 20;
    // //Array of paths to construct tube
    // let c = 2 * Math.PI * radius;
    // let h = c / 4 / 2;
    // let myPath = [
    //   new BABYLON.Vector3(0, 0, h),
    //   new BABYLON.Vector3(0, 0, -h)
    // ];

    //Create ribbon with updatable parameter set to true for later changes
    // let tubeParentXform = new BABYLON.TransformNode('tubeParentXform', scene);
    // let tubeChildXform = new BABYLON.TransformNode('tubeChildXform', scene);
    // let tube = BABYLON.MeshBuilder.CreateTube("tube", {path: myPath, radius: radius, sideOrientation: BABYLON.Mesh.BACKSIDE, updatable: false}, scene);
    // tube.alphaIndex = 0;
    // let tubeTexture = new BABYLON.Texture("eso0932a.png", scene, true, false);
    // tubeTexture.vScale = -1;
    // tube.parent = tubeChildXform;
    // tubeChildXform.parent = tubeParentXform
    // tube.rotate(new BABYLON.Vector3(0,0,-1), 0.57);
    // tubeChildXform.rotate(new BABYLON.Vector3(1,0,0), 0.48);
    // tubeParentXform.rotate(new BABYLON.Vector3(0,-1,0), 0.22);
    // let tubeMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    // tubeMaterial.backFaceCulling = true;
    // tubeMaterial.disableLighting = true;
    // tubeMaterial.emissiveTexture = tubeTexture;
    // tube.material = tubeMaterial;
    // tube.material.alpha = 0.5;
    // tubeParentXform.parent = this;
  }

  /*
   *  Look-up star color using star's color index B-V.
   *
   *  See: https://en.wikipedia.org/wiki/Color_index
   *  Blue-white-red star color range from http://www.vendian.org/mncharity/dir3/starcolor/details.html
   */
  private _starColor(starIndex: number): BABYLON.Color4 {

    // Normalize star color fraction from colorIndexBV range of -0.4-2.0 to 0.0-1.0.
    let fraction = BABYLON.Scalar.Normalize(this._starData.colorIndexBV[starIndex], -0.4, 2.0);

    // Calculate star color index.
    let maxColorIndex = this._starData.color.length - 1;
    let colorIndex = Math.round(maxColorIndex * fraction);
    colorIndex = BABYLON.Scalar.Clamp(colorIndex, 0, maxColorIndex);

    // Look-up and return star color.
    let c = this._starData.color[colorIndex];
    return new BABYLON.Color4(c[0], c[1], c[2], 0);
  }

  /*
   *  Compute star scale factor based on apparent magnitude.
   */
  private _starScaleFactor(starIndex: number) {

    // Magnitude is counterintuitive - lower values are hgiher magnitudes!
    // "Lowest" magnitude in star data is 7.8, "highest" is -1.44 for Sirius.
    // So we need to invert these & ensure positive to get scale that approximates magnitude.
    return (8 - this._starData.apparentMagnitude[starIndex]) * this._starScale;
  }
}

export default CelestialSphere
