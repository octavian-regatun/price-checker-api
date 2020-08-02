const cheerio = require('cheerio');
const fetch = require('node-fetch');
const delay = require('delay');

class PcGarage {
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

  static URL = 'https://www.pcgarage.ro/cauta';

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

  static #getHTMLForPage = async (URL, page) => {
    const $ = await fetch(`${URL}/pagina${page}`, { method: 'GET' })
      .then((response) => response.text())
      .then((body) => cheerio.load(body));

    return $;
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

  static #getProductData = ($products) => {
    const products = [];
    for (const $product of $products) {
      const $ = cheerio.load($product);

      const stock = $('.product_box_availability').text();

      if (stock.trim() !== 'Nu este in stoc') {
        let price = $('.price').text();
        price = price.replace(' RON', '');
        price = price.replace('.', '');
        price = price.replace(',', '.');
        price = parseFloat(price);

        const name = $('.product_box_name').children().children().attr('title');

        let imgSrc = $('img').eq(0).attr('srcset');
        imgSrc = imgSrc.split(',')[0];

        let link = $('.product_box')
          .children()
          .first()
          .children('a')
          .attr('href');

        products.push({ name, price, imgSrc, link });
      }
    }

    return products;
  };

  static async requestAllPages(search) {
    const { $, url: URL } = await this.#getHTMLForSearch(search, true);

    await delay(5000);

    const totalNumberOfPages = this.#howManyPagesAre($);

    let response = [];

    for (let i = 1; i <= totalNumberOfPages; i++) {
      const $ = await this.#getHTMLForPage(URL, i);

      const $products = $('.product_box_container').get();

      response.push({ page: i, products: this.#getProductData($products) });

      console.log(`Products from page ${i} have been loaded!`);

      await delay(5000);
    }

    return response;
  }

  static async requestFirstPage(search) {
    const $ = await this.#getHTMLForSearch(search);

    const $products = $('.product_box_container').get();

    console.log(`Products have been loaded!`);

    return { products: this.#getProductData($products) };
  }
}

module.exports = PcGarage;
