export function ApiFactory() {
  return (() => {
    return init();
  });
}

function init() {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}
