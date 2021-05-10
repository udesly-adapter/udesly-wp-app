<?php

if (!defined('ABSPATH')) {
	exit;
}

function udesly_honeypot_field() {
	?>
<div style="position: relative; overflow: hidden;" aria-hidden="true">
	<div style="position: absolute; left: 40000px">
		<input type="checkbox" name="contact_me_by_fax_only" value="1" tabindex="-1" autocomplete="nope" />
	</div>
</div>
<?php
}