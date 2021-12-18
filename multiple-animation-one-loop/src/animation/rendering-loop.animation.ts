import AnimationInterface from "../interface/animation.interface";

export default class RenderingLoop implements AnimationInterface {
    private animations: AnimationInterface[];

    recordAnimation(animation: AnimationInterface): void {
        this.animations.push(animation);
    }
}
