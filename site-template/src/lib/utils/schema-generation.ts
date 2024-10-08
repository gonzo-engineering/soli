import type { GigDetails } from '$lib/interfaces/gigs';
import type { Release } from '$lib/interfaces/releases';
import { artistDetails } from '../../data/info/artist';

export const generateReleaseSchema = (release: Release) => {
	return {
		'@context': 'https://schema.org',
		'@type': 'MusicAlbum',
		name: release.name,
		description: release.description,
		genre: 'Rock',
		byArtist: {
			'@type': 'MusicGroup',
			name: artistDetails.name
		},
		image: `${artistDetails.websiteUrl}/artwork/${release.artwork.front}`,
		datePublished: release.releaseDate,
		numTracks: release.tracks.length,
		track: release.tracks.map((track) => ({
			'@type': 'MusicRecording',
			name: track.name,
			duration: `PT${track.durationInSeconds}S`,
			byArtist: {
				'@type': 'MusicGroup',
				name: artistDetails.name
			},
			inAlbum: release.name
		}))
	};
};

export const generateGigSchema = (gig: GigDetails) => {
	return {
		'@context': 'https://schema.org',
		'@type': 'MusicEvent',
		name: gig.venue,
		location: {
			'@type': 'MusicVenue',
			name: gig.venue,
			address: gig.address
		},
		startDate: gig.dateTimeStart,
		url: gig.ticketLink
	};
};
