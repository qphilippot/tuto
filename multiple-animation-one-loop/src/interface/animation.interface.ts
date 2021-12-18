export default interface AnimationInterface {
    render(time: DOMHighResTimeStamp, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
}
