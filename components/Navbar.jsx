import { Button } from "@mantine/core";
import Link from "next/link";
import Router from "next/router";
import { useGradesStore, useCredsStore } from "../utils/store";

const Navbar = () => {
  // const router = useRouter;
  const handleLogout = () => {
    clearGradesData();
    clearCredsData();
    Router.push("/");
  };

  const clearGradesData = useGradesStore((state) => state.clearGradesData);

  const clearCredsData = useCredsStore((state) => state.clearCreds);
  return (
    <div className="flex justify-between px-16 pt-4 h-16 bg-gray-900">
      <Link href="/" passHref>
        <p>IITM</p>
      </Link>
      <Button className="hover:cursor-pointer" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
};

export default Navbar;
