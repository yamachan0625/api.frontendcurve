import puppeteer from 'puppeteer';
import { serchKeyWord, puppeteerOptions } from './common';

// 毎回ブラウザを閉じずに同じブラウザにて検索させたい;
export const scrapingGreen = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);

  const page = await browser.newPage();

  // タイムアウトを無制限に
  await page.setDefaultNavigationTimeout(0);

  await page.goto(`https://www.green-japan.com/search/01`);

  const inputBox = await page.$('#keyword');

  for (let i = 0; i < serchKeyWord.length; i++) {
    // 検索欄リセット
    await page.$eval(
      '#keyword',
      // @ts-ignore
      (element) => (element.value = '')
    );

    // 検索欄に入力
    await inputBox.type(serchKeyWord[i], {
      delay: 250,
    });

    // 一度他の要素を選択しないと検索件数が反映されない為checkboxをフォーカス
    const checkBox = await page.$('#workers_range_type_lower_0');
    await checkBox.focus();

    // 検索結果反映に若干ラグがある為5000ms待機
    await page
      // @ts-ignore
      .waitForTimeout(10000);

    const searchCount = await page.evaluate(async () => {
      return document.querySelector('#search_job_count').innerHTML;
    });

    console.log(serchKeyWord[i], ':', 'count:', searchCount);
  }

  await browser.close();
};

scrapingGreen();