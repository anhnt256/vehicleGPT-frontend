import { OrganizationSwitcher, UserButton, useUser } from '@clerk/clerk-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Logo } from '@/components/logo';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { updateUserRole } from '@/lib/api/updateUserRole';
import { getCookie, setCookie } from '@/lib/utils/cookie';

export const Navbar = () => {
  const { userRole } = useLoaderData();
  const cookieRole = getCookie('userRole') || 'free';
  const isFreeUser = userRole === 'free' || cookieRole === 'free';
  const navigate = useNavigate();
  const { user } = useUser();

  const [showModel, setShowModel] = useState(false);

  const handleUpgradeClick = () => {
    setShowModel(!showModel);
  };

  const handleUpgradePaidClick = async () => {
    try {
      // Sử dụng optional chaining (?.) để tránh lỗi null/undefined
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error('Email not available');
        return;
      }

      await updateUserRole(email, 'paid');

      // Lưu role mới vào cookie
      setCookie('userRole', 'paid', 7);

      // Cập nhật UI
      navigate('/dashboard?userRole=paid', { replace: true });

      alert('Chúc mừng! Bạn đã nâng cấp lên tài khoản Premium.');
    } catch (error) {
      console.error('Lỗi khi nâng cấp tài khoản:', error);
      alert('Có lỗi xảy ra khi nâng cấp tài khoản. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
        <div className="flex items-center gap-x-4">
          <Logo />
        </div>
        <div className="ml-auto flex items-center gap-x-2">
          {isFreeUser ? (
            <div
              className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm"
              onClick={handleUpgradeClick}
            >
              Upgrade to Pro
            </div>
          ) : (
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl="/organization/:id"
              afterLeaveOrganizationUrl="/select-org"
              afterSelectOrganizationUrl="/organization/:id"
              appearance={{
                elements: {
                  rootBox: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  popoverBox: {
                    right: 0,
                    left: 'unset !important',
                  },
                },
              }}
            />
          )}

          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  height: 30,
                  width: 30,
                },
              },
            }}
          />
        </div>
      </nav>
      <Dialog open={showModel} onOpenChange={handleUpgradeClick}>
        <DialogContent
          aria-describedby={undefined}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 shadow-lg text-white"
        >
          <VisuallyHidden>
            <DialogTitle>Upgrade to Pro</DialogTitle>
          </VisuallyHidden>
          <h2 className="text-2xl font-bold mb-4">Upgrade to Pro</h2>
          <p className="mb-4 text-lg">Unlock all the features of the app, including:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li className="text-md">Access to Notes section</li>
            <li className="text-md">Ability to create Organizations</li>
            <li className="text-md">View by Board functionality</li>
          </ul>
          <button
            type="button"
            className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 cursor-pointer"
            onClick={handleUpgradePaidClick}
          >
            Upgrade Now
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};
