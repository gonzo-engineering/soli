import { form } from '$app/server';
import { API_BASE, DASHBOARD_BASE } from '$lib/config';
import * as z from 'zod';

const LabelDetailsForm = z.object({
	labelId: z.string(),
	labelName: z.string().min(1),
	labelImageNew: z.instanceof(File).optional(),
	labelDescription: z.string().max(1000).optional(),
	labelWebsite: z.string().optional(),
	labelLinks: z.string().optional()
});

export const updateLabelDetails = form(LabelDetailsForm, async (data) => {
	const formData = new FormData();
	if (data.labelImageNew) {
		formData.append('labelImageNew', data.labelImageNew);
	}
	formData.append('labelName', data.labelName);
	formData.append('labelId', data.labelId);
	formData.append('labelDescription', data.labelDescription || '');
	formData.append('labelWebsite', data.labelWebsite || '');
	formData.append('labelLinks', data.labelLinks || '[]');
	await fetch(`${API_BASE}/labels/${data.labelId}`, {
		method: 'PATCH',
		headers: { origin: DASHBOARD_BASE },
		body: formData
	});
});
