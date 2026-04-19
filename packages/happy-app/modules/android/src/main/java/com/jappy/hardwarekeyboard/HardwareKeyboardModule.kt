package com.jappy.hardwarekeyboard

import android.app.Activity
import android.view.KeyEvent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class HardwareKeyboardModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("HardwareKeyboard")

    Events("onCtrlEnter")

    OnActivityResult { _, _ -> }

    OnCreate {
      val activity = appContext.currentActivity ?: return@OnCreate
      HardwareKeyboardHelper.register(activity) {
        sendEvent("onCtrlEnter")
      }
    }

    OnDestroy {
      HardwareKeyboardHelper.unregister()
    }
  }
}
