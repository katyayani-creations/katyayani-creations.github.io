/*  ---------------------------------------------------
    Template Name: Ogani
    Description:  Ogani eCommerce  HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';
function toggleMenu(){
    $('.hero__categories ul').slideToggle(400);
}
function openLoginBox() {
    // $("#ex2").modal({
    // 	escapeClose: false,
    // 	clickClose: false,
    // 	showClose: false,
    // 	fadeDuration: 1000,
    // 	fadeDelay: 0.50
    // });
    // setTimeout(() => {
    // 	$("#txt_wa_phone").focus();
    // }, 1000);
}

function setLike(e, prodId) {
    e.stopPropagation();
    e.preventDefault();
    $.get("./ajax.php?action=add_like&prodId=" + prodId).then(data => {
        $(".prod_like_icon_" + prodId).toggleClass("red");
        var arr = localStorage.getItem("kc-like") || "[]";
        arr = JSON.parse(arr);
        var index = arr.indexOf(prodId);
        if (index > -1) {
            arr.splice(index, 1);
        } else {
            arr.push(prodId);
        }
        localStorage.setItem("kc-like", JSON.stringify(arr));
        $(".like_icon").html(arr.length);
        for (const id of arr) {
            $(".kc-like-" + id).addClass("color-red");
        }

    });
}

function setCart(prodId, quantity, price, reload) {
    $.get("/ajax.php?action=add_cart&prodId=" + prodId + "&quantity=" + quantity + "&price=" + price)
        .then(data => {
            if (reload) {
                window.location.href = window.location.href;
            }
            $(".prod_cart_icon_" + prodId).toggleClass("red");
            var arr = localStorage.getItem("kc-cart") || "{}";
            arr = JSON.parse(arr);
            arr[prodId] = {
                quantity,
                price
            }
            let cartPrice = 0;
            for (const obj of Object.values(arr)) {
                cartPrice += obj["price"] * obj["quantity"];
            }
            localStorage.setItem("kc-cart", JSON.stringify(arr));
            $(".cart_icon").html(arr.length);
            $(".cart_price").html("₹" + cartPrice.toFixed(2));
            $(".shoping__cart__total_" + prodId).html("₹" + (price * quantity).toFixed(2));
        });
}


(function ($) {
    /*------------------
    Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
        Gallery filter
    --------------------*/
        $('.featured__controls li').on('click', function () {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }
    });

    $(document).ready(() => {
        const waNumber = localStorage.getItem("wa-number");
        const urlArr = [
            "https://katyayani-creations.in/",
            "https://katyayani-creations.in/index.php"
        ];
        if (waNumber == null && urlArr.indexOf(window.location.href) > -1) {
            openLoginBox();
        } else {
            // $(".header__top__right__auth").text(waNumber);
        }

        /*------------------
        Background Set
    --------------------*/
        if (screen.width < 600) {
            $(".hero").addClass("hero-normal");
            $("#mobile_blink").show();
        }
        $('.set-bg').each(function () {
            var bg = $(this).data('setbg');
            $(this).css('background-image', 'url(' + bg + ')');
        });
        function setBGNew() {
            $('.set-bg-new').each(function () {
                let index = $(this).data("imageindex");
                let bg = $(this).data('images').split(",");
                bg = bg.filter(item => item.length >0)
                const domain = $(this).data("domain");
                $(this).css('background-image', 'url(' + domain + bg[index%bg.length] + ')');
                index ++;
                $(this).data("imageindex", index);
            });
            setTimeout(setBGNew, 10000);
        }
        if($('.set-bg-new').length > 0){
            setBGNew();
        }

        //Humberger Menu
        $(".humberger__open").on('click', function () {
            $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
            $(".humberger__menu__overlay").addClass("active");
            $("body").addClass("over_hid");
        });

        $(".humberger__menu__overlay").on('click', function () {
            $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
            $(".humberger__menu__overlay").removeClass("active");
            $("body").removeClass("over_hid");
        });

        /*------------------
        Navigation
    --------------------*/
        $(".mobile-menu").slicknav({
            prependTo: '#mobile-menu-wrap',
            allowParentLinks: true
        });

    /*-----------------------
        Categories Slider
    ------------------------*/
    $('.categories__slider1').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: false,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
            },

            480: {
                items: 1,
            },

            768: {
                items: 1,
            },

            992: {
                items: 1,
            }
        }
    })

    $(".categories__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            }
        }
    });

    /*
        $('.hero__categories__all').on('click', function (e) {
            alert(1);
            e.preventDefault();
            e.stopPropagation();
            $('.hero__categories ul').slideToggle(400);
        });
        */
    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    $(".latest-product__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------------
        Product Discount Slider
    -------------------------------*/
    $(".product__discount__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            320: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 2,
            },

            992: {
                items: 3,
            }
        }
    });

    /*---------------------------------
        Product Details Pic Slider
    ----------------------------------*/
    $(".product__details__pic__slider").owlCarousel({
        loop: true,
        margin: 20,
        items: 4,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------
        Price Range Slider
    ------------------------ */

    let timer;
    function debounce(func, timeout = 2000) {
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
    function saveInput(min, max) {
        // $(".featured_product").show();
        $(".featured_product").each((i, obj) => {
            const price = parseInt($(obj).data("price"));
            if (price >= min && price <= max) {
                // $(obj).show(500);
                $(obj).fadeIn(2000);
            } else {
                // $(obj).hide(500);
                $(obj).fadeOut(1000);
            }
        });
    }
    //const processChange = debounce(() => saveInput());

    var rangeSlider = $(".price-range"),
        minamount = $("#minamount"),
        maxamount = $("#maxamount"),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        step: 50,
        slide: function (event, ui) {
            minamount.val('$' + ui.values[0]);
            maxamount.val('$' + ui.values[1]);
            debounce(() => saveInput(ui.values[0], ui.values[1]))()
        }
    });
    minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

    /*--------------------------
        Select
    ----------------------------*/
    $("select").niceSelect();

    /*------------------
        Single Product
    --------------------*/
    $('.product__details__pic__slider img').on('click', function () {

        var imgurl = $(this).data('imgbigurl');
        var bigImg = $('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
            $('.product__details__pic__item--large').attr({
                src: imgurl
            });
        }
    });

    /*-------------------
        Quantity change
    --------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        const input = $button.parent().find('input');
        var oldValue = input.val();
        const maxquantity = input.attr("data-maxquantity");

        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
            if(newVal > maxquantity){
                newVal = maxquantity;
            }
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        const prodId = input.attr("data-prodId");
        $button.parent().find('input').val(newVal);
        if(newVal != oldValue){
            $("#updatecart_"+prodId).submit();
        }
    });
    $("#products").autocomplete({
        source: availableTags,
        minLength: 2,
        select: function (event, ui) {
            redirectToProduct(ui.item.id, ui.item.value, ui.item.sku, ui.item.url);
        },
        response: function(event, ui) {
            if (!ui.content.length) {
                var noResult = { value:"",label:"No results found" };
                ui.content.push(noResult);
            }
        }
    });
});
})(jQuery);
