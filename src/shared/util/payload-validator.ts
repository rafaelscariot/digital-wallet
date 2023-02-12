export const isPayloadValid = (payload: string) => {
  try {
    JSON.parse(payload);
  } catch (error) {
    return false;
  }

  return true;
};
