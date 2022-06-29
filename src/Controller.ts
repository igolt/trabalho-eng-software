class ControllerButton {
  private _isActive: boolean;
  private _isDown: boolean;

  public constructor() {
    this._isDown = this._isActive = false;
  }

  public isDown(): boolean {
    return this._isDown;
  }

  public isActive(): boolean {
    return this._isActive;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public update(isDown: boolean) {
    if (this._isDown != isDown) {
      this._isActive = isDown;
    }
    this._isDown = isDown;
  }
}

export class Controller {
  public left: ControllerButton;
  public right: ControllerButton;
  public up: ControllerButton;

  public constructor() {
    this.left = new ControllerButton();
    this.right = new ControllerButton();
    this.up = new ControllerButton();

    window.addEventListener("keydown", this.keyboardUpdate.bind(this));
    window.addEventListener("keyup", this.keyboardUpdate.bind(this));
  }

  private keyboardUpdate(e: KeyboardEvent): void {
    const isDown = e.type == "keydown";

    switch (e.key) {
      case "ArrowLeft":
        this.left.update(isDown);
        break;
      case "ArrowUp":
        this.up.update(isDown);
        break;
      case "ArrowRight":
        this.right.update(isDown);
    }
  }
}
