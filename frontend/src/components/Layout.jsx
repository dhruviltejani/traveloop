import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />

      <Sidebar />

      <main className="pt-16 md:pl-72">
        <div className="min-h-screen px-4 pb-16 md:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
