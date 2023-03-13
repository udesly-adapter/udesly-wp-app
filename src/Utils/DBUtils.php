<?php

namespace Udesly\Utils;

final class DBUtils {


	static function create_wc_attributes(array $attributes) {
		if (class_exists('woocommerce')) {
			$results = [];
			foreach ($attributes as $attribute) {
				if (!taxonomy_exists("pa_" . $attribute->slug)) {
				  wc_create_attribute([
				  	"name" => $attribute->name,
				    "slug" => $attribute->slug,
				  ]);
				}


				foreach ($attribute->values as $value) {
					self::create_term_if_necessary((object) [
						"name" => $value->name,
						"slug" => $value->slug,
						"taxonomy" => "pa_" . $attribute->slug,
					]);
				}
				$results[] = [
					"name" => "pa_" . $attribute->slug,
					"value" => "",
					"is_visible" => '1',
					"is_variation" => "1",
					"is_taxonomy" => "1"
				];
			}
			return $results;
		}
		return [];
	}

	static function create_user_if_necessary( \stdClass $user ): ?int {
		$user = sanitize_post( $user );
		if ( ! $user->user_login ) {
			return null;
		}

		$wp_user = DBUtils::get_user_by_login_name( $user->user_login );
		if ( ! $wp_user ) {
			if ( property_exists( $user, 'meta_input' ) ) {
				$meta = $user->meta_input;
				unset( $user->meta_input );
			}
			if ( property_exists( $user, 'custom_meta_input' ) ) {
				$custom_meta = $user->custom_meta_input;
				unset( $user->custom_meta_input );
			}
			$user->user_pass = wp_generate_password( 20, true );
			$id              = wp_insert_user( $user );
			if ( ! is_wp_error( $id ) ) {
				if ( isset( $meta ) ) {
					foreach ( $meta as $meta_key => $meta_value ) {
						update_user_meta( $id, $meta_key, $meta_value );
					}
				}
				if ( isset( $custom_meta ) ) {
					foreach ( $custom_meta as $meta_key => $meta_value ) {
						$meta_value = DBUtils::clean_custom_meta( $meta_value );
						if ( $meta_value ) {
							update_field( $meta_key, $meta_value,  "user_" . $id );
						}
					}
				}

				return $id;
			}

			return null;
		} else {
			return $wp_user->ID;
		}
	}

	static function clean_custom_meta( $meta_value ) {

		$type  = $meta_value->type;
		$value = $meta_value->value;

		if ( ! $type ) {
			return null;
		}

		switch ( $type ) {
			case "Color":
			case "Email":
			case "Phone":
			case "Number":
			case "Option":
			case "Date":
			case "Link":
			case "CommercePrice":
			case "PlainText":
				return sanitize_text_field( $value );
			case "RichText":
				return wp_kses_post( $value );
			case "Bool":
				return (bool) $value ? "1" : "0";
			case "ImageRef":
				$result = self::upload_from_url($value->url);
				if (isset($result['attachment_id'])) {
					if ($value->alt) {
						update_post_meta($result['attachment_id'], '_wp_attachment_image_alt', $value->alt);
					}
					return $result['attachment_id'];
				}
				return null;
			case "Video":
				return $value->url;
			case "FileRef":
				$result = self::upload_from_url($value->url);
				if (isset($result['attachment_id'])) {
					return $result['attachment_id'];
				}
				return null;
			case "Set":
				$results = [];
				foreach ($value as $image) {
					$result = self::upload_from_url($image->url);
					if (isset($result['attachment_id'])) {
						if ($image->alt) {
							update_post_meta($result['attachment_id'], '_wp_attachment_image_alt', $value->alt);
						}
						$results[] = [
							"image" => $result['attachment_id'],
						];
					}
				}
				return $results;
			case "CommercePropTable":
				return self::create_wc_attributes($value);
			case "ItemRef":
				$ref = $meta_value->ref;
				$refType = $meta_value->refType;

				if ($ref === "author") {
					$user = DBUtils::get_user_by_login_name($value);
					if ($user) {
						return $user->ID;
					}
				} else {
					if ($refType === "post") {
						$post = DBUtils::get_post_by_slug($value, ["post_type" => $ref, "fields" => "ids"]);
						if ($post) {
							return $post;
						}
					}else {
						$term = DBUtils::get_term_by_slug($value, $ref);
						if ($term) {
							return $term->term_id;
						}
					}
				}
				return null;
			case "ItemRefSet":
				$ref = $meta_value->ref;
				$refType = $meta_value->refType;
				$results = [];
				foreach ($value as $slug) {
					if ($ref === "author") {
						$user = DBUtils::get_user_by_login_name($slug);
						if ($user) {
							$results[] = $user->ID;
						}
					} else {
						if ($refType === "post") {
							$post = DBUtils::get_post_by_slug($slug, ["post_type" => $ref, "fields" => "ids"]);
							if ($post) {
								$results[] = $post;
							}
						}else {
							$term = DBUtils::get_term_by_slug($slug, $ref);
							if ($term) {
								$results[] = $term->term_id;
							}
						}
					}
				}
				return $results ?? [];
		}

		return null;


	}

