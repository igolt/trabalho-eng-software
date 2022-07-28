const getCanvas = (): HTMLCanvasElement =>
  document.querySelector("canvas") ?? document.createElement("canvas");

export class Display {
  private buffer: CanvasRenderingContext2D;
  private context: CanvasRenderingContext2D;

  constructor(canvas?: HTMLCanvasElement) {
    canvas = canvas ?? getCanvas();

    const buffer = document.createElement("canvas").getContext("2d");
    const context = canvas.getContext("2d");

    if (buffer === null || context === null) {
      throw new Error("Could not create buffer or context");
    }
    this.buffer = buffer;
    this.context = context;
  }

  public drawMap(
    image: CanvasImageSource,
    imageColums: number,
    // imageRows: number,
    map: number[],
    mapColumns: number,
    // mapRows: number,
    tileSize: number
  ) {
    map.forEach((value, index) => {
      const sourceX = (value % imageColums) * tileSize;
      const sourceY = Math.floor(value / imageColums) * tileSize;
      const destinationX = (index % mapColumns) * tileSize;
      const destinationY = Math.floor(index / mapColumns) * tileSize;

      this.buffer.drawImage(
        image,
        sourceX,
        sourceY,
        tileSize,
        tileSize,
        destinationX,
        destinationY,
        tileSize,
        tileSize
      );
    });
  }

  public drawObject(
    image: CanvasImageSource,
    sourceX: number,
    sourceY: number,
    destinationX: number,
    destinationY: number,
    width: number,
    height: number
  ) {
    this.buffer.drawImage(
      image,
      sourceX,
      sourceY,
      width,
      height,
      Math.round(destinationX),
      Math.round(destinationY),
      width,
      height
    );
  }

  public resize(width: number, height: number, heightWidthRatio: number) {
    if (height / width > heightWidthRatio) {
      this.context.canvas.height = width * heightWidthRatio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / heightWidthRatio;
    }
    this.context.imageSmoothingEnabled = false;
  }

  public render() {
    this.context.drawImage(
      this.buffer.canvas,
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height,
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  }

  public getBoundingClientRect(): DOMRect {
    return this.context.canvas.getBoundingClientRect();
  }

  public setBufferCanvasHeight(height: number) {
    this.buffer.canvas.height = height;
  }

  public setBufferCanvasWidth(width: number) {
    this.buffer.canvas.width = width;
  }

  public disableImageSmoothing() {
    this.buffer.imageSmoothingEnabled = false;
  }

  public drawImage(image: HTMLImageElement) {
    this.buffer.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height
    );
  }

  public canvas(): HTMLCanvasElement {
    return this.context.canvas;
  }
}
