/**
 * Helper method to sort by date.
 * Should be used inside of a sort() method called on an array.
 *
 * Pass in the two date objects as a and b, then pass in the sort direction (descending is default).
 *
 * @returns 1 if date is larger, or -1 if date is smaller when sorting by desc.
 * @returns 1 if date is smaller, or -1 if date is larger when sorting by asc.
 */
export const sortDate = (a, b, sortDirection = 'desc') => {
  if (sortDirection === 'desc') {
    if (a.toDate() > b.toDate()) {
      return 1;
    } else {
      return -1;
    }
  } else {
    if (a.toDate() < b.toDate()) {
      return 1;
    } else {
      return -1;
    }
  }
};
