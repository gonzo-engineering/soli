import { form, query } from "$app/server";
import { API_BASE, DOMAIN_BASE, REQUEST_HEADER_BOILERPLATE } from "$lib/config";
import * as z from "zod";

const AddReleaseForm = z.object({
  artistId: z.string(),
  releaseArtwork: z.instanceof(File),
  releaseName: z.string().min(1),
  releaseType: z.enum(["album", "ep", "single"]),
  releaseDate: z.string(),
  releaseGenres: z.array(z.string()).optional(),
});

const UploadTrackForm = z.object({
  file: z.instanceof(File),
  artistId: z.string(),
  title: z.string().min(1),
  artistName: z.string().min(1),
  artistGroup: z.string().optional(),
});

const AddTrackToReleaseForm = z.object({
  releaseId: z.string(),
  trackId: z.string(),
  trackNumber: z.number(),
});

export const addRelease = form(AddReleaseForm, async (data) => {
  const formData = new FormData();
  formData.append("artistId", data.artistId);
  formData.append("releaseArtwork", data.releaseArtwork);
  formData.append("releaseName", data.releaseName);
  formData.append("releaseType", data.releaseType);
  if (data.releaseDate) {
    formData.append("releaseDate", data.releaseDate);
  }
  await fetch(`${API_BASE}/releases`, {
    method: "POST",
    headers: {
      origin: DOMAIN_BASE,
    },
    body: formData,
  });
});

export const uploadTrack = form(UploadTrackForm, async (data) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("artistId", data.artistId);
  formData.append("title", data.title);
  formData.append("artistName", data.artistName);
  if (data.artistGroup) {
    formData.append("artistGroup", data.artistGroup);
  }
  await fetch(`${API_BASE}/tracks`, {
    method: "POST",
    headers: {
      origin: DOMAIN_BASE,
    },
    body: formData,
  });
});

export const addTrackToRelease = form(AddTrackToReleaseForm, async (data) => {
  await fetch(`${API_BASE}/tracks`, {
    method: "PATCH",
    headers: REQUEST_HEADER_BOILERPLATE,
    body: JSON.stringify(data),
  });
});

export const deleteTrack = query(z.string(), async (trackId) => {
  await fetch(`${API_BASE}/tracks/${trackId}`, {
    method: "DELETE",
    headers: REQUEST_HEADER_BOILERPLATE,
  });
});

export const deleteRelease = query(z.string(), async (releaseId) => {
  await fetch(`${API_BASE}/releases/${releaseId}`, {
    method: "DELETE",
    headers: REQUEST_HEADER_BOILERPLATE,
  });
});
