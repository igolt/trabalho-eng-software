const REQUEST_OPTS = { once: true };

export const requestJSON = (url: string | URL): Promise<JSON> =>
  new Promise(resolve => {
    const request = new XMLHttpRequest();
    const callback = () => resolve(JSON.parse(request.responseText));

    request.addEventListener("load", callback, REQUEST_OPTS);
    request.open("GET", url);
    request.send();
  });

export const requestImage = (url: string | URL) =>
  new Promise<HTMLImageElement>(resolve => {
    const image = new Image();
    const callback = () => resolve(image);

    image.addEventListener("load", callback, REQUEST_OPTS);
    image.src = typeof url == "string" ? url : url.toString();
  });

export const loadAudio = (url: string | URL) => {
  const audio = new Audio(typeof url == "string" ? url : url.toString());
  audio.load();
  return audio;
};
