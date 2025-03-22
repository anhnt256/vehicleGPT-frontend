import { useLocalStorage } from 'usehooks-ts';
import { useOrganization, useOrganizationList } from '@clerk/clerk-react';
import { PlusCircle } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Accordion } from '@/components/ui/accordion';

import { NavItem, Organization } from './NavItem';

interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({ storageKey = 't-sidebar-state' }: SidebarProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {});

  const { organization: activeOrganization, isLoaded: isLoadedOrg } = useOrganization();
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    []
  );

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-900/95 border-r border-gray-800/50 h-full">
      <Accordion type="multiple" defaultValue={defaultAccordionValue} className="space-y-2">
        {userMemberships.data.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
      <div className="mt-4 px-3">
        <h2 className="mb-2 px-2 text-sm font-semibold text-gray-300">WORKSPACES</h2>
        
        <div className="space-y-1">
          <button
            className="flex items-center gap-2 w-full p-2 rounded-md bg-indigo-600/20 text-indigo-300 font-medium transition-colors hover:bg-indigo-600/30"
          >
            <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-indigo-500"></div>
            <span className="truncate">Personal Tasks</span>
          </button>
          
          <button
            className="flex items-center gap-2 w-full p-2 rounded-md text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-300"
          >
            <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-gray-600"></div>
            <span className="truncate">Team Projects</span>
          </button>
          
          <button
            className="flex items-center gap-2 w-full p-2 rounded-md text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-300"
          >
            <div className="flex-shrink-0 w-4 h-4 rounded-sm bg-gray-600"></div>
            <span className="truncate">Client Work</span>
          </button>
        </div>
        
        <button className="flex items-center gap-2 mt-2 px-2 py-1 text-sm text-gray-400 hover:text-gray-300">
          <PlusCircle size={16} />
          <span>Add Workspace</span>
        </button>
      </div>
    </div>
  );
};
