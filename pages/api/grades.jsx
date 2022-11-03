import puppeteer from "puppeteer";

async function scrapper(username, password) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--single-process", "--no-zygote"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
    );
    await page.goto("https://www.iitm.ac.in/viewgrades/");

    await page.type('input[name="rollno"]', username);
    await page.type('input[name="pwd"]', password);
    await page.click('input[name="submit"]');

    await page.waitForSelector('frame[src="studopts2.php"]');
    await page.waitForTimeout(1000);
    const f = await page.$('frame[src="studopts2.php"]');
    if (!f) {
      throw new Error("The credentials are invalid");
    }

    const m = await f.contentFrame();

    const table = await m.$("table[border='1'][align='center'] tbody");

    const sanitizedRows = await table.evaluate((tempTable) => {
      const rows = Array.from(tempTable.childNodes);
      return rows.reduce(
        ({ prevData, currentSem }, row) => {
          const th = row.querySelector("th");
          const td8 = row.querySelector("td[colspan='8']");
          const td2 = row.querySelector("td[colspan='2']");
          // console.log(th, td8, td2);
          if (th) {
            console.log("Invalid element found");
            return { prevData, currentSem };
          }
          if (td8) {
            const semester = row.textContent.split("(")[0].trim();
            prevData.push({ semester, courses: [] });
            return { prevData, currentSem };
          }
          if (td2) {
            console.log("td2 found");
            const CGPA = Array.from(row.querySelectorAll("td"))
              .find((entries) => entries.textContent.includes("CGPA"))
              .textContent.split(":")[1];
            const ungradedCourses = prevData[currentSem].courses.filter(
              ({ grade }) => grade === " "
            ).length;
            prevData[currentSem] = {
              ...prevData[currentSem],
              CGPA,
              ungradedCourses,
            };
            console.log(CGPA);
            currentSem++;
            return { prevData, currentSem };
          }
          const entries = Array.from(row.querySelectorAll("td"));
          // console.log("entries:" + entries);
          prevData[currentSem].courses.push({
            code: entries[1].textContent,
            name: entries[2].textContent,
            credits: entries[4].textContent,
            grade: entries[5].textContent || "-",
          });
          return { prevData, currentSem };
        },
        { prevData: [], currentSem: 0 }
      ).prevData;
    });
    // console.log(sanitizedRows);
    return sanitizedRows;
  } catch (error) {
    console.log(`scraper: ${error}`);
  } finally {
    await browser.close();
  }
}

