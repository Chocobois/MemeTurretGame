import { Image, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Image[] = [
	// Backgrounds
	image('backgrounds/background', 'background'),
	image('backgrounds/bkg_test', 'bkg_test'),
	image('backgrounds/upgrade_page', 'upgrade_page'),
	image('backgrounds/widgets_0', 'widgets_0'),
	image('backgrounds/widgets_1', 'widgets_1'),
	image('backgrounds/widgets_2', 'widgets_2'),
	image('backgrounds/widgets_3', 'widgets_3'),
	image('backgrounds/widgets_4', 'widgets_4'),
	image('backgrounds/1-0', '1-0'),
	image('backgrounds/1-1', '1-1'),
	image('backgrounds/1-2', '1-2'),
	image('backgrounds/1-3', '1-3'),
	image('backgrounds/blank_bkg', 'blank_bkg'),


	// Characters
	image('characters/player', 'player'),
	image('characters/enemy_1', 'enemy_1'),
	image('characters/enemy_2', 'enemy_2'),
	image('characters/enemy_3', 'enemy_3'),
	image('characters/enemy_4', 'enemy_4'),
	image('characters/bullet_1', 'bullet_1'),
	image('characters/missile', 'missile'),
	image('characters/blank', 'blank'),
	image('characters/flak', 'flak'),
	image('characters/purple_bullet', 'purple_bullet'),
	image('characters/small_bullet', 'small_bullet'),
	image('characters/green_bullet', 'green_bullet'),

	// Items
	image('items/coin', 'coin'),
	image('items/red', 'red'),
	image('items/blue', 'blue'),
	image('items/gold', 'gold'),
	image('items/rainbow', 'rainbow'),
	image('items/gray', 'gray'),
	image('items/next_scene_button', 'next_scene_button'),

	// UI
	image('ui/hud', 'hud'),
	image('ui/lives_bar', 'lives_bar'),

	// Titlescreen
	image('titlescreen/sky', 'title_sky'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/character', 'title_character'),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("sprites/turretbase", "turretbase", 256, 256),
	spritesheet("sprites/gun_1", "gun_1", 256, 256),
	spritesheet("sprites/enemy_5", "enemy_5", 256, 256),
	spritesheet("sprites/next_button", "next_button", 256, 256),
	//spritesheet("sprites/bullet_1", "bullet_1", 128, 128),
	spritesheet("effects/flash", "flash", 128, 128),
	spritesheet("effects/hit_spark", "hit_spark", 128, 128),
	spritesheet("effects/meme_explosion", "meme_explosion", 200, 282),
	spritesheet("effects/explosion_orange", "explosion_orange", 256, 256),
	spritesheet("effects/explosion_tiny", "explosion_tiny", 512, 512),
	spritesheet("effects/bad_fire", "bad_fire", 512, 512),
	spritesheet("effects/blue_sparkle", "blue_sparkle", 256, 256),
	spritesheet("effects/gray_magic", "gray_magic", 128, 128),
	spritesheet("effects/red_magic", "red_magic", 128, 128),
	spritesheet("effects/blue_magic", "blue_magic", 128, 128),
	spritesheet("effects/gold_magic", "gold_magic", 128, 128),
	spritesheet("effects/rainbow_magic", "rainbow_magic", 128, 128),

];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	music('st1', 'm_st1'),
	music('st2', 'm_st2'),
	sound('tree/rustle', 't_rustle', 0.5),
	sound('tree/siren', 'siren', 0.8),
	sound('tree/shot_1', 'shot_1', 0.25),
	sound('tree/hit_1', 'hit_1', 0.25),
	sound('tree/turret_dead', 'turret_dead', 0.25),
	sound('tree/dead_1', 'dead_1', 0.25),
	sound('tree/dead_2', 'dead_2', 0.25),
	sound('tree/dead_3', 'dead_3', 0.25),
	sound('tree/dead_4', 'dead_4', 0.25),
	sound('tree/dead_5', 'dead_5', 0.25),
	sound('tree/hit_pierce', 'hit_pierce', 0.25),
	sound('tree/spawn', 'spawn', 0.25),
	sound('tree/machinegun', 'machinegun', 0.25),
	sound('tree/missile_sound', 'missile_sound', 0.25),
	sound('tree/meme_explosion_sound', 'meme_explosion_sound', 0.25),
	sound('tree/crit', 'crit', 0.25),
	sound('tree/bigfire', 'bigfire', 0.25),
	sound('tree/onhit', 'onhit', 0.25),
	sound('tree/scroll', 'scroll', 0.25),
	sound('tree/place', 'place', 0.25),
	sound('tree/turret_hit', 'turret_hit', 0.25),
	sound('tree/escape', 'escape', 0.25),
	sound('tree/big_gun_1', 'big_gun_1', 0.25),
];

/* Fonts */
await loadFont('DynaPuff-Medium', 'Game Font');

export {
	images,
	spritesheets,
	audios
};