	static function get_attachment_by_title( $title ) {

			$attachment = get_page_by_title($title, OBJECT, 'attachment');
//print_r($attachment);

			if ( $attachment ){
				return $attachment;
			}else{
				return null;
			}


	}

	static function upload_from_url( $image_url, $add_to_media = true ) {
		if (!$image_url) {
			return false;
		}
		$remote_image = fopen( $image_url, 'r' );

		if ( ! $remote_image ) {
			return false;
		}

		$meta = stream_get_meta_data( $remote_image );

		$image_meta     = false;
		$image_filetype = false;

		if ( $meta && ! empty( $meta['wrapper_data'] ) ) {
			foreach ( $meta['wrapper_data'] as $v ) {
				if ( preg_match( '/Content\-Type: ?((image)\/?(jpe?g|png|gif|bmp|webp|svg))/i', $v, $matches ) ) {
					$image_meta     = $matches[1];
					$image_filetype = $matches[3];
				}
			}
		}

// Resource did not provide an image.
		if ( ! $image_meta ) {
			return false;
		}

		$v = basename( $image_url );
		if ( $v && strlen( $v ) > 6 ) {
			// Create a filename from the URL's file, if it is long enough
			$path = $v;
		} else {
			// Short filenames should use the path from the URL (not domain)
			$url_parsed = parse_url( $image_url );
			$path       = isset( $url_parsed['path'] ) ? $url_parsed['path'] : $image_url;
		}

		$path            = preg_replace( '/(https?:|\/|www\.|\.[a-zA-Z]{2,4}$)/i', '', $path );
		$filename_no_ext = sanitize_title_with_dashes( $path, '', 'save' );

		$attachment = DBUtils::get_attachment_by_title($filename_no_ext);
		if ($attachment) {
			return ["attachment_id" => $attachment->ID];
		}
		$extension = $image_filetype;
		$filename  = $filename_no_ext . "." . $extension;

// Simulate uploading a file through $_FILES. We need a temporary file for this.
		$stream_content = stream_get_contents( $remote_image );

		$tmp      = tmpfile();
		$tmp_path = stream_get_meta_data( $tmp )['uri'];
		fwrite( $tmp, $stream_content );
		fseek( $tmp, 0 ); // If we don't do this, WordPress thinks the file is empty

		$fake_FILE = array(
			'name'     => $filename,
			'type'     => 'image/' . $extension,
			'tmp_name' => $tmp_path,
			'error'    => UPLOAD_ERR_OK,
			'size'     => strlen( $stream_content ),
		);

// Trick is_uploaded_file() by adding it to the superglobal
		$_FILES[ basename( $tmp_path ) ] = $fake_FILE;

// For wp_handle_upload to work:
		include_once ABSPATH . 'wp-admin/includes/media.php';
		include_once ABSPATH . 'wp-admin/includes/file.php';
		include_once ABSPATH . 'wp-admin/includes/image.php';

		$result = wp_handle_upload( $fake_FILE, array(
			'test_form' => false,
			'action'    => 'local',
		) );

		fclose( $tmp ); // Close tmp file
		@unlink( $tmp_path ); // Delete the tmp file. Closing it should also delete it, so hide any warnings with @
		unset( $_FILES[ basename( $tmp_path ) ] ); // Clean up our $_FILES mess.

		fclose( $remote_image ); // Close the opened image resource

		$result['attachment_id'] = 0;

		if ( empty( $result['error'] ) && $add_to_media ) {
			$args = array(
				'post_title'     => $filename_no_ext,
				'post_content'   => '',
				'post_status'    => 'publish',
				'post_mime_type' => $result['type'],
			);

			$result['attachment_id'] = wp_insert_attachment( $args, $result['file'] );

			$attach_data = wp_generate_attachment_metadata( $result['attachment_id'], $result['file'] );
			wp_update_attachment_metadata( $result['attachment_id'], $attach_data );

			if ( is_wp_error( $result['attachment_id'] ) ) {
				$result['attachment_id'] = 0;
			}
		}

		return $result;
	}

