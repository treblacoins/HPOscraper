require('dotenv').config();
const axios = require('axios');
const nodecron = require('node-cron');
const playwright = require('playwright');

const { beautifyScrapeResult } = require("./utils");

//const cronExpression = '* * 9-14 * * *'; <
const cronExpression = '*/20 * * * * *';

async function scrapePisos() {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(process.env.SCRAPE_URL);

    const content = await page.$$eval('div.NotHome', (allAlerts) => {
        const alertList = [];
        allAlerts.forEach((alert) => {
            const date = alert.querySelector('span.txtNa').textContent;
            const description = alert.querySelector('strong').textContent;
            if (new Date().toLocaleDateString('es-ES') >= date) alertList.push({ date, description });
            // if (new Date(Date.parse('2022-12-21')).toLocaleDateString('es-ES') == date) alertList.push({ date, description });
        });
        return alertList;
    })

    console.log(beautifyScrapeResult(content));
    await browser.close();

    axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: process.env.SCRAPE_CHAT_ID,
        text: beautifyScrapeResult(content),
    });
}

nodecron.schedule(cronExpression, scrapePisos);  