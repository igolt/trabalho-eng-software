import { IShowable } from "../showable.js";
import { CanvasScene } from "./CanvasScene.js";
import { IImages } from "./images.js";

export class Scene1 extends CanvasScene {

    constructor(
        context: CanvasRenderingContext2D,
        images:IImages) {

        super('scene1', context);

        this.addShowableBackground(
            
            new class implements IShowable {

                isShowable(is?: boolean | undefined): boolean {
                    return true;
                }

                show() {

                    context.drawImage(images.get("background"), 10, 10);

                }

            }()

        );

    }

}