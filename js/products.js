/*
    SEARCH:
    
    1. First time, display products [all products]
    2. On search:
        Empty old list of products
        Render new list of products [some products]
        
*/
window.productProject = window.productProject || {};

$(document).ready(function () {
  /*global _*/
  $.getJSON('data/product.json', function(products) {
    window.productProject.products = products;
    initializeUI(products);
  }).fail(function(error) {
      console.log("There's a problem with your product JSON");
  });
});

// function checkout(product) {
//     // create form that displays purchase button next to each product
//     var handler = StripeCheckout.configure({
//     key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
//     image: '/img/documentation/checkout/marketplace.png',
//     locale: 'auto',
//     token: function(token) {
//       // Use the token to create the charge with a server-side script.
//       // You can access the token ID with `token.id`
//     }
//   });

//   $('#customButton').on('click', function(e) {
//     // Open Checkout with further options
//     handler.open({
//       name: 'Stripe.com',
//       description: '2 widgets',
//       amount: product.price
//     });
//     e.preventDefault();
//   });

//   // Close Checkout on page navigation
//   $(window).on('popstate', function() {
//     handler.close();
//   });
// }

function initializeUI(products) {
    
    $('#product-list').append(createProductListItems(products));
    $('input', '#form-search').on('keyup', function(event){
        //event.preventDefault();
        console.log(event.target.value);
        var term = event.target.value;
        var productList = $('#product-list');
        productList.empty();
        var filteredList = search(products, term);
        productList.append(createProductListItems((filteredList)));
        /* 
         * 1. do you have a search term? you must get it from your form, how?
         * 2. if yes, perform search
         * 3. if search results: 
         *      a: blow old list
         *      b: build array of list items for search results
         *      c: add the array of li to the ul
         */
    });
}

function createProductListItems(products) {
    return $.map(products, function(product) {
        // create div with class of row
      return $('<main>')
      // .attr('id', 'product.id')
        // .data('product', product)
        .addClass('row')
        .append($('<div>').addClass('col-sm-2')
        // .attr('id', 'product.id')
        // .data('product', product)
        .append(makeImageTag("img/product/thumbs/" + product.image)))
        .attr('id', 'product.id')
        .data('product', product)
        .append($('<div>').addClass('col-sm-10').append(makeDetails(product.desc, product.price, product.stock)));
        // .attr('id', 'product.id')
        // .data('product', product)
        // .addClass('product-row')
        // .append(makeImageTag("img/product/thumbs/" + product.image))
        // .append(makeDetails(product.desc, product.price, product.stock));
    });
}

function makeImageTag(url) {
    return $('<div>').append($('<img>').attr('src', url));
}

function makeDetails(desc, price, stock) {
        var container = $('<div>');
        if(stock < 10) {
            container.append($('<div>').addClass('desc').html(desc))
            .append($('<div>').addClass('price').html(price))
            .append($('<div>').addClass('stock').html(stock))
            .append($('<div>ALMOST OUT OF STOCK</div>'));
        } else {
            container.append($('<div>').addClass('desc').html(desc))
            .append($('<div>').addClass('price').html(price))
            .append($('<div>').addClass('stock').html(stock));
        }
        return container;
}

/**
 * Search takes a collection (Array or Object), and a search term as the 
 * target, and will recursively search thru the collection for the target, 
 * returning an Array of all Objects of the parent collection whose 
 * nested values matched the target.
 * 
 * TO SOLVE: Iterate over the collection
 *  a. If your value is a string? does this string contain (substring) your target?
 *  b. If your value is not a string? 
 *      (you could exclude all other primatives, Number, Boolean)
 *      what if the value is another Array or Object?
 */
function search(coll, target) {
    return _.reduce(coll, function (output, value) {
        if(isComplex(value)) {
            if(search(value, target).length) {
                output.push(value);
            }
        } else if(typeof value === 'string') {
            if(value.toLowerCase().indexOf(target.toLowerCase()) > -1) {
                output.push(value);
            }
        }
        return output;
    }, []);
}

/**
 * Returns true if value is Array or Object.
 * 
 * TO SOLVE: Figure out if the value is an Array, BUT also figure out if the 
 * value is an Object intended as a collection. ie, not a Date, not a null value
 */
function isComplex(value) {
    if(Array.isArray(value)) return true;
    if(typeof value === 'object' && value !== null && value instanceof Date === false) return true;
    return false;
}
