import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
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
			typeOptions: { password: true },
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.token}}',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/version',
			method: 'GET',
		},
	};
}
