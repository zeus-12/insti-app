import { useEffect, useState } from "react";
import Router from "next/router";
import { useGradesStore, useCredsStore } from "../utils/store";

const Grades = () => {
  const [error, setError] = useState("");
  useEffect(() => {
    username = credsDataZustand?.username;
    password = credsDataZustand?.password;

    if (!username || !password) {
      Router.push("/login");
    }

    if (!gradesZustand.length && username && password) {
      // setLoad(true);
      // e.preventDefault();

      const controller = new AbortController();
      const id = setTimeout(() => {
        setError("Timeout (Please check the credentials)");
        // setLoad(false);
        controller.abort();
      }, 8000);

      const fetchGrades = async () => {
        const res = await fetch("/api/grades", {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        clearTimeout(id);

        const data = await res.json();
        if (data) {
          setGradesData(data?.reverse());
          setGrades(data);
        }
      };

      fetchGrades();
    }
  }, []);

  var username, password;
  const credsDataZustand = useCredsStore((state) => {
    return { password: state.password, username: state.username };
  });

  const gradesZustand = useGradesStore((state) => state.gradesData);

  const setGradesZustand = useGradesStore((state) => state.setGradesData);
  const setGradesData = (data) => setGradesZustand(data);

  const [grades, setGrades] = useState(gradesZustand);

  if (!grades) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between px-28">
        {/* {username && <p>Hey {username}</p>} */}
        <p>Hey {username}</p>
        <p>Current CGPA: {grades[0]?.CGPA}</p>
      </div>
      <div>
        {grades?.map((item, index) => (
          <div key={index}>
            <p>{item.semester}</p>
            {item.courses.map((course, i) => (
              <div
                className="flex justify-between bg-slate-800 pt-3 px-28"
                key={i}
              >
                <p>{course.name}</p>
                <p>{course.grade}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grades;
