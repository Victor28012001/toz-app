// modules/keyboardControls.js
export const keyboardState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
  };
  
  const keyMap = {
    ArrowUp: "forward",
    KeyW: "forward",
    ArrowDown: "backward",
    KeyS: "backward",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
    ShiftLeft: "run",
    ShiftRight: "run",
  };
  
  export function setupKeyboardControls() {
    window.addEventListener("keydown", (event) => {
      const action = keyMap[event.code];
      if (action) keyboardState[action] = true;
    });
  
    window.addEventListener("keyup", (event) => {
      const action = keyMap[event.code];
      if (action) keyboardState[action] = false;
    });
  }
  