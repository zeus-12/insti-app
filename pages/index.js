import { Button } from "@mantine/core";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-col px-4 flex justify-center items-center min-h-[calc(100vh_-_4rem)]">
      <Head>
        <title>IIT-M</title>
        <meta name="description" content="Created for the Community" />
      </Head>
      <p className="text-4xl font-semibold">The All-in-one App for Insti</p>
      <div className="flex gap-4 mt-2">
        <Link href="/grades">
          <p className="hover:cursor-pointer text-xl p-2 bg-blue-400 rounded-md">
            Grades
          </p>
        </Link>

        <Link href="/netaccess">
          <p className="hover:cursor-pointer text-xl p-2 bg-pink-400 rounded-md">
            Netaccess
          </p>
        </Link>
      </div>
      {/* <div className="mt-8">
        <Image
          className="rounded-md "
          layout=""
          width="750px"
          height="585px"
          about="iitm"
          priority
          src="/iitm.png"
        />
      </div> */}
      {/* <Footer /> */}
    </div>
  );
}
