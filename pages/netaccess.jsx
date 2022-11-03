import { useEffect, useState } from "react";
import { useCredsStore } from "../utils/store";

const Netaccess = () => {
  const { username, password } = useCredsStore((state) => {
    return { username: state.username, password: state.password };
  });

  const [error, setError] = useState("");

  console.log(username, password);
  useEffect(() => {
    const controller = new AbortController();
    const id = setTimeout(() => {
      setError("Timeout (Please check the credentials)");
      // setLoad(false);
      controller.abort();
    }, 15000);

    const netAccess = async () => {
      const res = await fetch("/api/netaccess", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(id);

      const data = await res.json();

      console.log(data);
      //   setGradesData(data?.reverse());
      //   setGrades(data);
    };
    netAccess();
  }, []);
  return (
    <div>
      <p>Performing Netaccess!</p>
    </div>
  );
};

export default Netaccess;
