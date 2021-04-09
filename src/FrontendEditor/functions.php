<?php

if (!function_exists('_u')) {

	function _u($hash, $type, $section = "page") {
		global $udesly_fe_data;

		echo $udesly_fe_data[$section]->$type->$hash;
	}
}

if (!function_exists('udesly_set_frontend_editor_data')) {

	function udesly_set_frontend_editor_data($template) {
		global $udesly_fe_data;
		$udesly_fe_data = [];
		$udesly_fe_data['page'] = json_decode(\Udesly\FrontendEditor\FrontendEditor::get_frontend_editor_data($template));
		$udesly_fe_data['global'] = json_decode(\Udesly\FrontendEditor\FrontendEditor::get_frontend_editor_global_data());
	}
}

if (!function_exists('udesly_output_frontend_editor_data')) {
	function udesly_output_frontend_editor_data($template) {

		global $udesly_fe_data;

		?>
<script id="udesly-fe-data" type="application/json">
<?php echo json_encode($udesly_fe_data); ?>
</script>
<?php

	}
}