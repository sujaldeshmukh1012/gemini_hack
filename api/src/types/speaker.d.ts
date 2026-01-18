/**
 * Type definitions for 'speaker' package
 * @see https://www.npmjs.com/package/speaker
 */

declare module 'speaker' {
  import { Writable } from 'stream';

  interface SpeakerOptions {
    channels?: number;
    sampleRate?: number;
    bitDepth?: number;
    signed?: boolean;
    float?: boolean;
    samplesPerFrame?: number;
    lowWaterMark?: number;
    highWaterMark?: number;
  }

  class Speaker extends Writable {
    constructor(options?: SpeakerOptions);
  }

  export = Speaker;
}
