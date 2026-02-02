import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

export class DigitalsacApi implements ICredentialType {
	name = 'digitalsacApi';
	displayName = 'Izing Pro Digitalsac API';
	documentationUrl = '';
	properties = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string' as NodePropertyTypes,
			default: 'https://example.digitalsac.io',
			description: 'Ex: https://seudominio.digitalsac.com.br',
		},
		{
			displayName: 'Bearer Token',
			name: 'token',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
} 