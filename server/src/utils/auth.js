export const removePassword = (data) => {
  const { password, __v, ...userData } = data;
  return userData;
}