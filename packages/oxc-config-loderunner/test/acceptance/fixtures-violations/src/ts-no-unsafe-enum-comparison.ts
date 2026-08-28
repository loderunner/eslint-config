enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

export function isWeird(status: Status): boolean {
  return status === 'weird';
}
