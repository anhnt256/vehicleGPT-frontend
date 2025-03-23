export const getOrgId = (): string => {
  const orgId = localStorage.getItem('orgId');
  return orgId || 'default';
}; 