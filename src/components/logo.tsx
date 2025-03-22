export const Logo = () => {
  return (
    <a href="/" className="block">
      <div className="hover:opacity-75 transition items-center gap-x-2 flex md:flex">
        <img src="/src/assets/logo.svg" alt="Logo" className="w-auto h-8" />
      </div>
    </a>
  );
};
