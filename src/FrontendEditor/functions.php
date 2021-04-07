<?php

if (!function_exists('_u')) {

	function _u($hash, $type) {
		global $udesly_fe_data;

		echo $udesly_fe_data->$type->$hash;
	}
}

if (!function_exists('udesly_set_frontend_editor_data')) {

	function udesly_set_frontend_editor_data($template) {
		$data = \Udesly\FrontendEditor\FrontendEditor::get_frontend_editor_data($template);
		global $udesly_fe_data;

		$udesly_fe_data = json_decode($data);
	}
}