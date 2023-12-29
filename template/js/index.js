import '#template/js/'
import './custom-js/pages'


window.__customGTMVariantRegex = /\s[^\s]+( zero a[ç|c][ú|u]car)?$/i



  $(window).one('scroll', () => {
    loadVendaValida()
    loadMailbiz()
    if (window.location.pathname === '/') {
        loadBeeviral()
    }
  })
