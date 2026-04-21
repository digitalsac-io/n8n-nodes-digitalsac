import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DigitalsacApi implements ICredentialType {
	name = 'digitalsacApi';
	displayName = 'Digitalsac Izing Pro API';
	documentationUrl = 'https://github.com/digitalsac-io/n8n-nodes-digitalsac#readme';
	icon = 'file:digitalsac.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://example.digitalsac.io',
			placeholder: 'https://yourdomain.digitalsac.com.br',
			description: 'Base URL of your Digitalsac instance',
			required: true,
		},
		{
			displayName: 'Bearer Token',
			name: 'token',
			type: 'string',
			default: '',
			typeOptions: { password: true },
			description: 'API Bearer token issued by Digitalsac',
			required: true,
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
			url: '/typebot/listar_filas',
			method: 'GET',
		},
	};
}
