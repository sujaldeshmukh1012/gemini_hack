/**
 * Volume Meter Worklet - Measures audio volume for VU meter display
 */
export default `
class VolMeterWorklet extends AudioWorkletProcessor {
  process(inputs) {
    if (inputs[0] && inputs[0].length) {
      const channel0 = inputs[0][0];
      let sum = 0;
      for (let i = 0; i < channel0.length; i++) {
        sum += Math.abs(channel0[i]);
      }
      const volume = sum / channel0.length;
      this.port.postMessage({ volume });
    }
    return true;
  }
}
`;
