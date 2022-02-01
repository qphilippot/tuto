import CanvasNotFoundException from "../exception/canvas-not-found.exception";
import CanvasContextNotSupportedException from "../exception/canvas-context-not-supported.exception";

export const getCanvas = function (canvasId: string): HTMLCanvasElement {
    const canvas = document.getElementById(canvasId);

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new CanvasNotFoundException(canvasId);
    }

    return canvas;
}

export const getContext = function<T extends RenderingContext>(canvas: HTMLCanvasElement, contextName: string): T {
    const context = canvas.getContext(contextName);
    if (context === null) {
        throw new CanvasContextNotSupportedException(contextName);
    }

    return context as T;
}