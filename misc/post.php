<?php

defined( 'ABSPATH' ) || exit;

/**
 * Generic Post Functions
 */
if ( ! function_exists( 'udesly_get_post_thumbnail_alt' ) ) {

	function udesly_get_post_thumbnail_alt(): string {
		$post_thumbnail_id = get_post_thumbnail_id();
		if ( ! $post_thumbnail_id ) {
			return "";
		}

		return esc_attr(get_post_meta( $post_thumbnail_id, '_wp_attachment_image_alt', true ));
	}

}

if ( ! function_exists( 'udesly_the_post_thumbnail_alt' ) ) {

	function udesly_the_post_thumbnail_alt() {
		echo udesly_get_post_thumbnail_alt();
	}

}

if (!function_exists('udesly_get_image'))  {

	function udesly_get_image( $args = [] ) {

		$args  = wp_parse_args( $args, [
			"id"   => null,
			"size" => "post-thumbnail"
		] );

		if ( ! $args["id"] ) {
			$args["id"] = get_post_thumbnail_id();
		}

		$key   = "udesly_img_" .  $args["id"]. "_" . $args["size"];

		$cache = wp_cache_get( $key, "udesly_theme" );
		if ( $cache ) {
			return $cache;
		}

		if ( ! $args["id"] ) {
			return (object) [
				"src"    => "",
				"alt"    => "",
				"srcset" => "",
				"sizes"  => ""
			];
		}

		$image = (object) [
			"alt" => udesly_get_post_thumbnail_alt(),
			"src"    => esc_url( wp_get_attachment_image_url( $args["id"], $args["size"] ) ?? '' ),
			"srcset" => wp_get_attachment_image_srcset( $args["id"] ),
			"sizes"  => wp_get_attachment_image_sizes( $args["id"] ),
		];

		wp_cache_set( $key,  $image, "udesly_theme" );

		return $image;
	}
}


if (!function_exists('udesly_define_post_type')) {

	function udesly_define_post_type(string $post_type, array $args) {

		if (post_type_exists($post_type)) {
			return;
		}

		$args = wp_parse_args($args, [
			'public' => true,
			'has_archive' => true,
			'show_in_rest' => true,
			'rest_base' => "post-type/$post_type",
			'supports' => ['author', 'excerpt', 'thumbnails', 'title'],
		]);

		$args = apply_filters('udesly_define_post_type_args', $args, $post_type);

		register_post_type($post_type,
			$args
		);

	}
}

if (!function_exists('udesly_define_taxonomy')) {

	function udesly_define_taxonomy(string $taxonomy, array $args, $object_type = []) {

		if (taxonomy_exists($taxonomy)) {
			return;
		}

		$args = wp_parse_args($args, [
			'public' => true,
			'has_archive' => true,
			'show_in_rest' => false,
			'rest_base' => "taxonomy/$taxonomy",
			'show_admin_column' => false,
			'supports' => ['author', 'excerpt', 'thumbnails', 'title'],
		]);

		$args = apply_filters('udesly_define_taxonomy_args', $args, $taxonomy);

		register_taxonomy(
			$taxonomy,
			$object_type,
			$args
		);

	}
}

