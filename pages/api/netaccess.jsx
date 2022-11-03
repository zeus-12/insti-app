import puppeteer from "puppeteer";

async function netaccess(username, password) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--single-process", "--no-zygote"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
    );
    await page.goto("https://netaccess.iitm.ac.in/account/login");

    await page.type('input[name="userLogin"]', username);
    await page.type('input[name="userPassword"]', password);
    await page.click('button[name="submit"]');

    await page.waitForSelector(".btn.btn-info.btn-md");
    await page.click("span.btn.btn-info.btn-md");
    await page.waitForSelector("#radios-1");

    await page.evaluate(() => {
      document.querySelector("#radios-1").parentElement.click();
    });
    await page.click('button[name="approveBtn"]');
  } catch (error) {
    console.log(`netaccess: ${error}`);
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
    try {
      await netaccess(username, password);
    } catch {
      res.status(400).json({ error: "Please try again later!" });
      return;
    }

    res.status(200).end();
    return;
  }
}
export default handler;
