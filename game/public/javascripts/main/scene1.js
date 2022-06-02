import { CanvasScene } from "./CanvasScene.js";
export class Scene1 extends CanvasScene {
    constructor(context, images) {
        super('scene1', context);
        this.addShowableBackground(new class {
            isShowable(is) {
                return true;
            }
            show() {
                context.drawImage(images.get("background"), 10, 10);
            }
        }());
    }
}
