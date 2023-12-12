import '#template/js/'
import './custom-js/pages'
import lozad from 'lozad'

async function loadAsync () {
    // RD form
  if (typeof window.setupRd === 'function') {
    const observer = lozad(document.getElementById('am-formulario-de-newsletter-b61733cf81abef42e0c4'), {
      rootMargin: '350px 0px',
      threshold: 0,
      load () {
        const script = document.createElement('script')
        script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js'
        script.id = 'hs-script-loader'
        script.async = true
        script.onload = window.setupRd
        document.getElementById('am-formulario-de-newsletter-b61733cf81abef42e0c4').appendChild(script)
      }
    })
    observer.observe()
  }

    //popup
   lozad(document.getElementById('popup-rd'), {
    rootMargin: '350px 0px',
    threshold: 0,
    load () {
      const script = document.createElement('script')
      script.src = 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/0541136d-12e0-496c-9058-0def4b5ad0d4-loader.js'
      script.id = 'rd-popup'
      script.async = true
      document.getElementById('popup-rd').appendChild(script)
    }
  }).observe()

}
loadAsync()

window.__customGTMVariantRegex = /\s[^\s]+( zero a[ç|c][ú|u]car)?$/i

const loadVendaValida = () => {
    const script = document.createElement('script')
    script.src = '//collect.vendavalida.com.br/push.js'
    script.id = 'venda-valida'
    script.type = 'text/javascript'
    script.async = true
    document.body.appendChild(script)
}

function loadMailbiz() {
    (function(m, a, i, l, b, z, j, s) {
        m['MailbizIntegration'] = {
          id: b,
          ready: 0
        };
        z = a.createElement(i);
        j = a.getElementsByTagName(i)[0];
        z.async = 1;
        z.src = l;
        j.parentNode.insertBefore(z, j);
      })(window, document, 'script', 'https://d3eq1zq78ux3cv.cloudfront.net/static/scripts/integration.min.js', '63a0a5f3a8aebb115f90b412');
}

function loadBeeviral () {
    !function (f, b, e, v, n, t, s) {
        t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        t.onload = function () {
            beeviralTracking.Send({
                token: "aipOcmlMVDhGTVZxcExVMFVJKkZKdGQwVkdYanNzRDlFWlRpVTdrQmxGRzhSS0xGclFQbjlJSlRLekxrekpqQA=="
            }, false, true);
        };
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://account.beeviral.app/Scripts/app/tracking.js');
}

  $(window).one('scroll', () => {
    loadVendaValida()
    loadMailbiz()
    if (window.location.pathname === '/') {
        loadBeeviral()
    }
  })
