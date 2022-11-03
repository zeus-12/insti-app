import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
};
export default Layout;
