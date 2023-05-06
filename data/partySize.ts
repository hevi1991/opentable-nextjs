export const partySize = Array(10)
  .fill(null)
  .map((_, index) => ({
    value: index + 1,
    label: `${index + 1} people`,
  }));
