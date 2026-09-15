const fs = require('fs');

const code = fs.readFileSync('wordpress/ai-course-cms.php', 'utf8');

// List of all WP and PHP functions called in ai-course-cms.php
const wpFunctions = [
  'add_action', 'add_filter', 'register_post_type', 'add_menu_page', 'add_submenu_page',
  'add_meta_box', 'wp_nonce_field', 'wp_verify_nonce', 'get_post_meta', 'update_post_meta',
  'delete_post_meta', 'sanitize_text_field', 'sanitize_textarea_field', 'esc_url_raw',
  'esc_attr', 'esc_html', 'esc_textarea', 'esc_url', 'wp_enqueue_media', 'wp_enqueue_style',
  'wp_add_inline_style', 'register_rest_route', 'wp_insert_post', 'get_option', 'update_option',
  'admin_url', 'wp_safe_redirect', 'check_admin_referer', 'wp_die', 'current_user_can',
  'site_url', 'get_page_by_path', 'sanitize_title', 'selected', 'get_the_ID', 'get_the_title',
  'get_post_field', 'current_time', 'is_wp_error', 'add_query_arg'
];

const phpFunctions = [
  'defined', 'class_exists', 'header', 'is_array', 'count', 'intval', 'floatval',
  'trim', 'explode', 'implode', 'array_map', 'array_filter', 'array_values', 'json_decode',
  'json_encode', 'strpos', 'substr', 'sprintf', 'in_array', 'array_key_exists', 'unset',
  'isset', 'empty', 'round', 'min', 'max'
];

const known = new Set([...wpFunctions, ...phpFunctions]);

// Extract all identifier( calls that are not in known and not methods ($this->foo, self::foo, $obj->foo)
const lines = code.split('\n');
lines.forEach((line, idx) => {
  // strip strings and comments
  let stripped = line.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/, '').replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""');
  // find fns called like foo(
  const matches = stripped.matchAll(/(?<!->|::|\bfunction\s+)([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g);
  for (const m of matches) {
    const fn = m[1];
    if (!known.has(fn) && !['if', 'while', 'for', 'foreach', 'switch', 'catch', 'array', 'echo', 'print', 'return', 'include', 'require', 'new', 'exit', 'die'].includes(fn)) {
      console.log(`Line ${idx + 1}: Unknown function '${fn}': ${line.trim()}`);
    }
  }
});