	static function get_user_by_login_name( $login ) {
		return get_user_by( "login", is_array($login) ? $login[0] : $login );
	}

	static function create_term_if_necessary( \stdClass $term ): ?int {
		$term    = (object) sanitize_term( (array) $term, $term->taxonomy );
		$wp_term = DBUtils::get_term_by_slug( $term->slug, $term->taxonomy );
		if ( $wp_term ) {
			return $wp_term->term_id;
		}
		if ( property_exists( $term, 'meta_input' ) ) {
			$meta = $term->meta_input;
			unset( $term->meta_input );
		}
		if ( property_exists( $term, 'custom_meta_input' ) ) {
			$custom_meta = $term->custom_meta_input;
			unset( $term->custom_meta_input );
		}
		$wp_term = wp_insert_term( $term->name, $term->taxonomy, [
			"slug"        => $term->slug,
			"description" => $term->description ?? ""
		] );

		if ( ! is_wp_error( $wp_term ) ) {
			$term_id = $wp_term['term_id'];
			if ( isset( $meta ) ) {
				foreach ( $meta as $meta_key => $meta_value ) {
					update_term_meta( $term_id, $meta_key, $meta_value );
				}
			}
			if ( isset( $custom_meta ) ) {
				foreach ( $custom_meta as $meta_key => $meta_value ) {
					$meta_value = DBUtils::clean_custom_meta( $meta_value );
					if ( $meta_value ) {
						update_field( $meta_key, $meta_value, "term_" . $term_id );
					}
				}
			}

			return $term_id;
		}

		return null;
	}

	static function get_term_by_slug( string $slug, string $taxonomy ) {
		return get_term_by( "slug", $slug, $taxonomy );
	}

	static function create_product_variation_if_necessary(\stdClass $post) {
		$post->post_parent = self::get_post_by_slug($post->post_parent, [
			"post_type" => "product",
			"fields" => "ids"
		]);

		$old_post = self::get_post_by_slug( $post->post_name, [
			'post_type'   => $post->post_type,
			'post_status' => 'publish',
			'fields'      => 'ids'
		] );


		if ($old_post) {
			return $old_post;
		}

		$product = wc_get_product($post->post_parent);

		$post->post_title = $product->get_name();

		//$post->post_name = "product-" . $post->post_parent . "-variation";

		$post->guid = $product->get_permalink();

		$post->post_status = "publish";


		if ( property_exists( $post, 'custom_meta_input' ) ) {
			$custom_meta = $post->custom_meta_input;
			unset( $post->custom_meta_input );
		}

		if ( property_exists( $post, 'meta_input' ) ) {
			$meta = $post->meta_input;
			unset( $post->meta_input );
		}


		if ( property_exists( $post, '_thumbnail_id' ) ) {

			$attachment = DBUtils::upload_from_url( $post->_thumbnail_id->url );

			if ( $attachment ) {
				if ($post->_thumbnail_id->alt) {
					update_post_meta($attachment['attachment_id'], '_wp_attachment_image_alt', $post->_thumbnail_id->alt);
				}
			}

			unset($post->_thumbnail_id);
		}

		$post_id = wp_insert_post( (array) $post );


		if ( is_wp_error( $post_id ) ) {
			return null;
		}

		if ( isset( $meta ) ) {
			foreach ( $meta as $meta_key => $meta_value ) {
				update_post_meta( $post_id, $meta_key, $meta_value );
			}
		}

		if ( isset( $custom_meta ) ) {
			foreach ( $custom_meta as $meta_key => $meta_value ) {
				$meta_value = DBUtils::clean_custom_meta( $meta_value );
				if ( $meta_value ) {
					if ($meta_key == "_product_attributes") {
						update_post_meta($post_id, '_product_attributes', $meta_value);
					} else {
						update_field( $meta_key, $meta_value, $post_id );
					}

				}
			}
		}

		if ( isset ( $attachment) ) {
			update_post_meta($post_id, '_thumbnail_id', $attachment['attachment_id']);
		}

		return $post_id;
	}

