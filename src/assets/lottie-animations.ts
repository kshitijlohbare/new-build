// lottie-animations.ts
// This file contains animation data that would normally be fetched from external sources
// By including it directly in our project, we avoid CORS issues

// Basic Lottie animation type
export interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
}

export const celebrationAnimation: LottieAnimation = {
  "v": "5.7.3",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 512,
  "h": 512,
  "nm": "Celebration Animation",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Confetti",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": { "a": 0, "k": 0, "ix": 10 },
        "p": { "a": 0, "k": [256, 256, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": { "a": 0, "k": [100, 100, 100], "ix": 6 }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [20, 20], "ix": 2 },
              "p": { "a": 1, "k": [
                { "t": 0, "s": [0, -100], "h": 1, "o": { "x": 0.333, "y": 0 }, "i": { "x": 0.667, "y": 1 } },
                { "t": 60, "s": [0, 100] }
              ], "ix": 3 }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [1, 0.5, 0, 1], "ix": 4 },
              "o": { "a": 0, "k": 100, "ix": 5 },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false
            }
          ],
          "nm": "Particle 1",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "d": 1,
              "s": { "a": 0, "k": [15, 15], "ix": 2 },
              "p": { "a": 1, "k": [
                { "t": 0, "s": [50, -120], "h": 1, "o": { "x": 0.333, "y": 0 }, "i": { "x": 0.667, "y": 1 } },
                { "t": 60, "s": [50, 120] }
              ], "ix": 3 }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0, 0.5, 1, 1], "ix": 4 },
              "o": { "a": 0, "k": 100, "ix": 5 },
              "r": 1,
              "bm": 0,
              "nm": "Fill 2",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false
            }
          ],
          "nm": "Particle 2",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 2,
          "mn": "ADBE Vector Group",
          "hd": false
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sr",
              "d": 1,
              "pt": { "a": 0, "k": 5, "ix": 3 },
              "p": { "a": 1, "k": [
                { "t": 0, "s": [-50, -120], "h": 1, "o": { "x": 0.333, "y": 0 }, "i": { "x": 0.667, "y": 1 } },
                { "t": 60, "s": [-50, 120] }
              ], "ix": 3 },
              "or": { "a": 0, "k": 10, "ix": 4 },
              "ir": { "a": 0, "k": 5, "ix": 5 }
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0, 1, 0.5, 1], "ix": 4 },
              "o": { "a": 0, "k": 100, "ix": 5 },
              "r": 1,
              "bm": 0,
              "nm": "Fill 3",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false
            }
          ],
          "nm": "Particle 3",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 3,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ]
};

export const checkmarkAnimation: LottieAnimation = {
  "v": "5.7.3",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 512,
  "h": 512,
  "nm": "Checkmark Animation",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Checkmark",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": { "a": 0, "k": 0, "ix": 10 },
        "p": { "a": 0, "k": [256, 256, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": { "a": 0, "k": [100, 100, 100], "ix": 6 }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ind": 0,
              "ty": "sh",
              "ix": 1,
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0,0],[0,0],[0,0]],
                  "o": [[0,0],[0,0],[0,0]],
                  "v": [[-50,0],[0,50],[100,-50]],
                  "c": false
                },
                "ix": 2
              },
              "nm": "Path 1",
              "mn": "ADBE Vector Shape - Group",
              "hd": false
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0, 0.8, 0.4, 1], "ix": 3 },
              "o": { "a": 0, "k": 100, "ix": 4 },
              "w": { "a": 0, "k": 20, "ix": 5 },
              "lc": 2,
              "lj": 2,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0], "ix": 2 },
              "a": { "a": 0, "k": [0, 0], "ix": 1 },
              "s": { "a": 0, "k": [100, 100], "ix": 3 },
              "r": { "a": 0, "k": 0, "ix": 6 },
              "o": { "a": 0, "k": 100, "ix": 7 },
              "sk": { "a": 0, "k": 0, "ix": 4 },
              "sa": { "a": 0, "k": 0, "ix": 5 },
              "nm": "Transform"
            }
          ],
          "nm": "Checkmark",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ]
};

// This is a simplified version of the animation data. For a production app,
// you might want to create more detailed animations or use a proper Lottie file.
