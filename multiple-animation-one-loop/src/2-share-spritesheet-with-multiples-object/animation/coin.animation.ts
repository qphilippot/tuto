import AnimationInterface from "../interface/animation.interface";
import CoinSpriteSheet from "../../../assets/coin.sprite-sheet.png";

console.log(CoinSpriteSheet);
export default class CoinAnimation implements AnimationInterface {
    private spritesheet: HTMLImageElement = CoinSpriteSheet;
    private spriteIndex: number = 0;
    private spriteWidth: number = 0;
    private nbState: number = 10;
    private speed: number = 100;

    private x: number = 0;
    private y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    async load() {
        return await (new Promise((resolve => {
            // this.spritesheet.onload = () => {
            //     this.spriteWidth = this.spritesheet.width / this.nbState;
            //     resolve(null)
            // };
            // this.spritesheet.src = CoinSpriteSheet;
        })))
    }

    private refreshState(time: DOMHighResTimeStamp): void {
        this.spriteIndex = Math.ceil(time / this.speed) % this.nbState;
    }

    public render(time: DOMHighResTimeStamp, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        this.refreshState(time);
        this.spriteWidth = this.spritesheet.width / this.nbState;

        context.drawImage(
            this.spritesheet,
            this.spriteIndex * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteWidth,
            this.x, this.y, this.spriteWidth, this.spriteWidth
        )

        // context.drawImage(
        //     this.spritesheet,
        //     0, 0, this.spritesheet.width, this.spritesheet.height,
        //     0, 50, this.spritesheet.width, this.spritesheet.height
        // )
        //
        // context.strokeStyle = '#0000FF';
        // context.strokeRect(
        //     this.spriteIndex * this.spriteWidth,
        //     50,
        //     this.spriteWidth,
        //     this.spriteWidth,
        // );
    }
}
