import ExpoModulesCore

public class HardwareKeyboardModule: Module {
  public func definition() -> ModuleDefinition {
    Name("HardwareKeyboard")
    Events("onCtrlEnter")
  }
}
