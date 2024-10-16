import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { exec } from 'child_process';


dotenv.config();

const fs = require('fs');

async function connexion() {
  const CONFIDENTIAL_FILE = '.env';

  let user = process.env.USER;
  let password = process.env.PASSWORD;

  const navigation = 'C:\\Users\\exemple\\AppData\\Chrome\\Chrome.exe'; //The path to the browser .exe

  if (!user || !password) {
    console.log('No identifiants defined, Please enter them');

    const confidential = `USER=${user}\nPASSWORD=${password}\n`;
    fs.writeFileSync(CONFIDENTIAL_FILE, confidential);
  }

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: navigation,
    args: ['--window-size=1920,1080'],
    defaultViewport: null
  });

  exec(`${navigation}`, (err) => {
    if (err) {
      console.error(err)
      return;
    }
  });

  const page = await browser.newPage();
  await page.goto('https://exemple/accueil/index.php'); //URL your site défined

  await page.waitForSelector('#for-connexion', { visible: true });

  await page.evaluate((user, password) => {
    const button = document.getElementById('for-connexion');
    button?.addEventListener('click', () => {
      document.getElementById('login').value = user; //ID your site
      document.getElementById('pass').value = password; //ID your site
    });
  }, user, password);

  await page.click('#for-connexion'); //ID your site

  await page.waitForSelector('#loginModal', { visible: true });

  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.click('input[type="button"]'); //Button click auto

  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  console.log("Connexion successful !");



}
connexion().catch(console.error);


