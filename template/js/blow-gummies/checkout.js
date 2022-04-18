// Add your custom JavaScript for checkout here.
import ecomCart from '@ecomplus/shopping-cart'
ecomCart.once('change', () => {
    if (document.querySelectorAll('.cart .recommended-items').length) {
        document.querySelector('.cart .col-md-5.col-lg-4').insertAdjacentElement('afterend', document.querySelector('.cart .recommended-items'))     
    }
})
