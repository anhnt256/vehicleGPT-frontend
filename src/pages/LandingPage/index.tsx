import { Medal } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div
          className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700
        rounded-full uppercase"
        >
          <Medal className="h-6 w-6 mr-2" />Smart Task Management
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          Super-Todo will help
        </h1>
        <div
          className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md
        pb-4 w-fit"
        >
          work easier
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs">
        Super-Todo by CoverGo is a powerful SaaS platform designed to streamline task management for
        individuals and teams. With an intuitive interface and smart automation, it helps you stay
        organized, boost productivity, and collaborate seamlessly.
      </div>
    </div>
  );
};

export default LandingPage;
