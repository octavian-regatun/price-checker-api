const cheerio = require('cheerio');
const fetch = require('node-fetch');
const delay = require('delay');

class PcGarage {
  static URL = 'https://www.pcgarage.ro/cauta';

  static CATEGORIES = {
    laptop: {},
    mobile: {},
    componente: {
      placiVideo: 'placi-video',
      procesoare: 'procesoare',
      placiDeBaza: 'placi-de-baza',
      memorii: 'memorii',
      ssd: 'ssd',
      hardDiskUri: 'hard-disk-uri',
      surse: 'surse',
      carcase: 'carcase',
      coolere: 'coolere'
    },
    gaming: {},
    televizoare: {}
  };

  static #getHTMLForSearch = async (search, wantURL = false) => {
    let url;
    const $ = await fetch(`${this.URL}/${search}`, { method: 'GET' })
      .then((response) => {
        url = response.url;
        return response.text();
      })
      .then((body) => cheerio.load(body));

    if (wantURL) {
      return { $, url };
    }

    return $;
  };

  static #getHTMLForPage = async (URL, page, wantURL = false) => {
    let url;
    const $ = await fetch(`${URL}/pagina${page}`, { method: 'GET' })
      .then((response) => {
        url = response.url;
        return response.text();
      })
      .then((body) => cheerio.load(body));

    if (wantURL) {
      return { $, url };
    }

    return $;
  };

  static #getProductData = ($products) => {
    const products = [];

    const productsInTotal = $products.length;
    let productsInStock = 0;

    for (const $product of $products) {
      const $ = cheerio.load($product);

      const stock = $('.product_box_availability').text();

      if (stock.trim() !== 'Nu este in stoc') {
        productsInStock++;

        let price = $('.price').text();
        price = price.replace(' RON', '');
        price = price.replace('.', '');
        price = price.replace(',', '.');
        price = parseFloat(price);

        const name = $('.product_box_name').children().children().attr('title');

        let imgSrc = $('img').eq(0).attr('srcset');
        imgSrc = imgSrc.split(',')[0];

        let url = $('.product_box')
          .children()
          .first()
          .children('a')
          .attr('href');

        products.push({
          name,
          price,
          imgSrc,
          url
        });
      }
    }

    return {
      products,
      productsInStock: productsInStock,
      productsInTotal: productsInTotal
    };
  };

  static #isPageNumberButton = ($, pageNumber) => {
    if (pageNumber < 2 || pageNumber > 5) {
      throw new Error('The page number has to be between 2 and 5 (including)');
    } else {
      return (
        parseInt(
          $('.pagination')
            .first()
            .children()
            .eq(pageNumber - 1)
            .text(),
          10
        ) === pageNumber
      );
    }
  };

  static #howManyPagesAre = ($) => {
    if (this.#isPageNumberButton($, 5)) {
      // Can be either 5 or more
      // How much page numbers really are?
      let lastPageNumber = $('.pagination')
        .first()
        .children()
        .last()
        .children()
        .attr('href');

      lastPageNumber = lastPageNumber.split('pagina')[1];
      lastPageNumber = lastPageNumber.replace('/', '');

      return parseInt(lastPageNumber, 10);
    }

    if (this.#isPageNumberButton($, 4)) {
      return 4;
    }

    if (this.#isPageNumberButton($, 3)) {
      return 3;
    }

    if (this.#isPageNumberButton($, 2)) {
      return 2;
    }

    if (this.#isPageNumberButton($, 1)) {
      return 1;
    }
  };

  static async requestFirstPage(search) {
    const { $, url } = await this.#getHTMLForSearch(search, true);

    const $products = $('.product_box_container').get();

    console.log(`Products from the first page have been loaded!`);

    return {
      pageURL: url,
      productsInStock: this.#getProductData($products).productsInStock,
      productsInTotal: this.#getProductData($products).productsInTotal,
      products: this.#getProductData($products).products
    };
  }

  static async requestAllPages(search, delayTime = 2000) {
    const { $, url } = await this.#getHTMLForSearch(search, true);

    const totalNumberOfPages = this.#howManyPagesAre($);

    console.log(`There are ${totalNumberOfPages} pages in total`);

    let pages = [];

    await delay(delayTime);

    let productsInStock = 0;
    let productsInTotal = 0;

    for (let i = 1; i <= totalNumberOfPages; i++) {
      const { $, url: pageURL } = await this.#getHTMLForPage(url, i, true);

      const $products = $('.product_box_container').get();

      pages.push({
        page: i,
        pageURL,
        productsInStock: this.#getProductData($products).productsInStock,
        productsInTotal: this.#getProductData($products).productsInTotal,
        products: this.#getProductData($products)
      });

      productsInStock += this.#getProductData($products).productsInStock;
      productsInTotal += this.#getProductData($products).productsInTotal;

      console.log(`Products from page ${i} have been loaded!`);

      await delay(delayTime);
    }

    return {
      productsInStock,
      productsInTotal,
      pagesInTotal: totalNumberOfPages,
      pages
    };
  }

  static async requestByCategory(category, delayTime = 2000) {
    const { $, url } = await this.#getHTMLForSearch(category, true);

    const totalNumberOfPages = this.#howManyPagesAre($);

    console.log(`There are ${totalNumberOfPages} pages in total`);

    let pages = [];

    await delay(delayTime);

    let productsInStock = 0;
    let productsInTotal = 0;

    for (let i = 1; i <= totalNumberOfPages; i++) {
      const { $, url: pageURL } = await this.#getHTMLForPage(url, i, true);

      const $products = $('.product_box_container').get();

      pages.push({
        page: i,
        pageURL: pageURL,
        productsInStock: this.#getProductData($products).productsInStock,
        productsInTotal: this.#getProductData($products).productsInTotal,
        products: this.#getProductData($products)
      });

      productsInStock += this.#getProductData($products).productsInStock;
      productsInTotal += this.#getProductData($products).productsInTotal;

      console.log(`Products from page ${i} have been loaded!`);

      await delay(delayTime);
    }

    return {
      productsInStock,
      productsInTotal,
      pagesInTotal: totalNumberOfPages,
      pages
    };
  }
}

module.exports = PcGarage;
