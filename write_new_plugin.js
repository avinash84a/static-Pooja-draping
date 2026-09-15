const fs = require('fs');

// We will construct the completely hardened, crash-proof, production-grade WordPress CMS plugin code
const phpCode = `<?php
/**
 * Plugin Name: 1 Day AI Course CMS & Headless API (WPCode & WordPress Plugin)
 * Plugin URI: https://avipatil.live/cmspooja
 * Description: १ डे प्रॅक्टिकल AI कार्यशाळा (AI Course) साठी संपूर्ण WordPress CMS प्लगइन. WordPress डॅशबोर्डवरून किंवा WPCode द्वारे ५ मुख्य Pillars, १०-१२ Core Tools, Real-Life Projects, Batches व नावनोंदणी (Inquiries) चे Add, Update, Edit, Delete सहजपणे करा.
 * Version: 2.1.0
 * Author: AI Course Pune Team
 * Author URI: https://avipatil.live/cmspooja
 * Text Domain: ai-course-cms
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

if (!class_exists('AICourseCompleteCMS')) {

class AICourseCompleteCMS {

    private static $instance = null;
    private $option_key = 'ai_course_site_settings';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        // 1. Register Custom Post Types for AI Course
        add_action('init', [$this, 'register_post_types']);

        // 2. Admin Menus & Submenus
        add_action('admin_menu', [$this, 'register_admin_menus']);

        // 3. Custom Meta Boxes for Post Types
        add_action('add_meta_boxes', [$this, 'register_meta_boxes']);
        add_action('save_post', [$this, 'save_custom_meta']);

        // 4. Admin Columns Customizations
        add_filter('manage_ai_tool_posts_columns', [$this, 'tool_columns']);
        add_action('manage_ai_tool_posts_custom_column', [$this, 'render_tool_column'], 10, 2);

        add_filter('manage_ai_pillar_posts_columns', [$this, 'pillar_columns']);
        add_action('manage_ai_pillar_posts_custom_column', [$this, 'render_pillar_column'], 10, 2);

        add_filter('manage_ai_challenge_posts_columns', [$this, 'challenge_columns']);
        add_action('manage_ai_challenge_posts_custom_column', [$this, 'render_challenge_column'], 10, 2);

        add_filter('manage_ai_batch_posts_columns', [$this, 'batch_columns']);
        add_action('manage_ai_batch_posts_custom_column', [$this, 'render_batch_column'], 10, 2);

        add_filter('manage_ai_inquiry_posts_columns', [$this, 'inquiry_columns']);
        add_action('manage_ai_inquiry_posts_custom_column', [$this, 'render_inquiry_column'], 10, 2);

        // 5. Admin CSS & Assets (Safe enqueuing only on plugin pages)
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);

        // 6. REST API Routes for Next.js Front-End Sync
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        add_action('rest_api_init', [$this, 'enable_cors_headers'], 15);

        // 7. Admin Actions: Save Settings & 1-Click Seeder
        add_action('admin_post_ai_course_save_settings', [$this, 'handle_save_settings']);
        add_action('admin_post_ai_course_seed_data', [$this, 'handle_seed_data']);
    }

    /**
     * 1. Register Custom Post Types for AI Course (Full CRUD: Add, Edit, Delete, Update)
     */
    public function register_post_types() {
        // A. Core AI Tools (१०-१२ निवडक टूल्स)
        register_post_type('ai_tool', [
            'labels' => [
                'name'               => '🛠️ AI Tools (१०-१२ टूल्स)',
                'singular_name'      => 'AI Tool',
                'add_new'            => 'नवीन Tool जोडा (Add Tool)',
                'add_new_item'       => 'नवीन AI Tool तयार करा',
                'edit_item'          => 'AI Tool संपादित करा (Edit)',
                'new_item'           => 'नवीन AI Tool',
                'view_item'          => 'AI Tool पहा',
                'search_items'       => 'AI Tools शोधा',
                'not_found'          => 'कोणतेही Tool सापडले नाही',
                'all_items'          => 'सर्व AI Tools (All Tools)',
            ],
            'public'             => true,
            'has_archive'        => true,
            'menu_icon'          => 'dashicons-admin-tools',
            'show_in_menu'       => 'ai-course-cms',
            'supports'           => ['title', 'editor', 'thumbnail', 'revisions'],
            'show_in_rest'       => true,
            'rest_base'          => 'ai_tools',
        ]);

        // B. 5 Pillars (अभ्यासक्रमाचे ५ मुख्य टप्पे)
        register_post_type('ai_pillar', [
            'labels' => [
                'name'               => '⭐ ५ Pillars (अभ्यासक्रम)',
                'singular_name'      => 'Pillar',
                'add_new'            => 'नवीन Pillar जोडा (Add Pillar)',
                'add_new_item'       => 'नवीन Pillar तयार करा',
                'edit_item'          => 'Pillar संपादित करा (Edit)',
                'new_item'           => 'नवीन Pillar',
                'view_item'          => 'Pillar पहा',
                'search_items'       => 'Pillars शोधा',
                'not_found'          => 'कोणताही Pillar सापडला नाही',
                'all_items'          => 'सर्व ५ Pillars (All Pillars)',
            ],
            'public'             => true,
            'has_archive'        => true,
            'menu_icon'          => 'dashicons-star-filled',
            'show_in_menu'       => 'ai-course-cms',
            'supports'           => ['title', 'editor', 'revisions'],
            'show_in_rest'       => true,
            'rest_base'          => 'ai_pillars',
        ]);

        // C. Real-Life Challenges by Profession (प्रोजेक्ट्स)
        register_post_type('ai_challenge', [
            'labels' => [
                'name'               => '🎯 Real-Life Challenges (प्रोजेक्ट्स)',
                'singular_name'      => 'Challenge',
                'add_new'            => 'नवीन Challenge जोडा (Add Challenge)',
                'add_new_item'       => 'नवीन Real-Life Challenge तयार करा',
                'edit_item'          => 'Challenge संपादित करा (Edit)',
                'new_item'           => 'नवीन Challenge',
                'view_item'          => 'Challenge पहा',
                'search_items'       => 'Challenges शोधा',
                'not_found'          => 'कोणतेही Challenge सापडले नाही',
                'all_items'          => 'सर्व Challenges (All Projects)',
            ],
            'public'             => true,
            'has_archive'        => true,
            'menu_icon'          => 'dashicons-awards',
            'show_in_menu'       => 'ai-course-cms',
            'supports'           => ['title', 'editor', 'revisions'],
            'show_in_rest'       => true,
            'rest_base'          => 'ai_challenges',
        ]);

        // D. AI Workshop Batches (कार्यशाळा बॅचेस)
        register_post_type('ai_batch', [
            'labels' => [
                'name'               => '📅 AI Batches (शेड्युल)',
                'singular_name'      => 'AI Batch',
                'add_new'            => 'नवीन AI Batch जोडा',
                'add_new_item'       => 'नवीन AI Batch तयार करा',
                'edit_item'          => 'Batch संपादित करा (Edit)',
                'new_item'           => 'नवीन Batch',
                'view_item'          => 'Batch पहा',
                'search_items'       => 'Batches शोधा',
                'not_found'          => 'कोणतीही Batch सापडली नाही',
                'all_items'          => 'सर्व AI Batches',
            ],
            'public'             => true,
            'has_archive'        => true,
            'menu_icon'          => 'dashicons-calendar-alt',
            'show_in_menu'       => 'ai-course-cms',
            'supports'           => ['title', 'editor', 'revisions'],
            'show_in_rest'       => true,
            'rest_base'          => 'ai_batches',
        ]);

        // E. Course Inquiries / Leads (नावनोंदणी)
        register_post_type('ai_inquiry', [
            'labels' => [
                'name'               => '📥 AI नोंदणी (Inquiries)',
                'singular_name'      => 'Inquiry',
                'add_new'            => 'नवीन नोंदणी जोडा',
                'add_new_item'       => 'नवीन नोंदणी नोंदवा',
                'edit_item'          => 'नोंदणी संपादित करा (Status)',
                'new_item'           => 'नवीन नोंदणी',
                'view_item'          => 'नोंदणी पहा',
                'search_items'       => 'नोंदणी शोधा',
                'not_found'          => 'कोणतीही नोंदणी सापडली नाही',
                'all_items'          => 'सर्व नावनोंदणी (All Inquiries)',
            ],
            'public'             => false,
            'show_ui'            => true,
            'has_archive'        => false,
            'menu_icon'          => 'dashicons-email-alt2',
            'show_in_menu'       => 'ai-course-cms',
            'supports'           => ['title'],
            'show_in_rest'       => true,
            'rest_base'          => 'ai_inquiries',
        ]);
    }

    /**
     * 2. Register Admin Menus
     */
    public function register_admin_menus() {
        add_menu_page(
            '१ डे AI कार्यशाळा CMS',
            '🎓 AI Course CMS',
            'manage_options',
            'ai-course-cms',
            [$this, 'render_dashboard_page'],
            'dashicons-welcome-learn-more',
            26
        );

        add_submenu_page(
            'ai-course-cms',
            'डॅशबोर्ड व सेटिंग्ज',
            '⚙️ डॅशबोर्ड व सेटिंग्ज',
            'manage_options',
            'ai-course-cms',
            [$this, 'render_dashboard_page']
        );

        add_submenu_page(
            'ai-course-cms',
            'WPCode स्निपेट व गाईड',
            '📋 WPCode स्निपेट कोड',
            'manage_options',
            'ai-course-wpcode-guide',
            [$this, 'render_wpcode_guide_page']
        );
    }

    /**
     * 3. Admin Styles (Loaded safely only on plugin screens)
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our screens to avoid conflicts
        $screen = get_current_screen();
        $is_ai_screen = false;
        if ($screen) {
            $cpts = ['ai_tool', 'ai_pillar', 'ai_challenge', 'ai_batch', 'ai_inquiry'];
            if (in_array($screen->post_type, $cpts, true) || strpos($screen->id, 'ai-course') !== false) {
                $is_ai_screen = true;
            }
        }

        if (!$is_ai_screen) {
            return;
        }

        if (function_exists('wp_enqueue_media')) {
            wp_enqueue_media();
        }

        wp_register_style('ai-course-admin-styles', false);
        wp_enqueue_style('ai-course-admin-styles');
        wp_add_inline_style('ai-course-admin-styles', '
            .ai-wrap { max-width: 1100px; margin: 20px auto 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif; }
            .ai-banner { background: linear-gradient(135deg, #4A121E 0%, #691728 50%, #831B32 100%); color: #fff; padding: 26px 32px; border-radius: 14px; margin-bottom: 24px; box-shadow: 0 6px 18px rgba(74, 18, 30, 0.25); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border: 1px solid rgba(251, 191, 36, 0.3); }
            .ai-banner h1 { color: #fff; margin: 0 0 6px; font-size: 24px; font-weight: 800; }
            .ai-banner p { margin: 0; opacity: 0.92; font-size: 14px; color: #F3E5E7; }
            .ai-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; margin-bottom: 24px; }
            .ai-stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.04); text-decoration: none; display: block; color: inherit; transition: transform 0.15s ease, border-color 0.15s ease; }
            .ai-stat-card:hover { transform: translateY(-3px); border-color: #f59e0b; color: inherit; box-shadow: 0 6px 12px rgba(0,0,0,0.08); }
            .ai-stat-num { font-size: 32px; font-weight: 800; color: #691728; line-height: 1; margin-bottom: 4px; }
            .ai-stat-label { font-size: 13px; font-weight: 700; color: #334155; }
            .ai-stat-sub { font-size: 11px; color: #d97706; font-weight: 600; margin-top: 4px; display: block; }
            .ai-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 5px rgba(0,0,0,0.04); }
            .ai-card h2 { margin-top: 0; border-bottom: 2px solid #f8fafc; padding-bottom: 12px; font-size: 18px; color: #1e293b; display: flex; align-items: center; gap: 10px; font-weight: 700; }
            .ai-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .ai-field { margin-bottom: 18px; }
            .ai-field label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #334155; }
            .ai-field input[type="text"], .ai-field input[type="number"], .ai-field input[type="url"], .ai-field textarea, .ai-field select { width: 100%; border-radius: 8px; border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 14px; box-sizing: border-box; }
            .ai-field input:focus, .ai-field textarea:focus { border-color: #d97706; outline: none; box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.18); }
            .ai-btn-primary { background: #691728 !important; border-color: #4A121E !important; color: #fff !important; font-size: 14px !important; padding: 10px 24px !important; border-radius: 8px !important; height: auto !important; font-weight: 700 !important; cursor: pointer; text-decoration: none; display: inline-block; }
            .ai-btn-primary:hover { background: #4A121E !important; color: #fff !important; }
            .ai-btn-gold { background: #f59e0b !important; border-color: #d97706 !important; color: #1c1917 !important; font-size: 14px !important; padding: 10px 22px !important; border-radius: 8px !important; font-weight: 700 !important; text-decoration: none; display: inline-block; }
            .ai-btn-gold:hover { background: #d97706 !important; color: #fff !important; }
            .ai-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
            .ai-code-box { background: #0f172a; color: #38bdf8; font-family: monospace; padding: 16px; border-radius: 8px; font-size: 13px; white-space: pre-wrap; word-break: break-all; margin-top: 10px; }
        ');
    }

    /**
     * Default Site Settings
     */
    public function get_default_settings() {
        return [
            'course_title'    => '१ डे प्रॅक्टिकल AI कार्यशाळा (AI Course Pune)',
            'course_subtitle' => 'स्मार्टफोन व लॅपटॉपवरून दररोजच्या कामात AI चा सहज व अचूक वापर शिका!',
            'fees'            => '1499',
            'advance_fee'     => '499',
            'default_date'    => 'पुढील रविवार (Next Sunday)',
            'default_time'    => 'सकाळी १०:०० ते दुपारी ४:०० (६ तास प्रॅक्टिकल)',
            'venue_short'     => 'टिळक रोड / सदाशिव पेठ, पुणे',
            'venue_full'      => 'ऑफलाइन सेंटर: सदाशिव पेठ / टिळक रोड, पुणे & ऑनलाइन: Zoom Live द्वारे थेट घरातून.',
            'whatsapp'        => '919876543210',
            'mode'            => 'Offline (Pune) + Online (Zoom Live)',
            'zoom_link'       => 'https://zoom.us/j/aipune2026',
        ];
    }

    public function get_settings() {
        $saved = get_option($this->option_key, []);
        return wp_parse_args($saved, $this->get_default_settings());
    }

    /**
     * 4. Save Settings Handler
     */
    public function handle_save_settings() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        check_admin_referer('ai_settings_nonce', '_ai_settings_nonce');

        $clean = [
            'course_title'    => sanitize_text_field($_POST['course_title'] ?? ''),
            'course_subtitle' => sanitize_text_field($_POST['course_subtitle'] ?? ''),
            'fees'            => intval($_POST['fees'] ?? 1499),
            'advance_fee'     => intval($_POST['advance_fee'] ?? 499),
            'default_date'    => sanitize_text_field($_POST['default_date'] ?? ''),
            'default_time'    => sanitize_text_field($_POST['default_time'] ?? ''),
            'venue_short'     => sanitize_text_field($_POST['venue_short'] ?? ''),
            'venue_full'      => sanitize_textarea_field($_POST['venue_full'] ?? ''),
            'whatsapp'        => sanitize_text_field($_POST['whatsapp'] ?? ''),
            'mode'            => sanitize_text_field($_POST['mode'] ?? ''),
            'zoom_link'       => esc_url_raw($_POST['zoom_link'] ?? ''),
        ];

        update_option($this->option_key, $clean);

        wp_safe_redirect(add_query_arg([
            'page'    => 'ai-course-cms',
            'updated' => 'true',
        ], admin_url('admin.php')));
        exit;
    }

    /**
     * 5. One-Click Seeder: Loads 5 Pillars, 12 Core Tools, 8 Challenges
     */
    public function handle_seed_data() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        check_admin_referer('ai_seed_nonce', '_ai_seed_nonce');

        $this->seed_pillars();
        $this->seed_tools();
        $this->seed_challenges();
        $this->seed_batches();

        wp_safe_redirect(add_query_arg([
            'page'   => 'ai-course-cms',
            'seeded' => 'true',
        ], admin_url('admin.php')));
        exit;
    }

    private function find_post_by_slug($slug, $post_type) {
        $posts = get_posts([
            'name'        => $slug,
            'post_type'   => $post_type,
            'post_status' => 'any',
            'numberposts' => 1,
        ]);
        return !empty($posts) ? $posts[0] : null;
    }

    private function seed_pillars() {
        $pillars = [
            [
                'number'     => '१',
                'name_en'    => 'AI Understand',
                'title_mr'   => '१. 🧠 AI Understand (पाया व योग्य निवड)',
                'title_hi'   => '१. 🧠 AI Understand (बुनियादी समझ)',
                'flow_mr'    => 'AI म्हणजे काय → Tools → योग्य tool निवडणे',
                'flow_hi'    => 'AI क्या है → Tools → सही tool का चुनाव',
                'desc_mr'    => 'AI चे मूलभूत स्वरूप समजून घेणे, बाजारातील शेकडो टूल्समधून गोंधळून न जाता आपल्या कामासाठी अचूक टूल निवडण्याची हातोटी.',
                'desc_hi'    => 'AI का बुनियादी स्वरूप समझना और काम के लिए सही टूल चुनने का स्पष्ट तरीका।',
                'steps'      => "१. जनरेटिव्ह AI संकल्पना व भीती दूर करणे\\n२. Top १२ टूल्सची ओळख व वर्गीकरण\\n३. तुमच्या कामासाठी सर्वोत्तम टूल कसे निवडायचे?",
                'order'      => 1,
            ],
            [
                'number'     => '२',
                'name_en'    => 'AI Communicate',
                'title_mr'   => '२. 💬 AI Communicate (प्रॉम्प्ट संवाद)',
                'title_hi'   => '२. 💬 AI Communicate (प्रॉम्प्ट संवाद)',
                'flow_mr'    => 'AI सोबत बोलायचे कसे? → Prompting Formula',
                'flow_hi'    => 'AI से बात कैसे करें? → Prompting Formula',
                'desc_mr'    => 'कमांड कशी द्यावी, मराठी व हिंदीत अचूक प्रॉम्प्ट कसा लिहावा आणि पहिल्याच प्रयत्नात अपेक्षित उत्तर कसे मिळवावे.',
                'desc_hi'    => 'सही प्रॉम्प्ट कैसे लिखें, स्पष्ट निर्देश देकर पहले ही प्रयास में सटीक उत्तर कैसे पाएं।',
                'steps'      => "१. Role-Task-Context-Format (RTCF) फॉर्म्युला\\n२. मराठी व हिंदीत उच्च दर्जाचे प्रॉम्प्ट्स\\n३. चुकीचे उत्तर आल्यास AI ला दुरुस्त करण्याची पद्धत",
                'order'      => 2,
            ],
            [
                'number'     => '३',
                'name_en'    => 'AI Work',
                'title_mr'   => '३. 📄 AI Work (दैनंदिन कामकाज)',
                'title_hi'   => '३. 📄 AI Work (दैनिक कामकाज)',
                'flow_mr'    => 'Letters → Email → WhatsApp → Data',
                'flow_hi'    => 'Letters → Email → WhatsApp → Data',
                'desc_mr'    => 'सरकारी व कार्यालयीन पत्रे, कॉर्पोरेट ईमेल, व्यावसायिक WhatsApp मेसेज आणि Excel फॉर्म्युले काही सेकंदांत बनवणे.',
                'desc_hi'    => 'ऑफिस के पत्र, ईमेल, प्रोफेशनल WhatsApp मैसेज और Excel सूत्र सेकंड्स में बनाना।',
                'steps'      => "१. शासकीय व कायदेशीर पत्रव्यवहार ड्राफ्टिंग\\n२. क्लायंट ईमेल व WhatsApp ब्रॉडकास्ट मेसेज\\n३. Excel डेटा फॉर्म्युले व समरी रिपोर्टिंग",
                'order'      => 3,
            ],
            [
                'number'     => '४',
                'name_en'    => 'AI Create',
                'title_mr'   => '४. 🎨 AI Create (सर्जनशीलता & डिझाईन)',
                'title_hi'   => '४. 🎨 AI Create (क्रिएटिविटी & डिजाइन)',
                'flow_mr'    => 'Posters → Voiceover → PPT Presentations',
                'flow_hi'    => 'Posters → Voiceover → PPT Presentations',
                'desc_mr'    => 'सोशल मीडिया पोस्ट्स, बिझनेस पोस्टर्स, स्वतःचा आवाज न वापरता व्हॉईसओव्हर आणि आकर्षक प्रेझेंटेशन्स तयार करणे.',
                'desc_hi'    => 'सोशल मीडिया पोस्ट, बिजनेस पोस्टर, AI वॉइसओवर और सुंदर PPT तैयार करना।',
                'steps'      => "१. Canva AI ने जाहिरात व पोस्टर्स डिझाइन\\n२. ElevenLabs द्वारे मराठी व हिंदी AI आवाज\\n३. Gamma AI ने एका क्लिकवर संपूर्ण PPT सादरीकरण",
                'order'      => 4,
            ],
            [
                'number'     => '५',
                'name_en'    => 'AI Automate',
                'title_mr'   => '५. 🤖 AI Automate (ऑटोमेशन & फ्युचर)',
                'title_hi'   => '५. 🤖 AI Automate (ऑटोमेशन & भविष्य)',
                'flow_mr'    => 'AI Agents → Custom GPTs → Auto Workflows',
                'flow_hi'    => 'AI Agents → Custom GPTs → Auto Workflows',
                'desc_mr'    => 'वारंवार करावी लागणारी कामे ऑटोमेट करणे, स्वतःचा पर्सनल AI असिस्टंट तयार करणे आणि भविष्यातील संधींचा वेध घेणे.',
                'desc_hi'    => 'बार-बार होने वाले कामों को ऑटोमेट करना और अपना पर्सनल AI असिस्टेंट बनाना।',
                'steps'      => "१. Custom GPT व स्वतःचा AI सहाय्यक बनवणे\\n२. Google Forms आणि WhatsApp ऑटोमेशन ओळख\\n३. AI युगात आपले करिअर व व्यवसाय सुरक्षित ठेवणे",
                'order'      => 5,
            ],
        ];

        foreach ($pillars as $p) {
            $slug = sanitize_title($p['name_en']);
            $existing = $this->find_post_by_slug($slug, 'ai_pillar');

            $post_data = [
                'post_title'   => $p['title_mr'],
                'post_content' => $p['desc_mr'],
                'post_status'  => 'publish',
                'post_type'    => 'ai_pillar',
                'post_name'    => $slug,
            ];

            if ($existing) {
                $post_id = $existing->ID;
                $post_data['ID'] = $post_id;
                wp_update_post($post_data);
            } else {
                $post_id = wp_insert_post($post_data);
            }

            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_ai_pillar_number', $p['number']);
                update_post_meta($post_id, '_ai_pillar_name_en', $p['name_en']);
                update_post_meta($post_id, '_ai_pillar_title_mr', $p['title_mr']);
                update_post_meta($post_id, '_ai_pillar_title_hi', $p['title_hi']);
                update_post_meta($post_id, '_ai_pillar_flow_mr', $p['flow_mr']);
                update_post_meta($post_id, '_ai_pillar_flow_hi', $p['flow_hi']);
                update_post_meta($post_id, '_ai_pillar_desc_mr', $p['desc_mr']);
                update_post_meta($post_id, '_ai_pillar_desc_hi', $p['desc_hi']);
                update_post_meta($post_id, '_ai_pillar_steps', $p['steps']);
                update_post_meta($post_id, '_ai_pillar_order', $p['order']);
            }
        }
    }

    private function seed_tools() {
        $tools = [
            [
                'name'         => 'ChatGPT',
                'developer'    => 'OpenAI',
                'category'     => 'text',
                'badge_text'   => 'सर्वात लोकप्रिय (Most Popular)',
                'badge_color'  => 'emerald',
                'free_tier'    => 'मोफत (Free) + Plus पर्याय',
                'use_mr'       => 'मराठी व हिंदी संवाद, पत्रलेखन, ईमेल, कल्पना व डेटा विश्लेषण',
                'use_hi'       => 'पत्र लेखन, ईमेल ड्राफ्टिंग, आइडियाज और सामान्य सवाल-जवाब',
                'audience_mr'  => 'सर्वसामान्य नागरिक, विद्यार्थी, शिक्षक, व्यावसायिक',
                'audience_hi'  => 'छात्र, शिक्षक, व्यापारी, आम नागरिक',
                'url'          => 'https://chatgpt.com',
                'order'        => 1,
            ],
            [
                'name'         => 'Google Gemini',
                'developer'    => 'Google',
                'category'     => 'text',
                'badge_text'   => 'Google Ecosystem',
                'badge_color'  => 'blue',
                'free_tier'    => 'पूर्णपणे मोफत (100% Free)',
                'use_mr'       => 'गूगल ड्राइव्ह, जीमेल, यूट्यूब व ताज्या बातम्यांचे अचूक विश्लेषण',
                'use_hi'       => 'Gmail, Drive, YouTube के साथ जुड़ाव और लाइव इंटरनेट सर्च',
                'audience_mr'  => 'Android युजर्स, ऑफिस कर्मचारी, शिक्षक',
                'audience_hi'  => 'Android उपयोगकर्ता, ऑफिस कर्मचारी, शिक्षक',
                'url'          => 'https://gemini.google.com',
                'order'        => 2,
            ],
            [
                'name'         => 'Claude',
                'developer'    => 'Anthropic',
                'category'     => 'text',
                'badge_text'   => 'उत्कृष्ट लेखन (Best for Writing)',
                'badge_color'  => 'amber',
                'free_tier'    => 'मोफत उपलब्ध (Free Tier)',
                'use_mr'       => 'दीर्घ अहवाल, कायदेशीर कागदपत्रे व मानवासारखे नैसर्गिक लेखन',
                'use_hi'       => 'लंबे लेख, कानूनी दस्तावेज, प्राकृतिक भाषा में ड्राफ्टिंग',
                'audience_mr'  => 'लेखक, वकील, संशोधक, अधिकारी',
                'audience_hi'  => 'लेखक, वकील, रिसर्चर, अधिकारी',
                'url'          => 'https://claude.ai',
                'order'        => 3,
            ],
            [
                'name'         => 'Perplexity AI',
                'developer'    => 'Perplexity',
                'category'     => 'research',
                'badge_text'   => 'संदर्भ शोध (Best Research)',
                'badge_color'  => 'indigo',
                'free_tier'    => 'मोफत (Daily Free Pro Searches)',
                'use_mr'       => 'गुगलपेक्षा वेगवान! प्रत्येक उत्तरासोबत खात्रीशीर मूळ संदर्भांची लिंक',
                'use_hi'       => 'गूगल से तेज, हर उत्तर के साथ प्रामाणिक लिंक और सोर्स',
                'audience_mr'  => 'विद्यार्थी, स्पर्धा परीक्षा अभ्यासक, पत्रकार',
                'audience_hi'  => 'प्रतियोगी परीक्षा छात्र, पत्रकार, शोधकर्ता',
                'url'          => 'https://perplexity.ai',
                'order'        => 4,
            ],
            [
                'name'         => 'NotebookLM',
                'developer'    => 'Google',
                'category'     => 'research',
                'badge_text'   => 'PDF ऑडिओ सारांश (Audio Overview)',
                'badge_color'  => 'rose',
                'free_tier'    => 'पूर्ण मोफत (Free by Google)',
                'use_mr'       => 'तुमच्या PDF किंवा पुस्तकांचा पॉडकास्ट ऑडिओ सारांश एका क्लिकवर तयार करा',
                'use_hi'       => 'किताबों और PDF का ऑडियो पॉडकास्ट समरी मिनटों में बनाएं',
                'audience_mr'  => 'शिक्षक, विद्यार्थी, पुस्तक वाचक, अभ्यासक',
                'audience_hi'  => 'टीचर्स, छात्र, पुस्तक प्रेमी',
                'url'          => 'https://notebooklm.google.com',
                'order'        => 5,
            ],
            [
                'name'         => 'Canva AI (Magic Studio)',
                'developer'    => 'Canva',
                'category'     => 'image',
                'badge_text'   => 'ग्राफिक डिझाईन (Graphic Design)',
                'badge_color'  => 'purple',
                'free_tier'    => 'मोफत + Pro',
                'use_mr'       => 'मराठी सणांची पोस्टर्स, दुकानाची जाहिरात, बॅनर व थंबनेल डिझाइन',
                'use_hi'       => 'त्योहारों के पोस्टर, दुकान के विज्ञापन, सोशल मीडिया ग्राफिक्स',
                'audience_mr'  => 'व्यावसायिक, डिझाइनर्स, सोशल मीडिया मॅनेजर्स',
                'audience_hi'  => 'दुकानदार, व्यापारी, सोशल मीडिया क्रिएटर',
                'url'          => 'https://canva.com',
                'order'        => 6,
            ],
            [
                'name'         => 'Gamma AI',
                'developer'    => 'Gamma App',
                'category'     => 'presentation',
                'badge_text'   => 'PPT मिनिटांत (Instant PPT)',
                'badge_color'  => 'emerald',
                'free_tier'    => 'मोफत क्रेडिट्स उपलब्ध',
                'use_mr'       => 'फक्त एका वाक्यातून संपूर्ण आकर्षक PPT प्रेझेंटेशन तयार करा',
                'use_hi'       => 'सिर्फ टॉपिक लिखकर खूबसूरत प्रेजेंटेशन स्लाइड्स सेकंड्स में पाएं',
                'audience_mr'  => 'शिक्षक, कॉर्पोरेट कर्मचारी, वक्ते',
                'audience_hi'  => 'शिक्षक, सेल्स प्रोफेशनल्स, स्पीकर्स',
                'url'          => 'https://gamma.app',
                'order'        => 7,
            ],
            [
                'name'         => 'ElevenLabs',
                'developer'    => 'ElevenLabs',
                'category'     => 'audio',
                'badge_text'   => 'वास्तववादी AI आवाज (Best Voice)',
                'badge_color'  => 'cyan',
                'free_tier'    => 'दरमहा १०,००० शब्द मोफत',
                'use_mr'       => 'मराठी व हिंदी मजकुराचा मानवासारखा स्पष्ट ऑडिओ व्हॉईसओव्हर',
                'use_hi'       => 'टेक्स्ट से प्राकृतिक इंसानी आवाज (हिंदी व मराठी वॉइसओवर)',
                'audience_mr'  => 'यूट्यूबर्स, रील निर्माते, शिक्षक, जाहिरातदार',
                'audience_hi'  => 'यूट्यूबर्स, रील मेकर्स, पॉडकास्टर्स',
                'url'          => 'https://elevenlabs.io',
                'order'        => 8,
            ],
            [
                'name'         => 'Microsoft Copilot',
                'developer'    => 'Microsoft',
                'category'     => 'work',
                'badge_text'   => 'Office & Excel साथी',
                'badge_color'  => 'blue',
                'free_tier'    => 'मोफत (Free with MS Account)',
                'use_mr'       => 'Word, Excel, PowerPoint फाइल्स झटपट बनवणे',
                'use_hi'       => 'Word, Excel फॉर्मूला और ऑफिस डेटा का आसान समाधान',
                'audience_mr'  => 'ऑफिस कर्मचारी, शासकीय कर्मचारी, अकाउंटंट्स',
                'audience_hi'  => 'दफ्तर कर्मचारी, अकाउंटेंट्स',
                'url'          => 'https://copilot.microsoft.com',
                'order'        => 9,
            ],
            [
                'name'         => 'Google Lens',
                'developer'    => 'Google',
                'category'     => 'utility',
                'badge_text'   => 'फोटोवरून भाषांतर (Photo Translate)',
                'badge_color'  => 'amber',
                'free_tier'    => '१००% मोफत (स्मार्टफोनवर उपलब्ध)',
                'use_mr'       => 'कोणत्याही कागदाचा फोटो काढून मजकूर कॉपी करा किंवा त्वरित मराठीत भाषांतर करा',
                'use_hi'       => 'कागजों की फोटो खींचकर टेक्स्ट कॉपी या भाषांतर करें',
                'audience_mr'  => 'सर्व नागरिक, गृहिणी, ज्येष्ठ नागरिक, विद्यार्थी',
                'audience_hi'  => 'आम नागरिक, माता-पिता, छात्र',
                'url'          => 'https://lens.google',
                'order'        => 10,
            ],
            [
                'name'         => 'Napkin AI',
                'developer'    => 'Napkin',
                'category'     => 'presentation',
                'badge_text'   => 'मजकुराचे इन्फोग्राफिक (Infographics)',
                'badge_color'  => 'violet',
                'free_tier'    => 'मोफत वापरता येते',
                'use_mr'       => 'सामान्य मजकुराचे सुंदर फ्लोचार्ट व आकृत्यांमध्ये रूपांतर',
                'use_hi'       => 'टेक्स्ट का सुंदर फ्लोचार्ट और डायग्राम में रूपांतरण',
                'audience_mr'  => 'शिक्षक, ट्रेनर्स, सल्लागार, मॅनेजर्स',
                'audience_hi'  => 'प्रशिक्षकों, सलाहकारों, शिक्षकों',
                'url'          => 'https://napkin.ai',
                'order'        => 11,
            ],
            [
                'name'         => 'InVideo AI',
                'developer'    => 'InVideo',
                'category'     => 'video',
                'badge_text'   => 'प्रॉम्प्टवरून व्हिडिओ (Video AI)',
                'badge_color'  => 'rose',
                'free_tier'    => 'मोफत ट्रायल्स उपलब्ध',
                'use_mr'       => 'फक्त कल्पना सांगा आणि व्हॉईसओव्हरसह संपूर्ण व्हिडिओ तयार',
                'use_hi'       => 'स्क्रिप्ट लिखकर सबटाइटल्स और आवाज के साथ वीडियो बनाएं',
                'audience_mr'  => 'कंटेंट क्रिएटर्स, व्यवसाय मालक, डिजिटल मार्केटर्स',
                'audience_hi'  => 'कंटेंट क्रिएटर, डिजिटल मार्केटर',
                'url'          => 'https://invideo.io',
                'order'        => 12,
            ],
        ];

        foreach ($tools as $t) {
            $slug = sanitize_title($t['name']);
            $existing = $this->find_post_by_slug($slug, 'ai_tool');

            $post_data = [
                'post_title'   => $t['name'],
                'post_content' => $t['use_mr'],
                'post_status'  => 'publish',
                'post_type'    => 'ai_tool',
                'post_name'    => $slug,
            ];

            if ($existing) {
                $post_id = $existing->ID;
                $post_data['ID'] = $post_id;
                wp_update_post($post_data);
            } else {
                $post_id = wp_insert_post($post_data);
            }

            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_ai_tool_developer', $t['developer']);
                update_post_meta($post_id, '_ai_tool_category', $t['category']);
                update_post_meta($post_id, '_ai_tool_badge_text', $t['badge_text']);
                update_post_meta($post_id, '_ai_tool_badge_color', $t['badge_color']);
                update_post_meta($post_id, '_ai_tool_free_tier', $t['free_tier']);
                update_post_meta($post_id, '_ai_tool_url', $t['url']);
                update_post_meta($post_id, '_ai_tool_use_mr', $t['use_mr']);
                update_post_meta($post_id, '_ai_tool_use_hi', $t['use_hi']);
                update_post_meta($post_id, '_ai_tool_audience_mr', $t['audience_mr']);
                update_post_meta($post_id, '_ai_tool_audience_hi', $t['audience_hi']);
                update_post_meta($post_id, '_ai_tool_order', $t['order']);
            }
        }
    }

    private function seed_challenges() {
        $challenges = [
            [
                'id_slug'      => 'teacher',
                'role_mr'      => 'शिक्षक (Teacher)',
                'role_hi'      => 'शिक्षक (Teacher)',
                'icon'         => 'GraduationCap',
                'pipeline'     => 'Chapter → Lesson Plan → PPT → MCQ → Worksheet',
                'pipeline_text_mr' => 'धडा निवडा → पाठाचे नियोजन → आकर्षक PPT → बहुपर्यायी प्रश्न (MCQ) → वर्कशीट',
                'pipeline_text_hi' => 'अध्याय → लेसन प्लान → आकर्षक PPT → वस्तुनिष्ठ प्रश्न (MCQ) → वर्कशीट',
                'tools'        => 'ChatGPT, NotebookLM, Gamma, Canva AI',
                'outcome_mr'   => 'शिक्षकांचे ५ तासांचे तयारीचे काम फक्त १५ मिनिटांत! संपूर्ण धड्यावर आधारित परिपूर्ण मराठी शैक्षणिक साहित्य तयार होते.',
                'outcome_hi'   => 'अध्यापकों के 5 घंटे की तैयारी सिर्फ 15 मिनट में! पूरे पाठ पर आधारित तैयार शिक्षण सामग्री।',
                'sample_input' => 'इयत्ता ७ वी विज्ञान: वनस्पतींमधील पोषण (Nutrition in Plants)',
                'sample_prompt'=> 'मी इयत्ता ७ वी चा विज्ञान शिक्षक आहे. "वनस्पतींमधील पोषण" या धड्यावर आधारित ४५ मिनिटांचा मराठी लेसन प्लान तयार कर. सोबत विद्यार्थ्यांना विचारण्यासाठी ५ सोपे व ५ विचार करायला लावणारे MCQ प्रश्न आणि उत्तरपत्रिका तयार कर.',
                'order'        => 1,
            ],
            [
                'id_slug'      => 'business',
                'role_mr'      => 'दुकानदार / व्यावसायिक (Business Owner)',
                'role_hi'      => 'दुकानदार / व्यवसायी (Business Owner)',
                'icon'         => 'Briefcase',
                'pipeline'     => 'Business → Advertisement → Poster → WhatsApp → Customer Reply',
                'pipeline_text_mr' => 'व्यवसाय → जाहिरात मजकूर → आकर्षक पोस्टर → WhatsApp ब्रॉडकास्ट → ऑटो ग्राहक उत्तर',
                'pipeline_text_hi' => 'बिजनेस → विज्ञापन कॉपी → पोस्टर डिजाइन → WhatsApp मैसेज → ग्राहक उत्तर',
                'tools'        => 'ChatGPT, Canva AI, Google Gemini',
                'outcome_mr'   => 'महागड्या एजन्सीची गरज नाही! स्वतःच्या दुकानासाठी किंवा सर्व्हिससाठी सणांची जाहिरात, बॅनर व WhatsApp मेसेज काही मिनिटांत तयार.',
                'outcome_hi'   => 'बिना किसी एजेंसी के अपने बिजनेस के लिए फेस्टिवल ऑफर्स, पोस्टर और ऑटोमैटिक WhatsApp जवाब बनाएं।',
                'sample_input' => 'पुण्यातील कपड्यांचे दुकान / सणासुदीची विशेष १०% सवलत',
                'sample_prompt'=> 'माझे पुण्यात साड्यांचे दुकान आहे. येणाऱ्या सणासाठी ग्राहकांना आकर्षित करणारा एक भावनिक आणि प्रभावी मराठी WhatsApp ऑफर मेसेज तयार कर, ज्यात १०% सूट आणि पत्ता नमूद असेल.',
                'order'        => 2,
            ],
            [
                'id_slug'      => 'professional',
                'role_mr'      => 'ऑफिस कर्मचारी (Working Professional)',
                'role_hi'      => 'दफ्तर कर्मचारी (Working Professional)',
                'icon'         => 'Laptop',
                'pipeline'     => 'Email → Excel → Report → Presentation',
                'pipeline_text_mr' => 'क्लायंट ईमेल → Excel डेटा फॉर्म्युला → संक्षिप्त अहवाल → मॅनेजमेंट प्रेझेंटेशन',
                'pipeline_text_hi' => 'ईमेल ड्राफ्ट → Excel फॉर्मूला → समरी रिपोर्ट → बोर्ड प्रेजेंटेशन',
                'tools'        => 'Microsoft Copilot, ChatGPT, Claude, Gamma',
                'outcome_mr'   => 'ऑफिसमध्ये वेळेवर काम पूर्ण करून बॉस व मॅनेजमेंटवर छाप पाडा. अवघड Excel फॉर्म्युले व प्रेझेंटेशन अगदी सहज!',
                'outcome_hi'   => 'दफ्तर में घंटों का काम मिनटों में पूरा करें। कठिन Excel सूत्र और रिपोर्ट समरी सेकंड्स में तैयार।',
                'sample_input' => 'तिमाही विक्री डेटा व क्लायंट फॉलो-अप ईमेल',
                'sample_prompt'=> 'आमच्या क्लायंटने पेमेंट उशिरा केले आहे. त्यांना नम्र परंतु ठामपणे आठवण करून देणारा एक औपचारिक कॉर्पोरेट ईमेल तयार कर, ज्यात प्रोजेक्ट डेडलाइनचा उल्लेख असेल.',
                'order'        => 3,
            ],
            [
                'id_slug'      => 'parent',
                'role_mr'      => 'गृहिणी / पालक (Homemaker / Parent)',
                'role_hi'      => 'माता-पिता / गृहिणी (Parent / Homemaker)',
                'icon'         => 'Home',
                'pipeline'     => 'Child → Study Plan → Notes → Quiz → Revision',
                'pipeline_text_mr' => 'मुलाचे वय/वर्ग → अभ्यासाचे वेळापत्रक → सोप्या भाषेत नोट्स → खेळातील प्रश्नमंजुषा → रिव्हिजन',
                'pipeline_text_hi' => 'बच्चे की कक्षा → टाइमटेबल → सरल नोट्स → मजेदार क्विज → परीक्षा रिविजन',
                'tools'        => 'ChatGPT, Google Lens, Gemini',
                'outcome_mr'   => 'मुलांना ट्यूशनची गरज न भासता घरच्या घरी खेळता खेळता अभ्यास करून घेण्याचा नवा मार्ग! पालक व मुले दोघांचाही तणाव दूर.',
                'outcome_hi'   => 'बच्चों की पढ़ाई में बिना किसी तनाव के मदद करें। बोरिंग विषयों को मजेदार कहानियों और क्विज में बदलें।',
                'sample_input' => '८ वर्षांच्या मुलासाठी इतिहास व गणिताचा मनोरंजक अभ्यास',
                'sample_prompt'=> 'माझ्या ८ वर्षांच्या मुलाला छत्रपती शिवाजी महाराजांचा इतिहास सोप्या गोष्टीच्या रूपात सांगा आणि त्यावर आधारित ३ मनोरंजक प्रश्न तयार करा जेणेकरून त्याला ते लक्षात राहील.',
                'order'        => 4,
            ],
            [
                'id_slug'      => 'govt',
                'role_mr'      => 'शासकीय अधिकारी / कर्मचारी (Govt / Semi-Govt)',
                'role_hi'      => 'सरकारी कर्मचारी (Govt Employee)',
                'icon'         => 'Landmark',
                'pipeline'     => 'Issue → Marathi Draft → Formal Letter → Report Summary',
                'pipeline_text_mr' => 'विषय → शुद्ध मराठी मसुदा → अधिकृत शासकीय पत्र → संक्षिप्त अहवाल',
                'pipeline_text_hi' => 'मुद्दा → शासकीय शब्दावली → आधिकारिक पत्र प्रारूप → सारांश रिपोर्ट',
                'tools'        => 'Claude, ChatGPT, Google Lens',
                'outcome_mr'   => 'शासकीय व निमशासकीय पत्रांसाठी अचूक मराठी प्रशासकीय शब्दावलीसह निर्दोष पत्रव्यवहार व परिपत्रके झटपट तयार.',
                'outcome_hi'   => 'आधिकारिक नियमों के अनुसार शुद्ध भाषायी ड्राफ्टिंग और पत्राचार की त्वरित तैयारी।',
                'sample_input' => 'कार्यालयीन उपकरणांची दुरुस्ती व नवीन खरेदीसाठी मंजुरी पत्र',
                'sample_prompt'=> 'कार्यालयातील जुने संगणक बदलून नवीन संगणक खरेदीसाठी सक्षम प्राधिकाऱ्यांकडे सादर करायचे प्रशासकीय मंजुरीचे औपचारिक मराठी पत्र तयार कर.',
                'order'        => 5,
            ],
            [
                'id_slug'      => 'creator',
                'role_mr'      => 'कंटेंट क्रिएटर / फ्रीलान्सर (Content Creator)',
                'role_hi'      => 'कंटेंट क्रिएटर (Freelancer / Creator)',
                'icon'         => 'Rocket',
                'pipeline'     => 'Idea → Reel Script → AI Voiceover → Thumbnail → Video',
                'pipeline_text_mr' => 'कल्पना → रील स्क्रिप्ट → AI व्हॉईसओव्हर → थंबनेल डिझाइन → व्हिडिओ',
                'pipeline_text_hi' => 'आइडिया → रील स्क्रिप्ट → AI वॉइसओवर → थंबनेल डिजाइन → वीडियो',
                'tools'        => 'ChatGPT, ElevenLabs, Canva AI, InVideo AI',
                'outcome_mr'   => 'कॅमेरासमोर येण्याची किंवा महागडा माईक वापरण्याची गरज नाही! दररोज १ तासात ३ दर्जेदार सोशल मीडिया रील्स तयार.',
                'outcome_hi'   => 'बिना चेहरा दिखाए या स्टूडियो के बिना वायरल रील्स और यूट्यूब वीडियो बनाएं।',
                'sample_input' => 'पुण्यातील शनिवार वाड्याबद्दल ३ अज्ञात रंजक तथ्ये (Instagram Reel)',
                'sample_prompt'=> 'पुण्यातील शनिवार वाड्याबद्दल ३ अज्ञात आणि रोमांचक तथ्यांवर आधारित ३० सेकंदांची मराठी इन्स्टाग्राम रील स्क्रिप्ट तयार कर.',
                'order'        => 6,
            ],
            [
                'id_slug'      => 'student',
                'role_mr'      => 'महाविद्यालयीन विद्यार्थी (College Student / Job Seeker)',
                'role_hi'      => 'कॉलेज छात्र / जॉब सीकर (Student)',
                'icon'         => 'Target',
                'pipeline'     => 'Resume → ATS Score → Interview Prep → Mock Questions',
                'pipeline_text_mr' => 'रेझ्युमे → ATS स्कोअर वाढवणे → मुलाखतीची तयारी → मॉक प्रश्नोत्तरे',
                'pipeline_text_hi' => 'रिज्यूमे → ATS फ्रेंडली फॉर्मेट → इंटरव्यू तैयारी → मॉक सवाल',
                'tools'        => 'ChatGPT, Claude, NotebookLM',
                'outcome_mr'   => 'इंटरव्ह्यू क्रॅक करण्यासाठी आंतरराष्ट्रीय दर्जाचा रेझ्युमे व संभाव्य प्रश्नांची तयारी. मुलाखतीत नक्की निवड!',
                'outcome_hi'   => 'कॉर्पोरेट नौकरियों के लिए शानदार रिज्यूमे और कठिन इंटरव्यू सवालों की परफेक्ट तैयारी।',
                'sample_input' => 'B.Com फ्रेशरसाठी बँक किंवा IT कंपनीतील जॉबसाठी रेझ्युमे',
                'sample_prompt'=> 'मी नुकतीच B.Com पदवी पूर्ण केली आहे. फायनान्स किंवा बँकिंग क्षेत्रातील एन्ट्री लेव्हल नोकरीसाठी एक आकर्षक आणि प्रभावी रेझ्युमे तयार कर.',
                'order'        => 7,
            ],
            [
                'id_slug'      => 'citizen',
                'role_mr'      => '४०+ वय असलेले नागरिक (Senior Citizen / 40+ Adult)',
                'role_hi'      => '४०+ नागरिक / वरिष्ठ (Senior Citizen)',
                'icon'         => 'Users',
                'pipeline'     => 'Medicine / Query → Photo → Marathi Explanation → Audio Listen',
                'pipeline_text_mr' => 'औषधाची पट्टी / शंका → फोटो काढा → सोप्या मराठीत समजून घ्या → आवाजात ऐका',
                'pipeline_text_hi' => 'दवा का पर्चा → फोटो खींचें → आसान भाषा में अर्थ → सुनकर समझें',
                'tools'        => 'Google Lens, ChatGPT Voice, NotebookLM',
                'outcome_mr'   => 'इंग्रजी समजण्याची भीती कायमची संपली! कोणत्याही डॉक्टरचे प्रिस्क्रिप्शन किंवा सरकारी नोटीस मोबाईलवर सोप्या मराठीत समजून घ्या.',
                'outcome_hi'   => 'अस्पष्ट सरकारी नोटिस या डॉक्टर की पर्ची आसानी से समझें और फोन से सीधे बोलकर जवाब पाएं।',
                'sample_input' => 'रक्त तपासणी अहवाल (Blood Report) मधील वैद्यकीय संज्ञा समजणे',
                'sample_prompt'=> 'या ब्लड रिपोर्टमधील कोलेस्टेरॉल व हिमोग्लोबिनच्या आकड्यांचा सर्वसामान्य माणसाला समजेल अशा अत्यंत सोप्या आणि सकारात्मक भाषेत अर्थ सांगा.',
                'order'        => 8,
            ],
        ];

        foreach ($challenges as $c) {
            $existing = $this->find_post_by_slug($c['id_slug'], 'ai_challenge');

            $post_data = [
                'post_title'   => $c['role_mr'],
                'post_content' => $c['outcome_mr'],
                'post_status'  => 'publish',
                'post_type'    => 'ai_challenge',
                'post_name'    => $c['id_slug'],
            ];

            if ($existing) {
                $post_id = $existing->ID;
                $post_data['ID'] = $post_id;
                wp_update_post($post_data);
            } else {
                $post_id = wp_insert_post($post_data);
            }

            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_ai_challenge_slug', $c['id_slug']);
                update_post_meta($post_id, '_ai_challenge_role_mr', $c['role_mr']);
                update_post_meta($post_id, '_ai_challenge_role_hi', $c['role_hi']);
                update_post_meta($post_id, '_ai_challenge_icon', $c['icon']);
                update_post_meta($post_id, '_ai_challenge_pipeline', $c['pipeline']);
                update_post_meta($post_id, '_ai_challenge_pipeline_mr', $c['pipeline_text_mr']);
                update_post_meta($post_id, '_ai_challenge_pipeline_hi', $c['pipeline_text_hi']);
                update_post_meta($post_id, '_ai_challenge_tools', $c['tools']);
                update_post_meta($post_id, '_ai_challenge_outcome_mr', $c['outcome_mr']);
                update_post_meta($post_id, '_ai_challenge_outcome_hi', $c['outcome_hi']);
                update_post_meta($post_id, '_ai_challenge_sample_input', $c['sample_input']);
                update_post_meta($post_id, '_ai_challenge_sample_prompt', $c['sample_prompt']);
                update_post_meta($post_id, '_ai_challenge_order', $c['order']);
            }
        }
    }

    private function seed_batches() {
        $batches = [
            [
                'title'        => 'बॅच १: आगामी रविवार (पुणे ऑफलाइन कार्यशाळा)',
                'date'         => 'पुढील रविवार (Next Sunday)',
                'time'         => 'सकाळी १०:०० ते दुपारी ४:०० (६ तास)',
                'mode'         => 'Offline (Pune)',
                'venue'        => 'सदाशिव पेठ / टिळक रोड, पुणे',
                'seats_total'  => 25,
                'seats_booked' => 18,
                'status'       => 'fast_filling',
            ],
            [
                'title'        => 'बॅच २: ऑनलाइन थेट लाइव्ह कार्यशाळा (Zoom)',
                'date'         => 'पुढील शनिवार (Saturday Evening)',
                'time'         => 'संध्याकाळी ५:०० ते रात्री ९:००',
                'mode'         => 'Online (Zoom Live)',
                'venue'        => 'Zoom Live (घरातून ऑनलाइन सहभागी व्हा)',
                'seats_total'  => 50,
                'seats_booked' => 34,
                'status'       => 'available',
            ],
        ];

        foreach ($batches as $b) {
            $slug = sanitize_title($b['title']);
            $existing = $this->find_post_by_slug($slug, 'ai_batch');

            $post_data = [
                'post_title'   => $b['title'],
                'post_content' => $b['venue'],
                'post_status'  => 'publish',
                'post_type'    => 'ai_batch',
                'post_name'    => $slug,
            ];

            if ($existing) {
                $post_id = $existing->ID;
                $post_data['ID'] = $post_id;
                wp_update_post($post_data);
            } else {
                $post_id = wp_insert_post($post_data);
            }

            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_ai_batch_date', $b['date']);
                update_post_meta($post_id, '_ai_batch_time', $b['time']);
                update_post_meta($post_id, '_ai_batch_mode', $b['mode']);
                update_post_meta($post_id, '_ai_batch_venue', $b['venue']);
                update_post_meta($post_id, '_ai_batch_seats_total', $b['seats_total']);
                update_post_meta($post_id, '_ai_batch_seats_booked', $b['seats_booked']);
                update_post_meta($post_id, '_ai_batch_status', $b['status']);
            }
        }
    }

    /**
     * 6. Meta Boxes for Post Types
     */
    public function register_meta_boxes() {
        add_meta_box('ai_tool_meta', '🛠️ AI Tool तपशील व सेटिंग्ज', [$this, 'render_tool_meta_box'], 'ai_tool', 'normal', 'high');
        add_meta_box('ai_pillar_meta', '⭐ Pillar तपशील व पायऱ्या', [$this, 'render_pillar_meta_box'], 'ai_pillar', 'normal', 'high');
        add_meta_box('ai_challenge_meta', '🎯 Real-Life Challenge (प्रोजेक्ट) तपशील', [$this, 'render_challenge_meta_box'], 'ai_challenge', 'normal', 'high');
        add_meta_box('ai_batch_meta', '📅 AI कार्यशाळा बॅच तपशील', [$this, 'render_batch_meta_box'], 'ai_batch', 'normal', 'high');
        add_meta_box('ai_inquiry_meta', '📥 नावनोंदणी ग्राहक माहिती व Status', [$this, 'render_inquiry_meta_box'], 'ai_inquiry', 'normal', 'high');
    }

    public function render_tool_meta_box($post) {
        wp_nonce_field('ai_tool_meta_nonce', '_ai_tool_meta_nonce');
        $cat         = get_post_meta($post->ID, '_ai_tool_category', true) ?: 'all';
        $badge_text  = get_post_meta($post->ID, '_ai_tool_badge_text', true) ?: 'Recommended';
        $badge_color = get_post_meta($post->ID, '_ai_tool_badge_color', true) ?: 'emerald';
        $developer   = get_post_meta($post->ID, '_ai_tool_developer', true) ?: '';
        $free_tier   = get_post_meta($post->ID, '_ai_tool_free_tier', true) ?: 'Free / Freemium';
        $url         = get_post_meta($post->ID, '_ai_tool_url', true) ?: '';
        $use_mr      = get_post_meta($post->ID, '_ai_tool_use_mr', true) ?: '';
        $use_hi      = get_post_meta($post->ID, '_ai_tool_use_hi', true) ?: '';
        $aud_mr      = get_post_meta($post->ID, '_ai_tool_audience_mr', true) ?: '';
        $aud_hi      = get_post_meta($post->ID, '_ai_tool_audience_hi', true) ?: '';
        $order       = get_post_meta($post->ID, '_ai_tool_order', true) ?: '1';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Developer / कंपनी:</label>
                <input type="text" name="_ai_tool_developer" value="<?php echo esc_attr($developer); ?>" style="width:100%; padding:8px;" placeholder="उदा. OpenAI, Google, Anthropic">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">टूल कॅटेगरी:</label>
                <select name="_ai_tool_category" style="width:100%; padding:8px;">
                    <option value="text" <?php selected($cat, 'text'); ?>>मजकूर & लेखन (Text & Chat)</option>
                    <option value="research" <?php selected($cat, 'research'); ?>>रिसर्च & सारांश (Research & PDF)</option>
                    <option value="image" <?php selected($cat, 'image'); ?>>प्रतिमा & डिझाइन (Image & Canva)</option>
                    <option value="presentation" <?php selected($cat, 'presentation'); ?>>सादरीकरण (Presentations / PPT)</option>
                    <option value="audio" <?php selected($cat, 'audio'); ?>>आवाज & ऑडिओ (Audio / ElevenLabs)</option>
                    <option value="video" <?php selected($cat, 'video'); ?>>व्हिडिओ निर्मिती (Video / InVideo)</option>
                    <option value="work" <?php selected($cat, 'work'); ?>>ऑफिस & एक्सेल (Office & Copilot)</option>
                    <option value="utility" <?php selected($cat, 'utility'); ?>>उपयुक्त टूल्स (Lens / Scanner)</option>
                    <option value="automation" <?php selected($cat, 'automation'); ?>>ऑटोमेशन & AI Agents</option>
                </select>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Badge मजकूर:</label>
                <input type="text" name="_ai_tool_badge_text" value="<?php echo esc_attr($badge_text); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">अधिकृत लिंक (URL):</label>
                <input type="url" name="_ai_tool_url" value="<?php echo esc_attr($url); ?>" style="width:100%; padding:8px;" placeholder="https://...">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">मराठीत मुख्य वापर (Primary Use in Marathi):</label>
            <textarea name="_ai_tool_use_mr" rows="2" style="width:100%; padding:8px;"><?php echo esc_textarea($use_mr); ?></textarea>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">हिंदीत मुख्य वापर (Primary Use in Hindi):</label>
            <textarea name="_ai_tool_use_hi" rows="2" style="width:100%; padding:8px;"><?php echo esc_textarea($use_hi); ?></textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 120px; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Target Audience (मराठी):</label>
                <input type="text" name="_ai_tool_audience_mr" value="<?php echo esc_attr($aud_mr); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Target Audience (हिंदी):</label>
                <input type="text" name="_ai_tool_audience_hi" value="<?php echo esc_attr($aud_hi); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्रम (Order):</label>
                <input type="number" name="_ai_tool_order" value="<?php echo esc_attr($order); ?>" style="width:100%; padding:8px;">
            </div>
        </div>
        <?php
    }

    public function render_pillar_meta_box($post) {
        wp_nonce_field('ai_pillar_meta_nonce', '_ai_pillar_meta_nonce');
        $number   = get_post_meta($post->ID, '_ai_pillar_number', true) ?: '१';
        $name_en  = get_post_meta($post->ID, '_ai_pillar_name_en', true) ?: 'AI Understand';
        $title_mr = get_post_meta($post->ID, '_ai_pillar_title_mr', true) ?: '';
        $title_hi = get_post_meta($post->ID, '_ai_pillar_title_hi', true) ?: '';
        $flow_mr  = get_post_meta($post->ID, '_ai_pillar_flow_mr', true) ?: '';
        $flow_hi  = get_post_meta($post->ID, '_ai_pillar_flow_hi', true) ?: '';
        $steps    = get_post_meta($post->ID, '_ai_pillar_steps', true) ?: '';
        $order    = get_post_meta($post->ID, '_ai_pillar_order', true) ?: '1';
        ?>
        <div style="display: grid; grid-template-columns: 120px 1fr 120px; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्रमांक (१ ते ५):</label>
                <input type="text" name="_ai_pillar_number" value="<?php echo esc_attr($number); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">इंग्रजी नाव (Pillar Name):</label>
                <input type="text" name="_ai_pillar_name_en" value="<?php echo esc_attr($name_en); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्रम (Order):</label>
                <input type="number" name="_ai_pillar_order" value="<?php echo esc_attr($order); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">मराठी शीर्षक:</label>
                <input type="text" name="_ai_pillar_title_mr" value="<?php echo esc_attr($title_mr); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">हिंदी शीर्षक:</label>
                <input type="text" name="_ai_pillar_title_hi" value="<?php echo esc_attr($title_hi); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">मराठी Flow (पायऱ्या):</label>
                <input type="text" name="_ai_pillar_flow_mr" value="<?php echo esc_attr($flow_mr); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">हिंदी Flow (चरण):</label>
                <input type="text" name="_ai_pillar_flow_hi" value="<?php echo esc_attr($flow_hi); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">तपशीलवार पायऱ्या (प्रत्येक ओळीवर १ मुद्दा):</label>
            <textarea name="_ai_pillar_steps" rows="4" style="width:100%; padding:8px;"><?php echo esc_textarea($steps); ?></textarea>
        </div>
        <?php
    }

    public function render_challenge_meta_box($post) {
        wp_nonce_field('ai_challenge_meta_nonce', '_ai_challenge_meta_nonce');
        $slug      = get_post_meta($post->ID, '_ai_challenge_slug', true) ?: '';
        $role_mr   = get_post_meta($post->ID, '_ai_challenge_role_mr', true) ?: '';
        $role_hi   = get_post_meta($post->ID, '_ai_challenge_role_hi', true) ?: '';
        $icon      = get_post_meta($post->ID, '_ai_challenge_icon', true) ?: 'GraduationCap';
        $pipeline  = get_post_meta($post->ID, '_ai_challenge_pipeline', true) ?: '';
        $tools     = get_post_meta($post->ID, '_ai_challenge_tools', true) ?: '';
        $sample_in = get_post_meta($post->ID, '_ai_challenge_sample_input', true) ?: '';
        $sample_pr = get_post_meta($post->ID, '_ai_challenge_sample_prompt', true) ?: '';
        $order     = get_post_meta($post->ID, '_ai_challenge_order', true) ?: '1';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Slug ID:</label>
                <input type="text" name="_ai_challenge_slug" value="<?php echo esc_attr($slug); ?>" style="width:100%; padding:8px;" placeholder="teacher, business, etc.">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Icon नाव:</label>
                <select name="_ai_challenge_icon" style="width:100%; padding:8px;">
                    <option value="GraduationCap" <?php selected($icon, 'GraduationCap'); ?>>🎓 GraduationCap (शिक्षक)</option>
                    <option value="Briefcase" <?php selected($icon, 'Briefcase'); ?>>💼 Briefcase (व्यवसायिक)</option>
                    <option value="Laptop" <?php selected($icon, 'Laptop'); ?>>💻 Laptop (ऑफिस)</option>
                    <option value="Home" <?php selected($icon, 'Home'); ?>>🏠 Home (पालक/गृहिणी)</option>
                    <option value="Landmark" <?php selected($icon, 'Landmark'); ?>>🏛️ Landmark (शासकीय)</option>
                    <option value="Rocket" <?php selected($icon, 'Rocket'); ?>>🚀 Rocket (फ्रीलान्सर)</option>
                    <option value="Target" <?php selected($icon, 'Target'); ?>>🎯 Target (उद्योजक)</option>
                    <option value="Users" <?php selected($icon, 'Users'); ?>>👥 Users (४०+ नागरिक)</option>
                </select>
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्रम (Order):</label>
                <input type="number" name="_ai_challenge_order" value="<?php echo esc_attr($order); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">वापरली जाणारी Tools:</label>
            <input type="text" name="_ai_challenge_tools" value="<?php echo esc_attr($tools); ?>" style="width:100%; padding:8px;" placeholder="उदा. ChatGPT, Canva AI, NotebookLM">
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">Pipeline (प्रक्रियेच्या पायऱ्या):</label>
            <input type="text" name="_ai_challenge_pipeline" value="<?php echo esc_attr($pipeline); ?>" style="width:100%; padding:8px;" placeholder="उदा. Idea → Script → Voiceover → Video">
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">नमुना विषय (Sample Input):</label>
            <input type="text" name="_ai_challenge_sample_input" value="<?php echo esc_attr($sample_in); ?>" style="width:100%; padding:8px;">
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">तयार AI प्रॉम्प्ट (Ready-to-use Prompt):</label>
            <textarea name="_ai_challenge_sample_prompt" rows="3" style="width:100%; padding:8px; font-family: monospace;"><?php echo esc_textarea($sample_pr); ?></textarea>
        </div>
        <?php
    }

    public function render_batch_meta_box($post) {
        wp_nonce_field('ai_batch_meta_nonce', '_ai_batch_meta_nonce');
        $date         = get_post_meta($post->ID, '_ai_batch_date', true) ?: '';
        $time         = get_post_meta($post->ID, '_ai_batch_time', true) ?: '';
        $mode         = get_post_meta($post->ID, '_ai_batch_mode', true) ?: 'Offline (Pune)';
        $venue        = get_post_meta($post->ID, '_ai_batch_venue', true) ?: '';
        $seats_total  = get_post_meta($post->ID, '_ai_batch_seats_total', true) ?: '25';
        $seats_booked = get_post_meta($post->ID, '_ai_batch_seats_booked', true) ?: '0';
        $status       = get_post_meta($post->ID, '_ai_batch_status', true) ?: 'available';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">तारीख / दिवस:</label>
                <input type="text" name="_ai_batch_date" value="<?php echo esc_attr($date); ?>" style="width:100%; padding:8px;" placeholder="उदा. पुढील रविवार / 22 मार्च 2026">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">वेळ (Timing):</label>
                <input type="text" name="_ai_batch_time" value="<?php echo esc_attr($time); ?>" style="width:100%; padding:8px;" placeholder="उदा. सकाळी १०:०० ते दुपारी ४:००">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">माध्यम (Mode):</label>
                <select name="_ai_batch_mode" style="width:100%; padding:8px;">
                    <option value="Offline (Pune)" <?php selected($mode, 'Offline (Pune)'); ?>>पुणे ऑफलाइन सेंटर (Offline)</option>
                    <option value="Online (Zoom Live)" <?php selected($mode, 'Online (Zoom Live)'); ?>>झूम ऑनलाइन लाइव्ह (Online Live)</option>
                    <option value="Hybrid (Both)" <?php selected($mode, 'Hybrid (Both)'); ?>>हायब्रीड (ऑफलाइन + ऑनलाइन दोन्ही)</option>
                </select>
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">स्थिती (Status):</label>
                <select name="_ai_batch_status" style="width:100%; padding:8px;">
                    <option value="available" <?php selected($status, 'available'); ?>>जागा उपलब्ध (Seats Available)</option>
                    <option value="fast_filling" <?php selected($status, 'fast_filling'); ?>>जागा वेगाने भरत आहेत (Fast Filling)</option>
                    <option value="full" <?php selected($status, 'full'); ?>>बॅच पूर्ण भरली (Batch Full)</option>
                </select>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">एकूण जागा (Total Seats):</label>
                <input type="number" name="_ai_batch_seats_total" value="<?php echo esc_attr($seats_total); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">बुक झालेल्या जागा (Booked Seats):</label>
                <input type="number" name="_ai_batch_seats_booked" value="<?php echo esc_attr($seats_booked); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">पत्ता / व्हिन्यू (Venue):</label>
            <textarea name="_ai_batch_venue" rows="2" style="width:100%; padding:8px;"><?php echo esc_textarea($venue); ?></textarea>
        </div>
        <?php
    }

    public function render_inquiry_meta_box($post) {
        wp_nonce_field('ai_inquiry_meta_nonce', '_ai_inquiry_meta_nonce');
        $phone    = get_post_meta($post->ID, '_ai_inquiry_phone', true) ?: '';
        $category = get_post_meta($post->ID, '_ai_inquiry_category', true) ?: '';
        $batch    = get_post_meta($post->ID, '_ai_inquiry_batch', true) ?: '';
        $lang     = get_post_meta($post->ID, '_ai_inquiry_lang', true) ?: 'मराठी';
        $status   = get_post_meta($post->ID, '_ai_inquiry_status', true) ?: 'new';
        $notes    = get_post_meta($post->ID, '_ai_inquiry_notes', true) ?: '';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">मोबाईल नंबर:</label>
                <input type="text" name="_ai_inquiry_phone" value="<?php echo esc_attr($phone); ?>" style="width:100%; padding:8px;">
                <?php if ($phone): ?>
                    <a href="https://wa.me/91<?php echo esc_attr(preg_replace('/[^0-9]/', '', $phone)); ?>" target="_blank" style="display:inline-block; margin-top: 6px; color: #16a34a; font-weight: 700; text-decoration:none;">
                        💬 WhatsApp वर थेट चॅट करा
                    </a>
                <?php endif; ?>
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">स्थिती (Status):</label>
                <select name="_ai_inquiry_status" style="width:100%; padding:8px;">
                    <option value="new" <?php selected($status, 'new'); ?>>🔴 नवीन नावनोंदणी (New Inquiry)</option>
                    <option value="contacted" <?php selected($status, 'contacted'); ?>>🟡 संपर्क केला (Contacted)</option>
                    <option value="confirmed" <?php selected($status, 'confirmed'); ?>>🟢 सीट कन्फर्म (Confirmed)</option>
                    <option value="cancelled" <?php selected($status, 'cancelled'); ?>>⚪ रद्द (Cancelled)</option>
                </select>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्षेत्र / प्रोफेशन:</label>
                <input type="text" name="_ai_inquiry_category" value="<?php echo esc_attr($category); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">भाषा निवड:</label>
                <input type="text" name="_ai_inquiry_lang" value="<?php echo esc_attr($lang); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">नोंद / मेसेज:</label>
            <textarea name="_ai_inquiry_notes" rows="3" style="width:100%; padding:8px;"><?php echo esc_textarea($notes); ?></textarea>
        </div>
        <?php
    }

    /**
     * Save Custom Meta
     */
    public function save_custom_meta($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        // Tool
        if (isset($_POST['_ai_tool_meta_nonce']) && wp_verify_nonce($_POST['_ai_tool_meta_nonce'], 'ai_tool_meta_nonce')) {
            update_post_meta($post_id, '_ai_tool_developer', sanitize_text_field($_POST['_ai_tool_developer'] ?? ''));
            update_post_meta($post_id, '_ai_tool_category', sanitize_text_field($_POST['_ai_tool_category'] ?? ''));
            update_post_meta($post_id, '_ai_tool_badge_text', sanitize_text_field($_POST['_ai_tool_badge_text'] ?? ''));
            update_post_meta($post_id, '_ai_tool_url', esc_url_raw($_POST['_ai_tool_url'] ?? ''));
            update_post_meta($post_id, '_ai_tool_use_mr', sanitize_textarea_field($_POST['_ai_tool_use_mr'] ?? ''));
            update_post_meta($post_id, '_ai_tool_use_hi', sanitize_textarea_field($_POST['_ai_tool_use_hi'] ?? ''));
            update_post_meta($post_id, '_ai_tool_audience_mr', sanitize_text_field($_POST['_ai_tool_audience_mr'] ?? ''));
            update_post_meta($post_id, '_ai_tool_audience_hi', sanitize_text_field($_POST['_ai_tool_audience_hi'] ?? ''));
            update_post_meta($post_id, '_ai_tool_order', intval($_POST['_ai_tool_order'] ?? 1));
        }

        // Pillar
        if (isset($_POST['_ai_pillar_meta_nonce']) && wp_verify_nonce($_POST['_ai_pillar_meta_nonce'], 'ai_pillar_meta_nonce')) {
            update_post_meta($post_id, '_ai_pillar_number', sanitize_text_field($_POST['_ai_pillar_number'] ?? ''));
            update_post_meta($post_id, '_ai_pillar_name_en', sanitize_text_field($_POST['_ai_pillar_name_en'] ?? ''));
            update_post_meta($post_id, '_ai_pillar_title_mr', sanitize_text_field($_POST['_ai_pillar_title_mr'] ?? ''));
            update_post_meta($post_id, '_ai_pillar_title_hi', sanitize_text_field($_POST['_ai_pillar_title_hi'] ?? ''));
            update_post_meta($post_id, '_ai_pillar_flow_mr', sanitize_text_field($_POST['_ai_pillar_flow_mr'] ?? ''));
            update_post_meta($post_id, '_ai_pillar_flow_hi', sanitize_text_field($_POST['_ai_pillar_flow_hi'] ?? ''));
            update_post_meta($post_id, '_ai_pillar_steps', sanitize_textarea_field($_POST['_ai_pillar_steps'] ?? ''));
            update_post_meta($post_id, '_ai_pillar_order', intval($_POST['_ai_pillar_order'] ?? 1));
        }

        // Challenge
        if (isset($_POST['_ai_challenge_meta_nonce']) && wp_verify_nonce($_POST['_ai_challenge_meta_nonce'], 'ai_challenge_meta_nonce')) {
            update_post_meta($post_id, '_ai_challenge_slug', sanitize_text_field($_POST['_ai_challenge_slug'] ?? ''));
            update_post_meta($post_id, '_ai_challenge_icon', sanitize_text_field($_POST['_ai_challenge_icon'] ?? ''));
            update_post_meta($post_id, '_ai_challenge_tools', sanitize_text_field($_POST['_ai_challenge_tools'] ?? ''));
            update_post_meta($post_id, '_ai_challenge_pipeline', sanitize_text_field($_POST['_ai_challenge_pipeline'] ?? ''));
            update_post_meta($post_id, '_ai_challenge_sample_input', sanitize_text_field($_POST['_ai_challenge_sample_input'] ?? ''));
            update_post_meta($post_id, '_ai_challenge_sample_prompt', sanitize_textarea_field($_POST['_ai_challenge_sample_prompt'] ?? ''));
            update_post_meta($post_id, '_ai_challenge_order', intval($_POST['_ai_challenge_order'] ?? 1));
        }

        // Batch
        if (isset($_POST['_ai_batch_meta_nonce']) && wp_verify_nonce($_POST['_ai_batch_meta_nonce'], 'ai_batch_meta_nonce')) {
            update_post_meta($post_id, '_ai_batch_date', sanitize_text_field($_POST['_ai_batch_date'] ?? ''));
            update_post_meta($post_id, '_ai_batch_time', sanitize_text_field($_POST['_ai_batch_time'] ?? ''));
            update_post_meta($post_id, '_ai_batch_mode', sanitize_text_field($_POST['_ai_batch_mode'] ?? ''));
            update_post_meta($post_id, '_ai_batch_status', sanitize_text_field($_POST['_ai_batch_status'] ?? ''));
            update_post_meta($post_id, '_ai_batch_seats_total', intval($_POST['_ai_batch_seats_total'] ?? 25));
            update_post_meta($post_id, '_ai_batch_seats_booked', intval($_POST['_ai_batch_seats_booked'] ?? 0));
            update_post_meta($post_id, '_ai_batch_venue', sanitize_textarea_field($_POST['_ai_batch_venue'] ?? ''));
        }

        // Inquiry
        if (isset($_POST['_ai_inquiry_meta_nonce']) && wp_verify_nonce($_POST['_ai_inquiry_meta_nonce'], 'ai_inquiry_meta_nonce')) {
            update_post_meta($post_id, '_ai_inquiry_phone', sanitize_text_field($_POST['_ai_inquiry_phone'] ?? ''));
            update_post_meta($post_id, '_ai_inquiry_category', sanitize_text_field($_POST['_ai_inquiry_category'] ?? ''));
            update_post_meta($post_id, '_ai_inquiry_lang', sanitize_text_field($_POST['_ai_inquiry_lang'] ?? ''));
            update_post_meta($post_id, '_ai_inquiry_status', sanitize_text_field($_POST['_ai_inquiry_status'] ?? ''));
            update_post_meta($post_id, '_ai_inquiry_notes', sanitize_textarea_field($_POST['_ai_inquiry_notes'] ?? ''));
        }
    }

    /**
     * 7. Custom Column Headers & Content
     */
    public function tool_columns($cols) {
        return [
            'cb'         => '<input type="checkbox" />',
            'title'      => 'AI Tool नाव',
            'developer'  => 'Developer',
            'category'   => 'Category',
            'badge'      => 'Badge',
            'order'      => 'Order',
            'date'       => 'तारीख',
        ];
    }

    public function render_tool_column($col, $post_id) {
        if ($col === 'developer') {
            echo esc_html(get_post_meta($post_id, '_ai_tool_developer', true) ?: '-');
        } elseif ($col === 'category') {
            echo '<span class="ai-badge" style="background:#e0e7ff; color:#3730a3;">' . esc_html(get_post_meta($post_id, '_ai_tool_category', true) ?: 'all') . '</span>';
        } elseif ($col === 'badge') {
            echo '<span class="ai-badge" style="background:#dcfce7; color:#166534;">' . esc_html(get_post_meta($post_id, '_ai_tool_badge_text', true) ?: 'Top Tool') . '</span>';
        } elseif ($col === 'order') {
            echo esc_html(get_post_meta($post_id, '_ai_tool_order', true) ?: '1');
        }
    }

    public function pillar_columns($cols) {
        return [
            'cb'     => '<input type="checkbox" />',
            'number' => 'क्रमांक',
            'title'  => 'Pillar नाव (Title)',
            'flow'   => 'Flow',
            'order'  => 'Order',
        ];
    }

    public function render_pillar_column($col, $post_id) {
        if ($col === 'number') {
            echo '<strong>' . esc_html(get_post_meta($post_id, '_ai_pillar_number', true) ?: '१') . '</strong>';
        } elseif ($col === 'flow') {
            echo esc_html(get_post_meta($post_id, '_ai_pillar_flow_mr', true) ?: '-');
        } elseif ($col === 'order') {
            echo esc_html(get_post_meta($post_id, '_ai_pillar_order', true) ?: '1');
        }
    }

    public function challenge_columns($cols) {
        return [
            'cb'       => '<input type="checkbox" />',
            'title'    => 'क्षेत्र / प्रोफेशन',
            'tools'    => 'वापरली जाणारी Tools',
            'pipeline' => 'Pipeline',
            'order'    => 'Order',
        ];
    }

    public function render_challenge_column($col, $post_id) {
        if ($col === 'tools') {
            echo esc_html(get_post_meta($post_id, '_ai_challenge_tools', true) ?: '-');
        } elseif ($col === 'pipeline') {
            echo '<span style="font-size:11px; color:#475569;">' . esc_html(get_post_meta($post_id, '_ai_challenge_pipeline', true) ?: '-') . '</span>';
        } elseif ($col === 'order') {
            echo esc_html(get_post_meta($post_id, '_ai_challenge_order', true) ?: '1');
        }
    }

    public function batch_columns($cols) {
        return [
            'cb'     => '<input type="checkbox" />',
            'title'  => 'बॅच नाव',
            'date'   => 'तारीख व वेळ',
            'mode'   => 'माध्यम (Mode)',
            'seats'  => 'जागा (Booked/Total)',
            'status' => 'Status',
        ];
    }

    public function render_batch_column($col, $post_id) {
        if ($col === 'date') {
            echo esc_html(get_post_meta($post_id, '_ai_batch_date', true) . ' | ' . get_post_meta($post_id, '_ai_batch_time', true));
        } elseif ($col === 'mode') {
            echo esc_html(get_post_meta($post_id, '_ai_batch_mode', true) ?: 'Offline');
        } elseif ($col === 'seats') {
            $booked = intval(get_post_meta($post_id, '_ai_batch_seats_booked', true));
            $total  = intval(get_post_meta($post_id, '_ai_batch_seats_total', true) ?: 25);
            echo '<strong>' . $booked . '</strong> / ' . $total;
        } elseif ($col === 'status') {
            $st = get_post_meta($post_id, '_ai_batch_status', true);
            $color = $st === 'available' ? '#16a34a' : ($st === 'fast_filling' ? '#d97706' : '#dc2626');
            echo '<span style="color:' . $color . '; font-weight:700;">' . esc_html(strtoupper($st ?: 'available')) . '</span>';
        }
    }

    public function inquiry_columns($cols) {
        return [
            'cb'       => '<input type="checkbox" />',
            'title'    => 'नाव',
            'phone'    => 'मोबाईल',
            'category' => 'क्षेत्र',
            'lang'     => 'भाषा',
            'status'   => 'Status',
            'date'     => 'नोंदणी तारीख',
        ];
    }

    public function render_inquiry_column($col, $post_id) {
        if ($col === 'phone') {
            $phone = get_post_meta($post_id, '_ai_inquiry_phone', true);
            echo esc_html($phone) . ' <a href="https://wa.me/91' . esc_attr(preg_replace('/[^0-9]/', '', $phone)) . '" target="_blank" style="color:#16a34a;">💬</a>';
        } elseif ($col === 'category') {
            echo esc_html(get_post_meta($post_id, '_ai_inquiry_category', true) ?: '-');
        } elseif ($col === 'lang') {
            echo esc_html(get_post_meta($post_id, '_ai_inquiry_lang', true) ?: 'मराठी');
        } elseif ($col === 'status') {
            $st = get_post_meta($post_id, '_ai_inquiry_status', true) ?: 'new';
            echo '<span class="ai-badge" style="background:#fee2e2; color:#991b1b;">' . esc_html(strtoupper($st)) . '</span>';
        }
    }

    /**
     * 8. Safe REST API & CORS Configuration
     */
    public function enable_cors_headers() {
        add_filter('rest_pre_serve_request', function ($value) {
            if (!headers_sent()) {
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, Accept');
            }
            return $value;
        });
    }

    public function register_rest_routes() {
        // Primary Endpoint
        register_rest_route('ai-course/v1', '/all-data', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_all_data'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('ai-course/v1', '/tools', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_tools'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('ai-course/v1', '/pillars', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_pillars'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('ai-course/v1', '/challenges', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_challenges'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('ai-course/v1', '/batches', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_batches'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('ai-course/v1', '/register', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_rest_register'],
            'permission_callback' => '__return_true',
        ]);

        // Compatibility alias endpoints for existing frontend
        register_rest_route('pooja/v1', '/ai-course', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_all_data'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('pooja/v1', '/ai-inquiry', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_rest_register'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function get_rest_all_data() {
        return rest_ensure_response([
            'status'     => 'success',
            'settings'   => $this->get_settings(),
            'pillars'    => $this->get_formatted_pillars(),
            'tools'      => $this->get_formatted_tools(),
            'challenges' => $this->get_formatted_challenges(),
            'batches'    => $this->get_formatted_batches(),
        ]);
    }

    public function get_rest_tools() {
        return rest_ensure_response(['status' => 'success', 'data' => $this->get_formatted_tools()]);
    }

    public function get_rest_pillars() {
        return rest_ensure_response(['status' => 'success', 'data' => $this->get_formatted_pillars()]);
    }

    public function get_rest_challenges() {
        return rest_ensure_response(['status' => 'success', 'data' => $this->get_formatted_challenges()]);
    }

    public function get_rest_batches() {
        return rest_ensure_response(['status' => 'success', 'data' => $this->get_formatted_batches()]);
    }

    public function handle_rest_register($request) {
        $params = $request->get_json_params();
        if (empty($params)) {
            $params = $request->get_body_params();
        }

        $name     = sanitize_text_field($params['name'] ?? 'नवीन विद्यार्थी');
        $phone    = sanitize_text_field($params['phone'] ?? '');
        $category = sanitize_text_field($params['category'] ?? '');
        $batch    = sanitize_text_field($params['batch'] ?? '');
        $lang     = sanitize_text_field($params['lang'] ?? 'मराठी');
        $notes    = sanitize_textarea_field($params['notes'] ?? '');

        if (empty($phone)) {
            return new WP_Error('missing_phone', 'मोबाईल नंबर आवश्यक आहे.', ['status' => 400]);
        }

        $post_id = wp_insert_post([
            'post_title'   => $name . ' (' . $phone . ')',
            'post_status'  => 'publish',
            'post_type'    => 'ai_inquiry',
        ]);

        if ($post_id && !is_wp_error($post_id)) {
            update_post_meta($post_id, '_ai_inquiry_name', $name);
            update_post_meta($post_id, '_ai_inquiry_phone', $phone);
            update_post_meta($post_id, '_ai_inquiry_category', $category);
            update_post_meta($post_id, '_ai_inquiry_batch', $batch);
            update_post_meta($post_id, '_ai_inquiry_lang', $lang);
            update_post_meta($post_id, '_ai_inquiry_status', 'new');
            update_post_meta($post_id, '_ai_inquiry_notes', $notes);

            return rest_ensure_response([
                'success' => true,
                'message' => 'नावनोंदणी यशस्वीरीत्या प्राप्त झाली!',
                'id'      => $post_id,
            ]);
        }

        return new WP_Error('insert_failed', 'नोंदणी सेव्ह करता आली नाही.', ['status' => 500]);
    }

    private function get_formatted_tools() {
        $posts = get_posts([
            'post_type'      => 'ai_tool',
            'posts_per_page' => 50,
            'post_status'    => 'publish',
            'orderby'        => 'meta_value_num',
            'meta_key'       => '_ai_tool_order',
            'order'          => 'ASC',
        ]);

        $tools = [];
        foreach ($posts as $post) {
            $id = $post->ID;
            $tools[] = [
                'id'          => $id,
                'name'        => get_the_title($id),
                'developer'   => get_post_meta($id, '_ai_tool_developer', true) ?: '',
                'category'    => get_post_meta($id, '_ai_tool_category', true) ?: 'all',
                'badgeText'   => get_post_meta($id, '_ai_tool_badge_text', true) ?: '',
                'badgeColor'  => get_post_meta($id, '_ai_tool_badge_color', true) ?: 'emerald',
                'freeTier'    => get_post_meta($id, '_ai_tool_free_tier', true) ?: '',
                'url'         => get_post_meta($id, '_ai_tool_url', true) ?: '',
                'use_mr'      => get_post_meta($id, '_ai_tool_use_mr', true) ?: '',
                'use_hi'      => get_post_meta($id, '_ai_tool_use_hi', true) ?: '',
                'audience_mr' => get_post_meta($id, '_ai_tool_audience_mr', true) ?: '',
                'audience_hi' => get_post_meta($id, '_ai_tool_audience_hi', true) ?: '',
                'order'       => intval(get_post_meta($id, '_ai_tool_order', true) ?: 1),
            ];
        }
        return $tools;
    }

    private function get_formatted_pillars() {
        $posts = get_posts([
            'post_type'      => 'ai_pillar',
            'posts_per_page' => 10,
            'post_status'    => 'publish',
            'orderby'        => 'meta_value_num',
            'meta_key'       => '_ai_pillar_order',
            'order'          => 'ASC',
        ]);

        $pillars = [];
        foreach ($posts as $post) {
            $id = $post->ID;
            $steps_raw = get_post_meta($id, '_ai_pillar_steps', true) ?: '';
            $steps = array_values(array_filter(array_map('trim', explode("\\n", str_replace("\\r", "", $steps_raw))))));

            $pillars[] = [
                'id'       => $id,
                'number'   => get_post_meta($id, '_ai_pillar_number', true) ?: '१',
                'name_en'  => get_post_meta($id, '_ai_pillar_name_en', true) ?: '',
                'title_mr' => get_post_meta($id, '_ai_pillar_title_mr', true) ?: get_the_title($id),
                'title_hi' => get_post_meta($id, '_ai_pillar_title_hi', true) ?: '',
                'flow_mr'  => get_post_meta($id, '_ai_pillar_flow_mr', true) ?: '',
                'flow_hi'  => get_post_meta($id, '_ai_pillar_flow_hi', true) ?: '',
                'desc_mr'  => get_post_meta($id, '_ai_pillar_desc_mr', true) ?: $post->post_content,
                'desc_hi'  => get_post_meta($id, '_ai_pillar_desc_hi', true) ?: '',
                'steps'    => $steps,
                'order'    => intval(get_post_meta($id, '_ai_pillar_order', true) ?: 1),
            ];
        }
        return $pillars;
    }

    private function get_formatted_challenges() {
        $posts = get_posts([
            'post_type'      => 'ai_challenge',
            'posts_per_page' => 20,
            'post_status'    => 'publish',
            'orderby'        => 'meta_value_num',
            'meta_key'       => '_ai_challenge_order',
            'order'          => 'ASC',
        ]);

        $challenges = [];
        foreach ($posts as $post) {
            $id = $post->ID;
            $challenges[] = [
                'id'            => $id,
                'id_slug'       => get_post_meta($id, '_ai_challenge_slug', true) ?: $post->post_name,
                'role_mr'       => get_post_meta($id, '_ai_challenge_role_mr', true) ?: get_the_title($id),
                'role_hi'       => get_post_meta($id, '_ai_challenge_role_hi', true) ?: '',
                'icon'          => get_post_meta($id, '_ai_challenge_icon', true) ?: 'GraduationCap',
                'tools'         => get_post_meta($id, '_ai_challenge_tools', true) ?: '',
                'pipeline'      => get_post_meta($id, '_ai_challenge_pipeline', true) ?: '',
                'pipeline_mr'   => get_post_meta($id, '_ai_challenge_pipeline_mr', true) ?: '',
                'pipeline_hi'   => get_post_meta($id, '_ai_challenge_pipeline_hi', true) ?: '',
                'outcome_mr'    => get_post_meta($id, '_ai_challenge_outcome_mr', true) ?: $post->post_content,
                'outcome_hi'    => get_post_meta($id, '_ai_challenge_outcome_hi', true) ?: '',
                'sample_input'  => get_post_meta($id, '_ai_challenge_sample_input', true) ?: '',
                'sample_prompt' => get_post_meta($id, '_ai_challenge_sample_prompt', true) ?: '',
                'order'         => intval(get_post_meta($id, '_ai_challenge_order', true) ?: 1),
            ];
        }
        return $challenges;
    }

    private function get_formatted_batches() {
        $posts = get_posts([
            'post_type'      => 'ai_batch',
            'posts_per_page' => 20,
            'post_status'    => 'publish',
            'orderby'        => 'date',
            'order'          => 'DESC',
        ]);

        $batches = [];
        foreach ($posts as $post) {
            $id = $post->ID;
            $batches[] = [
                'id'          => $id,
                'title'       => get_the_title($id),
                'date'        => get_post_meta($id, '_ai_batch_date', true) ?: '',
                'time'        => get_post_meta($id, '_ai_batch_time', true) ?: '',
                'mode'        => get_post_meta($id, '_ai_batch_mode', true) ?: 'Offline',
                'venue'       => get_post_meta($id, '_ai_batch_venue', true) ?: '',
                'seatsTotal'  => intval(get_post_meta($id, '_ai_batch_seats_total', true) ?: 25),
                'seatsBooked' => intval(get_post_meta($id, '_ai_batch_seats_booked', true) ?: 0),
                'status'      => get_post_meta($id, '_ai_batch_status', true) ?: 'available',
            ];
        }
        return $batches;
    }

    /**
     * 9. Render Admin Dashboard Page
     */
    public function render_dashboard_page() {
        $settings = $this->get_settings();
        
        $tools_obj      = wp_count_posts('ai_tool');
        $tools_count    = isset($tools_obj->publish) ? intval($tools_obj->publish) : 0;

        $pillars_obj    = wp_count_posts('ai_pillar');
        $pillars_count  = isset($pillars_obj->publish) ? intval($pillars_obj->publish) : 0;

        $chall_obj      = wp_count_posts('ai_challenge');
        $challenges_count = isset($chall_obj->publish) ? intval($chall_obj->publish) : 0;

        $batch_obj      = wp_count_posts('ai_batch');
        $batches_count  = isset($batch_obj->publish) ? intval($batch_obj->publish) : 0;

        $inq_obj        = wp_count_posts('ai_inquiry');
        $inquiries_count = isset($inq_obj->publish) ? intval($inq_obj->publish) : 0;
        ?>
        <div class="wrap ai-wrap">
            <div class="ai-banner">
                <div>
                    <h1>🎓 १ डे प्रॅक्टिकल AI कार्यशाळा CMS (Pune)</h1>
                    <p>५ Pillars, १०-१२ Core Tools, Real-Life Projects, Batches व Inquiries चे सुलभ नियंत्रण.</p>
                </div>
                <div>
                    <a href="<?php echo esc_url(site_url('/wp-json/ai-course/v1/all-data')); ?>" target="_blank" class="button ai-btn-gold">
                        🌐 REST API डेटा पहा
                    </a>
                </div>
            </div>

            <?php if (isset($_GET['updated'])): ?>
                <div class="notice notice-success is-dismissible" style="border-left-color: #10b981;">
                    <p><strong>✅ सेटिंग्ज यशस्वीरीत्या सेव्ह झाल्या!</strong></p>
                </div>
            <?php endif; ?>

            <?php if (isset($_GET['seeded'])): ?>
                <div class="notice notice-success is-dismissible" style="border-left-color: #10b981;">
                    <p><strong>🎉 सर्व ५ Pillars, १२ Core Tools व ८ Challenges WordPress मध्ये यशस्वीरीत्या तयार झाले!</strong></p>
                </div>
            <?php endif; ?>

            <div class="ai-stats-grid">
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_tool')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo $tools_count; ?></div>
                    <div class="ai-stat-label">🛠️ AI Tools (१०-१२ निवडक)</div>
                    <span class="ai-stat-sub">Edit / Manage Tools &rarr;</span>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_pillar')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo $pillars_count; ?></div>
                    <div class="ai-stat-label">⭐ ५ मुख्य Pillars</div>
                    <span class="ai-stat-sub">Edit Pillars &rarr;</span>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_challenge')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo $challenges_count; ?></div>
                    <div class="ai-stat-label">🎯 Real-Life Projects</div>
                    <span class="ai-stat-sub">Edit Challenges &rarr;</span>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_batch')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo $batches_count; ?></div>
                    <div class="ai-stat-label">📅 Batches (शेड्युल)</div>
                    <span class="ai-stat-sub">Manage Batches &rarr;</span>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_inquiry')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo $inquiries_count; ?></div>
                    <div class="ai-stat-label">📥 नावनोंदणी (Inquiries)</div>
                    <span class="ai-stat-sub">View Leads &rarr;</span>
                </a>
            </div>

            <div class="ai-card" style="border: 2px dashed #f59e0b; background: #fffbeb;">
                <h2 style="color: #92400e; border-bottom: 2px solid #fef3c7;">
                    ⚡ 1-Click Default Content Setup (सुरुवातीचा सर्व डेटा लोड करा)
                </h2>
                <p style="color: #78350f; font-size: 14px; line-height: 1.6;">
                    जर तुमच्या WordPress मध्ये अद्याप Pillars, टूल्स किंवा प्रोजेक्ट्स जोडलेले नसतील, तर खालील बटण दाबल्यास <strong>सर्व ५ Pillars (Understand, Communicate, Work, Create, Automate)</strong>, <strong>१२ Core Tools (ChatGPT, Gemini, Claude, Perplexity, Canva इ.)</strong>, आणि <strong>८ क्षेत्रांचे Real-Life Challenges</strong> आपोआप WordPress मध्ये तयार होतील.
                </p>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <input type="hidden" name="action" value="ai_course_seed_data">
                    <?php wp_nonce_field('ai_seed_nonce', '_ai_seed_nonce'); ?>
                    <button type="submit" class="button ai-btn-primary" onclick="return confirm('सर्व १२ टूल्स, ५ Pillars व ८ Real-Life Challenges आपोआप तयार करू का?');">
                        🚀 १-क्लिक सर्व डेटा लोड करा (Load Default Content)
                    </button>
                </form>
            </div>

            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="ai_course_save_settings">
                <?php wp_nonce_field('ai_settings_nonce', '_ai_settings_nonce'); ?>

                <div class="ai-card">
                    <h2>⚙️ कार्यशाळा मुख्य तपशील (Course Information)</h2>

                    <div class="ai-field">
                        <label for="ai_title">कार्यशाळा शीर्षक (Title):</label>
                        <input type="text" id="ai_title" name="course_title" value="<?php echo esc_attr($settings['course_title']); ?>" required>
                    </div>

                    <div class="ai-field">
                        <label for="ai_sub">उपशीर्षक (Headline / Subtitle):</label>
                        <input type="text" id="ai_sub" name="course_subtitle" value="<?php echo esc_attr($settings['course_subtitle']); ?>">
                    </div>

                    <div class="ai-grid-2">
                        <div class="ai-field">
                            <label for="ai_fees">एकूण फी (₹ Fees):</label>
                            <input type="number" id="ai_fees" name="fees" value="<?php echo esc_attr($settings['fees']); ?>">
                        </div>
                        <div class="ai-field">
                            <label for="ai_adv">अॅडव्हान्स बुकिंग फी (₹ Advance):</label>
                            <input type="number" id="ai_adv" name="advance_fee" value="<?php echo esc_attr($settings['advance_fee']); ?>">
                        </div>
                    </div>

                    <div class="ai-grid-2">
                        <div class="ai-field">
                            <label for="ai_date">आगामी बॅच तारीख:</label>
                            <input type="text" id="ai_date" name="default_date" value="<?php echo esc_attr($settings['default_date']); ?>">
                        </div>
                        <div class="ai-field">
                            <label for="ai_time">वेळ (Timing):</label>
                            <input type="text" id="ai_time" name="default_time" value="<?php echo esc_attr($settings['default_time']); ?>">
                        </div>
                    </div>

                    <div class="ai-grid-2">
                        <div class="ai-field">
                            <label for="ai_wa">WhatsApp नंबर (नावनोंदणीसाठी):</label>
                            <input type="text" id="ai_wa" name="whatsapp" value="<?php echo esc_attr($settings['whatsapp']); ?>" required>
                        </div>
                        <div class="ai-field">
                            <label for="ai_mode">कार्यशाळा माध्यम (Mode):</label>
                            <input type="text" id="ai_mode" name="mode" value="<?php echo esc_attr($settings['mode']); ?>">
                        </div>
                    </div>

                    <div class="ai-field">
                        <label for="ai_venue">पत्ता व ठिकाण (Venue / Offline Location):</label>
                        <textarea id="ai_venue" name="venue_full" rows="2"><?php echo esc_textarea($settings['venue_full']); ?></textarea>
                    </div>

                    <div class="ai-field">
                        <label for="ai_zoom">Zoom लिंक (ऑनलाइन बॅचसाठी):</label>
                        <input type="url" id="ai_zoom" name="zoom_link" value="<?php echo esc_attr($settings['zoom_link']); ?>" placeholder="https://zoom.us/j/...">
                    </div>

                    <div style="margin-top: 20px;">
                        <button type="submit" class="button ai-btn-primary">
                            💾 सर्व सेटिंग्ज सेव्ह करा
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <?php
    }

    /**
     * 10. Render WPCode Guide Page
     */
    public function render_wpcode_guide_page() {
        ?>
        <div class="wrap ai-wrap">
            <div class="ai-banner">
                <div>
                    <h1>📋 WPCode द्वारे प्लगइन कसे चालवावे? (WPCode Snippet Instructions)</h1>
                    <p>जर तुम्हाला संपूर्ण प्लगइन अपलोड न करता थेट <strong>WPCode (Code Snippets)</strong> प्लगइन वापरून चालवायचे असेल, तर खालील सूचनांचे पालन करा.</p>
                </div>
            </div>

            <div class="ai-card">
                <h2>⚡ पायरी १: WPCode मध्ये नवीन स्निपेट तयार करा</h2>
                <ol style="line-height: 1.8; font-size: 14px; color: #334155;">
                    <li>तुमच्या WordPress डॅशबोर्डमध्ये <strong>Code Snippets</strong> किंवा <strong>WPCode</strong> वर क्लिक करा.</li>
                    <li><strong>+ Add Snippet</strong> बटणावर क्लिक करा आणि <strong>Add Your Custom Code (New Snippet)</strong> निवडा.</li>
                    <li>Code Type मध्ये <strong>PHP Snippet</strong> निवडा.</li>
                    <li>Insertion मध्ये <strong>Auto Insert</strong> आणि Location मध्ये <strong>Everywhere (Run everywhere)</strong> ठेवा.</li>
                    <li>खालील कोड कॉपी करून पेस्ट करा आणि <strong>Active</strong> करून <strong>Save Snippet</strong> दाबा!</li>
                </ol>

                <h2 style="margin-top: 25px;">🌐 पायरी २: REST API Endpoints</h2>
                <div class="ai-code-box">GET  <?php echo esc_html(site_url('/wp-json/ai-course/v1/all-data')); ?>  (सर्व Pillars, Tools व Projects)
GET  <?php echo esc_html(site_url('/wp-json/ai-course/v1/tools')); ?>     (१०-१२ Core Tools)
GET  <?php echo esc_html(site_url('/wp-json/ai-course/v1/pillars')); ?>   (५ मुख्य Pillars)
GET  <?php echo esc_html(site_url('/wp-json/ai-course/v1/challenges')); ?>(Real-Life Projects)
POST <?php echo esc_html(site_url('/wp-json/ai-course/v1/register')); ?>  (थेट फॉर्म नावनोंदणी)</div>
            </div>
        </div>
        <?php
    }
}

// Initialize the plugin instance safely
if (did_action('plugins_loaded')) {
    AICourseCompleteCMS::get_instance();
} else {
    add_action('plugins_loaded', ['AICourseCompleteCMS', 'get_instance']);
}

}
`;

fs.writeFileSync('wordpress/ai-course-cms.php', phpCode, 'utf8');
console.log('Saved ai-course-cms.php successfully. Size:', phpCode.length);