async function handler(req, res) {
  if (req.method == "POST") {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }
    const response = await scrapper(username, password);
    //   const response = [
    //     {
    //       semester: "First Semester",
    //       courses: [
    //         {
    //           code: "GN1101",
    //           name: "Life Skills 1",
    //           credits: "0",
    //           grade: "P",
    //         },
    //         {
    //           code: "ID1200 ",
    //           name: "Ecology and Environment",
    //           credits: "0",
    //           grade: "P",
    //         },
    //         {
    //           code: "MA1101",
    //           name: "Functions of Several Variables",
    //           credits: "10",
    //           grade: "C",
    //         },
    //         {
    //           code: "PH1010",
    //           name: "Physics I",
    //           credits: "10",
    //           grade: "C",
    //         },
    //       ],
    //       CGPA: "7",
    //       ungradedCourses: 0,
    //     },
    //     {
    //       semester: "Second Semester",
    //       courses: [
    //         {
    //           code: "AM1100A",
    //           name: "Engineering Mechanics",
    //           credits: "10",
    //           grade: "A",
    //         },
    //         {
    //           code: "ED1011",
    //           name: "Functional and Conceptual Design",
    //           credits: "9",
    //           grade: "B",
    //         },
    //         {
    //           code: "ED1021",
    //           name: "Introduction to Computation and Visualization",
    //           credits: "9",
    //           grade: "B",
    //         },
    //         {
    //           code: "ED1031",
    //           name: "Creative Design",
    //           credits: "3",
    //           grade: "B",
    //         },
    //         {
    //           code: "ED1033",
    //           name: "Form and Aesthetics in Design I",
    //           credits: "6",
    //           grade: "S",
    //         },
    //         {
    //           code: "ED2090",
    //           name: "Geometric Modelling and CAD",
    //           credits: "12",
    //           grade: "B",
    //         },
    //         {
    //           code: "EE1101#",
    //           name: "Signals and Systems",
    //           credits: "10",
    //           grade: "A",
    //         },
    //         {
    //           code: "GN1102",
    //           name: "Life Skills 2",
    //           credits: "0",
    //           grade: "P",
    //         },
    //         {
    //           code: "MA1102",
    //           name: "Series and Matrices",
    //           credits: "10",
    //           grade: "A",
    //         },
    //       ],
    //       CGPA: "8.25",
    //       ungradedCourses: 0,
    //     },
    //     {
    //       semester: "Summer",
    //       courses: [
    //         {
    //           code: "ME1480",
    //           name: "Engineering Drawing",
    //           credits: "7",
    //           grade: "B",
    //         },
    //         {
    //           code: "PH1030 ",
    //           name: "Physics Laboratory I",
    //           credits: "4",
    //           grade: "A",
    //         },
    //       ],
    //       CGPA: "8.26",
    //       ungradedCourses: 0,
    //     },
    //     {
    //       semester: "Third Semester",
    //       courses: [
    //         {
    //           code: "ED1034",
    //           name: "Form and Aesthetics in Design II",
    //           credits: "6",
    //           grade: "A",
    //         },
    //         {
    //           code: "ED2011",
    //           name: "Design of Mechanical Systems 1",
    //           credits: "15",
    //           grade: "S",
    //         },
    //         {
    //           code: "ED2012",
    //           name: "Manufacturing Processes",
    //           credits: "6",
    //           grade: "A",
    //         },
    //         {
    //           code: "ED2130",
    //           name: "Analog and Digital Electronics",
    //           credits: "13",
    //           grade: "A",
    //         },
    //         {
    //           code: "ED2141",
    //           name: "Physics of Measurement",
    //           credits: "9",
    //           grade: "B",
    //         },
    //         {
    //           code: "MA2020",
    //           name: "Differential Equations",
    //           credits: "9",
    //           grade: "C",
    //         },
    //       ],
    //       CGPA: "8.46",
    //       ungradedCourses: 0,
    //     },
    //     {
    //       semester: "Fourth Semester",
    //       courses: [
    //         {
    //           code: "CH5019",
    //           name: "Mathematical Foundations of Data Science",
    //           credits: "12",
    //           grade: "B",
    //         },
    //         {
    //           code: "CY1050",
    //           name: "Macromolecules as Engineering Materials",
    //           credits: "9",
    //           grade: "S",
    //         },
    //         {
    //           code: "ED2040",
    //           name: "Control Systems",
    //           credits: "12",
    //           grade: "S",
    //         },
    //         {
    //           code: "ED4040",
    //           name: "Design of Thermal and Fluid Systems",
    //           credits: "15",
    //           grade: "A",
    //         },
    //         {
    //           code: "ED4060",
    //           name: "Design of Mechanical Systems 2",
    //           credits: "15",
    //           grade: "A",
    //         },
    //       ],
    //       CGPA: "8.65",
    //       ungradedCourses: 0,
    //     },
    //     {
    //       semester: "Fifth Semester",
    //       courses: [
    //         {
    //           code: "BT1010",
    //           name: "Life Sciences",
    //           credits: "9",
    //           grade: " ",
    //         },
    //         {
    //           code: "ED3010",
    //           name: "Human Factors in Design (L&P)",
    //           credits: "9",
    //           grade: " ",
    //         },
    //         {
    //           code: "ED5040",
    //           name: "Human Anatomy, Physiology & Biomechanics",
    //           credits: "12",
    //           grade: " ",
    //         },
    //         {
    //           code: "ED5052",
    //           name: "Electromagnetic Compatibility for Product Design",
    //           credits: "11",
    //           grade: " ",
    //         },
    //         {
    //           code: "ED5080",
    //           name: "Mechatronics System Design ",
    //           credits: "9",
    //           grade: " ",
    //         },
    //         {
    //           code: "ED5340",
    //           name: "Data Science: Theory and practice",
    //           credits: "12",
    //           grade: " ",
    //         },
    //       ],
    //       CGPA: "8.65",
    //       ungradedCourses: 6,
    //     },
    //   ];
    res.json(response);
    res.end();
    return;
  }
}
export default handler;
