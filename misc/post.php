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

if (! function_exists('_udesly_sanitize_image_obj')) {
	function _udesly_sanitize_image_obj($obj) {
		$args = [
			"id" => "local",
			"src"    => "",
			"alt"    => "",
			"srcset" => "",
			"sizes"  => ""
		];

		if (property_exists($obj, "alt")) {
			$args['alt'] = $obj->alt;
		}
		if (property_exists($obj, "src")) {
			if (\Udesly\Utils\StringUtils::contains($obj->src, ':')) {
				$args['src'] = $obj->src;
			} else {
				$args['src'] = untrailingslashit(get_template_directory_uri()) . $obj->src;
			}
		}
		if (property_exists($obj, "srcset") && is_array($obj->srcset)) {
			foreach ($obj->srcset as $src) {
				if (\Udesly\Utils\StringUtils::contains($src, ':')) {
					$args['srcset'] .= $src;
				} else {
					$args['srcset'] .= untrailingslashit(get_template_directory_uri()) . $src . ", ";
				}
			}
		}

		return (object) $args;
	}
}

if (!function_exists('udesly_get_image'))  {

	function udesly_get_image( $args = [] ) {

		if (is_object($args) && !property_exists($args, 'id')) {

			return _udesly_sanitize_image_obj($args);
		} else {
			$args = (array) $args;
		}

		$args  = wp_parse_args( $args, [
			"id"   => null,
			"size" => "full"
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
				"id" => "",
				"src"    => "",
				"alt"    => "",
				"srcset" => "",
				"sizes"  => "",
				"caption" => ""
			];
		}

		$image = (object) [
			"id" => $args["id"],
			"alt" => get_post_meta( $args["id"], '_wp_attachment_image_alt', true ) ?? "",
			"src"    => esc_url( wp_get_attachment_image_url( $args["id"], $args["size"] ) ?? '' ),
			"srcset" => wp_get_attachment_image_srcset( $args["id"] ),
			"sizes"  => wp_get_attachment_image_sizes( $args["id"] ),
			"caption" => wp_get_attachment_caption($args["id"])
		];

		wp_cache_set( $key,  $image, "udesly_theme" );

		return $image;
	}
}

function udesly_get_fake_set_item() {
	return ["image" => (object) [
		"id" => "",
		"src"    => "",
		"alt"    => "",
		"srcset" => "",
		"sizes"  => "",
		"caption" => ""
	]];
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
			'supports' => ['author', 'excerpt', 'editor', 'thumbnail', 'title'],
		]);

		$args = apply_filters('udesly/post_type/args', $args, $post_type);

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
			'show_in_rest' => true,
			'rest_base' => "taxonomy/$taxonomy",
			'show_admin_column' => true,
			'supports' => ['author', 'excerpt', 'thumbnails', 'title'],
		]);

		$args = apply_filters('udesly/taxonomy/args', $args, $taxonomy);

		register_taxonomy(
			$taxonomy,
			$object_type,
			$args
		);

	}
}
if (!function_exists('udesly_get_the_terms')) {


	function udesly_get_the_terms($taxonomy, $limit = -1) {
		global $post;

		$terms = get_the_terms($post, $taxonomy);
		if (!$terms) {
			return [];
		}
		if ($limit < 1) {
			return $terms;
		}
		return array_slice($terms, 0, $limit);
	}

}

if (!function_exists('udesly_get_the_term')) {

	function udesly_get_the_term($taxonomy) {
		$terms = udesly_get_the_terms($taxonomy);
		if (isset($terms[0])) {
			return $terms[0];
		}
		return false;
	}
}