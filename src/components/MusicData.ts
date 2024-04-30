const overlap = 2;

const Data = {
	m_main_menu: {
		offset: 0.424,
		bpm: 60,
	},
	m_first: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_draw: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_end: {
		offset: 0,
		bpm: 0,
		loop: false,
	},
	m_shop: {
		offset: 41860 / 48000,
		bpm: 86,
		loop: true,
		start: 41860 / 48000 + overlap,
		end: 2854884 / 48000 + overlap,
	},
	m_st1: {
		offset: 0.4,
		bpm: 120,
		loop: true,
	},
	m_st2: {
		offset: 0.4,
		bpm: 120,
		loop: true,
	},
	m_final2: {
		offset: 2433184 / 48000,
		bpm: 140,
		loop: true,
		start: 21.574,
		end: 276.750,
	},
	m_final3: {
		offset: 2433184 / 48000,
		bpm: 144,
		loop: true,
		start: 55.174,
		end: 271.885,
	},
};

export type MusicKey = keyof typeof Data;
export type MusicDataType = {
	[K in MusicKey]: {
		offset: number;
		bpm: number;
		loop: boolean;
		start: number;
		end: number;
	};
};

export default Data as MusicDataType;
