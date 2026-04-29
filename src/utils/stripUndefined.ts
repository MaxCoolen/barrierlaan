/** Verwijdert alle undefined-waarden uit een object zodat Firestore niet crasht. */
export function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T
}
