/*
  COMPRA CON SHOPIFY — SOLO CÓDIGO. NO SE MUESTRA EN LA PÁGINA.

  No hay tienda real. Los valores de abajo son placeholders.
  No poner aquí un dominio real, un token real ni claves de Wompi.

  La página sigue diciendo «Reservar» y lleva a #contacto.
  No hay botón Comprar, carrito ni enlace de checkout.
  Una revisión posterior puede pasar uiEnabled a true; hasta entonces
  este archivo no pinta nada y no hace ninguna petición.
*/

(function () {
  var SHOPIFY = {
    uiEnabled: false,
    storeDomain: "REEMPLAZAR.myshopify.com",
    storefrontToken: "REEMPLAZAR_TOKEN_PUBLICO_STOREFRONT",
    apiVersion: "2026-01",
    products: {
      "360": {
        sku: "miel-oscura-360",
        variantId: "gid://shopify/ProductVariant/REEMPLAZAR_360",
        priceLabel: "$25.000"
      },
      "500": {
        sku: "miel-oscura-500",
        variantId: "gid://shopify/ProductVariant/REEMPLAZAR_500",
        priceLabel: "$30.000"
      },
      "700": {
        sku: "miel-oscura-700",
        variantId: "gid://shopify/ProductVariant/REEMPLAZAR_700",
        priceLabel: "$40.000"
      },
      "1500": {
        sku: "miel-oscura-1500",
        variantId: "gid://shopify/ProductVariant/REEMPLAZAR_1500",
        priceLabel: "$80.000"
      }
    }
  };

  function cartPermalink(variantId, quantity) {
    var qty = quantity || 1;
    return "https://" + SHOPIFY.storeDomain + "/cart/" + encodeURIComponent(variantId) + ":" + qty;
  }

  function cartCreateBody(variantId, quantity) {
    return {
      query: "mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl } userErrors { message } } }",
      variables: {
        input: {
          lines: [{ merchandiseId: variantId, quantity: quantity || 1 }]
        }
      }
    };
  }

  function endpoint() {
    return "https://" + SHOPIFY.storeDomain + "/api/" + SHOPIFY.apiVersion + "/graphql.json";
  }

  /* Preparado para más adelante. No se llama al cargar la página. */
  function createCart(variantId, quantity) {
    if (!SHOPIFY.uiEnabled) return Promise.resolve(null);
    return fetch(endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY.storefrontToken
      },
      body: JSON.stringify(cartCreateBody(variantId, quantity))
    }).then(function (response) { return response.json(); });
  }

  function removeStrayPurchaseUi() {
    document.querySelectorAll("[data-shopify-ui]").forEach(function (el) {
      el.remove();
    });
  }

  window.BolcanarShopify = {
    config: SHOPIFY,
    cartPermalink: cartPermalink,
    cartCreateBody: cartCreateBody,
    createCart: createCart,
    mount: function () {
      if (!SHOPIFY.uiEnabled) return;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeStrayPurchaseUi);
  } else {
    removeStrayPurchaseUi();
  }
})();
