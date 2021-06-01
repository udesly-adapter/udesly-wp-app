<?php

if (!defined('ABSPATH')) {
	exit;
}

function udesly_honeypot_field() {
	?>
<div style="position: relative; overflow: hidden;" aria-hidden="true">
	<div style="position: absolute; left: 40000px">
		<input type="checkbox" name="contact_me_by_fax_only" value="1" tabindex="-1" autocomplete="nope" autofill="off"/>
	</div>
</div>
<?php
}

function udesly_compare_dates($date, $days, $when) {

	try {
		$start_date = date_create($date);
		$compare_date = date_create();
		if ($when == "past") {
			$compare_date->sub(new DateInterval( "P$days"."D"));
		} else {
			$compare_date->add(new DateInterval( "P$days"."D"));
		}
		return $start_date->getTimestamp() - $compare_date->getTimestamp();
	} catch (Exception $e) {
		debug_log($e);
		return 1;
	}
}


function udesly_field_contains($field, $check) {

	if (is_array($field)) {
		foreach ($field as $item) {
			$slug = is_object($item) ? $item->slug : $item['slug'];
			if ($slug === $check) {
				return true;
			}
		}
		return false;
	}

	return false;
}


function udesly_get_menu($menu_name, $tree = false) {

    $menu = wp_get_nav_menu_object($menu_name);
    if (!$menu) {
        return [];
    }

	$raw_menu_items = wp_get_nav_menu_items( $menu->term_id, array( 'update_post_term_cache' => false ) );

	$menu_items = array();
	$items = [];
	foreach ( (array) $raw_menu_items as $menu_item ) {
		$menu_items[$menu_item->ID] = (object) [
		            'title' => $menu_item->title,
                    'url' => $menu_item->url,
		            'items' => [],
                    'subtitle' => get_field('subtitle', $menu_item),
		        ];

		if ($image_id = get_field('image', $menu_item)) {
			$menu_items[$menu_item->ID]->image = udesly_get_image(
				[
					'id' => $image_id
				]
			);
        }
		if ( $menu_item->menu_item_parent ) {
		    $menu_items[ $menu_item->menu_item_parent]->items[] = $menu_item->ID;
		} else {
		    $items[] = $menu_items[$menu_item->ID];
        }
	}

	if (!$tree) {
	    return $menu_items;
    }

    foreach ($items as $key =>$menu_item) {
	    $items[$key] = __udesly_resolve_menu_item($menu_item, $menu_items);
    }

    return $items;
}


function __udesly_resolve_menu_item($menu_item, $raw_items) {
    if (count($menu_item->items) == 0) {
        return $menu_item;
    }

    $items = [];
    foreach ($menu_item->items as $id) {
        $items[] = $raw_items[$id];
    }

    $menu_item->items = $items;
    return $menu_item;
}

function udesly_get_user_meta( $key, $user_id = false ) {
    if (!$user_id) {
	    $user_id = get_current_user_id();
    }

    if (!$user_id) {
        return "";
    }

    $cache_key = $user_id . "_meta_" . $key;
    $cached = wp_cache_get($cache_key);
    if ($cached) {
        return $cached;
    }
	$value = get_user_meta( $user_id, $key, true );

    if (!$value) {
        $value = "";
    }

    wp_cache_set($cache_key, $value);

    return $value;
}