	static function create_post_if_necessary( \stdClass $post ) {

		if ( StringUtils::contains( $post->post_name, '/' ) ) {
			$parts = explode( "/", $post->post_name );

			$id = - 1;
			foreach ( $parts as $post_name ) {
				$post->post_name = $post_name;
				if ( $id !== - 1 ) {
					$post->post_parent = $id;
				}
				$id = self::create_post_if_necessary( $post );
			}

			return $id;
		}


		$old_post = $post->post_type !== "product_variation" ? self::get_post_by_slug( $post->post_name, [
				'post_type'   => $post->post_type,
				'post_status' => 'publish',
				'fields'      => 'ids'
		]) : null;


		if ( ! $old_post ) {

			if ( $post->post_type === "product_variation" && class_exists('woocommerce')) {  // Before sanitize otherwise it fails

				return self::create_product_variation_if_necessary($post);
			}

			$post = sanitize_post( $post );
			if ( ! property_exists( $post, 'post_status' ) ) {
				$post->post_status = 'publish';
			}

			if ( ! property_exists( $post, 'post_type' ) ) {
				$post->post_type = 'post';
			}
			if ( property_exists( $post, 'post_author' ) ) {

				$wp_user = DBUtils::get_user_by_login_name( $post->post_author );

				if ( $wp_user ) {
					$post->post_author = $wp_user->ID;
				}
			}
			if ( property_exists( $post, '_thumbnail_id' ) ) {

				$attachment = DBUtils::upload_from_url( $post->_thumbnail_id->url );

				if ( $attachment ) {
					if ($post->_thumbnail_id->alt) {
						update_post_meta($attachment['attachment_id'], '_wp_attachment_image_alt', $post->_thumbnail_id->alt);
					}
					$post->_thumbnail_id = $attachment['attachment_id'];
				}
			}

			if ( property_exists($post, 'post_category')) {
			    $categories = [];
			    foreach ($post->post_category as $category_slug) {
			        $cat = get_category_by_slug($category_slug);
			        if ($cat) {
			            $categories[] = $cat->term_id;
                    }
                }
			    $post->post_category = $categories;
            }



			$post_id = wp_insert_post( (array) $post );


			if ( is_wp_error( $post_id ) ) {
				return null;
			}

			if ( property_exists( $post, 'meta_input' ) ) {
				$meta = $post->meta_input;
				unset( $post->meta_input );
			}

			if ( property_exists( $post, 'custom_meta_input' ) ) {
				$custom_meta = $post->custom_meta_input;
				unset( $post->custom_meta_input );
			}

			if (property_exists($post, 'tax_input')) {
				$taxes = $post->tax_input;
				unset($post->tax_input);

				foreach ($taxes as $tax_name => $slugs) {
					if (StringUtils::starts_with($tax_name, "pa_")) {
						foreach ($slugs as $slug) {
							$wp_term = DBUtils::get_term_by_slug( $slug, $tax_name );
							if ($wp_term) {
								wp_set_object_terms($post_id, $wp_term->term_id, $tax_name, true);
							}
						}
					} else {
						wp_set_object_terms($post_id, $slugs, $tax_name, true);
					}

				}
			}


			if ( isset( $meta ) ) {
				foreach ( $meta as $meta_key => $meta_value ) {
					update_post_meta( $post_id, $meta_key, $meta_value );
				}
			}
			if ( isset( $custom_meta ) ) {
				foreach ( $custom_meta as $meta_key => $meta_value ) {
					$meta_value = DBUtils::clean_custom_meta( $meta_value );
					if ( $meta_value ) {
						update_field( $meta_key, $meta_value, $post_id );
					}
				}
			}

			return $post_id;
		}

		return $old_post;

	}

	static function get_post_by_slug( string $slug, $args = [] ) {

		$args = wp_parse_args( $args, [
			'name'          => $slug,
			'post_type'     => 'post',
			'post_status'   => 'publish',
			'numberposts'   => 1,
			'no_found_rows' => true
		] );

		$query = new \WP_Query( $args );

		if ( $query->have_posts() ) {
			return array_shift( $query->posts );
		}

		return null;
	}


}