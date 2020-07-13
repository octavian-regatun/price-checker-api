const cheerio = require('cheerio');
const fetch = require('node-fetch');

class PcGarage {
	static URL = 'https://www.pcgarage.ro/cauta';

	static #getHTML = async (search) => {
		try {
			const $ = await fetch(`${this.URL}/${search}`, { method: 'GET' })
				.then((response) => response.text())
				.then((body) => cheerio.load(body));

			return $;
		} catch (error) {
			console.log(error);
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
				price = Number.parseFloat(price);

				const name = $('.product_box_name').children().attr('title');

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

	static #isPageNumberButton = async ($) => {
		console.log($('.pagination').first().children().length);
	};

	static async requestFirstPage(search) {
		const $ = await this.#getHTML(search);

		const $products = $('.product_box_container').get();

		const response = { products: this.#getProductData($products) };

		return response;
	}
}
module.exports = PcGarage;
