type RequestJSONCallback = (param: any) => void;
type RequestImageCallback = (image: HTMLImageElement) => void;

export const requestJSON = (
  url: string | URL,
  callback: RequestJSONCallback
) => {
  const request = new XMLHttpRequest();

  request.addEventListener(
    "load",
    function () {
      callback(JSON.parse(this.responseText));
    },
    { once: true }
  );

  request.open("GET", url);
  request.send();
};

export const requestImage = (url: string, callback: RequestImageCallback) => {
  const image = new Image();

  image.addEventListener("load", () => callback(image), { once: true });

  image.src = url;
};
