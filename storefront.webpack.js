// storefront.webpack.js

const path = require('path')

const dirSearchAlias = path.resolve(__dirname, 'template/js/lib/search-engine')

module.exports = () => ({
  resolve: {
    alias: {
      './methods/set-search-term': path.resolve(dirSearchAlias, 'set-search-term'),
      './html/CartQuickview.html': path.resolve(__dirname, 'template/js/custom-js/html/CartQuickview.html'),
      './js/CartQuickview.js': path.resolve(__dirname, 'template/js/custom-js/js/CartQuickview.js'),
      './html/APrices.html': path.resolve(__dirname, 'template/js/custom-js/html/APrices.html'),
      './html/AccountPoints.html': path.resolve(__dirname, 'template/js/custom-js/html/AccountPoints.html'),
      './html/ProductCard.html': path.resolve(__dirname, 'template/js/custom-js/html/ProductCard.html'),
      './html/ProductVariations.html': path.resolve(__dirname, 'template/js/custom-js/html/ProductVariations.html'),
      './js/ProductCard.js': path.resolve(__dirname, 'template/js/custom-js/js/ProductCard.js'),
      './html/DiscountApplier.html': path.resolve(__dirname, 'template/js/blow-gummies/html/DiscountApplier.html'),
      './js/DiscountApplier.js': path.resolve(__dirname, 'template/js/blow-gummies/js/DiscountApplier.js'),
      './html/ShippingCalculator.html': path.resolve(__dirname, 'template/js/custom-js/html/ShippingCalculator.html'),
      './js/ShippingCalculator.js': path.resolve(__dirname, 'template/js/custom-js/js/ShippingCalculator.js'),
      './html/TheCart.html': path.resolve(__dirname, 'template/js/custom-js/components/TheCart.html'),
      './js/TheCart.js': path.resolve(__dirname, 'template/js/custom-js/components/TheCart.js'),
      './js/TheProduct.js': path.resolve(__dirname, 'template/js/custom-js/components/TheProduct.js'),
      './html/TheProduct.html': path.resolve(__dirname, 'template/js/custom-js/components/TheProduct.html'),
      './html/EcCheckout.html': path.resolve(__dirname, 'template/js/custom-js/components/EcCheckout.html'),
      './js/InstantSearch.js': path.resolve(__dirname, 'template/js/custom-js/js/InstantSearch.js') 
    }
  }
})
