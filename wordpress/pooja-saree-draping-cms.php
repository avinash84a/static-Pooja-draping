<?php
/**
 * Plugin Name: Pooja Saree Draping - Complete Headless CMS & Admin Panel
 * Plugin URI: https://avipatil.live/cmspooja
 * Description: संपूर्ण पूजा साडी ड्रॅपिंग CMS प्लगइन. WordPress डॅशबोर्डवरून कार्यशाळा, सर्व १४+ साडी प्रकार, फोटो गॅलरी, विद्यार्थिनींचे अभिप्राय, आणि नवीन नावनोंदणी (Inquiries) चे Edit, Delete, Update करा.
 * Version: 2.0.0
 * Author: Pooja Saree Draping Pune
 * Author URI: https://avipatil.live/cmspooja
 * Text Domain: pooja-saree-draping
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class PoojaSareeDrapingCompleteCMS {

    private static $instance = null;
    private $option_key = 'pooja_site_settings';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        // Register Custom Post Types & Taxonomies
        add_action('init', [$this, 'register_post_types']);
        add_action('init', [$this, 'register_taxonomies']);

        // Admin Menus & Submenus
        add_action('admin_menu', [$this, 'register_admin_menus']);

        // Custom Meta Boxes for Post Types
        add_action('add_meta_boxes', [$this, 'register_meta_boxes']);
        add_action('save_post', [$this, 'save_custom_meta']);

        // Admin Columns customizations
        add_filter('manage_saree_style_posts_columns', [$this, 'style_columns']);
        add_action('manage_saree_style_posts_custom_column', [$this, 'render_style_column'], 10, 2);

        add_filter('manage_workshop_batch_posts_columns', [$this, 'batch_columns']);
        add_action('manage_workshop_batch_posts_custom_column', [$this, 'render_batch_column'], 10, 2);

        add_filter('manage_pooja_gallery_posts_columns', [$this, 'gallery_columns']);
        add_action('manage_pooja_gallery_posts_custom_column', [$this, 'render_gallery_column'], 10, 2);

        add_filter('manage_pooja_review_posts_columns', [$this, 'review_columns']);
        add_action('manage_pooja_review_posts_custom_column', [$this, 'render_review_column'], 10, 2);

        add_filter('manage_pooja_inquiry_posts_columns', [$this, 'inquiry_columns']);
        add_action('manage_pooja_inquiry_posts_custom_column', [$this, 'render_inquiry_column'], 10, 2);

        // Admin CSS & JS Assets
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);

        // REST API Routes
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        add_action('rest_api_init', [$this, 'enable_cors_headers'], 15);

        // Admin Actions (Save Settings, 1-Click Seeder)
        add_action('admin_post_pooja_save_site_settings', [$this, 'handle_save_settings']);
        add_action('admin_post_pooja_seed_sample_data', [$this, 'handle_seed_sample_data']);
    }

    /**
     * 1. Register Custom Post Types for Edit, Delete, Update
     */
    public function register_post_types() {
        // A. Saree Styles (साडी प्रकार)
        register_post_type('saree_style', [
            'labels' => [
                'name'               => 'साडी प्रकार (Styles)',
                'singular_name'      => 'साडी प्रकार',
                'add_new'            => 'नवीन साडी प्रकार जोडा',
                'add_new_item'       => 'नवीन साडी प्रकार तयार करा',
                'edit_item'          => 'साडी प्रकार संपादित करा (Edit)',
                'new_item'           => 'नवीन साडी प्रकार',
                'view_item'          => 'साडी प्रकार पहा',
                'search_items'       => 'साडी प्रकार शोधा',
                'not_found'          => 'कोणताही साडी प्रकार सापडला नाही',
                'all_items'          => 'सर्व साडी प्रकार (All Styles)',
            ],
            'public'             => true,
            'has_archive'        => true,
            'menu_icon'          => 'dashicons-tag',
            'show_in_menu'       => 'pooja-saree-cms',
            'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
            'show_in_rest'       => true,
            'rest_base'          => 'saree_styles',
        ]);

        // B. Workshop Batches (कार्यशाळा बॅचेस)
        register_post_type('workshop_batch', [
            'labels' => [
                'name'               => 'बॅचेस व शेड्युल (Batches)',
                'singular_name'      => 'बॅच',
                'add_new'            => 'नवीन बॅच जोडा',
                'add_new_item'       => 'नवीन बॅच शेड्युल करा',
                'edit_item'          => 'बॅच संपादित करा (Edit Batch)',
                'all_items'          => 'सर्व बॅचेस (All Batches)',
            ],
            'public'             => true,
            'has_archive'        => false,
            'menu_icon'          => 'dashicons-calendar-alt',
            'show_in_menu'       => 'pooja-saree-cms',
            'supports'           => ['title', 'editor'],
            'show_in_rest'       => true,
            'rest_base'          => 'workshop_batches',
        ]);

        // C. Photo Gallery (फोटो गॅलरी)
        register_post_type('pooja_gallery', [
            'labels' => [
                'name'               => 'फोटो गॅलरी (Gallery)',
                'singular_name'      => 'फोटो',
                'add_new'            => 'नवीन फोटो जोडा',
                'add_new_item'       => 'नवीन फोटो अपलोड करा',
                'edit_item'          => 'फोटो संपादित करा (Edit Photo)',
                'all_items'          => 'सर्व फोटो (All Photos)',
            ],
            'public'             => true,
            'menu_icon'          => 'dashicons-format-gallery',
            'show_in_menu'       => 'pooja-saree-cms',
            'supports'           => ['title', 'thumbnail', 'excerpt'],
            'show_in_rest'       => true,
            'rest_base'          => 'pooja_gallery',
        ]);

        // D. Reviews & Testimonials (अभिप्राय)
        register_post_type('pooja_review', [
            'labels' => [
                'name'               => 'अभिप्राय व रिव्ह्यू (Reviews)',
                'singular_name'      => 'अभिप्राय',
                'add_new'            => 'नवीन रिव्ह्यू जोडा',
                'add_new_item'       => 'नवीन अभिप्राय जोडा',
                'edit_item'          => 'अभिप्राय संपादित करा (Edit Review)',
                'all_items'          => 'सर्व अभिप्राय (All Reviews)',
            ],
            'public'             => true,
            'menu_icon'          => 'dashicons-star-filled',
            'show_in_menu'       => 'pooja-saree-cms',
            'supports'           => ['title', 'editor', 'thumbnail'],
            'show_in_rest'       => true,
            'rest_base'          => 'pooja_reviews',
        ]);

        // E. Inquiries & Registrations (नावनोंदणी)
        register_post_type('pooja_inquiry', [
            'labels' => [
                'name'               => 'नावनोंदणी व चौकशी (Inquiries)',
                'singular_name'      => 'चौकशी',
                'all_items'          => 'सर्व चौकशी (All Inquiries)',
                'edit_item'          => 'चौकशी पहा व अपडेट करा',
                'search_items'       => 'नाव किंवा फोन नंबर शोधा',
            ],
            'public'             => false,
            'show_ui'            => true,
            'show_in_menu'       => 'pooja-saree-cms',
            'supports'           => ['title'],
            'capabilities'       => [
                'create_posts' => 'do_not_allow', // Created via Frontend REST API
            ],
            'map_meta_cap'       => true,
        ]);
    }

    /**
     * 2. Register Taxonomies (Categories for Styles & Gallery)
     */
    public function register_taxonomies() {
        register_taxonomy('style_category', ['saree_style', 'pooja_gallery'], [
            'labels'            => [
                'name'          => 'वर्गवारी (Categories)',
                'singular_name' => 'वर्गवारी',
                'add_new_item'  => 'नवीन वर्गवारी जोडा',
            ],
            'hierarchical'      => true,
            'public'            => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
        ]);
    }

    /**
     * 3. Register Admin Sidebar Navigation & Submenus
     */
    public function register_admin_menus() {
        // Main Brand Menu
        add_menu_page(
            'पूजा साडी ड्रॅपिंग CMS',
            '🌸 साडी ड्रॅपिंग CMS',
            'manage_options',
            'pooja-saree-cms',
            [$this, 'render_dashboard_page'],
            'dashicons-art',
            25
        );

        // Submenu: Dashboard & Settings
        add_submenu_page(
            'pooja-saree-cms',
            'डॅशबोर्ड व सेटिंग्ज',
            '⚙️ डॅशबोर्ड व सेटिंग्ज',
            'manage_options',
            'pooja-saree-cms',
            [$this, 'render_dashboard_page']
        );
    }

    /**
     * 4. Enqueue Admin Assets
     */
    public function enqueue_admin_assets($hook) {
        wp_enqueue_media();
        wp_enqueue_style('pooja-admin-styles', false);
        wp_add_inline_style('pooja-admin-styles', '
            .pooja-wrap { max-width: 1100px; margin: 20px auto 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif; }
            .pooja-banner { background: linear-gradient(135deg, #7c1328 0%, #a61c36 100%); color: #fff; padding: 26px 32px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(124, 19, 40, 0.2); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
            .pooja-banner h1 { color: #fff; margin: 0 0 6px; font-size: 24px; font-weight: 700; }
            .pooja-banner p { margin: 0; opacity: 0.92; font-size: 14px; }
            .pooja-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
            .pooja-stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-decoration: none; display: block; color: inherit; transition: transform 0.15s ease, border-color 0.15s ease; }
            .pooja-stat-card:hover { transform: translateY(-2px); border-color: #9e1b32; color: inherit; }
            .pooja-stat-num { font-size: 28px; font-weight: 800; color: #9e1b32; line-height: 1; margin-bottom: 4px; }
            .pooja-stat-label { font-size: 13px; font-weight: 600; color: #475569; }
            .pooja-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
            .pooja-card h2 { margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; font-size: 18px; color: #1e293b; display: flex; align-items: center; gap: 10px; }
            .pooja-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .pooja-field { margin-bottom: 18px; }
            .pooja-field label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #334155; }
            .pooja-field input[type="text"], .pooja-field input[type="number"], .pooja-field input[type="url"], .pooja-field textarea, .pooja-field select { width: 100%; border-radius: 6px; border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 14px; box-sizing: border-box; }
            .pooja-field input:focus, .pooja-field textarea:focus { border-color: #9e1b32; outline: none; box-shadow: 0 0 0 2px rgba(158, 27, 50, 0.15); }
            .pooja-btn-primary { background: #9e1b32 !important; border-color: #7c1328 !important; color: #fff !important; font-size: 14px !important; padding: 10px 22px !important; border-radius: 6px !important; height: auto !important; font-weight: 600 !important; cursor: pointer; text-decoration: none; display: inline-block; }
            .pooja-btn-primary:hover { background: #7c1328 !important; color: #fff !important; }
            .pooja-btn-gold { background: #d97706 !important; border-color: #b45309 !important; color: #fff !important; font-size: 14px !important; padding: 10px 20px !important; border-radius: 6px !important; font-weight: 600 !important; text-decoration: none; display: inline-block; }
            .pooja-btn-gold:hover { background: #b45309 !important; color: #fff !important; }
            .pooja-badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .pooja-badge-new { background: #fee2e2; color: #991b1b; }
            .pooja-badge-contacted { background: #fef3c7; color: #92400e; }
            .pooja-badge-confirmed { background: #dcfce7; color: #166534; }
            .pooja-thumb-preview { width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; display: block; }
        ');
    }

    /**
     * Default Site Settings
     */
    public function get_default_settings() {
        return [
            'workshop_title'   => '1 डे साडी ड्रॅपिंग वर्कशॉप',
            'subtitle'         => 'गौरी महालक्ष्मीच्या सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण',
            'instructor'       => 'पूजा पाटील (पुणे)',
            'description'      => 'पुण्यातील सुप्रसिद्ध साडी ड्रॅपिंग आर्टिस्ट पूजा पाटील यांच्या मार्गदर्शनाखाली संपूर्ण प्रात्यक्षिकासह (Hands-on Practical) १४+ पारंपारिक व गौरी महालक्ष्मी साडी प्रकार शिका.',
            'default_date'     => 'दर रविवारी नवीन बॅच (Upcoming Sunday)',
            'default_time'     => 'सकाळी ११:०० ते सायंकाळी ५:००',
            'fees'             => 1500,
            'advance_fee'      => 500,
            'seats_left'       => 6,
            'patterns_count'   => '14 ते 15 प्रकार',
            'phone'            => '8446917187',
            'whatsapp'         => '8446917187',
            'address_short'    => 'सिंहगड रोड, आनंद नगर, पुणे',
            'address_full'     => 'साईप्रभा हाऊस, जगताप हॉस्पिटल समोर, आनंद नगर, सिंहगड रोड, पुणे - ४११०५१',
            'google_map_url'   => 'https://maps.google.com/?q=Sinhgad+Road+Anand+Nagar+Pune',
            'instagram_url'    => 'https://instagram.com/',
            'hero_image'       => 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
            'highlights'       => [
                '१४+ पारंपारिक व मॉडर्न साडी ड्रॅपिंग प्रकार',
                'उभी व बसलेली गौरी महालक्ष्मी साडी ड्रॅपिंग स्पेशल',
                'स्टेप-बाय-स्टेप वैयक्तिक प्रात्यक्षिक (Hands-on training)',
                'साडी पिन अप, फिक्सिंग व प्लेट्सच्या सोप्या ट्रिक्स',
                'वर्कशॉपनंतर घरबसल्या साडी नेसवण्याचा आत्मविश्वास',
                'प्रमाणपत्र व मोफत व्हिडिओ गाईड',
            ],
        ];
    }

    public function get_settings() {
        $saved = get_option($this->option_key, []);
        return wp_parse_args($saved, $this->get_default_settings());
    }

    /**
     * 5. Render Central Admin Dashboard Page
     */
    public function render_dashboard_page() {
        $settings = $this->get_settings();
        $updated = isset($_GET['updated']) && $_GET['updated'] === 'true';
        $seeded  = isset($_GET['seeded']) && $_GET['seeded'] === 'true';

        // Count totals for quick stats
        $styles_count    = wp_count_posts('saree_style')->publish ?? 0;
        $batches_count   = wp_count_posts('workshop_batch')->publish ?? 0;
        $gallery_count   = wp_count_posts('pooja_gallery')->publish ?? 0;
        $reviews_count   = wp_count_posts('pooja_review')->publish ?? 0;
        $inquiries_count = wp_count_posts('pooja_inquiry')->publish ?? 0;

        ?>
        <div class="wrap pooja-wrap">
            <div class="pooja-banner">
                <div>
                    <h1>🌸 पूजा साडी ड्रॅपिंग (Pooja Saree Draping) - मुख्य कंट्रोल पॅनल</h1>
                    <p>येथून तुम्ही वेबसाइटवरील सर्व साडी प्रकार, बॅचेस, गॅलरी, अभिप्राय आणि नवीन नावनोंदणीचे Edit, Update, Delete करू शकता.</p>
                </div>
                <div>
                    <a href="<?php echo esc_url(site_url('/')); ?>" target="_blank" class="button" style="background: rgba(255,255,255,0.2); color: #fff; border-color: rgba(255,255,255,0.4);">
                        🌐 मुख्य वेबसाइट पहा
                    </a>
                </div>
            </div>

            <?php if ($updated): ?>
                <div class="notice notice-success is-dismissible" style="border-left-color: #9e1b32;">
                    <p><strong>यशस्वी!</strong> सेटिंग्ज सेव्ह झाल्या असून Next.js फ्रंटएंडसाठी REST API तात्काळ अपडेट झाले आहे.</p>
                </div>
            <?php endif; ?>

            <?php if ($seeded): ?>
                <div class="notice notice-success is-dismissible" style="border-left-color: #d97706;">
                    <p><strong>अभिनंदन!</strong> सर्व १४ साडी प्रकार, वर्कशॉप बॅचेस, गॅलरी व अभिप्राय WordPress मध्ये तयार झाले आहेत. तुम्ही खाली दिलेल्या मेनूवरून त्यांना कधीही Edit किंवा Delete करू शकता.</p>
                </div>
            <?php endif; ?>

            <!-- QUICK CRUD STATS CARDS -->
            <div class="pooja-stats-grid">
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=saree_style')); ?>" class="pooja-stat-card">
                    <div class="pooja-stat-num"><?php echo esc_html($styles_count); ?></div>
                    <div class="pooja-stat-label">✨ साडी प्रकार (Styles)</div>
                    <small style="color: #9e1b32; font-weight:600;">Edit / Delete / Add →</small>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=workshop_batch')); ?>" class="pooja-stat-card">
                    <div class="pooja-stat-num"><?php echo esc_html($batches_count); ?></div>
                    <div class="pooja-stat-label">📅 कार्यशाळा बॅचेस (Batches)</div>
                    <small style="color: #9e1b32; font-weight:600;">Edit / Delete / Add →</small>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=pooja_gallery')); ?>" class="pooja-stat-card">
                    <div class="pooja-stat-num"><?php echo esc_html($gallery_count); ?></div>
                    <div class="pooja-stat-label">🖼️ फोटो गॅलरी (Gallery)</div>
                    <small style="color: #9e1b32; font-weight:600;">Edit / Delete / Add →</small>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=pooja_review')); ?>" class="pooja-stat-card">
                    <div class="pooja-stat-num"><?php echo esc_html($reviews_count); ?></div>
                    <div class="pooja-stat-label">⭐ विद्यार्थिनींचे अभिप्राय</div>
                    <small style="color: #9e1b32; font-weight:600;">Edit / Delete / Add →</small>
                </a>
                <a href="<?php echo esc_url(admin_url('edit.php?post_type=pooja_inquiry')); ?>" class="pooja-stat-card">
                    <div class="pooja-stat-num" style="color: #166534;"><?php echo esc_html($inquiries_count); ?></div>
                    <div class="pooja-stat-label">📥 आलेली नावनोंदणी (Leads)</div>
                    <small style="color: #166534; font-weight:600;">तपासा / Status बदला →</small>
                </a>
            </div>

            <!-- ONE-CLICK SEEDER ACTION (IF DATABASE IS EMPTY) -->
            <div class="pooja-card" style="border: 2px dashed #f59e0b; background: #fffbeb;">
                <h2>⚡ १-क्लिक नमुना डेटा तयार करा (1-Click Content Setup)</h2>
                <p style="color: #92400e; margin-bottom: 14px; font-size: 14px;">
                    जर तुमच्या WordPress मध्ये अद्याप साडी प्रकार किंवा बॅचेस जोडलेले नसतील, तर खालील बटण दाबल्यास <strong>सर्व १४ साडी प्रकार (उभी गौरी, पेशवाई, कमल, रुक्मिणी इ.)</strong>, आगामी बॅचेस आणि नमुना अभिप्राय आपोआप WordPress मध्ये सेव्ह होतील. त्यानंतर तुम्ही प्रत्येकाला हवे तसे Edit, Update किंवा Delete करू शकता.
                </p>
                <form method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display:inline;">
                    <input type="hidden" name="action" value="pooja_seed_sample_data">
                    <?php wp_nonce_field('pooja_seed_nonce', '_pooja_seed_nonce'); ?>
                    <button type="submit" class="button pooja-btn-gold" onclick="return confirm('सर्व १४ साडी प्रकार व नमुना डेटा WordPress मध्ये तयार करायचा का?');">
                        🚀 सर्व १४ साडी प्रकार आणि बॅचेस लोड करा
                    </button>
                </form>
            </div>

            <!-- GENERAL SETTINGS FORM -->
            <form method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="pooja_save_site_settings">
                <?php wp_nonce_field('pooja_save_site_nonce', '_pooja_site_nonce'); ?>

                <!-- SECTION 1: संपर्क आणि स्टुडिओ माहिती -->
                <div class="pooja-card">
                    <h2>📞 संपर्क आणि स्टुडिओ पत्ता (Contact & Studio Details)</h2>
                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_whatsapp">WhatsApp नंबर:</label>
                            <input type="text" id="pooja_whatsapp" name="whatsapp" value="<?php echo esc_attr($settings['whatsapp']); ?>" required>
                            <small>१० अंकी नंबर (उदा. 8446917187)</small>
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_phone">कॉलिंग नंबर:</label>
                            <input type="text" id="pooja_phone" name="phone" value="<?php echo esc_attr($settings['phone']); ?>">
                        </div>
                    </div>

                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_address_short">थोडक्यात पत्ता:</label>
                            <input type="text" id="pooja_address_short" name="address_short" value="<?php echo esc_attr($settings['address_short']); ?>">
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_google_map">Google Maps लिंक (किंवा एम्बेड URL):</label>
                            <input type="url" id="pooja_google_map" name="google_map_url" value="<?php echo esc_attr($settings['google_map_url']); ?>">
                        </div>
                    </div>

                    <div class="pooja-field">
                        <label for="pooja_address_full">संपूर्ण स्टुडिओ पत्ता:</label>
                        <textarea id="pooja_address_full" name="address_full" rows="2"><?php echo esc_textarea($settings['address_full']); ?></textarea>
                    </div>
                </div>

                <!-- SECTION 2: १ डे कार्यशाळा मुख्य तपशील -->
                <div class="pooja-card">
                    <h2>📅 मुख्य कार्यशाळा माहिती (Main Workshop Details)</h2>
                    <div class="pooja-field">
                        <label for="pooja_w_title">कार्यशाळा शीर्षक (Title):</label>
                        <input type="text" id="pooja_w_title" name="workshop_title" value="<?php echo esc_attr($settings['workshop_title']); ?>" required>
                    </div>

                    <div class="pooja-field">
                        <label for="pooja_w_subtitle">उपशीर्षक (Subtitle):</label>
                        <input type="text" id="pooja_w_subtitle" name="subtitle" value="<?php echo esc_attr($settings['subtitle']); ?>">
                    </div>

                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_w_instructor">प्रशिक्षिका नाव:</label>
                            <input type="text" id="pooja_w_instructor" name="instructor" value="<?php echo esc_attr($settings['instructor']); ?>">
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_w_count">साडी प्रकार संख्या:</label>
                            <input type="text" id="pooja_w_count" name="patterns_count" value="<?php echo esc_attr($settings['patterns_count']); ?>">
                        </div>
                    </div>

                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_w_fees">एकूण फी (₹):</label>
                            <input type="number" id="pooja_w_fees" name="fees" value="<?php echo esc_attr($settings['fees']); ?>">
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_w_advance">अॅडव्हान्स बुकिंग (₹):</label>
                            <input type="number" id="pooja_w_advance" name="advance_fee" value="<?php echo esc_attr($settings['advance_fee']); ?>">
                        </div>
                    </div>

                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_w_date">पुढील बॅच तारीख:</label>
                            <input type="text" id="pooja_w_date" name="default_date" value="<?php echo esc_attr($settings['default_date']); ?>">
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_w_time">वेळ:</label>
                            <input type="text" id="pooja_w_time" name="default_time" value="<?php echo esc_attr($settings['default_time']); ?>">
                        </div>
                    </div>

                    <div class="pooja-field">
                        <label for="pooja_w_desc">कार्यशाळा सविस्तर वर्णन:</label>
                        <textarea id="pooja_w_desc" name="description" rows="3"><?php echo esc_textarea($settings['description']); ?></textarea>
                    </div>

                    <!-- HERO IMAGE WITH WP MEDIA PICKER -->
                    <div class="pooja-field">
                        <label for="pooja_hero_image">मुख्य बॅनर इमेज (Hero Banner):</label>
                        <div style="display:flex; gap: 10px;">
                            <input type="text" id="pooja_hero_image" name="hero_image" value="<?php echo esc_attr($settings['hero_image']); ?>" style="flex:1;">
                            <button type="button" class="button" id="pooja_hero_upload_btn">फोटो निवडा (Media)</button>
                        </div>
                        <?php if (!empty($settings['hero_image'])): ?>
                            <img id="pooja_hero_preview" src="<?php echo esc_url($settings['hero_image']); ?>" alt="Banner Preview" style="max-width: 240px; margin-top: 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <?php endif; ?>
                    </div>

                    <div class="pooja-field">
                        <label>कार्यशाळा वैशिष्ट्ये (प्रत्येक ओळीवर १):</label>
                        <textarea name="highlights_raw" rows="6"><?php echo esc_textarea(implode("\n", $settings['highlights'])); ?></textarea>
                    </div>
                </div>

                <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
                    <button type="submit" class="button button-primary pooja-btn-primary">
                        💾 सर्व बदल सेव्ह करा (Save All Settings)
                    </button>
                    <a href="<?php echo esc_url(rest_url('pooja/v1/all-data')); ?>" target="_blank" style="font-size: 13px; font-weight:600; color: #9e1b32; text-decoration: none;">
                        🔗 Live REST API JSON तपासा (/wp-json/pooja/v1/all-data)
                    </a>
                </div>
            </form>
        </div>

        <script>
        jQuery(document).ready(function($){
            $('#pooja_hero_upload_btn').on('click', function(e) {
                e.preventDefault();
                var uploader = wp.media({
                    title: 'मुख्य बॅनर फोटो निवडा',
                    button: { text: 'हा फोटो वापरा' },
                    multiple: false
                }).on('select', function() {
                    var file = uploader.state().get('selection').first().toJSON();
                    $('#pooja_hero_image').val(file.url);
                    $('#pooja_hero_preview').attr('src', file.url).show();
                }).open();
            });
        });
        </script>
        <?php
    }

    /**
     * 6. Custom Meta Boxes for Saree Styles, Batches, Reviews, and Inquiries
     */
    public function register_meta_boxes() {
        // Meta Box for Saree Styles
        add_meta_box('pooja_style_meta', 'साडी प्रकार तपशील (Style Details)', [$this, 'render_style_metabox'], 'saree_style', 'normal', 'high');

        // Meta Box for Batches
        add_meta_box('pooja_batch_meta', 'बॅच तपशील (Batch Information)', [$this, 'render_batch_metabox'], 'workshop_batch', 'normal', 'high');

        // Meta Box for Reviews
        add_meta_box('pooja_review_meta', 'अभिप्राय तपशील (Review Rating & Student)', [$this, 'render_review_metabox'], 'pooja_review', 'normal', 'high');

        // Meta Box for Inquiries (Lead Details)
        add_meta_box('pooja_inquiry_meta', 'विद्यार्थिनी नोंदणी माहिती (Inquiry Lead Details)', [$this, 'render_inquiry_metabox'], 'pooja_inquiry', 'normal', 'high');
    }

    // Render Saree Style Meta Box
    public function render_style_metabox($post) {
        wp_nonce_field('pooja_style_meta_nonce', '_style_nonce');
        $marathi_name = get_post_meta($post->ID, '_marathi_name', true) ?: $post->post_title;
        $english_name = get_post_meta($post->ID, '_english_name', true);
        $duration     = get_post_meta($post->ID, '_duration', true) ?: '२५ मिनिटे';
        $difficulty   = get_post_meta($post->ID, '_difficulty', true) ?: 'Intermediate';
        $pallu_type   = get_post_meta($post->ID, '_pallu_type', true);
        $pleats_count = get_post_meta($post->ID, '_pleats_count', true);
        $key_steps    = get_post_meta($post->ID, '_key_steps', true);
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">मराठी नाव:</label>
                <input type="text" name="_marathi_name" value="<?php echo esc_attr($marathi_name); ?>" style="width:100%;">
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">English Name:</label>
                <input type="text" name="_english_name" value="<?php echo esc_attr($english_name); ?>" style="width:100%;">
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 12px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">शिकण्याचा कालावधी:</label>
                <input type="text" name="_duration" value="<?php echo esc_attr($duration); ?>" style="width:100%;">
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">पातळी (Difficulty):</label>
                <select name="_difficulty" style="width:100%;">
                    <option value="Beginner" <?php selected($difficulty, 'Beginner'); ?>>Beginner (सोपे)</option>
                    <option value="Intermediate" <?php selected($difficulty, 'Intermediate'); ?>>Intermediate (मध्यम)</option>
                    <option value="Advanced" <?php selected($difficulty, 'Advanced'); ?>>Advanced (तज्ज्ञ)</option>
                </select>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">निऱ्यांची संख्या (Pleats):</label>
                <input type="text" name="_pleats_count" value="<?php echo esc_attr($pleats_count); ?>" style="width:100%;">
            </div>
        </div>
        <div style="margin-bottom: 12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">पदर प्रकार (Pallu Style):</label>
            <input type="text" name="_pallu_type" value="<?php echo esc_attr($pallu_type); ?>" style="width:100%;">
        </div>
        <div>
            <label style="font-weight:600; display:block; margin-bottom:4px;">महत्त्वाच्या पायऱ्या (प्रत्येक ओळीवर १):</label>
            <textarea name="_key_steps" rows="4" style="width:100%;"><?php echo esc_textarea($key_steps); ?></textarea>
        </div>
        <?php
    }

    // Render Batch Meta Box
    public function render_batch_metabox($post) {
        wp_nonce_field('pooja_batch_meta_nonce', '_batch_nonce');
        $date        = get_post_meta($post->ID, '_batch_date', true);
        $time        = get_post_meta($post->ID, '_batch_time', true) ?: 'सकाळी ११:०० ते सायंकाळी ५:००';
        $fees        = get_post_meta($post->ID, '_batch_fees', true) ?: '1500';
        $advance_fee = get_post_meta($post->ID, '_advance_fee', true) ?: '500';
        $seats_left  = get_post_meta($post->ID, '_seats_left', true) ?: '6';
        $status      = get_post_meta($post->ID, '_batch_status', true) ?: 'open';
        $venue       = get_post_meta($post->ID, '_venue', true) ?: 'आनंद नगर, सिंहगड रोड, पुणे';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">बॅच तारीख (उदा. 20 सप्टेंबर):</label>
                <input type="text" name="_batch_date" value="<?php echo esc_attr($date); ?>" style="width:100%;" required>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">वेळ (Timing):</label>
                <input type="text" name="_batch_time" value="<?php echo esc_attr($time); ?>" style="width:100%;">
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 12px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">फी (₹):</label>
                <input type="number" name="_batch_fees" value="<?php echo esc_attr($fees); ?>" style="width:100%;">
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">अॅडव्हान्स (₹):</label>
                <input type="number" name="_advance_fee" value="<?php echo esc_attr($advance_fee); ?>" style="width:100%;">
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">शिल्लक जागा (Seats Left):</label>
                <input type="number" name="_seats_left" value="<?php echo esc_attr($seats_left); ?>" style="width:100%;">
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">बॅच स्टेटस:</label>
                <select name="_batch_status" style="width:100%;">
                    <option value="open" <?php selected($status, 'open'); ?>>नोंदणी सुरू (Open)</option>
                    <option value="few_seats" <?php selected($status, 'few_seats'); ?>>मर्यादित जागा शिल्लक (Filling Fast)</option>
                    <option value="full" <?php selected($status, 'full'); ?>>हाऊसफुल्ल (Housefull)</option>
                    <option value="completed" <?php selected($status, 'completed'); ?>>पूर्ण झाले (Completed)</option>
                </select>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">स्थळ (Venue):</label>
                <input type="text" name="_venue" value="<?php echo esc_attr($venue); ?>" style="width:100%;">
            </div>
        </div>
        <?php
    }

    // Render Review Meta Box
    public function render_review_metabox($post) {
        wp_nonce_field('pooja_review_meta_nonce', '_review_nonce');
        $name     = get_post_meta($post->ID, '_reviewer_name', true) ?: $post->post_title;
        $city     = get_post_meta($post->ID, '_reviewer_city', true) ?: 'पुणे';
        $rating   = get_post_meta($post->ID, '_rating', true) ?: '5';
        $source   = get_post_meta($post->ID, '_source', true) ?: 'Google Reviews';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">विद्यार्थिनीचे नाव:</label>
                <input type="text" name="_reviewer_name" value="<?php echo esc_attr($name); ?>" style="width:100%;" required>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">शहर / परिसर (उदा. कोथरूड, पुणे):</label>
                <input type="text" name="_reviewer_city" value="<?php echo esc_attr($city); ?>" style="width:100%;">
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">रेटिंग (Rating):</label>
                <select name="_rating" style="width:100%;">
                    <option value="5" <?php selected($rating, '5'); ?>>⭐⭐⭐⭐⭐ (५ स्टार - उत्कृष्ट)</option>
                    <option value="4" <?php selected($rating, '4'); ?>>⭐⭐⭐⭐ (४ स्टार - खूप छान)</option>
                </select>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">स्रोत (Source):</label>
                <input type="text" name="_source" value="<?php echo esc_attr($source); ?>" style="width:100%;">
            </div>
        </div>
        <?php
    }

    // Render Inquiry Lead Meta Box
    public function render_inquiry_metabox($post) {
        wp_nonce_field('pooja_inquiry_meta_nonce', '_inquiry_nonce');
        $phone        = get_post_meta($post->ID, '_phone', true);
        $workshop     = get_post_meta($post->ID, '_workshop_type', true);
        $participants = get_post_meta($post->ID, '_participants', true) ?: '1';
        $message      = get_post_meta($post->ID, '_message', true);
        $status       = get_post_meta($post->ID, '_status', true) ?: 'new';
        $admin_notes  = get_post_meta($post->ID, '_admin_notes', true);

        $wa_clean = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($wa_clean) === 10) {
            $wa_clean = '91' . $wa_clean;
        }
        $wa_url = 'https://wa.me/' . $wa_clean . '?text=' . rawurlencode('नमस्कार ' . $post->post_title . ', पूजा साडी ड्रॅपिंग वर्कशॉपसाठी तुमची नोंदणी आम्हाला प्राप्त झाली आहे.');
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">मोबाईल नंबर:</label>
                <input type="text" name="_phone" value="<?php echo esc_attr($phone); ?>" style="width:100%;" readonly>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">थेट WhatsApp मेसेज:</label>
                <a href="<?php echo esc_url($wa_url); ?>" target="_blank" class="button" style="background:#25D366; color:#fff; border-color:#25D366; font-weight:600;">
                    💬 WhatsApp वर संपर्क करा
                </a>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">निवडलेला वर्कशॉप / प्रकार:</label>
                <input type="text" value="<?php echo esc_attr($workshop); ?>" style="width:100%;" readonly>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">सहभागी विद्यार्थिनी संख्या:</label>
                <input type="text" value="<?php echo esc_attr($participants); ?>" style="width:100%;" readonly>
            </div>
        </div>
        <div style="margin-bottom: 12px;">
            <label style="font-weight:600; display:block; margin-bottom:4px;">विद्यार्थिनीचा संदेश:</label>
            <textarea rows="2" style="width:100%;" readonly><?php echo esc_textarea($message); ?></textarea>
        </div>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #e2e8f0;">
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px;">
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">स्थिती (Status Update):</label>
                <select name="_status" style="width:100%;">
                    <option value="new" <?php selected($status, 'new'); ?>>🔴 नवीन नोंदणी (New)</option>
                    <option value="contacted" <?php selected($status, 'contacted'); ?>>🟡 संपर्क साधला (Contacted)</option>
                    <option value="confirmed" <?php selected($status, 'confirmed'); ?>>🟢 कन्फर्म / फी भरली (Confirmed)</option>
                    <option value="cancelled" <?php selected($status, 'cancelled'); ?>>⚪ रद्द केले (Cancelled)</option>
                </select>
            </div>
            <div>
                <label style="font-weight:600; display:block; margin-bottom:4px;">अॅडमिन नोट्स (Admin Notes):</label>
                <input type="text" name="_admin_notes" value="<?php echo esc_attr($admin_notes); ?>" placeholder="उदा. ₹५०० ॲडव्हान्स मिळाला / गुगल पे द्वारे" style="width:100%;">
            </div>
        </div>
        <?php
    }

    /**
     * Save Custom Meta on Post Save
     */
    public function save_custom_meta($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        // Saree Style
        if (isset($_POST['_style_nonce']) && wp_verify_nonce($_POST['_style_nonce'], 'pooja_style_meta_nonce')) {
            update_post_meta($post_id, '_marathi_name', sanitize_text_field($_POST['_marathi_name'] ?? ''));
            update_post_meta($post_id, '_english_name', sanitize_text_field($_POST['_english_name'] ?? ''));
            update_post_meta($post_id, '_duration', sanitize_text_field($_POST['_duration'] ?? ''));
            update_post_meta($post_id, '_difficulty', sanitize_text_field($_POST['_difficulty'] ?? ''));
            update_post_meta($post_id, '_pallu_type', sanitize_text_field($_POST['_pallu_type'] ?? ''));
            update_post_meta($post_id, '_pleats_count', sanitize_text_field($_POST['_pleats_count'] ?? ''));
            update_post_meta($post_id, '_key_steps', sanitize_textarea_field($_POST['_key_steps'] ?? ''));
        }

        // Batch
        if (isset($_POST['_batch_nonce']) && wp_verify_nonce($_POST['_batch_nonce'], 'pooja_batch_meta_nonce')) {
            update_post_meta($post_id, '_batch_date', sanitize_text_field($_POST['_batch_date'] ?? ''));
            update_post_meta($post_id, '_batch_time', sanitize_text_field($_POST['_batch_time'] ?? ''));
            update_post_meta($post_id, '_batch_fees', absint($_POST['_batch_fees'] ?? 1500));
            update_post_meta($post_id, '_advance_fee', absint($_POST['_advance_fee'] ?? 500));
            update_post_meta($post_id, '_seats_left', absint($_POST['_seats_left'] ?? 6));
            update_post_meta($post_id, '_batch_status', sanitize_text_field($_POST['_batch_status'] ?? 'open'));
            update_post_meta($post_id, '_venue', sanitize_text_field($_POST['_venue'] ?? ''));
        }

        // Review
        if (isset($_POST['_review_nonce']) && wp_verify_nonce($_POST['_review_nonce'], 'pooja_review_meta_nonce')) {
            update_post_meta($post_id, '_reviewer_name', sanitize_text_field($_POST['_reviewer_name'] ?? ''));
            update_post_meta($post_id, '_reviewer_city', sanitize_text_field($_POST['_reviewer_city'] ?? 'पुणे'));
            update_post_meta($post_id, '_rating', absint($_POST['_rating'] ?? 5));
            update_post_meta($post_id, '_source', sanitize_text_field($_POST['_source'] ?? 'Google Reviews'));
        }

        // Inquiry
        if (isset($_POST['_inquiry_nonce']) && wp_verify_nonce($_POST['_inquiry_nonce'], 'pooja_inquiry_meta_nonce')) {
            update_post_meta($post_id, '_status', sanitize_text_field($_POST['_status'] ?? 'new'));
            update_post_meta($post_id, '_admin_notes', sanitize_text_field($_POST['_admin_notes'] ?? ''));
        }
    }

    /**
     * 7. Custom Column Definitions for Quick List View
     */
    public function style_columns($cols) {
        return [
            'cb'         => $cols['cb'],
            'image'      => 'फोटो',
            'title'      => 'साडी प्रकारचे नाव',
            'taxonomy'   => 'वर्गवारी',
            'difficulty' => 'पातळी',
            'duration'   => 'वेळ',
            'date'       => 'तारीख',
        ];
    }
    public function render_style_column($col, $post_id) {
        if ($col === 'image') {
            $thumb = get_the_post_thumbnail_url($post_id, 'thumbnail');
            if ($thumb) {
                echo '<img src="' . esc_url($thumb) . '" class="pooja-thumb-preview">';
            } else {
                echo '<span style="color:#94a3b8;">—</span>';
            }
        } elseif ($col === 'taxonomy') {
            $terms = get_the_term_list($post_id, 'style_category', '', ', ');
            echo $terms ?: '—';
        } elseif ($col === 'difficulty') {
            echo esc_html(get_post_meta($post_id, '_difficulty', true) ?: 'Intermediate');
        } elseif ($col === 'duration') {
            echo esc_html(get_post_meta($post_id, '_duration', true) ?: '—');
        }
    }

    public function batch_columns($cols) {
        return [
            'cb'     => $cols['cb'],
            'title'  => 'बॅच नाव / दिनांक',
            'date_val' => 'शेड्युल तारीख',
            'timing' => 'वेळ',
            'fees'   => 'फी (₹)',
            'seats'  => 'शिल्लक जागा',
            'status' => 'स्थिती (Status)',
        ];
    }
    public function render_batch_column($col, $post_id) {
        if ($col === 'date_val') {
            echo esc_html(get_post_meta($post_id, '_batch_date', true) ?: '—');
        } elseif ($col === 'timing') {
            echo esc_html(get_post_meta($post_id, '_batch_time', true) ?: '—');
        } elseif ($col === 'fees') {
            echo '₹' . esc_html(get_post_meta($post_id, '_batch_fees', true) ?: '1500');
        } elseif ($col === 'seats') {
            echo esc_html(get_post_meta($post_id, '_seats_left', true) ?: '0') . ' जागा';
        } elseif ($col === 'status') {
            $st = get_post_meta($post_id, '_batch_status', true);
            if ($st === 'open') {
                echo '<span class="pooja-badge pooja-badge-confirmed">नोंदणी सुरू</span>';
            } elseif ($st === 'few_seats') {
                echo '<span class="pooja-badge pooja-badge-contacted">काहीच जागा शिल्लक</span>';
            } elseif ($st === 'full') {
                echo '<span class="pooja-badge pooja-badge-new">हाऊसफुल्ल</span>';
            } else {
                echo '<span class="pooja-badge">पूर्ण</span>';
            }
        }
    }

    public function gallery_columns($cols) {
        return [
            'cb'       => $cols['cb'],
            'image'    => 'फोटो',
            'title'    => 'शीर्षक',
            'category' => 'वर्गवारी',
            'date'     => 'अपलोड तारीख',
        ];
    }
    public function render_gallery_column($col, $post_id) {
        if ($col === 'image') {
            $thumb = get_the_post_thumbnail_url($post_id, 'thumbnail');
            if ($thumb) {
                echo '<img src="' . esc_url($thumb) . '" class="pooja-thumb-preview">';
            }
        } elseif ($col === 'category') {
            echo get_the_term_list($post_id, 'style_category', '', ', ') ?: 'गौरी महालक्ष्मी';
        }
    }

    public function review_columns($cols) {
        return [
            'cb'       => $cols['cb'],
            'title'    => 'विद्यार्थिनीचे नाव',
            'city'     => 'शहर',
            'rating'   => 'रेटिंग',
            'content'  => 'अभिप्राय',
        ];
    }
    public function render_review_column($col, $post_id) {
        if ($col === 'city') {
            echo esc_html(get_post_meta($post_id, '_reviewer_city', true) ?: 'पुणे');
        } elseif ($col === 'rating') {
            $stars = (int) (get_post_meta($post_id, '_rating', true) ?: 5);
            echo str_repeat('⭐', $stars);
        } elseif ($col === 'content') {
            echo esc_html(wp_trim_words(get_the_excerpt($post_id), 12));
        }
    }

    public function inquiry_columns($cols) {
        return [
            'cb'           => $cols['cb'],
            'title'        => 'नाव',
            'phone'        => 'फोन नंबर',
            'workshop'     => 'वर्कशॉप प्रकार',
            'status'       => 'स्थिती',
            'quick_action' => 'WhatsApp',
            'date'         => 'नोंदणी तारीख',
        ];
    }
    public function render_inquiry_column($col, $post_id) {
        $phone = get_post_meta($post_id, '_phone', true);
        if ($col === 'phone') {
            echo esc_html($phone);
        } elseif ($col === 'workshop') {
            echo esc_html(get_post_meta($post_id, '_workshop_type', true));
        } elseif ($col === 'status') {
            $st = get_post_meta($post_id, '_status', true) ?: 'new';
            if ($st === 'new') {
                echo '<span class="pooja-badge pooja-badge-new">नवीन (New)</span>';
            } elseif ($st === 'contacted') {
                echo '<span class="pooja-badge pooja-badge-contacted">संपर्क केला</span>';
            } elseif ($st === 'confirmed') {
                echo '<span class="pooja-badge pooja-badge-confirmed">कन्फर्म</span>';
            } else {
                echo '<span class="pooja-badge">रद्द</span>';
            }
        } elseif ($col === 'quick_action') {
            $clean = preg_replace('/[^0-9]/', '', $phone);
            if (strlen($clean) === 10) $clean = '91' . $clean;
            $link = 'https://wa.me/' . $clean;
            echo '<a href="' . esc_url($link) . '" target="_blank" style="color:#16a34a; font-weight:700; text-decoration:none;">💬 Chat</a>';
        }
    }

    /**
     * 8. Handle Admin Form Saves
     */
    public function handle_save_settings() {
        if (!current_user_can('manage_options')) wp_die('Unauthorized');
        check_admin_referer('pooja_save_site_nonce', '_pooja_site_nonce');

        $raw_highlights = sanitize_textarea_field($_POST['highlights_raw'] ?? '');
        $highlights_arr = array_filter(array_map('trim', explode("\n", $raw_highlights)));

        $new_settings = [
            'workshop_title'   => sanitize_text_field($_POST['workshop_title'] ?? ''),
            'subtitle'         => sanitize_text_field($_POST['subtitle'] ?? ''),
            'instructor'       => sanitize_text_field($_POST['instructor'] ?? ''),
            'description'      => sanitize_textarea_field($_POST['description'] ?? ''),
            'default_date'     => sanitize_text_field($_POST['default_date'] ?? ''),
            'default_time'     => sanitize_text_field($_POST['default_time'] ?? ''),
            'fees'             => absint($_POST['fees'] ?? 1500),
            'advance_fee'      => absint($_POST['advance_fee'] ?? 500),
            'patterns_count'   => sanitize_text_field($_POST['patterns_count'] ?? '14-15 प्रकार'),
            'phone'            => sanitize_text_field($_POST['phone'] ?? '8446917187'),
            'whatsapp'         => sanitize_text_field($_POST['whatsapp'] ?? '8446917187'),
            'address_short'    => sanitize_text_field($_POST['address_short'] ?? ''),
            'address_full'     => sanitize_textarea_field($_POST['address_full'] ?? ''),
            'google_map_url'   => esc_url_raw($_POST['google_map_url'] ?? ''),
            'hero_image'       => esc_url_raw($_POST['hero_image'] ?? ''),
            'highlights'       => !empty($highlights_arr) ? array_values($highlights_arr) : $this->get_default_settings()['highlights'],
        ];

        update_option($this->option_key, $new_settings);
        wp_redirect(admin_url('admin.php?page=pooja-saree-cms&updated=true'));
        exit;
    }

    /**
     * 9. 1-Click Sample Data Seeder: Populates all 14 styles and batches into WP
     */
    public function handle_seed_sample_data() {
        if (!current_user_can('manage_options')) wp_die('Unauthorized');
        check_admin_referer('pooja_seed_nonce', '_pooja_seed_nonce');

        $img_base = 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/';

        $styles = [
            [
                'title'       => 'उभी गौरी साडी ड्रॅपिंग',
                'marathi'     => 'उभी गौरी साडी ड्रॅपिंग',
                'english'     => 'Standing Gauri Pattern',
                'category'    => 'गौरी महालक्ष्मी',
                'desc'        => 'गौरीच्या उभ्या मूर्तीवर किंवा स्टँडवर नेसवली जाणारी अत्यंत डौलदार व व्यवस्थित पिन-अप केलेली पारंपरिक पद्धत.',
                'duration'    => '३० मिनिटे',
                'difficulty'  => 'Intermediate',
                'pallu'       => 'लांब व दुहेरी पदर',
                'pleats'      => '७-८ रेखीव निऱ्या',
                'steps'       => "कमरपट्टी बेस तयार करणे\nनिऱ्यांची अचूक मांडणी\nखांद्यावरील पदर लॉक करणे\nआभूषणे फिक्सिंग",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
            ],
            [
                'title'       => 'बसलेली गौरी साडी ड्रॅपिंग',
                'marathi'     => 'बसलेली गौरी साडी ड्रॅपिंग',
                'english'     => 'Sitting Gauri Pattern',
                'category'    => 'गौरी महालक्ष्मी',
                'desc'        => 'चौरंगावर किंवा पाटावर बसलेल्या गौरीच्या मूर्तीवर निऱ्यांचा पसरट व आकर्षक थाट बसवण्याची खास पद्धत.',
                'duration'    => '३५ मिनिटे',
                'difficulty'  => 'Intermediate',
                'pallu'       => 'पंखा स्टाईल पदर',
                'pleats'      => 'पसरट गोल निऱ्या',
                'steps'       => "बैठक समतोल करणे\nपुढील निऱ्या पंख्यासारख्या पसरवणे\nकंबरबंद सेटिंग\nदागिने व शेला सजवणे",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.19-AM-2.jpeg',
            ],
            [
                'title'       => 'शाही पेशवाई नऊवारी',
                'marathi'     => 'शाही पेशवाई नऊवारी',
                'english'     => 'Peshwai Nauvari Pattern',
                'category'    => 'नऊवारी प्रकार',
                'desc'        => 'महाराष्ट्राच्या ऐतिहासिक संस्कृतीचे प्रतीक असलेली भव्य, उठावदार ओचा आणि डौलदार काष्टा असलेली नऊवारी.',
                'duration'    => '२५ मिनिटे',
                'difficulty'  => 'Advanced',
                'pallu'       => 'शाही डावा पदर',
                'pleats'      => 'मोठ्या पेशवाई निऱ्या',
                'steps'       => "काष्टा काढणे\nमध्यभागी ओचा खोचणे\nमागील काष्टा खोचून पिन करणे\nपायघोळ फिनिशिंग",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.19-AM-1.jpeg',
            ],
            [
                'title'       => 'रुक्मिणी पॅटर्न साडी ड्रेप',
                'marathi'     => 'रुक्मिणी पॅटर्न साडी ड्रेप',
                'english'     => 'Rukmini Traditional Pattern',
                'category'    => 'डिझायनर प्रकार',
                'desc'        => 'पंढरपूरच्या रुक्मिणी मातेच्या मूर्तीवरून प्रेरित अत्यंत सात्विक, मोहक आणि उत्सवी सोहळ्यांसाठी शोभून दिसणारा प्रकार.',
                'duration'    => '२५ मिनिटे',
                'difficulty'  => 'Intermediate',
                'pallu'       => 'उठावदार लांब पदर',
                'pleats'      => '५-६ सरळ निऱ्या',
                'steps'       => "पायाजवळ योग्य घेर ठेवणे\nपदर व्यवस्थित प्लीट करणे\nकंबरपट्टा लावून प्लेट्स बांधणे\nहार व दागिन्यांचे अलाइनमेंट",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.20-AM.jpeg',
            ],
            [
                'title'       => 'ब्राह्मणी नऊवारी साडी',
                'marathi'     => 'ब्राह्मणी नऊवारी साडी',
                'english'     => 'Brahmani Nauvari Draping',
                'category'    => 'नऊवारी प्रकार',
                'desc'        => 'अत्यंत आखीव-रेखीव, सुटसुटीत आणि पारंपरिक पूजेसाठी अत्यंत पवित्र मानली जाणारी काष्टा पद्धत.',
                'duration'    => '२० मिनिटे',
                'difficulty'  => 'Intermediate',
                'pallu'       => 'खांद्यावरून घट्ट पिन केलेला पदर',
                'pleats'      => 'बारीक नाजूक निऱ्या',
                'steps'       => "गाठ बांधणे\nकाष्टा मागे खोचणे\nबारीक निऱ्या काढणे\nपदर पिन-अप करणे",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.20-AM-1.jpeg',
            ],
            [
                'title'       => 'कमल पॅटर्न (Lotus Pleats)',
                'marathi'     => 'कमल पॅटर्न (Lotus Pleats)',
                'english'     => 'Kamal Pattern',
                'category'    => 'डिझायनर प्रकार',
                'desc'        => 'कमळाच्या पाकळ्यांप्रमाणे निऱ्यांची गोलाकार मांडणी करून तयार होणारा अत्यंत मोहक साडी प्रकार.',
                'duration'    => '३० मिनिटे',
                'difficulty'  => 'Advanced',
                'pallu'       => 'शॉर्ट स्लीव्ह पदर',
                'pleats'      => 'पाकळीसारख्या लेअर्स',
                'steps'       => "निऱ्यांचे पाकळी आकारात फोल्डिंग\nसुरक्षित सूक्ष्म पिनिंग\nकमरेवर पाकळ्यांची गोलाकार मांडणी\nस्प्रे फिक्सिंग",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.20-AM-2.jpeg',
            ],
            [
                'title'       => 'अप्सरा पॅटर्न ड्रेपिंग',
                'marathi'     => 'अप्सरा पॅटर्न ड्रेपिंग',
                'english'     => 'Apsara Modern Draping',
                'category'    => 'डिझायनर प्रकार',
                'desc'        => 'फ्लोई पदर, कमरेवर डायगोनल प्लीट्स आणि अत्यंत ग्लॅमरस लुक देणारा आधुनिक पार्टी प्रकार.',
                'duration'    => '२० मिनिटे',
                'difficulty'  => 'Intermediate',
                'pallu'       => 'फ्लोटिंग पदर',
                'pleats'      => 'तिरप्या प्लीट्स',
                'steps'       => "तिरप्या निऱ्या काढणे\nसाइड झिप/पिनने लॉक करणे\nपदर हातावर सोडणे\nस्टाइलिंग",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.21-AM-1.jpeg',
            ],
            [
                'title'       => 'कोल्हापुरी काष्टा नऊवारी',
                'marathi'     => 'कोल्हापुरी काष्टा नऊवारी',
                'english'     => 'Kolhapuri Kashta Nauvari',
                'category'    => 'नऊवारी प्रकार',
                'desc'        => 'महालक्ष्मी अंबाबाईच्या आशीर्वादाने ओळखली जाणारी ऐतिहासिक वीरश्री लूक देणारी मर्दानी नऊवारी.',
                'duration'    => '२५ मिनिटे',
                'difficulty'  => 'Intermediate',
                'pallu'       => 'कडक सरळ पदर',
                'pleats'      => 'घट्ट ओचा निऱ्या',
                'steps'       => "कमरेभोवती फिरवून काष्टा काढणे\nपाय घट्ट बांधणे\nपदराची घडी करणे\nकंबरपट्टा लावणे",
                'image'       => $img_base . 'WhatsApp-Image-2026-09-07-at-12.32.21-AM-2.jpeg',
            ],
        ];

        foreach ($styles as $st) {
            // Check if already exists
            $existing = get_page_by_title($st['title'], OBJECT, 'saree_style');
            if ($existing) continue;

            $post_id = wp_insert_post([
                'post_title'   => $st['title'],
                'post_content' => $st['desc'],
                'post_type'    => 'saree_style',
                'post_status'  => 'publish',
            ]);

            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_marathi_name', $st['marathi']);
                update_post_meta($post_id, '_english_name', $st['english']);
                update_post_meta($post_id, '_duration', $st['duration']);
                update_post_meta($post_id, '_difficulty', $st['difficulty']);
                update_post_meta($post_id, '_pallu_type', $st['pallu']);
                update_post_meta($post_id, '_pleats_count', $st['pleats']);
                update_post_meta($post_id, '_key_steps', $st['steps']);
                update_post_meta($post_id, '_sample_image_url', $st['image']);

                // Assign term
                wp_set_object_terms($post_id, $st['category'], 'style_category');
            }
        }

        // Seed Sample Batches
        $batches = [
            [
                'title'       => 'रविवार स्पेशल बॅच - १ डे वर्कशॉप',
                'date'        => 'दर रविवारी (Upcoming Sunday)',
                'time'        => 'सकाळी ११:०० ते सायंकाळी ५:००',
                'fees'        => 1500,
                'advance'     => 500,
                'seats'       => 6,
                'status'      => 'open',
            ],
            [
                'title'       => 'शनिवार स्पेशल बॅच - नऊवारी मास्टरक्लास',
                'date'        => 'आगामी शनिवार (Upcoming Saturday)',
                'time'        => 'सकाळी १०:३० ते सायंकाळी ४:३०',
                'fees'        => 1500,
                'advance'     => 500,
                'seats'       => 4,
                'status'      => 'few_seats',
            ]
        ];

        foreach ($batches as $b) {
            $existing = get_page_by_title($b['title'], OBJECT, 'workshop_batch');
            if ($existing) continue;

            $b_id = wp_insert_post([
                'post_title'   => $b['title'],
                'post_type'    => 'workshop_batch',
                'post_status'  => 'publish',
            ]);
            if ($b_id && !is_wp_error($b_id)) {
                update_post_meta($b_id, '_batch_date', $b['date']);
                update_post_meta($b_id, '_batch_time', $b['time']);
                update_post_meta($b_id, '_batch_fees', $b['fees']);
                update_post_meta($b_id, '_advance_fee', $b['advance']);
                update_post_meta($b_id, '_seats_left', $b['seats']);
                update_post_meta($b_id, '_batch_status', $b['status']);
                update_post_meta($b_id, '_venue', 'आनंद नगर, सिंहगड रोड, पुणे');
            }
        }

        wp_redirect(admin_url('admin.php?page=pooja-saree-cms&seeded=true'));
        exit;
    }

    /**
     * 10. CORS & Headless REST API Routes
     */
    public function enable_cors_headers() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function($value) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, Accept');
            return $value;
        });
    }

    public function register_rest_routes() {
        // Aggregated endpoint for Next.js (Fastest single request)
        register_rest_route('pooja/v1', '/all-data', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_all_data'],
            'permission_callback' => '__return_true',
        ]);

        // Dedicated endpoint: Workshop
        register_rest_route('pooja/v1', '/workshop', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_workshop'],
            'permission_callback' => '__return_true',
        ]);

        // Dedicated endpoint: Styles
        register_rest_route('pooja/v1', '/styles', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_styles'],
            'permission_callback' => '__return_true',
        ]);

        // Dedicated endpoint: Batches
        register_rest_route('pooja/v1', '/batches', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_batches'],
            'permission_callback' => '__return_true',
        ]);

        // Dedicated endpoint: Reviews
        register_rest_route('pooja/v1', '/reviews', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_reviews'],
            'permission_callback' => '__return_true',
        ]);

        // Dedicated endpoint: Inquiries (POST from frontend)
        register_rest_route('pooja/v1', '/inquiry', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_rest_create_inquiry'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * REST Callback: Aggregated All Data
     */
    public function get_rest_all_data() {
        return rest_ensure_response([
            'status'   => 'success',
            'settings' => $this->get_settings(),
            'styles'   => $this->get_formatted_styles(),
            'batches'  => $this->get_formatted_batches(),
            'reviews'  => $this->get_formatted_reviews(),
            'updated'  => current_time('mysql'),
        ]);
    }

    public function get_rest_workshop() {
        return rest_ensure_response([
            'status' => 'success',
            'data'   => $this->get_settings(),
        ]);
    }

    public function get_rest_styles() {
        return rest_ensure_response([
            'status' => 'success',
            'data'   => $this->get_formatted_styles(),
        ]);
    }

    public function get_rest_batches() {
        return rest_ensure_response([
            'status' => 'success',
            'data'   => $this->get_formatted_batches(),
        ]);
    }

    public function get_rest_reviews() {
        return rest_ensure_response([
            'status' => 'success',
            'data'   => $this->get_formatted_reviews(),
        ]);
    }

    /**
     * REST Callback: Receive Inquiry from Next.js Frontend
     */
    public function handle_rest_create_inquiry($request) {
        $params = $request->get_json_params() ?: $request->get_params();

        $name         = sanitize_text_field($params['name'] ?? '');
        $phone        = sanitize_text_field($params['phone'] ?? '');
        $workshop     = sanitize_text_field($params['workshopType'] ?? '1 डे साडी ड्रॅपिंग वर्कशॉप');
        $participants = sanitize_text_field($params['participants'] ?? '1');
        $message      = sanitize_textarea_field($params['message'] ?? '');

        if (empty($name) || empty($phone)) {
            return new WP_Error('missing_fields', 'नाव आणि मोबाईल नंबर आवश्यक आहे.', ['status' => 400]);
        }

        $post_id = wp_insert_post([
            'post_title'   => $name . ' (' . $phone . ')',
            'post_content' => $message,
            'post_type'    => 'pooja_inquiry',
            'post_status'  => 'publish',
        ]);

        if (is_wp_error($post_id)) {
            return new WP_Error('save_failed', 'माहिती सेव्ह करताना त्रुटी आली.', ['status' => 500]);
        }

        update_post_meta($post_id, '_student_name', $name);
        update_post_meta($post_id, '_phone', $phone);
        update_post_meta($post_id, '_workshop_type', $workshop);
        update_post_meta($post_id, '_participants', $participants);
        update_post_meta($post_id, '_message', $message);
        update_post_meta($post_id, '_status', 'new');
        update_post_meta($post_id, '_source', 'Next.js Frontend');

        return rest_ensure_response([
            'success' => true,
            'lead_id' => $post_id,
            'message' => 'नोंदणी यशस्वीरीत्या प्राप्त झाली.',
        ]);
    }

    /**
     * Helper Methods to fetch formatted data
     */
    public function get_formatted_styles() {
        $posts = get_posts([
            'post_type'      => 'saree_style',
            'posts_per_page' => 100,
            'post_status'    => 'publish',
            'orderby'        => 'menu_order title',
            'order'          => 'ASC',
        ]);

        $styles = [];
        foreach ($posts as $p) {
            $cat_terms = get_the_terms($p->ID, 'style_category');
            $category_name = ($cat_terms && !is_wp_error($cat_terms)) ? $cat_terms[0]->name : 'गौरी महालक्ष्मी';
            $image_url = get_the_post_thumbnail_url($p->ID, 'large') ?: get_post_meta($p->ID, '_sample_image_url', true);

            $steps_raw = get_post_meta($p->ID, '_key_steps', true);
            $steps = array_filter(array_map('trim', explode("\n", (string)$steps_raw)));

            $styles[] = [
                'id'            => $p->ID,
                'nameMarathi'   => get_post_meta($p->ID, '_marathi_name', true) ?: $p->post_title,
                'nameEnglish'   => get_post_meta($p->ID, '_english_name', true) ?: $p->post_name,
                'category'      => $category_name,
                'categoryLabel' => $category_name,
                'description'   => $p->post_content,
                'difficulty'    => get_post_meta($p->ID, '_difficulty', true) ?: 'Intermediate',
                'duration'      => get_post_meta($p->ID, '_duration', true) ?: '२५ मिनिटे',
                'palluType'     => get_post_meta($p->ID, '_pallu_type', true) ?: 'पारंपारिक पदर',
                'pleatsCount'   => get_post_meta($p->ID, '_pleats_count', true) ?: '५-७ निऱ्या',
                'keySteps'      => !empty($steps) ? $steps : ['योग्य घेर मोजणे', 'निऱ्यांची मांडणी', 'पदर पिन करणे'],
                'imageUrl'      => $image_url ?: 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
            ];
        }
        return $styles;
    }

    public function get_formatted_batches() {
        $posts = get_posts([
            'post_type'      => 'workshop_batch',
            'posts_per_page' => 20,
            'post_status'    => 'publish',
            'orderby'        => 'ID',
            'order'          => 'DESC',
        ]);

        $batches = [];
        foreach ($posts as $p) {
            $batches[] = [
                'id'        => $p->ID,
                'title'     => $p->post_title,
                'date'      => get_post_meta($p->ID, '_batch_date', true) ?: 'दर रविवारी',
                'time'      => get_post_meta($p->ID, '_batch_time', true) ?: 'सकाळी ११:०० ते सायंकाळी ५:००',
                'fees'      => (int) (get_post_meta($p->ID, '_batch_fees', true) ?: 1500),
                'advance'   => (int) (get_post_meta($p->ID, '_advance_fee', true) ?: 500),
                'seatsLeft' => (int) (get_post_meta($p->ID, '_seats_left', true) ?: 6),
                'status'    => get_post_meta($p->ID, '_batch_status', true) ?: 'open',
                'venue'     => get_post_meta($p->ID, '_venue', true) ?: 'आनंद नगर, सिंहगड रोड, पुणे',
            ];
        }
        return $batches;
    }

    public function get_formatted_reviews() {
        $posts = get_posts([
            'post_type'      => 'pooja_review',
            'posts_per_page' => 50,
            'post_status'    => 'publish',
            'orderby'        => 'ID',
            'order'          => 'DESC',
        ]);

        $reviews = [];
        foreach ($posts as $p) {
            $reviews[] = [
                'id'      => $p->ID,
                'name'    => get_post_meta($p->ID, '_reviewer_name', true) ?: $p->post_title,
                'city'    => get_post_meta($p->ID, '_reviewer_city', true) ?: 'पुणे',
                'rating'  => (int) (get_post_meta($p->ID, '_rating', true) ?: 5),
                'text'    => $p->post_content,
                'source'  => get_post_meta($p->ID, '_source', true) ?: 'Google Reviews',
                'date'    => get_the_date('M Y', $p->ID),
            ];
        }
        return $reviews;
    }
}

// Initialize Plugin
PoojaSareeDrapingCompleteCMS::get_instance();
