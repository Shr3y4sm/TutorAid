/**
 * Polyfill for `requireNativeComponent` which was removed in React Native 0.85.
 *
 * The `react-native-webrtc` / `@stream-io/react-native-webrtc` libraries still
 * call `requireNativeComponent('RTCVideoView')` at module load time. In RN 0.85
 * this export no longer exists, so we provide a compatibility shim that falls
 * back to `codegenNativeComponent` (the modern replacement) or a plain View.
 */

// Use require() instead of import so this doesn't fail at module load time
// if requireNativeComponent is not exported from react-native.
const RN = require("react-native");

// If the real requireNativeComponent exists, use it.
// Otherwise, provide a fallback that returns a plain View component.
const nativeRequire =
  typeof RN.requireNativeComponent === "function"
    ? RN.requireNativeComponent
    : (viewName: string) => {
        // Fallback: return a minimal component that renders a View.
        // This keeps the app from crashing at import time. The native
        // RTCVideoView will still be used when the native module is linked.
        const { View } = require("react-native");
        return View;
      };

// In RN 0.85, requireNativeComponent is exposed as a getter-only accessor
// property on the react-native module object, so a plain assignment silently
// fails (or throws in strict mode). Use Object.defineProperty to properly
// override it before any WebRTC library tries to read it at module load time.
Object.defineProperty(RN, "requireNativeComponent", {
  value: nativeRequire,
  writable: true,
  configurable: true,
});

export default nativeRequire;
