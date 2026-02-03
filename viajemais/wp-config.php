<?php

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u183147815_Vjv7O' );

/** Database username */
define( 'DB_USER', 'u183147815_mbcyJ' );

/** Database password */
define( 'DB_PASSWORD', 'tBddVLS4hEY3RGer' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'VL0u_Z.O~3CYNv9<g|rmT31*m!bP_h-Gf2T9!v?Z+OwiPDfZkECBO,f[-%1%R/n}' );
define( 'SECURE_AUTH_KEY',   'n@LGcXx#YCCh|>Zzdf!]yRD2~Jwp{FK[9C9G|(4r%z,!tPl&32-1i>r(h&V9my%+' );
define( 'LOGGED_IN_KEY',     '+.SX76(k#l7t|q}S{qMw3G(9y(x,:+;f(A.lgH-3t=MZxl|92|e0uGjb,*ZXHtYU' );
define( 'NONCE_KEY',         ',WcCIY?vnzzGS:~#5LmrZ5ENY#+<<3}Z9kb23uMz;wXDY1%(CUVHEY5KfW$NE!.o' );
define( 'AUTH_SALT',         'g8Mm{a1$tQ.?(?j0NnKzACf21=9|OjVS=CU>+IWA8IyKT{<3Il^?}4O8>/Y 8[E2' );
define( 'SECURE_AUTH_SALT',  '.)Y7//3dfQP[<FtkG/Ae0M$MgHZ!&7`?qXdW#0n+rC)2e9.V20> i3%44=lc,_;e' );
define( 'LOGGED_IN_SALT',    ';FwI`612DV!:LKn</`k{#/v}WNZ*%58K9Sxqt:NIB.I+RC:T8*-5EqJHs:@CV8Nv' );
define( 'NONCE_SALT',        'kOLse[0eaQ3y,w?[>fr}o]tqj>Y2w[|zKPL1ajr}`n5`;^+o`-9-p+b@e6S){+_R' );
define( 'WP_CACHE_KEY_SALT', '%m<26Objn_gr-vlH<)6k k<x0pI<@^AaSqHlZ^/hYrak(Bz0a+)Te9u)w4ZLO=S?' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', 'babd939aafca80bd812566ca048e31ed' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
define( 'WP_MEMORY_LIMIT', '1024M' );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
