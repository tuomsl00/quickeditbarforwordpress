<?php
/**
 * Plugin Name: Quick wysiwyg edit bar
 * Plugin URI: https://github.com/tuomsl00/quickeditbarforwordpress
 * Description: Adds quick wysiwyg properties with edit bar
 * Version: 0.1.0
 * Author: Tuomo Osola
 * Author URI: https://www.linkedin.com/in/tuomo-osola-2816aa138/
 */

class Main {

    private $sid;

    function __construct() {
        add_action( 'wp_enqueue_scripts', array($this, 'enqueue_scripts' ));

        remove_filter('the_content','wpautop');
        remove_filter('the_excerpt','wpautop');

        add_filter( 'the_content', array($this, 'new_content'));
        add_filter( 'the_title' , array($this, 'new_title'));
        add_filter( 'the_excerpt', array($this, 'new_excerpt'));

        add_action( 'wp_head', array($this, 'save_edit'));
        add_action( 'wp_footer', array($this, 'editor_interface'));

        add_action( 'admin_bar_menu', array($this, 'modify_admin_bar'), 999 );

        $this->sid = 0;

    }

    public function enqueue_scripts() {
        wp_enqueue_style( 'style', plugins_url( 'style.css', __FILE__ ) ); 
        wp_enqueue_script('mobx', 'https://unpkg.com/mobx@2.4.3/lib/mobx.umd.min.js', array(), null, true);
        wp_enqueue_script('react', 'https://unpkg.com/react@16/umd/react.development.js', array(), null, true);
        wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@16/umd/react-dom.development.js', array(), null, true);
        wp_enqueue_script('babel', 'https://unpkg.com/babel-standalone@6/babel.min.js', array(), null, true);

        wp_enqueue_script('rtest', plugins_url( 'index.jsx', __FILE__ ), array(), false, true);

        wp_localize_script('rtest', 'saveEdit', array('homeUrl' => esc_url( home_url( '/' ) )));

        add_filter( 'script_loader_tag', array($this, 'handle_scripts'), 10, 3 );

    }

    public function handle_scripts($tag, $handle, $src) {
       //  '<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>';
        if ($handle == "react" || $handle == "react-dom" || $handle == "babel") {
            $tag = '<script crossorigin src="'.esc_url($src).'"></script>';
        }
    
        if ($handle == "rtest") {
            $tag = '
                <script type="text/babel" src="'.plugins_url( 'Actions.jsx', __FILE__ ).'"></script>
                <script type="text/babel" src="'.plugins_url( 'index.jsx', __FILE__ ).'"></script>
            ';
        }

        return $tag;
    }

    public function subid() {
        return $this->sid++;
    }

    public function new_content($content) {
        if (!is_admin()) {
            global $post; 
            $postid = $post->ID;
            return "<p contentEditable=\"true\" id=\"edit".$postid."_".$this->subid()."\" name=\"content\">".$content."</p>";
        }
        return $content;
    }

    public function new_title($title) {

        if (!is_admin()) {
            foreach(get_post_types( '', 'names') as $post_type) {
                $post = get_page_by_title( $title, '', $post_type );
                $postid = $post->ID;
                if ($postid != "")
                    return "<span contentEditable=\"true\" id=\"edit".$postid."_".$this->subid()."\" name=\"title\">".$title."</span>";
            }
        }
        return $title;
    }

    public function new_excerpt($content) {
        return "<p id=\"excerpt\">".$content."</p>";
    }

    public function editor_interface() {
        echo '<div id="editbar"></div>';
    }

    public function modify_admin_bar( $wp_admin_bar ){
        if (!is_admin()) {
            $wp_admin_bar->add_node( array(
                'id'		=> 'editmode',
                'title' => '<span id="edit-toggle-text">Edit mode</span>',
            ) );
        }
      }

    public function save_edit() {
        $id = $_POST['id'];
        $content = $_POST['content'];
        $title = $_POST['title'];
        if (is_numeric($id) && $_POST['sign'] == "Wysiwyg edit bar") {
            if ($content) {
                $post = array('ID' => $id, 'post_content' => $content);
             }
             if ($title) {
                 $post = array('ID' => $id, 'post_title' => $title);
            }
            wp_update_post( $post );
            exit();
        }     
    }

}

function start() {
    if ( is_admin_bar_showing() ) {
        $start = new Main();
    }
}

add_action('init', 'start');

?>
