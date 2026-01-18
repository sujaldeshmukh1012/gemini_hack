/**
 * Type definitions for 'mic' package
 * @see https://www.npmjs.com/package/mic
 */

declare module 'mic' {
  import { Readable } from 'stream';

  interface MicOptions {
    rate?: string | number;
    channels?: string | number;
    bitwidth?: string | number;
    device?: string;
    exitOnSilence?: number;
    fileType?: string;
    debug?: boolean;
  }

  interface MicInstance {
    getAudioStream(): Readable;
    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
  }

  function mic(options?: MicOptions): MicInstance;

  export = mic;
}
