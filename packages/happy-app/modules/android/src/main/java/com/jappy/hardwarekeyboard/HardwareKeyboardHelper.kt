package com.jappy.hardwarekeyboard

import android.app.Activity
import android.view.KeyEvent

object HardwareKeyboardHelper {
    private var callback: (() -> Unit)? = null

    fun register(activity: Activity, onCtrlEnter: () -> Unit) {
        callback = onCtrlEnter
    }

    fun unregister() {
        callback = null
    }

    /**
     * Call from MainActivity.dispatchKeyEvent.
     * Returns true if the event was consumed.
     */
    fun handleKeyEvent(event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_DOWN &&
            event.keyCode == KeyEvent.KEYCODE_ENTER &&
            (event.isCtrlPressed || event.isMetaPressed)) {
            callback?.invoke()
            return true
        }
        return false
    }
}
