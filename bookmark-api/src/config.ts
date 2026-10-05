export const config = {
  get port(): number {
    return Number(process.env.PORT ?? 3000);
  },
};
