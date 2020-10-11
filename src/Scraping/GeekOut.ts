import puppeteer from 'puppeteer';
import { Matter } from '../models/matter';
import { Job } from '../models/job';
import { serchKeyWord, jobkey, puppeteerOptions } from './common';

export const scrapingGeekOut = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);

  const page = await browser.newPage();

  // タイムアウトを無制限に
  await page.setDefaultNavigationTimeout(0);

  await page.goto(`https://geek-out.jp/job/`);

  const inputBox = await page.$('#f_keywords');

  const jobData = {};

  for (let i = 0; i < serchKeyWord.length; i++) {
    // 検索欄リセット
    await page.$eval(
      '#f_keywords',
      // @ts-ignore
      (element) => (element.value = '')
    );

    await inputBox.type(serchKeyWord[i], {
      delay: 500,
    });

    const searchCount = await page.evaluate(async () => {
      return document.querySelector('.p-job-index__form-value span').innerHTML;
    });

    jobData[jobkey[i]] = searchCount;
  }

  console.log({ jobData });

  const job = new Job({
    siteName: 'GeekOut',
    jobData: jobData,
    date: '2020-09-20',
  });

  await job.save();

  await browser.close();
};

scrapingGeekOut();
