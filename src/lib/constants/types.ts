import HiphopImg from '$lib/assets/musicType/hiphop.svg';
import ChillImg from '$lib/assets/musicType/chill.svg';
import AnimeImg from '$lib/assets/musicType/anime.svg';
import ClassicalImg from '$lib/assets/musicType/classical.svg';
import CountryImg from '$lib/assets/musicType/country.svg';
import LofiImg from '$lib/assets/musicType/lofi.svg';
import RockImg from '$lib/assets/musicType/rock.svg';
import SoulImg from '$lib/assets/musicType/soul.svg';
import WorkingImg from '$lib/assets/musicType/working.svg';
import PopImg from '$lib/assets/musicType/pop.svg';
import FunkImg from '$lib/assets/musicType/funk.svg';
import IndieImg from '$lib/assets/musicType/indie.svg';

export const SESSION_MUSIC_TYPES = [
	{
		name: 'Chill',
		img: ChillImg
	},
	{
		name: 'Hiphop',
		img: HiphopImg
	},
	{
		name: 'Anime',
		img: AnimeImg
	},
	{
		name: 'Classical',
		img: ClassicalImg
	},
	{
		name: 'Country',
		img: CountryImg
	},
	{
		name: 'Lo-Fi',
		img: LofiImg
	},
	{
		name: 'Rock',
		img: RockImg
	},
	{
		name: 'Pop',
		img: PopImg
	},
	{
		name: 'Focus',
		img: WorkingImg
	},
	{
		name: 'Soul',
		img: SoulImg
	},
	{
		name: 'Funk',
		img: FunkImg
	},
	{
		name: 'Indie',
		img: IndieImg
	}
].sort((a, b) => a.name.localeCompare(b.name));
