// When DOM is fully loaded
jQuery(document).ready(function($) {


	/* Enable Strict Mode
	 ---------------------------------------------------------------------- */
	"use strict";


	/* Main Settings
	 ---------------------------------------------------------------------- */

	// Detect Touch Devices
	var isTouch = ( ( 'ontouchstart' in window ) || ( navigator.msMaxTouchPoints > 0 ) );

	if ( isTouch ) {

		$( 'body' ).addClass( 'touch-device' );

	}


	/* Navigation
	 ---------------------------------------------------------------------- */
	(function() {


		/* Top navigation
	 	 ------------------------- */

	 	if ( $( '#nav li' ).length ) {
			
			// Create top navigation
			$( document ).on( 'mouseenter', '#nav ul li', function() {
				var 
					$this = $( this ),
					$sub  = $this.children( 'ul' );
				if ( $sub.length ) {
					$this.addClass('active');
		            var elm = $('ul:first', this);
		            var off = elm.offset();
		            var l = off.left;
		            var w = elm.width();
		            var docH = $('body').height();
		            var docW = $('body').width();

		            var isEntirelyVisible = (l + w <= docW);

		            if (!isEntirelyVisible) {
		                $sub.addClass('edge');
		            } else {
		                $sub.removeClass('edge');
		            }
		        }
				$sub.stop( true, true ).addClass( 'show-list' );
			}).on( 'mouseleave', '#nav ul li', function() {
				$( this ).removeClass( 'active' ).children( 'ul' ).stop( true, true ).removeClass( 'show-list edge' );
			});

			// Add Top nav to main nav
			$( '#nav ul, #nav li' ).addClass( 'top-nav-el' );
			var $top_nav = $( '#nav > ul' ).children().clone();
			if ( $( '#main-nav ul' ).length <= 0 ) {
				$( '#main-nav' ).append( '<ul></ul>' );
				$( '#main-nav ul' ).append( $top_nav );
			}
			else {
				$( $top_nav ).insertBefore( '#main-nav ul > li:first-child:eq(0)' );
			}

		}

		// Main navigation
		// Slidebar

		$( '#main-nav .menu-item-has-children > a' ).each(function(){
			$( this ).after('<i class="submenu-trigger icon icon-angle-down"></i>' );
		});

		$( '#main-nav > ul > li' ).addClass( 'first-child' );
		$( '#main-nav .submenu-trigger, #main-nav .menu-item-has-children > a[href="#"]' ).on( 'click touch', function(e){
			e.preventDefault();
			var li = $( this ).closest('li'),
				main_index = $( this ).parents( '.first-child' ).index();
			$( '#main-nav > ul > li:not(:eq('+main_index+')) ul:visible' ).slideUp();
			li.find( ' > ul' ).slideToggle(400);
		});

		// Menu Trigger
		$( '#menu-trigger' ).on( 'click touch', function(e){
			e.preventDefault();
			$('body').addClass('slidebar-visible');
		});

		$( '#slidebar-close, #slidebar-layer' ).on( 'click touch', function( e ){
			e.preventDefault();
			$('body').removeClass('slidebar-visible');
		});

		// Close Slidebar after click on hash anchor
		$( document ).on( 'click touch', '#slidebar-content a[href*=#]', function(e){
			if ( $( this ).attr( 'href' ) != '#'  ) {
				$('body').removeClass('slidebar-visible');
			}
		});

		$( "#slidebar-content #searchform" ).keypress(function(e) {
		    if ( (e.keyCode == 13) && (e.target.type != "textarea") ) {
				e.preventDefault();
				$( this ).submit();
				$( this ).attr('readonly', 'readonly');
		   		$( this ).attr('disabled', 'true');
				setTimeout(function() {
					document.activeElement.blur();
					$( this ).blur(); 
					$( this ).removeAttr('readonly');
					$( this ).removeAttr('disabled');
				}, 100);

		    }
		});
		

		/* Hash Links
	 	 ------------------------- */
	 	if ( controls_vars.ajaxed == 0 ) {

	 		// Jump hash after load
	 		var target_hash = location.hash;

	 		var offset = parseInt( $( '#header' ).css( 'height' ), 10 );

	 		if ( target_hash != '' && $( target_hash ).length ) {

	 			var scroll_offset = $( target_hash ).offset().top + offset;
				$( 'html, body' ).animate({
					scrollTop: scroll_offset
				}, 900);
	 		}

				
	 		$( document ).on( 'click', '#nav a[href*=#], #ajax-container a[href*=#], #slidemenu a[href*=#], #slidebar-content a[href*=#]', function(e){
	 			var that = $( this );
	 			var url = that.attr( 'href' );
	 			var target_hash = location.hash;
				
				if ( that.attr( 'href' ) !== '#' ) {

					var hash = url.split('#')[1];

					if ( hash ) {

						hash = $( this ).attr( 'href' ).replace(/^.*?#/,'');
						hash = '#' + hash;
						
						url = url.replace( hash, '' );
						offset = $( this ).data( 'offset' );
						if ( offset == undefined || offset == '' ) {
					
							offset = parseInt( $( '#header' ).css( 'height' ), 10 );
							offset = -(offset);
						}
					} else {
						hash = '';
					}

					if ( url === '' ) {
						url = ajax_vars.home_url+'/';
					}

					if ( url !== window.location.href.split('#')[0] ) {
						
						window.location.href = url+hash;
						
					} else {
						if ( hash !== '' && hash !== '#' ) {
							var scroll_offset = $( hash ).offset().top + offset;
							$( 'html, body' ).animate({
								scrollTop: scroll_offset
							}, 900);
						}
					}
				}

				e.preventDefault();


	 		} );
	 		
		}


	})();


	/* Small Functions
	 ---------------------------------------------------------------------- */
	(function() {


		// Scroll Button
	 	if ( ! $( 'body' ).hasClass( 'no-scroll' ) ) {
			$( 'body' ).append('<span id="scroll-button"><i></i></span>');
			$( '#scroll-button' ).on( 'click', function(e) {
				TweenMax.to( window, 1, { scrollTo:{ y:0, autoKill:false }, ease:Power2.easeOut, onComplete: function(){
					$( '.intro.quick-scroll > .parallax.image-container' ).css( 'background-position', '50% 0px' )

				} } );
				e.preventDefault;
				return false;
			});
		}

		// Tooltip
		$( '.tip.active-tip' ).topTip();


	})();


	/* Ajax Filters
	 ---------------------------------------------------------------------- */
 	(function() {

		// Open dropdown
		$( document ).on( 'click', '.filters-wrapper .filter', function(event) {

			event.preventDefault();

			$( this ).parents( '.filters-wrapper' ).find( '.is-visible' ).not( this ).removeClass( 'is-visible' );

			$( this ).toggleClass( 'is-visible' );
			
		} );

		// List click action
		$( document ).on( 'click', '.filter-dropdown-content ul li a', function(event) {

			event.preventDefault();

			var 
				$filter = $( this ).parents( '.filter' ),
				$grid = $filter.parents( '.grid-wrapper' ).attr( 'data-grid' ),
				obj = $.parseJSON( $filter.attr('data-obj') ),
				cat_name = $( this ).text(),
				selected_filter = $filter.find( '.filter-title' ).attr( 'data-filter-name' ),
				hh = 0;

			obj['filter_name'] = $( this ).attr( 'data-filter-name' );
			
			if ( $( '#wpadminbar' ).length ) {
				hh = $( '#wpadminbar' ).outerHeight();
			}
			
			if ( obj.filter_name != selected_filter ) {

				// Clear filters
				$filter.parents( '.filters-wrapper' ).find( '.filter' ).not( $filter ).each( function(){
					var 
						temp_name = $( this ).find('ul li:first-child').text();
					$( this ).find( '.filter-title' ).text( temp_name );
					$( this ).find( '.filter-title' ).attr( 'data-filter-name', '' );
					$( this ).removeClass( 'active' );
				});

				// Classes
				$filter.addClass( 'loading active' );
				$( '.load-more' ).removeClass( 'loaded loading' );

				if ( $( '#header.always-show-header' ).length ) {
					var header_height = $( '#header.always-show-header' ).outerHeight();
					TweenLite.to( window, 0.4, {scrollTo:{ y:$filter.offset().top-hh-header_height} } );
				} else {
					TweenLite.to( window, 0.4, {scrollTo:{ y:$filter.offset().top-hh } } );
				}

				$filter.find( '.filter-title' ).text( cat_name ).attr( 'data-filter-name', obj.filter_name );;
				$filter.find( '.filter-title' ).attr( 'data-filter-name', obj.filter_name );

				// Pagenum
				obj['pagenum'] = 1;
				$( '.load-more' ).attr( 'data-pagenum', 2 );

				// Hide messages
				$( '.ajax-messages .message' ).hide();
				$( '.' + $grid ).find( '.masonry-item .active-tip' ).removeClass( 'active-tip' );
				$( '.' + $grid ).find( '.masonry-item' ).addClass( 'masonry-item--hide' );
	
				setTimeout( function() { 
					// Ajax
					$.ajax({
						url: ajax_action.ajaxurl,
						type: 'post',
						data: {
							action: obj['action'],
							ajax_nonce : ajax_action.ajax_nonce,
							obj: obj
						},
						success: function( result ) {

							if ( result == 'Busted!' ) {
								location.reload();
								return false;
							}

							var 
								$result = $( result ),
								$container = $( '.' + $grid );
								$container.isotope( 'remove', $container.isotope( 'getItemElements' ) );

							if ( result == 'no_results' ) {
								$filter.removeClass( 'loading' );
								$( '.load-more-wrap' ).addClass( 'hidden' );
								return;
							}

							$result.imagesLoaded( { background: true }, function() {
								$filter.removeClass( 'loading' );
								$container.append( $result ).isotope( 'appended', $result );
								$container.isotope( 'layout' );

								if ( $container.find( '.end-posts' ).length ) {
									// Hide loader
									$( '.load-more-wrap' ).addClass( 'hidden' );
								} else {
									$( '.load-more-wrap' ).removeClass( 'hidden' );
								}

								var $count = 1;

								var _addClass = function(){
									setTimeout( function() {
										var added_item = $container.find( '.masonry-item' ).eq($count-1);
										added_item.addClass( 'masonry-item--appear' );
										var added_item_tip = added_item.find('.tip');
										added_item_tip.addClass( 'active-tip' );
										if ( $container.find( '.masonry-item' ).length >= $count ) {

											$count++;
		
											_addClass();
										}
									}, 200);

								}
								
								_addClass();

							});
						},
						error: function( request, status, error ) {
							var 
								$container = $( '.' + $grid );

							$container.isotope( 'remove', $container.isotope( 'getItemElements' ) );
							$container.css( 'height', 0 );
							$filter.removeClass( 'loading' );
							$( '.message.ajax-error' ).fadeIn(400);
						}
					});
				}, 300);
			}
			
		} );


		// Load more post
		$( document ).on( 'click', '.load-more', function(event) {

			event.preventDefault();

			if ( ! $( '.filter' ).length ) return;

			var 
				$this = $( this ),
				$filter,
				$grid,
				obj;

			// Check active filter (if exists)
			if ( $( '.filters-wrapper .filter.active' ).length ) {
				$filter = $( '.filters-wrapper .filter.active' );
				obj = $.parseJSON( $filter.attr('data-obj') );
				obj['filter_name'] = $filter.find( '.filter-title' ).attr( 'data-filter-name' );
			} else {
				$filter = $( '.filters-wrapper .filter' );
				obj = $.parseJSON( $filter.attr('data-obj') );
				obj['filter_name'] = 'all';
			}

			// Grid
			$grid = $filter.parents( '.grid-wrapper' ).attr( 'data-grid' );

			// Pagenum
			obj['pagenum'] = parseInt( $this.attr( 'data-pagenum' ) );

			// Hide messages
			$( '.ajax-messages .message' ).hide();

			// Classes
			$this.addClass( 'loading' );
			// Ajax
			$.ajax({
				url: ajax_action.ajaxurl,
				type: 'post',
				data: {
					action: obj['action'],
					ajax_nonce : ajax_action.ajax_nonce,
					obj: obj
				},
				success: function( result ) {

					if ( result == 'Busted!' ) {
						location.reload();
						return false;
					}
							
					var 
						$result = $( result ),
						$container = $( '.' + $grid );

					if ( result == 'no_results' ) {
						$this.removeClass( 'loading' );
						$this.addClass( 'loaded' );
						return;
					}

					$result.imagesLoaded( { background: true }, function() {
						$container.removeClass( 'new-masonry-item' );
						obj['pagenum'] = obj['pagenum'] + 1;
						$this.attr( 'data-pagenum', obj['pagenum'] );
						$this.removeClass( 'loading' );
						$container.append( $( $result ).addClass( 'new-masonry-item' ) ).isotope( 'appended', $result );
						if ( $container.find( '.end-posts' ).length ) {
							// Hide loader
							$this.parent().addClass( 'hidden' );
						} else {
							$this.parent().removeClass( 'hidden' );
						}

						$container.isotope( 'layout' );

						var $count = 1;

						var _addClass = function(){
							setTimeout( function() {
								var added_item = $container.find( '.new-masonry-item' ).eq($count-1);
									added_item.addClass( 'masonry-item--appear' );
								var added_item_tip = added_item.find('.tip');
								added_item_tip.addClass( 'active-tip' );
								if ( $container.find( '.new-masonry-item' ).length >= $count ) {

									$count++;

									_addClass();
								}
							}, 200);

						}
						
						_addClass();
					});
				},
				error: function( request, status, error ) {
					var 
						$container = $( '.' + $grid );

					$this.attr( 'data-pagenum', '2' );
					$container.isotope( 'remove', $container.isotope( 'getItemElements' ) );
					$container.css( 'height', 0 );
					$this.removeClass( 'loading' );
					$( '.message.ajax-error' ).fadeIn(400);
				}
			});
			
		} );

		
	})();

	/* ==================================================
	  WPAjax Loader 
	================================================== */
	(function() {

        function _load_anim_start() {
            if ( $( '.wpal-loading-layer' ).length <= 0 ) {
                return false;
            }
            $( 'body' ).addClass('loading');
            $( '.wpal-loading-layer' ).css( 'visibility', 'visible' ).addClass( 'show-layer' );
			
        }

        function _load_anim_end() {

            if ( $( '.wpal-loading-layer' ).length <= 0 ) {
                return false;
            }
            $( 'body' ).addClass( 'wp-ajax-loader loaded' ).removeClass('loading');
           	$( '.wpal-loading-layer' ).addClass( 'hide-layer' );
			setTimeout( function(){ $( '.wpal-loading-layer' ).css( 'visibility', 'hidden' ).removeClass( 'hide-layer show-layer' ); }, 1400);

        }

        function _load_anim_redirect(url) {
            $( 'body' ).addClass('loading');
            $( '.wpal-loading-layer' ).css( 'visibility', 'visible' ).addClass( 'show-layer' ); 
            setTimeout( function(){ window.location.href = url; }, 400 );
        }


        if ( controls_vars.ajaxed == 0 || window.location.href.indexOf( 'customize.php' ) > -1 ) {
            _load_anim_end();


        } else {
            $.WPAjaxLoader({
                home_url : controls_vars.home_url,
                theme_uri : controls_vars.theme_uri,
                dir : controls_vars.dir,
                reload_containers : controls_vars.ajax_reload_containers,
                permalinks : controls_vars.permalinks,
                ajax_async : controls_vars.ajax_async,
                ajax_cache : controls_vars.ajax_cache,
                ajax_events : controls_vars.ajax_events,
                ajax_elements : controls_vars.ajax_elements,
                excludes_links : controls_vars.ajax_exclude_links,
                reload_scripts : controls_vars.ajax_reload_scripts,
                search_forms : '#searchform',
                start_delay: 1200,
                nav: '#nav-main',
                header_container : '#header',
                loadStart : function() {
                    
                    // Close playlist 
                    if ( $( '#scamp_player.sp-show-list' ).length ) {
                        $( '#scamp_player' ).removeClass( 'sp-show-list' );
                    }
                    
                    // Close Slidebar after page loaded
					$('body').removeClass('slidebar-visible');

					// Remove tooltip
					$( '#tip' ).remove();

                    _load_anim_start()

                     $.event.trigger({
                        type: "AjaxLoadStart"
                    });

                },
                loadEnd : function(){

                    /* Custom Post Navigation */
                    if ( $('.custom-post-nav' ).length ) {
                        $('.custom-post-nav.is-active' ).remove();
                        $('.custom-post-nav' ).detach().appendTo( 'body' );
                        $('.custom-post-nav' ).addClass( 'is-active' );
                    }

                    /* YT API Init */
                    if((typeof YT !== "undefined") && YT && YT.Player){
						$( 'body' ).addClass( 'YTAPI' );
					};

                    _load_anim_end();
                     $.event.trigger({
                        type: "AjaxLoadEnd"
                    });
                },
                redirectStart: function(url){
                    console.log(url);
                    _load_anim_redirect(url);

                }
            });

            $.WPAjaxLoader.init(function(){});

        }

    })();

});

// Load the YouTube API asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Create the player object when API is ready
window.onYouTubeIframeAPIReady = function () {
    document.body.className += " YTAPInit";
};