import { EventEmitter, type EventSubscription } from 'expo-modules-core';
import HardwareKeyboardModule from './src/HardwareKeyboardModule';

type HardwareKeyboardEvents = { onCtrlEnter: () => void };

const emitter = HardwareKeyboardModule
    ? new EventEmitter<HardwareKeyboardEvents>(HardwareKeyboardModule)
    : null;

export function addCtrlEnterListener(listener: () => void): EventSubscription {
    if (!emitter) {
        return { remove: () => {} };
    }
    return emitter.addListener('onCtrlEnter', listener);
}
