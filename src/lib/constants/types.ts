import HiphopImg from '$assets/musicType/hiphop.svg';
import ChillImg from '$assets/musicType/chill.svg';
import AnimeImg from '$assets/musicType/anime.svg';
import ClassicalImg from '$assets/musicType/classical.svg';
import CountryImg from '$assets/musicType/country.svg';
import LofiImg from '$assets/musicType/lofi.svg';
import RockImg from '$assets/musicType/rock.svg';
import SoulImg from '$assets/musicType/soul.svg';
import WorkingImg from '$assets/musicType/working.svg';
import PopImg from '$assets/musicType/pop.svg';
import FunkImg from '$assets/musicType/funk.svg';
import IndieImg from '$assets/musicType/indie.svg';

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
