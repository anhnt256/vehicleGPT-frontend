export const Logo = () => {
  return (
    <a href="/" className="block">
      <div className="hover:opacity-75 transition items-center flex">
        <span className="text-xl sm:text-2xl font-bold">
          <span className="text-orange-500">Super</span>
          <span className="text-blue-600 ml-1 font-mono">Todo</span>
        </span>
      </div>
    </a>
  );
};
