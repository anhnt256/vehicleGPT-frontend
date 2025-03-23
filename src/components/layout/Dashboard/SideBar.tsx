import { useOrganization, useOrganizationList } from '@clerk/clerk-react';
import logoImg from '@/assets/logo.png';
import { setCookie } from '@/lib/utils/cookie';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  const { organization: activeOrganization, isLoaded: isLoadedOrg } = useOrganization();
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const handleOrganizationClick = (orgId: string) => {
    // Lưu orgId vào cookie với thời hạn 30 ngày
    setCookie('selectedOrgId', orgId, 30);

    // Refresh trang để lấy dữ liệu mới
    window.location.reload();
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </>
    );
  }

  // Tạo organization mặc định với logo từ assets
  const defaultOrg = {
    id: 'default',
    name: 'Default',
    slug: 'default',
    imageUrl: logoImg,
  };

  // Tạo array mới chứa defaultOrg và tất cả organization hiện có
  const allOrganizations = [{ organization: defaultOrg }, ...userMemberships.data];

  return (
    <div className="bg-gray-900/95 border-r border-gray-800/50 h-full p-4">
      <h2 className="text-white text-lg font-medium mb-4">Organizations</h2>
      <div className="space-y-3">
        {allOrganizations.map(({ organization }) => (
          <Button
            key={organization.id}
            size="sm"
            variant="ghost"
            className={`w-full flex items-center justify-start gap-3 py-2 px-3 ${
              organization.id === activeOrganization?.id ||
              (organization.id === 'default' && !activeOrganization)
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
            onClick={() => handleOrganizationClick(organization.id)}
          >
            {organization.imageUrl ? (
              <div className="h-6 w-6 flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src={organization.imageUrl}
                  alt={`${organization.name} logo`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-6 w-6 flex-shrink-0 rounded-md bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {organization.name.substring(0, 1).toUpperCase()}
                </span>
              </div>
            )}
            <span className="flex-1 truncate text-sm">{organization.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
