export const setSessionData = async (key: string, data: string) => {
  if (key) {
    window["localStorage"].setItem(key, data);
  } else {
    setSessionData(key, data);
  }
};

export const getSessionData = (key: string): any => {
  const storageData = window["localStorage"].getItem(key) || "";
  return storageData;
};
