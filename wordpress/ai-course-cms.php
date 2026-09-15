<?php
/**
 * Plugin Name: 1 Day AI Course CMS & Headless API (WPCode & WordPress Plugin)
 * Plugin URI: https://avipatil.live/cmspooja
 * Description: १ डे प्रॅक्टिकल AI कार्यशाळा (AI Course) साठी संपूर्ण WordPress CMS प्लगइन. WordPress डॅशबोर्डवरून किंवा WPCode द्वारे ५ मुख्य Pillars, १०-१२ Core Tools, Real-Life Projects, Batches व नावनोंदणी (Inquiries) चे Add, Update, Edit, Delete सहजपणे करा.
 * Version: 2.0.0
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

        // 4. Admin Columns Customizations (Quick view, Edit, Delete)
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

        // 5. Admin CSS & Assets
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

        // C. Real-Life Challenges by Profession (कॅपस्टोन प्रोजेक्ट्स)
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
            'dashicons-superhero',
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
     * 3. Admin Styles
     */
    public function enqueue_admin_assets($hook) {
        wp_enqueue_media();
        wp_enqueue_style('ai-course-admin-styles', false);
        wp_add_inline_style('ai-course-admin-styles', '
            .ai-wrap { max-width: 1100px; margin: 20px auto 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif; }
            .ai-banner { background: linear-gradient(135deg, #4A121E 0%, #691728 50%, #831B32 100%); color: #fff; padding: 26px 32px; border-radius: 14px; margin-bottom: 24px; box-shadow: 0 6px 18px rgba(74, 18, 30, 0.25); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border: 1px solid rgba(251, 191, 36, 0.3); }
            .ai-banner h1 { color: #fff; margin: 0 0 6px; font-size: 24px; font-weight: 800; font-family: Georgia, serif; }
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
            .ai-badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; }
            .ai-code-box { background: #1e1e2e; color: #cdd6f4; padding: 18px; border-radius: 10px; font-family: monospace; font-size: 13px; overflow-x: auto; white-space: pre; border: 1px solid #313244; }
        ');
    }

    /**
     * Default AI Course Settings
     */
    public function get_default_settings() {
        return [
            'course_title'      => '१ डे प्रॅक्टिकल AI कार्यशाळा (Basic to Advanced)',
            'course_subtitle'   => 'AI फक्त IT लोकांसाठी नाही — AI प्रत्येकासाठी आहे!',
            'trainer'           => 'Pooja Patil & Technical Team',
            'description'       => '४०-५० टूल्सचा गोंधळ नको! १०-१२ Core Tools, ५ मुख्य Pillars आणि शेवटी तुमच्या क्षेत्राचा थेट Real-Life प्रोजेक्ट चॅलेंज — मराठीत अगदी सोप्या भाषेत.',
            'languages'         => 'मराठी & हिंदी',
            'fees'              => 1499,
            'advance_fee'       => 499,
            'default_date'      => 'आगामी रविवार (Upcoming Sunday Batch)',
            'default_time'      => 'सकाळी १०:०० ते संध्याकाळी ५:०० (१ पूर्ण दिवस)',
            'venue_short'       => 'सिंहगड रोड, आनंद नगर, पुणे & Zoom ऑनलाइन',
            'venue_full'        => 'आनंद नगर, सिंहगड रोड, पुणे - ४११०५१ (तसेच घरबसल्या ऑनलाइन Zoom द्वारे उपलब्ध)',
            'whatsapp'          => '8446917187',
            'phone'             => '8446917187',
            'zoom_link'         => '',
            'mode'              => 'Offline (Pune) + Online (Zoom Live)',
            'certificate_included' => 'होय (अधिकृत ई-प्रमाणपत्र)',
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
        check_admin_referer('ai_save_settings_nonce', '_ai_save_nonce');

        $current = $this->get_settings();
        $fields = [
            'course_title', 'course_subtitle', 'trainer', 'description', 'languages',
            'fees', 'advance_fee', 'default_date', 'default_time', 'venue_short',
            'venue_full', 'whatsapp', 'phone', 'zoom_link', 'mode', 'certificate_included'
        ];

        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                $current[$field] = sanitize_text_field(wp_unslash($_POST[$field]));
            }
        }

        update_option($this->option_key, $current);

        wp_safe_redirect(add_query_arg([
            'page'    => 'ai-course-cms',
            'updated' => 'true',
        ], admin_url('admin.php')));
        exit;
    }

    /**
     * 5. One-Click Seeder: Loads all 5 Pillars, 12 Core Tools, 8 Challenges
     */
    public function handle_seed_data() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        check_admin_referer('ai_seed_nonce', '_ai_seed_nonce');

        // Seed Pillars
        $this->seed_pillars();
        // Seed Tools
        $this->seed_tools();
        // Seed Challenges
        $this->seed_challenges();
        // Seed Sample Batch
        $this->seed_batches();

        wp_safe_redirect(add_query_arg([
            'page'   => 'ai-course-cms',
            'seeded' => 'true',
        ], admin_url('admin.php')));
        exit;
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
                'desc_hi'    => 'AI की बुनियादी कार्यप्रणाली को समझना और बिना भटके अपने काम के लिए सबसे सटीक AI टूल चुनना।',
                'steps'      => "AI म्हणजे काय?\nCore Tools ची ओळख\nयोग्य Tool निवडणे",
                'color'      => 'border-amber-400 bg-amber-50 text-amber-900',
                'badge'      => 'bg-amber-500 text-white',
                'order'      => 1,
            ],
            [
                'number'     => '२',
                'name_en'    => 'AI Communicate',
                'title_mr'   => '२. 💬 AI Communicate (प्रॉम्प्ट संवाद)',
                'title_hi'   => '२. 💬 AI Communicate (प्रॉम्प्ट संवाद)',
                'flow_mr'    => 'Prompt Engineering → Marathi/English → Follow-up prompts',
                'flow_hi'    => 'Prompt Engineering → Marathi/English → Follow-up prompts',
                'desc_mr'    => 'AI ला अचूक आज्ञा (Prompts) देण्याची कला. मराठी किंवा इंग्रजीत थेट मानवाप्रमाणे बोलणे आणि फॉलो-अप प्रॉम्प्ट्सने १००% अचूक काम करून घेणे.',
                'desc_hi'    => 'AI को सटीक निर्देश देने की कला। हिंदी-मराठी में संवाद और फॉलो-अप प्रॉम्प्ट्स से मनचाहा परिणाम पाना।',
                'steps'      => "Prompt Engineering\nMarathi / English संवाद\nFollow-up Prompts",
                'color'      => 'border-sky-400 bg-sky-50 text-sky-900',
                'badge'      => 'bg-sky-600 text-white',
                'order'      => 2,
            ],
            [
                'number'     => '३',
                'name_en'    => 'AI Work',
                'title_mr'   => '३. 📄 AI Work (दैनंदिन कामकाज)',
                'title_hi'   => '३. 📄 AI Work (दैनिक कामकाज)',
                'flow_mr'    => 'Email → PDF → Word → Excel → PPT → Research → Reports',
                'flow_hi'    => 'Email → PDF → Word → Excel → PPT → Research → Reports',
                'desc_mr'    => 'ऑफिस व व्यवसायाचे तासन्‌तासांचे काम मिनिटांत: अचूक ईमेल, अवघड PDF चा सारांश, Word ड्राफ्टिंग, Excel फॉर्म्युला, PPT आणि सखोल अहवाल.',
                'desc_hi'    => 'दफ्तर और बिजनेस के घंटों का काम मिनटों में: ईमेल, PDF समरी, Word डॉक्यूमेंट्स, Excel फॉर्मूला और प्रेजेंटेशन।',
                'steps'      => "Email & Letters\nPDF & Excel डेटा\nPPT & Reports",
                'color'      => 'border-emerald-400 bg-emerald-50 text-emerald-900',
                'badge'      => 'bg-emerald-600 text-white',
                'order'      => 3,
            ],
            [
                'number'     => '४',
                'name_en'    => 'AI Create',
                'title_mr'   => '४. 🎨 AI Create (सर्जनशीलता & डिझाईन)',
                'title_hi'   => '४. 🎨 AI Create (क्रिएटिविटी & डिजाइन)',
                'flow_mr'    => 'Images → Posters → Social Media → Video → Voice',
                'flow_hi'    => 'Images → Posters → Social Media → Video → Voice',
                'desc_mr'    => 'क्रिएटिव्ह डिझाईनची जादू: आकर्षक सणांचे/ऑफर्सचे पोस्टर्स, सोशल मीडिया पोस्ट्स, रील्स व्हिडिओ आणि अस्सल आवाजातील व्हॉईस-ओव्हर.',
                'desc_hi'    => 'रचनात्मक डिजाइन की दुनिया: पोस्टर्स, सोशल मीडिया पोस्ट्स, रील्स वीडियो और नेचुरल वॉइस-ओवर।',
                'steps'      => "Images & Posters\nSocial Media\nVideo & Voice",
                'color'      => 'border-purple-400 bg-purple-50 text-purple-900',
                'badge'      => 'bg-purple-600 text-white',
                'order'      => 4,
            ],
            [
                'number'     => '५',
                'name_en'    => 'AI Automate',
                'title_mr'   => '५. 🤖 AI Automate (ऑटोमेशन & फ्युचर)',
                'title_hi'   => '५. 🤖 AI Automate (ऑटोमेशन & भविष्य)',
                'flow_mr'    => 'Automation → AI Agents → Basic workflows → Future of AI',
                'flow_hi'    => 'Automation → AI Agents → Basic workflows → Future of AI',
                'desc_mr'    => 'वारंवार कराव्या लागणाऱ्या कामांचे ऑटोमेशन: नो-कोड वर्कफ्लो, AI बॉट्सची ओळख आणि भविष्यातील AI तंत्रज्ञानासाठी स्वतःला सज्ज करणे.',
                'desc_hi'    => 'वर्कफ्लो ऑटोमेशन: बेसिक AI वर्कफ्लो सेट करना, AI एजेंट्स की पहचान और AI के भविष्य के लिए पूरी तैयारी।',
                'steps'      => "Basic Workflows\nAI Agents ची ओळख\nFuture of AI",
                'color'      => 'border-rose-400 bg-rose-50 text-rose-900',
                'badge'      => 'bg-rose-600 text-white',
                'order'      => 5,
            ],
        ];

        foreach ($pillars as $p) {
            $existing = get_page_by_path(sanitize_title($p['name_en']), OBJECT, 'ai_pillar');
            $post_id = $existing ? $existing->ID : wp_insert_post([
                'post_title'   => $p['title_mr'],
                'post_name'    => sanitize_title($p['name_en']),
                'post_type'    => 'ai_pillar',
                'post_status'  => 'publish',
                'menu_order'   => $p['order'],
            ]);

            if ($post_id) {
                update_post_meta($post_id, '_ai_pillar_number', $p['number']);
                update_post_meta($post_id, '_ai_pillar_name_en', $p['name_en']);
                update_post_meta($post_id, '_ai_pillar_title_mr', $p['title_mr']);
                update_post_meta($post_id, '_ai_pillar_title_hi', $p['title_hi']);
                update_post_meta($post_id, '_ai_pillar_flow_mr', $p['flow_mr']);
                update_post_meta($post_id, '_ai_pillar_flow_hi', $p['flow_hi']);
                update_post_meta($post_id, '_ai_pillar_desc_mr', $p['desc_mr']);
                update_post_meta($post_id, '_ai_pillar_desc_hi', $p['desc_hi']);
                update_post_meta($post_id, '_ai_pillar_steps', $p['steps']);
                update_post_meta($post_id, '_ai_pillar_color', $p['color']);
                update_post_meta($post_id, '_ai_pillar_badge', $p['badge']);
                update_post_meta($post_id, '_ai_pillar_order', $p['order']);
            }
        }
    }

    private function seed_tools() {
        $tools = [
            [
                'name'         => 'ChatGPT',
                'category'     => 'all',
                'badge_text'   => 'All-Rounder',
                'badge_color'  => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                'use_mr'       => 'All-round AI assistant (मजकूर लेखन, माहिती, आयडियाज, शंका निवारण)',
                'use_hi'       => 'All-round AI assistant (राइटिंग, आइडियाज, सवालों के जवाब)',
                'audience_mr'  => '👥 सर्वसामान्य, विद्यार्थी, व्यावसायिक',
                'audience_hi'  => '👥 सभी वर्ग',
                'order'        => 1,
            ],
            [
                'name'         => 'Google Gemini',
                'category'     => 'all',
                'badge_text'   => 'Google Ecosystem',
                'badge_color'  => 'bg-blue-100 text-blue-800 border-blue-300',
                'use_mr'       => 'Research, writing, Google ecosystem (Docs, Drive, Gmail शी जोडलेले)',
                'use_hi'       => 'Research, writing, Google ecosystem (Docs, Drive, Gmail)',
                'audience_mr'  => '👥 सर्व (मराठी/हिंदीत सहज संवाद)',
                'audience_hi'  => '👥 सभी',
                'order'        => 2,
            ],
            [
                'name'         => 'Claude',
                'category'     => 'pro',
                'badge_text'   => 'Deep Analysis',
                'badge_color'  => 'bg-amber-100 text-amber-800 border-amber-300',
                'use_mr'       => 'Documents, writing, deep analysis (लांबलचक मजकूर व कोड विश्लेषण)',
                'use_hi'       => 'Documents, writing, deep analysis (गहराई से विश्लेषण)',
                'audience_mr'  => '💼 Professionals / Freelancers',
                'audience_hi'  => '💼 Professionals / Freelancers',
                'order'        => 3,
            ],
            [
                'name'         => 'Perplexity',
                'category'     => 'research',
                'badge_text'   => 'Live Web Research',
                'badge_color'  => 'bg-cyan-100 text-cyan-800 border-cyan-300',
                'use_mr'       => 'Research + sources (थेट संदर्भ आणि वेब लिंक्ससह अचूक शोध)',
                'use_hi'       => 'Research + sources (लाइव वेब सोर्स और रेफरेंस)',
                'audience_mr'  => '👨‍🏫 Teachers / Professionals / Business',
                'audience_hi'  => '👨‍🏫 Teachers / Professionals / Business',
                'order'        => 4,
            ],
            [
                'name'         => 'NotebookLM',
                'category'     => 'research',
                'badge_text'   => 'PDF & Study Master',
                'badge_color'  => 'bg-indigo-100 text-indigo-800 border-indigo-300',
                'use_mr'       => 'PDF, documents, study/research (मोठ्या पुस्तकांचे व नोट्सचे पॉडकास्ट)',
                'use_hi'       => 'PDF, documents, study/research (किताबों और नोट्स का अध्ययन)',
                'audience_mr'  => '👨‍🏫 Teachers / Students / Professionals',
                'audience_hi'  => '👨‍🏫 Teachers / Students / Professionals',
                'order'        => 5,
            ],
            [
                'name'         => 'Microsoft Copilot',
                'category'     => 'pro',
                'badge_text'   => 'Office Suite',
                'badge_color'  => 'bg-sky-100 text-sky-800 border-sky-300',
                'use_mr'       => 'Word, Excel, PowerPoint, Office (ऑफिस फाइल्स झटपट बनवणे)',
                'use_hi'       => 'Word, Excel, PowerPoint, Office डॉक्यूमेंट्स',
                'audience_mr'  => '🧑‍💼 Working / Govt (ऑफिस कर्मचारी)',
                'audience_hi'  => '🧑‍💼 Working / Govt (दफ्तर कर्मचारी)',
                'order'        => 6,
            ],
            [
                'name'         => 'Canva AI',
                'category'     => 'creative',
                'badge_text'   => 'Instant Design',
                'badge_color'  => 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
                'use_mr'       => 'Poster, presentation, social media (१ मिनिटात बॅनर व पोस्टर्स)',
                'use_hi'       => 'Poster, presentation, social media डिजाइन',
                'audience_mr'  => '🎨 सर्व (दुकानदार, महिला, शिक्षक)',
                'audience_hi'  => '🎨 सभी (ग्राफिक्स व पोस्टर्स)',
                'order'        => 7,
            ],
            [
                'name'         => 'Gamma',
                'category'     => 'creative',
                'badge_text'   => 'AI PPTs & Decks',
                'badge_color'  => 'bg-purple-100 text-purple-800 border-purple-300',
                'use_mr'       => 'AI presentations (फक्त एका प्रॉम्प्टवर संपूर्ण PPT डेक तयार)',
                'use_hi'       => 'AI presentations (एक प्रॉम्प्ट से पूरी PPT डेक तैयार)',
                'audience_mr'  => '🧑‍💼 Professionals / Teachers',
                'audience_hi'  => '🧑‍💼 Professionals / Teachers',
                'order'        => 8,
            ],
            [
                'name'         => 'CapCut',
                'category'     => 'creative',
                'badge_text'   => 'Reels & Video',
                'badge_color'  => 'bg-rose-100 text-rose-800 border-rose-300',
                'use_mr'       => 'Video/Reels editing (व्हिडिओ व इन्स्टाग्राम रील्स, ऑटो सबटायटल्स)',
                'use_hi'       => 'Video/Reels editing (वीडियो व इंस्टाग्राम रील्स)',
                'audience_mr'  => '📱 Business / Creators',
                'audience_hi'  => '📱 Business / Creators',
                'order'        => 9,
            ],
            [
                'name'         => 'Google Lens',
                'category'     => 'all',
                'badge_text'   => 'Mobile Vision',
                'badge_color'  => 'bg-teal-100 text-teal-800 border-teal-300',
                'use_mr'       => 'Image/document info (कागदावरील मजकूर भाषांतर व त्वरित कॉपी)',
                'use_hi'       => 'Image/document info (फोटो से टेक्स्ट कॉपी व अनुवाद)',
                'audience_mr'  => '👥 General Public (४०+ नागरिक, पालक)',
                'audience_hi'  => '👥 General Public (आम नागरिक)',
                'order'        => 10,
            ],
            [
                'name'         => 'Zapier / Make',
                'category'     => 'automation',
                'badge_text'   => 'Workflow Automation',
                'badge_color'  => 'bg-orange-100 text-orange-800 border-orange-300',
                'use_mr'       => 'Automation (Email, WhatsApp, Forms चे ऑटोमॅटिक कनेक्शन)',
                'use_hi'       => 'Automation (ईमेल, फॉर्म्स और WhatsApp का ऑटोमेशन)',
                'audience_mr'  => '💼 Business / Professionals',
                'audience_hi'  => '💼 Business / Professionals',
                'order'        => 11,
            ],
            [
                'name'         => 'n8n',
                'category'     => 'automation',
                'badge_text'   => 'AI Agents & Auto',
                'badge_color'  => 'bg-red-100 text-red-800 border-red-300',
                'use_mr'       => 'Advanced automation (स्वतःचे सानुकूल AI एजंट्स आणि प्रगत वर्कफ्लो)',
                'use_hi'       => 'Advanced automation (कस्टम AI एजेंट्स और एडवांस वर्कफ्लो)',
                'audience_mr'  => '🚀 Business / Technical users',
                'audience_hi'  => '🚀 Business / Technical users',
                'order'        => 12,
            ],
        ];

        foreach ($tools as $t) {
            $existing = get_page_by_path(sanitize_title($t['name']), OBJECT, 'ai_tool');
            $post_id = $existing ? $existing->ID : wp_insert_post([
                'post_title'   => $t['name'],
                'post_name'    => sanitize_title($t['name']),
                'post_type'    => 'ai_tool',
                'post_status'  => 'publish',
                'menu_order'   => $t['order'],
            ]);

            if ($post_id) {
                update_post_meta($post_id, '_ai_tool_category', $t['category']);
                update_post_meta($post_id, '_ai_tool_badge_text', $t['badge_text']);
                update_post_meta($post_id, '_ai_tool_badge_color', $t['badge_color']);
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
                'tools'        => 'ChatGPT, Canva AI, Google Gemini, Zapier',
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
                'role_mr'      => 'शासकीय कर्मचारी (Government Employee)',
                'role_hi'      => 'सरकारी कर्मचारी (Government Employee)',
                'icon'         => 'Landmark',
                'pipeline'     => 'Document → Summary → Official Letter → Report',
                'pipeline_text_mr' => 'शासकीय जीआर / फाईल → त्वरित सारांश → अधिकृत शासकीय पत्रव्यवहार → वरिष्ठ अहवाल',
                'pipeline_text_hi' => 'सरकारी दस्तावेज / फाइल → त्वरित समरी → आधिकारिक पत्र ड्राफ्ट → विभाग रिपोर्ट',
                'tools'        => 'NotebookLM, Copilot, ChatGPT',
                'outcome_mr'   => 'शेकडो पानांचे शासकीय परिपत्रके व नियम काही सेकंदात समजून घेऊन अचूक शासकीय मराठीत परिपत्रके व टीपणी (Noting) तयार करा.',
                'outcome_hi'   => 'लंबे सरकारी दस्तावेजों का त्वरित सार समझें और नियमानुसार शुद्ध भाषा में आधिकारिक पत्र व रिपोर्ट तैयार करें।',
                'sample_input' => 'नवीन शासन निर्णय (GR) चा सारांश व नागरिकांसाठी नोटीस',
                'sample_prompt'=> 'नवीन पाणीपुरवठा योजनेविषयी नागरिकांना माहिती देण्यासाठी शासकीय शिष्टाचाराला धरून एक स्पष्ट व नम्र मराठी जाहीर सूचना पत्रक तयार कर.',
                'order'        => 5,
            ],
            [
                'id_slug'      => 'freelancer',
                'role_mr'      => 'फ्रीलान्सर (Freelancer)',
                'role_hi'      => 'फ्रीलांसर (Freelancer)',
                'icon'         => 'Rocket',
                'pipeline'     => 'Client → Proposal → Quotation → Content → Invoice',
                'pipeline_text_mr' => 'क्लायंट ब्रीफ → प्रभावी प्रपोजल → कोटेशन पत्र → गुणवत्तापूर्ण कंटेंट → इनव्हॉइस',
                'pipeline_text_hi' => 'क्लाइंट रिक्वायरमेंट → मजबूत प्रपोजल → कोटेशन → कंटेंट डिलीवरी → इनवॉइस',
                'tools'        => 'Claude, ChatGPT, Canva AI, Zapier',
                'outcome_mr'   => 'आंतरराष्ट्रीय व स्थानिक क्लायंट्ससाठी प्रोफेशनल प्रपोजल्स व कोटेशन बनवून दुप्पट दराने काम मिळवण्याची क्षमता.',
                'outcome_hi'   => 'क्लाइंट्स को प्रभावित करने वाले प्रपोजल और कोटेशन मिनटों में तैयार कर अपनी कमाई और क्लाइंट बेस बढ़ाएं।',
                'sample_input' => 'वेबसाईट रीडिझाईन व सोशल मीडिया मॅनेजमेंट प्रपोजल',
                'sample_prompt'=> 'एका रेस्टॉरंटच्या डिजिटल मार्केटिंगसाठी ₹२५,००० प्रति महिना या दराने एक प्रभावी आणि व्यावसायिक क्लायंट प्रपोजल ड्राफ्ट कर, ज्यात सेवांची यादी व फायदे असतील.',
                'order'        => 6,
            ],
            [
                'id_slug'      => 'entrepreneur',
                'role_mr'      => 'स्टार्टअप / उद्योजक (Entrepreneur)',
                'role_hi'      => 'उद्यमी (Entrepreneur)',
                'icon'         => 'Target',
                'pipeline'     => 'Business Idea → Market Research → Business Plan → Marketing',
                'pipeline_text_mr' => 'बिझनेस आयडिया → मार्केट रिसर्च → संपूर्ण बिझनेस प्लॅन → गो-टू-मार्केट स्ट्रॅटेजी',
                'pipeline_text_hi' => 'बिजनेस आइडिया → मार्केट रिसर्च → कम्प्लीट बिजनेस प्लान → मार्केटिंग रणनीति',
                'tools'        => 'Perplexity, ChatGPT Plus, Claude, Gamma',
                'outcome_mr'   => 'नवीन व्यवसाय सुरू करताना होणारा लाखो रुपयांचा खर्च वाचवा; बाजारातील स्पर्धा, किंमत धोरण व ग्रोथ प्लॅन AI कडून तपासा.',
                'outcome_hi'   => 'नया बिजनेस शुरू करने के लिए संपूर्ण मार्केट रिसर्च, प्रतियोगी विश्लेषण और 90 दिनों का ग्रोथ रोडमैप हासिल करें।',
                'sample_input' => 'पुण्यात सेंद्रिय अन्नधान्य (Organic Store) ची सुरुवात',
                'sample_prompt'=> 'पुण्यात सेंद्रिय भाजीपाला व किराणा सुरू करण्यासाठी एक प्राथमिक बिझनेस प्लॅन तयार कर. ग्राहकांची गरज, संभाव्य अडथळे आणि पहिल्या ३ महिन्यांचे मार्केटिंग बजेट स्पष्ट कर.',
                'order'        => 7,
            ],
            [
                'id_slug'      => 'general40',
                'role_mr'      => 'ज्येष्ठ नागरिक / ४०+ (General 40+)',
                'role_hi'      => 'वरिष्ठ नागरिक / 40+ (General 40+)',
                'icon'         => 'Users',
                'pipeline'     => 'Question → Research → Summary → Planning → Action',
                'pipeline_text_mr' => 'मनातील शंका/प्रश्न → सखोल माहिती शोध → सोपा मराठी सारांश → नियोजन → प्रत्यक्ष कृती',
                'pipeline_text_hi' => 'मन का सवाल → जानकारी खोज → सरल भाषा में समरी → दैनिक प्लानिंग → प्रत्यक्ष क्रिया',
                'tools'        => 'Google Lens, ChatGPT, Google Gemini',
                'outcome_mr'   => 'तंत्रज्ञानाची कोणतीही भीती न बाळगता मोबाईलवर बोलून आरोग्य, प्रवास, बँकिंग व कौटुंबिक नियोजन स्वतःच्या हाताने आत्मविश्वासाने करा.',
                'outcome_hi'   => 'बिना किसी तकनीकी डर के आवाज से बात करके स्वास्थ्य, यात्रा और दैनिक कार्यों की पूरी जानकारी प्राप्त करें।',
                'sample_input' => 'ज्येष्ठ नागरिकांसाठी अष्टविनायक यात्रा नियोजन व आरोग्य काळजी',
                'sample_prompt'=> 'पुण्याहून ज्येष्ठ नागरिकांसाठी ३ दिवसांच्या अष्टविनायक यात्रेचे आरामदायी नियोजन तयार करा, ज्यात प्रवासातील अंतर, विश्रांतीची ठिकाणे आणि घ्यावयाची काळजी स्पष्ट असेल.',
                'order'        => 8,
            ],
        ];

        foreach ($challenges as $c) {
            $existing = get_page_by_path($c['id_slug'], OBJECT, 'ai_challenge');
            $post_id = $existing ? $existing->ID : wp_insert_post([
                'post_title'   => $c['role_mr'],
                'post_name'    => $c['id_slug'],
                'post_type'    => 'ai_challenge',
                'post_status'  => 'publish',
                'menu_order'   => $c['order'],
            ]);

            if ($post_id) {
                update_post_meta($post_id, '_ai_challenge_role_mr', $c['role_mr']);
                update_post_meta($post_id, '_ai_challenge_role_hi', $c['role_hi']);
                update_post_meta($post_id, '_ai_challenge_icon', $c['icon']);
                update_post_meta($post_id, '_ai_challenge_pipeline', $c['pipeline']);
                update_post_meta($post_id, '_ai_challenge_pipeline_text_mr', $c['pipeline_text_mr']);
                update_post_meta($post_id, '_ai_challenge_pipeline_text_hi', $c['pipeline_text_hi']);
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
                'title'        => 'बॅच १: आगामी रविवार (Pune Offline + Zoom Live)',
                'date'         => 'येणारा रविवार (Upcoming Sunday)',
                'time'         => 'सकाळी १०:०० ते संध्याकाळी ५:००',
                'mode'         => 'Pune Offline + Zoom Live',
                'seats_total'  => 15,
                'seats_booked' => 9,
                'status'       => 'Filling Fast',
            ],
            [
                'title'        => 'बॅच २: पुढील वीकेंड (Next Weekend Special)',
                'date'         => 'पुढील रविवार (Next Sunday)',
                'time'         => 'सकाळी १०:०० ते संध्याकाळी ५:००',
                'mode'         => 'Online Zoom Special',
                'seats_total'  => 20,
                'seats_booked' => 5,
                'status'       => 'Open',
            ],
        ];

        foreach ($batches as $b) {
            $post_id = wp_insert_post([
                'post_title'   => $b['title'],
                'post_type'    => 'ai_batch',
                'post_status'  => 'publish',
            ]);

            if ($post_id) {
                update_post_meta($post_id, '_ai_batch_date', $b['date']);
                update_post_meta($post_id, '_ai_batch_time', $b['time']);
                update_post_meta($post_id, '_ai_batch_mode', $b['mode']);
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
        // Meta Box for Tools
        add_meta_box(
            'ai_tool_meta',
            '🛠️ AI Tool तपशील व सेटिंग्ज',
            [$this, 'render_tool_meta_box'],
            'ai_tool',
            'normal',
            'high'
        );

        // Meta Box for Pillars
        add_meta_box(
            'ai_pillar_meta',
            '⭐ Pillar तपशील व पायऱ्या',
            [$this, 'render_pillar_meta_box'],
            'ai_pillar',
            'normal',
            'high'
        );

        // Meta Box for Challenges
        add_meta_box(
            'ai_challenge_meta',
            '🎯 Real-Life Challenge (प्रोजेक्ट) तपशील',
            [$this, 'render_challenge_meta_box'],
            'ai_challenge',
            'normal',
            'high'
        );

        // Meta Box for Batches
        add_meta_box(
            'ai_batch_meta',
            '📅 AI कार्यशाळा बॅच तपशील',
            [$this, 'render_batch_meta_box'],
            'ai_batch',
            'normal',
            'high'
        );

        // Meta Box for Inquiries
        add_meta_box(
            'ai_inquiry_meta',
            '📥 नावनोंदणी ग्राहक माहिती व Status',
            [$this, 'render_inquiry_meta_box'],
            'ai_inquiry',
            'normal',
            'high'
        );
    }

    public function render_tool_meta_box($post) {
        wp_nonce_field('ai_tool_meta_nonce', '_ai_tool_meta_nonce');
        $cat         = get_post_meta($post->ID, '_ai_tool_category', true) ?: 'all';
        $badge_text  = get_post_meta($post->ID, '_ai_tool_badge_text', true) ?: 'Recommended';
        $badge_color = get_post_meta($post->ID, '_ai_tool_badge_color', true) ?: 'bg-emerald-100 text-emerald-800 border-emerald-300';
        $use_mr      = get_post_meta($post->ID, '_ai_tool_use_mr', true);
        $use_hi      = get_post_meta($post->ID, '_ai_tool_use_hi', true);
        $aud_mr      = get_post_meta($post->ID, '_ai_tool_audience_mr', true);
        $aud_hi      = get_post_meta($post->ID, '_ai_tool_audience_hi', true);
        $url         = get_post_meta($post->ID, '_ai_tool_website_url', true);
        $order       = get_post_meta($post->ID, '_ai_tool_order', true) ?: 0;
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">कॅटेगरी (Category):</label>
                <select name="_ai_tool_category" style="width:100%; padding: 8px;">
                    <option value="all" <?php selected($cat, 'all'); ?>>सर्वसामान्य (All-round)</option>
                    <option value="pro" <?php selected($cat, 'pro'); ?>>ऑफिस & प्रोफेशनल्स (Office & Pro)</option>
                    <option value="research" <?php selected($cat, 'research'); ?>>रिसर्च & अभ्यास (Research & PDF)</option>
                    <option value="creative" <?php selected($cat, 'creative'); ?>>डिझाईन & व्हिडिओ (Creative & Video)</option>
                    <option value="automation" <?php selected($cat, 'automation'); ?>>ऑटोमेशन & AI Agents (Automation)</option>
                </select>
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">बॅज नाव (Badge Text):</label>
                <input type="text" name="_ai_tool_badge_text" value="<?php echo esc_attr($badge_text); ?>" style="width:100%; padding:8px;" placeholder="उदा. All-Rounder, Live Web Research">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">मुख्य उपयोग (मराठीत):</label>
            <input type="text" name="_ai_tool_use_mr" value="<?php echo esc_attr($use_mr); ?>" style="width:100%; padding:8px;" placeholder="उदा. मजकूर लेखन, माहिती, आयडियाज, शंका निवारण">
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">मुख्य उपयोग (हिंदीत):</label>
            <input type="text" name="_ai_tool_use_hi" value="<?php echo esc_attr($use_hi); ?>" style="width:100%; padding:8px;" placeholder="उदा. राइटिंग, आइडियाज, सवालों के जवाब">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">कोणासाठी उपयुक्त (Target Audience - मराठी):</label>
                <input type="text" name="_ai_tool_audience_mr" value="<?php echo esc_attr($aud_mr); ?>" style="width:100%; padding:8px;" placeholder="उदा. 👥 सर्वसामान्य, विद्यार्थी, व्यावसायिक">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Target Audience (हिंदी):</label>
                <input type="text" name="_ai_tool_audience_hi" value="<?php echo esc_attr($aud_hi); ?>" style="width:100%; padding:8px;" placeholder="उदा. 👥 सभी वर्ग">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Tool ची अधिकृत लिंक (Website URL):</label>
                <input type="url" name="_ai_tool_website_url" value="<?php echo esc_attr($url); ?>" style="width:100%; padding:8px;" placeholder="https://chatgpt.com">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्रम नंबर (Sort Order):</label>
                <input type="number" name="_ai_tool_order" value="<?php echo esc_attr($order); ?>" style="width:100%; padding:8px;">
            </div>
        </div>
        <?php
    }

    public function render_pillar_meta_box($post) {
        wp_nonce_field('ai_pillar_meta_nonce', '_ai_pillar_meta_nonce');
        $number    = get_post_meta($post->ID, '_ai_pillar_number', true) ?: '१';
        $name_en   = get_post_meta($post->ID, '_ai_pillar_name_en', true) ?: '';
        $title_mr  = get_post_meta($post->ID, '_ai_pillar_title_mr', true) ?: '';
        $title_hi  = get_post_meta($post->ID, '_ai_pillar_title_hi', true) ?: '';
        $flow_mr   = get_post_meta($post->ID, '_ai_pillar_flow_mr', true) ?: '';
        $flow_hi   = get_post_meta($post->ID, '_ai_pillar_flow_hi', true) ?: '';
        $desc_mr   = get_post_meta($post->ID, '_ai_pillar_desc_mr', true) ?: '';
        $desc_hi   = get_post_meta($post->ID, '_ai_pillar_desc_hi', true) ?: '';
        $steps     = get_post_meta($post->ID, '_ai_pillar_steps', true) ?: '';
        $order     = get_post_meta($post->ID, '_ai_pillar_order', true) ?: 1;
        ?>
        <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">Pillar क्रमांक:</label>
                <input type="text" name="_ai_pillar_number" value="<?php echo esc_attr($number); ?>" style="width:100%; padding:8px;" placeholder="उदा. १ किंवा 1">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">इंग्रजी नाव (English Name):</label>
                <input type="text" name="_ai_pillar_name_en" value="<?php echo esc_attr($name_en); ?>" style="width:100%; padding:8px;" placeholder="उदा. AI Understand">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्रम नंबर (Order):</label>
                <input type="number" name="_ai_pillar_order" value="<?php echo esc_attr($order); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">मराठी शीर्षक (Marathi Title):</label>
                <input type="text" name="_ai_pillar_title_mr" value="<?php echo esc_attr($title_mr); ?>" style="width:100%; padding:8px;" placeholder="१. 🧠 AI Understand (पाया व योग्य निवड)">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">हिंदी शीर्षक (Hindi Title):</label>
                <input type="text" name="_ai_pillar_title_hi" value="<?php echo esc_attr($title_hi); ?>" style="width:100%; padding:8px;" placeholder="१. 🧠 AI Understand (बुनियादी समझ)">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">फ्लो / हेडलाईन (मराठी):</label>
                <input type="text" name="_ai_pillar_flow_mr" value="<?php echo esc_attr($flow_mr); ?>" style="width:100%; padding:8px;" placeholder="AI म्हणजे काय → Tools → योग्य tool निवडणे">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">फ्लो / हेडलाईन (हिंदी):</label>
                <input type="text" name="_ai_pillar_flow_hi" value="<?php echo esc_attr($flow_hi); ?>" style="width:100%; padding:8px;" placeholder="AI क्या है → Tools → सही tool का चुनाव">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">सविस्तर माहिती (मराठीत):</label>
            <textarea name="_ai_pillar_desc_mr" rows="3" style="width:100%; padding:8px;"><?php echo esc_textarea($desc_mr); ?></textarea>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">सविस्तर माहिती (हिंदीत):</label>
            <textarea name="_ai_pillar_desc_hi" rows="3" style="width:100%; padding:8px;"><?php echo esc_textarea($desc_hi); ?></textarea>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">३ मुख्य पायऱ्या (प्रत्येक ओळीवर १):</label>
            <textarea name="_ai_pillar_steps" rows="3" style="width:100%; padding:8px;" placeholder="AI म्हणजे काय?&#10;Core Tools ची ओळख&#10;योग्य Tool निवडणे"><?php echo esc_textarea($steps); ?></textarea>
            <small style="color: #64748b;">(प्रत्येक ओळीवर एक टप्पा लिहा, उदा. १) AI म्हणजे काय? २) Core Tools ची ओळख ३) योग्य Tool निवडणे)</small>
        </div>
        <?php
    }

    public function render_challenge_meta_box($post) {
        wp_nonce_field('ai_challenge_meta_nonce', '_ai_challenge_meta_nonce');
        $role_mr     = get_post_meta($post->ID, '_ai_challenge_role_mr', true) ?: '';
        $role_hi     = get_post_meta($post->ID, '_ai_challenge_role_hi', true) ?: '';
        $icon        = get_post_meta($post->ID, '_ai_challenge_icon', true) ?: 'GraduationCap';
        $pipeline    = get_post_meta($post->ID, '_ai_challenge_pipeline', true) ?: '';
        $p_text_mr   = get_post_meta($post->ID, '_ai_challenge_pipeline_text_mr', true) ?: '';
        $p_text_hi   = get_post_meta($post->ID, '_ai_challenge_pipeline_text_hi', true) ?: '';
        $tools       = get_post_meta($post->ID, '_ai_challenge_tools', true) ?: '';
        $outcome_mr  = get_post_meta($post->ID, '_ai_challenge_outcome_mr', true) ?: '';
        $outcome_hi  = get_post_meta($post->ID, '_ai_challenge_outcome_hi', true) ?: '';
        $input_samp  = get_post_meta($post->ID, '_ai_challenge_sample_input', true) ?: '';
        $prompt_samp = get_post_meta($post->ID, '_ai_challenge_sample_prompt', true) ?: '';
        $order       = get_post_meta($post->ID, '_ai_challenge_order', true) ?: 1;
        ?>
        <div style="display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्षेत्र / प्रोफेशन (मराठीत):</label>
                <input type="text" name="_ai_challenge_role_mr" value="<?php echo esc_attr($role_mr); ?>" style="width:100%; padding:8px;" placeholder="उदा. शिक्षक (Teacher)">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">क्षेत्र (हिंदीत):</label>
                <input type="text" name="_ai_challenge_role_hi" value="<?php echo esc_attr($role_hi); ?>" style="width:100%; padding:8px;" placeholder="उदा. शिक्षक (Teacher)">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">आयकॉन:</label>
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
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">५-स्टेप पाइपलाइन कीवर्ड्स:</label>
                <input type="text" name="_ai_challenge_pipeline" value="<?php echo esc_attr($pipeline); ?>" style="width:100%; padding:8px;" placeholder="Chapter → Lesson Plan → PPT → MCQ → Worksheet">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">वापरली जाणारी Toos (Tools Used):</label>
                <input type="text" name="_ai_challenge_tools" value="<?php echo esc_attr($tools); ?>" style="width:100%; padding:8px;" placeholder="ChatGPT, NotebookLM, Gamma, Canva AI">
            </div>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">पाइपलाइन सविस्तर मजकूर (मराठीत):</label>
            <input type="text" name="_ai_challenge_pipeline_text_mr" value="<?php echo esc_attr($p_text_mr); ?>" style="width:100%; padding:8px;" placeholder="धडा निवडा → पाठाचे नियोजन → आकर्षक PPT → बहुपर्यायी प्रश्न (MCQ) → वर्कशीट">
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">प्रत्यक्ष होणारा फायदा (Outcome - मराठीत):</label>
            <textarea name="_ai_challenge_outcome_mr" rows="2" style="width:100%; padding:8px;"><?php echo esc_textarea($outcome_mr); ?></textarea>
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">नमुना इनपुट (Sample Real-Life Case):</label>
            <input type="text" name="_ai_challenge_sample_input" value="<?php echo esc_attr($input_samp); ?>" style="width:100%; padding:8px;" placeholder="उदा. इयत्ता ७ वी विज्ञान: वनस्पतींमधील पोषण (Nutrition in Plants)">
        </div>

        <div style="margin-top: 15px;">
            <label style="font-weight: 600; display:block; margin-bottom: 4px;">तयार मास्टर प्रॉम्प्ट (Ready-to-use Master Prompt):</label>
            <textarea name="_ai_challenge_sample_prompt" rows="3" style="width:100%; padding:8px; font-family:monospace;"><?php echo esc_textarea($prompt_samp); ?></textarea>
        </div>
        <?php
    }

    public function render_batch_meta_box($post) {
        wp_nonce_field('ai_batch_meta_nonce', '_ai_batch_meta_nonce');
        $date         = get_post_meta($post->ID, '_ai_batch_date', true) ?: '';
        $time         = get_post_meta($post->ID, '_ai_batch_time', true) ?: 'सकाळी १०:०० ते सायंकाळी ५:००';
        $mode         = get_post_meta($post->ID, '_ai_batch_mode', true) ?: 'Pune Offline + Zoom Online';
        $seats_total  = get_post_meta($post->ID, '_ai_batch_seats_total', true) ?: 15;
        $seats_booked = get_post_meta($post->ID, '_ai_batch_seats_booked', true) ?: 0;
        $status       = get_post_meta($post->ID, '_ai_batch_status', true) ?: 'Open';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">बॅच तारीख (Date):</label>
                <input type="text" name="_ai_batch_date" value="<?php echo esc_attr($date); ?>" style="width:100%; padding:8px;" placeholder="उदा. २१ सप्टेंबर (रविवार)">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">बॅच वेळ (Time):</label>
                <input type="text" name="_ai_batch_time" value="<?php echo esc_attr($time); ?>" style="width:100%; padding:8px;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">माध्यम (Mode):</label>
                <select name="_ai_batch_mode" style="width:100%; padding:8px;">
                    <option value="Pune Offline + Zoom Online" <?php selected($mode, 'Pune Offline + Zoom Online'); ?>>पुणे स्टुडिओ + Zoom ऑनलाइन (दोन्ही)</option>
                    <option value="Pune Offline Only" <?php selected($mode, 'Pune Offline Only'); ?>>फक्त पुणे स्टुडिओ (ऑफलाइन)</option>
                    <option value="Online Zoom Only" <?php selected($mode, 'Online Zoom Only'); ?>>फक्त Zoom ऑनलाइन</option>
                </select>
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">बुकिंग स्थिती (Status):</label>
                <select name="_ai_batch_status" style="width:100%; padding:8px;">
                    <option value="Open" <?php selected($status, 'Open'); ?>>🟢 नावनोंदणी सुरू (Open)</option>
                    <option value="Filling Fast" <?php selected($status, 'Filling Fast'); ?>>🟡 जागा भरत आल्या आहेत (Filling Fast)</option>
                    <option value="Sold Out" <?php selected($status, 'Sold Out'); ?>>🔴 बॅच पूर्ण (Sold Out)</option>
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
        <?php
    }

    public function render_inquiry_meta_box($post) {
        wp_nonce_field('ai_inquiry_meta_nonce', '_ai_inquiry_meta_nonce');
        $phone    = get_post_meta($post->ID, '_ai_inquiry_phone', true);
        $category = get_post_meta($post->ID, '_ai_inquiry_category', true);
        $lang     = get_post_meta($post->ID, '_ai_inquiry_lang', true);
        $notes    = get_post_meta($post->ID, '_ai_inquiry_notes', true);
        $status   = get_post_meta($post->ID, '_ai_inquiry_status', true) ?: 'new';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">मोबाईल नंबर:</label>
                <input type="text" name="_ai_inquiry_phone" value="<?php echo esc_attr($phone); ?>" style="width:100%; padding:8px;">
            </div>
            <div>
                <label style="font-weight: 600; display:block; margin-bottom: 4px;">स्थिती (Status):</label>
                <select name="_ai_inquiry_status" style="width:100%; padding:8px;">
                    <option value="new" <?php selected($status, 'new'); ?>>🔴 नवीन (New)</option>
                    <option value="contacted" <?php selected($status, 'contacted'); ?>>🟡 संपर्क झाला (Contacted)</option>
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

        // Tool Meta
        if (isset($_POST['_ai_tool_meta_nonce']) && wp_verify_nonce($_POST['_ai_tool_meta_nonce'], 'ai_tool_meta_nonce')) {
            $tool_fields = ['_ai_tool_category', '_ai_tool_badge_text', '_ai_tool_badge_color', '_ai_tool_use_mr', '_ai_tool_use_hi', '_ai_tool_audience_mr', '_ai_tool_audience_hi', '_ai_tool_website_url', '_ai_tool_order'];
            foreach ($tool_fields as $tf) {
                if (isset($_POST[$tf])) {
                    update_post_meta($post_id, $tf, sanitize_text_field(wp_unslash($_POST[$tf])));
                }
            }
        }

        // Pillar Meta
        if (isset($_POST['_ai_pillar_meta_nonce']) && wp_verify_nonce($_POST['_ai_pillar_meta_nonce'], 'ai_pillar_meta_nonce')) {
            $pillar_fields = ['_ai_pillar_number', '_ai_pillar_name_en', '_ai_pillar_title_mr', '_ai_pillar_title_hi', '_ai_pillar_flow_mr', '_ai_pillar_flow_hi', '_ai_pillar_desc_mr', '_ai_pillar_desc_hi', '_ai_pillar_steps', '_ai_pillar_order'];
            foreach ($pillar_fields as $pf) {
                if (isset($_POST[$pf])) {
                    update_post_meta($post_id, $pf, sanitize_textarea_field(wp_unslash($_POST[$pf])));
                }
            }
        }

        // Challenge Meta
        if (isset($_POST['_ai_challenge_meta_nonce']) && wp_verify_nonce($_POST['_ai_challenge_meta_nonce'], 'ai_challenge_meta_nonce')) {
            $ch_fields = ['_ai_challenge_role_mr', '_ai_challenge_role_hi', '_ai_challenge_icon', '_ai_challenge_pipeline', '_ai_challenge_pipeline_text_mr', '_ai_challenge_pipeline_text_hi', '_ai_challenge_tools', '_ai_challenge_outcome_mr', '_ai_challenge_outcome_hi', '_ai_challenge_sample_input', '_ai_challenge_sample_prompt', '_ai_challenge_order'];
            foreach ($ch_fields as $cf) {
                if (isset($_POST[$cf])) {
                    update_post_meta($post_id, $cf, sanitize_textarea_field(wp_unslash($_POST[$cf])));
                }
            }
        }

        // Batch Meta
        if (isset($_POST['_ai_batch_meta_nonce']) && wp_verify_nonce($_POST['_ai_batch_meta_nonce'], 'ai_batch_meta_nonce')) {
            $batch_fields = ['_ai_batch_date', '_ai_batch_time', '_ai_batch_mode', '_ai_batch_seats_total', '_ai_batch_seats_booked', '_ai_batch_status'];
            foreach ($batch_fields as $bf) {
                if (isset($_POST[$bf])) {
                    update_post_meta($post_id, $bf, sanitize_text_field(wp_unslash($_POST[$bf])));
                }
            }
        }

        // Inquiry Meta
        if (isset($_POST['_ai_inquiry_meta_nonce']) && wp_verify_nonce($_POST['_ai_inquiry_meta_nonce'], 'ai_inquiry_meta_nonce')) {
            $inq_fields = ['_ai_inquiry_phone', '_ai_inquiry_category', '_ai_inquiry_lang', '_ai_inquiry_notes', '_ai_inquiry_status'];
            foreach ($inq_fields as $inf) {
                if (isset($_POST[$inf])) {
                    update_post_meta($post_id, $inf, sanitize_text_field(wp_unslash($_POST[$inf])));
                }
            }
        }
    }

    /**
     * 7. Admin Columns Customization
     */
    public function tool_columns($cols) {
        return [
            'cb'          => '<input type="checkbox" />',
            'title'       => 'Tool नाव',
            'category'    => 'कॅटेगरी',
            'badge'       => 'बॅज',
            'use'         => 'मुख्य उपयोग (मराठीत)',
            'audience'    => 'कोणासाठी',
            'order'       => 'क्रम',
            'date'        => 'तारीख',
        ];
    }

    public function render_tool_column($col, $post_id) {
        if ($col === 'category') {
            echo esc_html(get_post_meta($post_id, '_ai_tool_category', true));
        } elseif ($col === 'badge') {
            echo '<span class="ai-badge" style="background:#e0e7ff; color:#3730a3;">' . esc_html(get_post_meta($post_id, '_ai_tool_badge_text', true)) . '</span>';
        } elseif ($col === 'use') {
            echo esc_html(wp_trim_words(get_post_meta($post_id, '_ai_tool_use_mr', true), 8));
        } elseif ($col === 'audience') {
            echo esc_html(get_post_meta($post_id, '_ai_tool_audience_mr', true));
        } elseif ($col === 'order') {
            echo esc_html(get_post_meta($post_id, '_ai_tool_order', true));
        }
    }

    public function pillar_columns($cols) {
        return [
            'cb'       => '<input type="checkbox" />',
            'number'   => 'क्र.',
            'title'    => 'Pillar नाव (Title)',
            'name_en'  => 'English Name',
            'flow'     => 'फ्लो / हेडलाईन',
            'steps'    => 'पायऱ्या',
            'date'     => 'तारीख',
        ];
    }

    public function render_pillar_column($col, $post_id) {
        if ($col === 'number') {
            echo '<strong>' . esc_html(get_post_meta($post_id, '_ai_pillar_number', true)) . '</strong>';
        } elseif ($col === 'name_en') {
            echo esc_html(get_post_meta($post_id, '_ai_pillar_name_en', true));
        } elseif ($col === 'flow') {
            echo '<small>' . esc_html(get_post_meta($post_id, '_ai_pillar_flow_mr', true)) . '</small>';
        } elseif ($col === 'steps') {
            $steps = get_post_meta($post_id, '_ai_pillar_steps', true);
            echo esc_html(count(array_filter(explode("\n", (string)$steps)))) . ' पायऱ्या';
        }
    }

    public function challenge_columns($cols) {
        return [
            'cb'       => '<input type="checkbox" />',
            'title'    => 'क्षेत्र / प्रोफेशन',
            'pipeline' => '५-स्टेप पाइपलाइन',
            'tools'    => 'Tools Used',
            'outcome'  => 'फायदा (Outcome)',
            'date'     => 'तारीख',
        ];
    }

    public function render_challenge_column($col, $post_id) {
        if ($col === 'pipeline') {
            echo '<code style="font-size:11px;">' . esc_html(get_post_meta($post_id, '_ai_challenge_pipeline', true)) . '</code>';
        } elseif ($col === 'tools') {
            echo esc_html(get_post_meta($post_id, '_ai_challenge_tools', true));
        } elseif ($col === 'outcome') {
            echo esc_html(wp_trim_words(get_post_meta($post_id, '_ai_challenge_outcome_mr', true), 10));
        }
    }

    public function batch_columns($cols) {
        return [
            'cb'     => '<input type="checkbox" />',
            'title'  => 'बॅच नाव',
            'date_b' => 'तारीख व वेळ',
            'mode'   => 'माध्यम (Mode)',
            'seats'  => 'जागा (Booked / Total)',
            'status' => 'Status',
        ];
    }

    public function render_batch_column($col, $post_id) {
        if ($col === 'date_b') {
            echo esc_html(get_post_meta($post_id, '_ai_batch_date', true) . ' (' . get_post_meta($post_id, '_ai_batch_time', true) . ')');
        } elseif ($col === 'mode') {
            echo esc_html(get_post_meta($post_id, '_ai_batch_mode', true));
        } elseif ($col === 'seats') {
            $b = get_post_meta($post_id, '_ai_batch_seats_booked', true) ?: 0;
            $t = get_post_meta($post_id, '_ai_batch_seats_total', true) ?: 0;
            echo '<strong>' . esc_html($b) . '</strong> / ' . esc_html($t);
        } elseif ($col === 'status') {
            $st = get_post_meta($post_id, '_ai_batch_status', true);
            $bg = $st === 'Open' ? '#dcfce7' : ($st === 'Filling Fast' ? '#fef3c7' : '#fee2e2');
            $cl = $st === 'Open' ? '#166534' : ($st === 'Filling Fast' ? '#92400e' : '#991b1b');
            echo '<span class="ai-badge" style="background:' . $bg . '; color:' . $cl . ';">' . esc_html($st) . '</span>';
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
            $p = get_post_meta($post_id, '_ai_inquiry_phone', true);
            echo '<a href="https://wa.me/91' . esc_attr($p) . '" target="_blank" style="font-weight:600;">' . esc_html($p) . '</a>';
        } elseif ($col === 'category') {
            echo esc_html(get_post_meta($post_id, '_ai_inquiry_category', true));
        } elseif ($col === 'lang') {
            echo esc_html(get_post_meta($post_id, '_ai_inquiry_lang', true));
        } elseif ($col === 'status') {
            $st = get_post_meta($post_id, '_ai_inquiry_status', true) ?: 'new';
            echo '<span class="ai-badge" style="background:#fee2e2; color:#991b1b;">' . esc_html(strtoupper($st)) . '</span>';
        }
    }

    /**
     * 8. REST API Routes
     */
    public function enable_cors_headers() {
        add_filter('rest_pre_serve_request', function ($value) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, Accept');
            return $value;
        });
    }

    public function register_rest_routes() {
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

        // Also register under pooja/v1 namespace for unified usage
        register_rest_route('pooja/v1', '/ai-course', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_all_data'],
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
            'updated'    => current_time('mysql'),
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
        $category = sanitize_text_field($params['category'] ?? 'General');
        $lang     = sanitize_text_field($params['lang'] ?? 'मराठी');
        $notes    = sanitize_textarea_field($params['notes'] ?? '');

        if (empty($phone)) {
            return new WP_Error('missing_phone', 'मोबाईल नंबर आवश्यक आहे.', ['status' => 400]);
        }

        $post_id = wp_insert_post([
            'post_title'  => $name . ' (' . $phone . ')',
            'post_type'   => 'ai_inquiry',
            'post_status' => 'publish',
        ]);

        if (is_wp_error($post_id)) {
            return $post_id;
        }

        update_post_meta($post_id, '_ai_inquiry_phone', $phone);
        update_post_meta($post_id, '_ai_inquiry_category', $category);
        update_post_meta($post_id, '_ai_inquiry_lang', $lang);
        update_post_meta($post_id, '_ai_inquiry_notes', $notes);
        update_post_meta($post_id, '_ai_inquiry_status', 'new');

        return rest_ensure_response([
            'status'     => 'success',
            'inquiry_id' => $post_id,
            'message'    => 'तुमची नावनोंदणी यशस्वीरीत्या सेव्ह झाली आहे!',
        ]);
    }

    private function get_formatted_tools() {
        $q = new WP_Query([
            'post_type'      => 'ai_tool',
            'posts_per_page' => -1,
            'orderby'        => 'meta_value_num',
            'meta_key'       => '_ai_tool_order',
            'order'          => 'ASC',
            'post_status'    => 'publish',
        ]);

        $list = [];
        if ($q->have_posts()) {
            while ($q->have_posts()) {
                $q->the_post();
                $id = get_the_ID();
                $list[] = [
                    'id'            => $id,
                    'name'          => get_the_title(),
                    'category'      => get_post_meta($id, '_ai_tool_category', true) ?: 'all',
                    'badgeText'     => get_post_meta($id, '_ai_tool_badge_text', true) ?: 'Recommended',
                    'badgeColor'    => get_post_meta($id, '_ai_tool_badge_color', true) ?: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    'primaryUseMr'  => get_post_meta($id, '_ai_tool_use_mr', true),
                    'primaryUseHi'  => get_post_meta($id, '_ai_tool_use_hi', true),
                    'audienceMr'    => get_post_meta($id, '_ai_tool_audience_mr', true),
                    'audienceHi'    => get_post_meta($id, '_ai_tool_audience_hi', true),
                    'websiteUrl'    => get_post_meta($id, '_ai_tool_website_url', true),
                    'order'         => (int)get_post_meta($id, '_ai_tool_order', true),
                ];
            }
            wp_reset_postdata();
        }
        return $list;
    }

    private function get_formatted_pillars() {
        $q = new WP_Query([
            'post_type'      => 'ai_pillar',
            'posts_per_page' => -1,
            'orderby'        => 'meta_value_num',
            'meta_key'       => '_ai_pillar_order',
            'order'          => 'ASC',
            'post_status'    => 'publish',
        ]);

        $list = [];
        if ($q->have_posts()) {
            while ($q->have_posts()) {
                $q->the_post();
                $id = get_the_ID();
                $raw_steps = get_post_meta($id, '_ai_pillar_steps', true);
                $step_lines = array_filter(array_map('trim', explode("\n", (string)$raw_steps)));
                $steps_arr = [];
                foreach ($step_lines as $line) {
                    $steps_arr[] = ['labelMr' => $line, 'labelHi' => $line];
                }

                $list[] = [
                    'id'          => get_post_field('post_name', $id),
                    'number'      => get_post_meta($id, '_ai_pillar_number', true) ?: '१',
                    'nameEn'      => get_post_meta($id, '_ai_pillar_name_en', true),
                    'titleMr'     => get_post_meta($id, '_ai_pillar_title_mr', true),
                    'titleHi'     => get_post_meta($id, '_ai_pillar_title_hi', true),
                    'headlineMr'  => get_post_meta($id, '_ai_pillar_flow_mr', true),
                    'headlineHi'  => get_post_meta($id, '_ai_pillar_flow_hi', true),
                    'descMr'      => get_post_meta($id, '_ai_pillar_desc_mr', true),
                    'descHi'      => get_post_meta($id, '_ai_pillar_desc_hi', true),
                    'steps'       => $steps_arr,
                    'color'       => get_post_meta($id, '_ai_pillar_color', true) ?: 'border-amber-400 bg-amber-50 text-amber-900',
                    'badgeBg'     => get_post_meta($id, '_ai_pillar_badge', true) ?: 'bg-amber-500 text-white',
                    'order'       => (int)get_post_meta($id, '_ai_pillar_order', true),
                ];
            }
            wp_reset_postdata();
        }
        return $list;
    }

    private function get_formatted_challenges() {
        $q = new WP_Query([
            'post_type'      => 'ai_challenge',
            'posts_per_page' => -1,
            'orderby'        => 'meta_value_num',
            'meta_key'       => '_ai_challenge_order',
            'order'          => 'ASC',
            'post_status'    => 'publish',
        ]);

        $list = [];
        if ($q->have_posts()) {
            while ($q->have_posts()) {
                $q->the_post();
                $id = get_the_ID();
                $pipeline_raw = get_post_meta($id, '_ai_challenge_pipeline', true);
                $p_parts = array_filter(array_map('trim', explode('→', (string)$pipeline_raw)));

                $tools_raw = get_post_meta($id, '_ai_challenge_tools', true);
                $t_parts = array_filter(array_map('trim', explode(',', (string)$tools_raw)));

                $list[] = [
                    'id'             => get_post_field('post_name', $id),
                    'roleMr'         => get_post_meta($id, '_ai_challenge_role_mr', true),
                    'roleHi'         => get_post_meta($id, '_ai_challenge_role_hi', true),
                    'icon'           => get_post_meta($id, '_ai_challenge_icon', true) ?: 'GraduationCap',
                    'pipeline'       => $p_parts,
                    'pipelineTextMr' => get_post_meta($id, '_ai_challenge_pipeline_text_mr', true),
                    'pipelineTextHi' => get_post_meta($id, '_ai_challenge_pipeline_text_hi', true),
                    'toolsUsed'      => $t_parts,
                    'outcomeMr'      => get_post_meta($id, '_ai_challenge_outcome_mr', true),
                    'outcomeHi'      => get_post_meta($id, '_ai_challenge_outcome_hi', true),
                    'sampleInput'    => get_post_meta($id, '_ai_challenge_sample_input', true),
                    'samplePrompt'   => get_post_meta($id, '_ai_challenge_sample_prompt', true),
                    'order'          => (int)get_post_meta($id, '_ai_challenge_order', true),
                ];
            }
            wp_reset_postdata();
        }
        return $list;
    }

    private function get_formatted_batches() {
        $q = new WP_Query([
            'post_type'      => 'ai_batch',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        ]);

        $list = [];
        if ($q->have_posts()) {
            while ($q->have_posts()) {
                $q->the_post();
                $id = get_the_ID();
                $list[] = [
                    'id'          => $id,
                    'title'       => get_the_title(),
                    'date'        => get_post_meta($id, '_ai_batch_date', true),
                    'time'        => get_post_meta($id, '_ai_batch_time', true),
                    'mode'        => get_post_meta($id, '_ai_batch_mode', true),
                    'seatsTotal'  => (int)get_post_meta($id, '_ai_batch_seats_total', true),
                    'seatsBooked' => (int)get_post_meta($id, '_ai_batch_seats_booked', true),
                    'status'      => get_post_meta($id, '_ai_batch_status', true),
                ];
            }
            wp_reset_postdata();
        }
        return $list;
    }

    /**
     * 9. Render Admin Dashboard Page
     */
    public function render_dashboard_page() {
        $settings = $this->get_settings();
        $updated  = isset($_GET['updated']);
        $seeded   = isset($_GET['seeded']);

        $tools_count      = wp_count_posts('ai_tool')->publish ?? 0;
        $pillars_count    = wp_count_posts('ai_pillar')->publish ?? 0;
        $challenges_count = wp_count_posts('ai_challenge')->publish ?? 0;
        $batches_count    = wp_count_posts('ai_batch')->publish ?? 0;
        $inquiries_count  = wp_count_posts('ai_inquiry')->publish ?? 0;

        ?>
        <div class="wrap ai-wrap">
            <div class="ai-banner">
                <div>
                    <h1>🎓 १ डे AI कार्यशाळा (AI Course CMS) - मुख्य डॅशबोर्ड</h1>
                    <p>येथून तुम्ही ५ मुख्य Pillars, १०-१२ Core Tools, Real-Life Projects, Batches व आलेल्या नावनोंदणीचे <strong>Add, Update, Delete, Edit</strong> सहजपणे करू शकता.</p>
                </div>
                <div>
                    <a href="<?php echo esc_url(site_url('/ai-course')); ?>" target="_blank" class="button" style="background: rgba(255,255,255,0.2); color: #fff; border-color: rgba(255,255,255,0.4); font-weight:700;">
                        🌐 थेट AI कोर्स पेज उघडा
                    </a>
                </div>
            </div>

            <?php if ($updated): ?>
                <div class="notice notice-success is-dismissible">
                    <p><strong>यशस्वी!</strong> AI कोर्स सेटिंग्ज सेव्ह झाल्या असून REST API तात्काळ अपडेट झाले आहे.</p>
                </div>
            <?php endif; ?>

            <?php if ($seeded): ?>
                <div class="notice notice-success is-dismissible" style="border-left-color: #f59e0b;">
                    <p><strong>अभिनंदन!</strong> सर्व ५ Pillars, १२ Core Tools आणि ८ Real-Life Projects चा नमुना डेटा WordPress मध्ये यशस्वीरीत्या तयार झाला आहे. तुम्ही खाली दिलेल्या मेनूवरून त्यांना कधीही <strong>Add, Edit, Update किंवा Delete</strong> करू शकता.</p>
                </div>
            <?php endif; ?>

            <!-- CRUD STATS CARDS -->
            <div class="ai-stats-grid">
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_pillar')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo esc_html($pillars_count); ?></div>
                    <div class="ai-stat-label">⭐ ५ मुख्य Pillars</div>
                    <span class="ai-stat-sub">Add / Edit / Delete →</span>
                </a>

                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_tool')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo esc_html($tools_count); ?></div>
                    <div class="ai-stat-label">🛠️ १०-१२ Core Tools</div>
                    <span class="ai-stat-sub">Add / Edit / Delete →</span>
                </a>

                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_challenge')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo esc_html($challenges_count); ?></div>
                    <div class="ai-stat-label">🎯 Real-Life Projects</div>
                    <span class="ai-stat-sub">Add / Edit / Delete →</span>
                </a>

                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_batch')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num"><?php echo esc_html($batches_count); ?></div>
                    <div class="ai-stat-label">📅 कार्यशाळा Batches</div>
                    <span class="ai-stat-sub">Add / Edit / Delete →</span>
                </a>

                <a href="<?php echo esc_url(admin_url('edit.php?post_type=ai_inquiry')); ?>" class="ai-stat-card">
                    <div class="ai-stat-num" style="color:#166534;"><?php echo esc_html($inquiries_count); ?></div>
                    <div class="ai-stat-label">📥 आलेली नोंदणी (Leads)</div>
                    <span class="ai-stat-sub" style="color:#166534;">तपासा / Status बदला →</span>
                </a>
            </div>

            <!-- ONE CLICK SEEDER -->
            <div class="ai-card" style="border: 2px dashed #f59e0b; background: #fffbeb;">
                <h2>⚡ १-क्लिक नमुना डेटा तयार करा (1-Click Content Setup)</h2>
                <p style="color: #92400e; margin-bottom: 14px; font-size: 14px;">
                    जर तुमच्या WordPress मध्ये अद्याप Pillars, टूल्स किंवा प्रोजेक्ट्स जोडलेले नसतील, तर खालील बटण दाबल्यास <strong>सर्व ५ Pillars (Understand, Communicate, Work, Create, Automate)</strong>, <strong>१२ Core Tools (ChatGPT, Gemini, Claude, Perplexity, Canva इ.)</strong>, आणि <strong>८ क्षेत्रांचे Real-Life Challenges</strong> आपोआप WordPress मध्ये तयार होतील. त्यानंतर तुम्ही प्रत्येकाला हवे तसे Edit, Update किंवा Delete करू शकता.
                </p>
                <form method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display:inline;">
                    <input type="hidden" name="action" value="ai_course_seed_data">
                    <?php wp_nonce_field('ai_seed_nonce', '_ai_seed_nonce'); ?>
                    <button type="submit" class="button ai-btn-gold" onclick="return confirm('सर्व ५ Pillars, १२ Tools व ८ Projects WordPress मध्ये लोड करायचे का?');">
                        🚀 सर्व ५ Pillars, १२ Tools आणि ८ Projects लोड करा
                    </button>
                </form>
            </div>

            <!-- GENERAL SETTINGS FORM -->
            <form method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="ai_course_save_settings">
                <?php wp_nonce_field('ai_save_settings_nonce', '_ai_save_nonce'); ?>

                <div class="ai-card">
                    <h2>📅 AI कार्यशाळा मुख्य तपशील (Main Workshop Config)</h2>
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
                    <li>वरील सर्व PHP कोड कॉपी करून पेस्ट करा आणि <strong>Active</strong> करून <strong>Save Snippet</strong> दाबा!</li>
                </ol>

                <h2 style="margin-top: 25px;">🌐 पायरी २: REST API Endpoints (Next.js फ्रंटएंडसाठी)</h2>
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

// Initialize the plugin instance
AICourseCompleteCMS::get_instance();

}
