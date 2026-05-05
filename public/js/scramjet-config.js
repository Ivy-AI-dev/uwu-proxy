export const SCRAMJET_DB_NAME = "$scramjet";

export const SCRAMJET_CONFIG = {
  prefix: "/scramjet/",
  files: {
    wasm: "/scram/scramjet.wasm.wasm",
    sync: "/scram/scramjet.sync.js",
    worker: "/scram/scramjet.bundle.js",
  },
};

export function isRecoverableScramjetError(error) {
  const message = String(error?.message || error || "");
  return (
    error?.name === "NotFoundError" ||
    message.includes("object stores was not found") ||
    message.includes("object store") ||
    message.includes("reading 'prefix'")
  );
}
