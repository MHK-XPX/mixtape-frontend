import '@types/youtube';
import { EventEmitter } from '@angular/core';

export interface IPlayerOutputs {
  ready?: EventEmitter<YT.Player>;
  change?: EventEmitter<YT.Events>; //changed from PlayerEvent, may want EventArgs
}

export interface IPlayerSize {
  height?: number;
  width?: number;
}

export interface IPlayerApiScriptOptions {
  protocol?: string;
}