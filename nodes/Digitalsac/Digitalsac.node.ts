import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IDataObject,
	IBinaryKeyData,
} from 'n8n-workflow';

export class Digitalsac implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Digitalsac Izing Pro',
		name: 'digitalsac',
		icon: 'file:digitalsac.svg',
		group: ['transform'],
		version: 1,
		description: 'Interage com a API do Digitalsac',
		defaults: {
			name: 'Digitalsac',
		},
		inputs: <NodeConnectionType[]>['main'],
		outputs: <NodeConnectionType[]>['main'],
		
		credentials: [
			{
				name: 'digitalsacApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operação',
				name: 'operation',
				type: 'options',
				options: [
					{ name: 'Validar WhatsApp', value: 'validateWhatsapp' },
					{ name: 'Validar CPF', value: 'validateCpf' },
					{ name: 'Validar Data', value: 'validateDate' },
					{ name: 'Listar Filas', value: 'listQueues' },
					{ name: 'Listar Atendentes', value: 'listAgents' },
					{ name: 'Transferir para Fila', value: 'transferQueue' },
					{ name: 'Transferir para Atendente', value: 'transferAgent' },
					{ name: 'Fechar Ticket', value: 'closeTicket' },
				{ name: 'Enviar Mensagem', value: 'sendMessage' },
				{ name: 'Enviar Botões', value: 'sendButtons' },
				{ name: 'Enviar Lista', value: 'sendList' },
				{ name: 'Enviar Mídia com Caption', value: 'sendMediaCaption' },
					{ name: 'Enviar Base64', value: 'sendBase64' },
					{ name: 'Listar Tags', value: 'listTags' },
					{ name: 'Vincular Tag', value: 'linkTag' },
					{ name: 'Criar Tag', value: 'createTag' },
					{ name: 'Listar Kanbans', value: 'listKanbans' },
					{ name: 'Vincular Kanban', value: 'linkKanban' },
					{ name: 'Listar Carteiras', value: 'listCarteiras' },
					{ name: 'Vincular Carteira', value: 'linkCarteira' },
					// Agendamento
					{ name: 'Listar Serviços', value: 'listServices' },
					{ name: 'Listar Usuários Disponíveis', value: 'listAvailableUsers' },
					{ name: 'Listar Horários Disponíveis', value: 'listAvailableSlots' },
					{ name: 'Listar Agendamentos', value: 'listSchedules' },
				{ name: 'Criar Agendamento', value: 'createSchedule' },
				{ name: 'Cancelar Agendamento', value: 'cancelSchedule' },
				{ name: 'Gerar Link do Calendário (.ics)', value: 'calendarLink' },
				// Templates WABA
				{ name: 'Listar Templates WABA', value: 'listWabaTemplates' },
				{ name: 'Enviar Template WABA', value: 'sendWabaTemplate' },
			],
			default: 'validateWhatsapp',
		},
			{
				displayName: 'Parâmetro',
				name: 'param',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['validateWhatsapp', 'validateCpf', 'sendMessage', 'sendButtons', 'sendList', 'sendMediaCaption', 'sendBase64'],
					},
				},
				description: 'Número, CPF ou UUID da conexão (conforme operação)',
			},
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'number',
			default: 1,
			displayOptions: {
				show: {
					operation: ['listKanbans'],
				},
			},
			description: 'ID do usuário para listar kanbans',
		},
		{
			displayName: 'Formato de Resposta',
			name: 'agentsFormat',
			type: 'options',
			options: [
				{ name: 'JSON Completo (Recomendado)', value: 'json' },
				{ name: 'Texto Formatado (Compatibilidade)', value: 'string' },
			],
			default: 'json',
			displayOptions: {
				show: {
					operation: ['listAgents'],
				},
			},
			description: 'Formato de retorno: JSON completo com todos os campos (id, name, email, phoneNumber, status, profile, isOnline, isActive, isMaster) ou texto formatado para compatibilidade',
		},
			{
				displayName: 'Corpo da Mensagem',
				name: 'messageBody',
				type: 'string',
				default: 'Mensagem de teste',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				description: 'Texto da mensagem a ser enviada',
			},
			{
				displayName: 'Número de Telefone',
				name: 'phoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				description: 'Número de telefone no formato DDI+DDD+Número (ex: 5511999999999)',
			},
			{
				displayName: 'Chave Externa',
				name: 'externalKey',
				type: 'string',
				default: 'Digitalsac123',
				displayOptions: {
					show: {
						operation: ['sendMessage', 'sendButtons', 'sendList', 'sendMediaCaption', 'sendBase64'],
					},
				},
				description: 'Identificador único opcional para a mensagem',
			},
			// Campos para Enviar Botões
			{
				displayName: 'Título',
				name: 'buttonTitle',
				type: 'string',
				default: 'Escolha uma opção',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Título do conjunto de botões',
			},
			{
				displayName: 'Corpo da Mensagem',
				name: 'buttonBody',
				type: 'string',
				default: 'Clique em uma das opções abaixo:',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Corpo da mensagem com botões',
			},
			{
				displayName: 'Número de Telefone',
				name: 'buttonPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Número de telefone no formato DDI+DDD+Número',
			},
			{
				displayName: 'Botões (JSON)',
				name: 'buttonsData',
				type: 'json',
				default: '[\n  {\n    "tipo": {"label": "Resposta Rápida", "value": "quick_reply"},\n    "display_text": "Sim",\n    "conteudo": "sim"\n  },\n  {\n    "tipo": {"label": "URL", "value": "url"},\n    "display_text": "Visitar Site",\n    "conteudo": "https://exemplo.com"\n  }\n]',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Array de botões em formato JSON',
			},
			// Campos para Enviar Lista
			{
				displayName: 'Título',
				name: 'listTitle',
				type: 'string',
				default: 'Menu de Opções',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Título da lista',
			},
			{
				displayName: 'Texto',
				name: 'listText',
				type: 'string',
				default: 'Escolha uma categoria:',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Texto da lista',
			},
			{
				displayName: 'Texto do Botão',
				name: 'listButtonText',
				type: 'string',
				default: 'Ver Opções',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Texto do botão para abrir a lista',
			},
			{
				displayName: 'Rodapé',
				name: 'listFooter',
				type: 'string',
				default: 'Powered by DigitalSac',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Rodapé da lista',
			},
			{
				displayName: 'Número de Telefone',
				name: 'listPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Número de telefone no formato DDI+DDD+Número',
			},
			{
				displayName: 'Seções (JSON)',
				name: 'sectionsData',
				type: 'json',
				default: '[\n  {\n    "title": "Produtos",\n    "lines": [\n      {\n        "title": "Produto A",\n        "description": "Descrição do produto A",\n        "rowId": 1\n      }\n    ]\n  }\n]',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Array de seções da lista em formato JSON',
			},
			// Campos para Enviar Mídia com Caption
			{
				displayName: 'Caption',
				name: 'mediaCaption',
				type: 'string',
				default: 'Arquivo enviado via API',
				displayOptions: {
					show: {
						operation: ['sendMediaCaption'],
					},
				},
				description: 'Legenda do arquivo',
			},
			{
				displayName: 'Número de Telefone',
				name: 'mediaCaptionPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendMediaCaption'],
					},
				},
				description: 'Número de telefone no formato DDI+DDD+Número',
			},
			// Campos para Enviar Base64
			{
				displayName: 'Caption (Opcional)',
				name: 'base64Caption',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'Legenda opcional do arquivo',
			},
			{
				displayName: 'Número de Telefone',
				name: 'base64PhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'Número de telefone no formato DDI+DDD+Número',
			},
			{
				displayName: 'Arquivo Base64',
				name: 'mediaBase64',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'Arquivo codificado em base64',
			},
			{
				displayName: 'Tipo MIME',
				name: 'mimeType',
				type: 'string',
				default: 'image/png',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'Tipo MIME do arquivo (ex: image/png, application/pdf)',
			},
			{
				displayName: 'Nome do Arquivo',
				name: 'fileName',
				type: 'string',
				default: 'arquivo.png',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'Nome do arquivo com extensão',
			},
			{
				displayName: 'Nome da Tag',
				name: 'tagName',
				type: 'string',
				default: 'Nova Tag',
				displayOptions: {
					show: {
						operation: ['createTag'],
					},
				},
				description: 'Nome da tag a ser criada',
			},
			{
				displayName: 'Cor da Tag',
				name: 'tagColor',
				type: 'string',
				default: '#2196F3',
				displayOptions: {
					show: {
						operation: ['createTag'],
					},
				},
				description: 'Cor da tag em formato hexadecimal (ex: #FF5733, #2196F3, #4CAF50)',
			},
			{
				displayName: 'Dados (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"data": "2024-01-15"}',
				displayOptions: {
					show: {
						operation: ['validateDate'],
					},
				},
				description: 'Data a ser validada no formato JSON',
			},
			{
				displayName: 'Dados (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "queueId": 1}',
				displayOptions: {
					show: {
						operation: ['transferQueue'],
					},
				},
				description: 'ID do ticket e ID da fila de destino',
			},
			{
				displayName: 'Dados (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "userId": 1}',
				displayOptions: {
					show: {
						operation: ['transferAgent'],
					},
				},
				description: 'ID do ticket e ID do atendente de destino',
			},
			{
				displayName: 'Dados (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123}',
				displayOptions: {
					show: {
						operation: ['closeTicket'],
					},
				},
				description: 'ID do ticket a ser fechado',
			},
			{
				displayName: 'Dados (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "tagId": 456}',
				displayOptions: {
					show: {
						operation: ['linkTag'],
					},
				},
				description: 'ID do ticket e ID da tag a ser vinculada',
			},
			{
				displayName: 'Dados (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "kanbanId": 456, "userId": 789}',
				displayOptions: {
					show: {
						operation: ['linkKanban'],
					},
				},
				description: 'ID do ticket, ID do kanban e ID do usuário',
			},
			{
				displayName: 'Dados (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "userId": 456}',
				displayOptions: {
					show: {
						operation: ['linkCarteira'],
					},
				},
				description: 'ID do ticket e ID do usuário da carteira',
			},
			// Campos para Agendamento
			{
				displayName: 'ID do Usuário',
				name: 'scheduleUserId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['listServices'],
					},
				},
				description: 'ID do usuário para filtrar serviços (opcional)',
			},
			{
				displayName: 'ID do Serviço',
				name: 'serviceId',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: ['listAvailableUsers', 'listAvailableSlots', 'createSchedule'],
					},
				},
				description: 'ID do serviço',
			},
			{
				displayName: 'Data',
				name: 'scheduleDate',
				type: 'string',
				default: '',
				placeholder: '2025-08-07',
				displayOptions: {
					show: {
						operation: ['listAvailableUsers', 'listAvailableSlots', 'createSchedule'],
					},
				},
				description: 'Data no formato YYYY-MM-DD',
			},
			{
				displayName: 'Horário',
				name: 'scheduleTime',
				type: 'string',
				default: '',
				placeholder: '09:00',
				displayOptions: {
					show: {
						operation: ['listAvailableUsers', 'createSchedule'],
					},
				},
				description: 'Horário no formato HH:mm (opcional para listar usuários)',
			},
			{
				displayName: 'ID do Usuário',
				name: 'scheduleAttendantId',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: ['listAvailableSlots', 'createSchedule'],
					},
				},
				description: 'ID do atendente/usuário',
			},
			{
				displayName: 'Nome do Contato',
				name: 'contactName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Nome do cliente/contato',
			},
			{
				displayName: 'Telefone do Contato',
				name: 'contactPhone',
				type: 'string',
				default: '',
				placeholder: '5511999999999',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Telefone do cliente/contato',
			},
			{
				displayName: 'Observações',
				name: 'scheduleNotes',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Observações sobre o agendamento (opcional)',
			},
			{
				displayName: 'ID da Conexão WhatsApp',
				name: 'whatsappId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'ID da conexão WhatsApp (opcional - usa primeira disponível se não informado)',
			},
			{
				displayName: 'Mensagem Personalizada',
				name: 'customMessage',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Mensagem personalizada do agendamento (opcional)',
			},
			{
				displayName: 'Lembretes (minutos)',
				name: 'reminders',
				type: 'string',
				default: '60,240',
				placeholder: '60,240,1440',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Lembretes em minutos antes do agendamento (separados por vírgula)',
			},
			{
				displayName: 'Duração do Intervalo (minutos)',
				name: 'intervalDuration',
				type: 'number',
				default: 30,
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Duração do intervalo em minutos',
			},
			{
				displayName: 'Fechar Ticket',
				name: 'closeTicket',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Se deve fechar o ticket após criar agendamento',
			},
			{
				displayName: 'Data',
				name: 'listScheduleDate',
				type: 'string',
				default: '',
				placeholder: '2025-08-08',
				displayOptions: {
					show: {
						operation: ['listSchedules'],
					},
				},
				description: 'Data no formato YYYY-MM-DD para listar agendamentos',
			},
			{
				displayName: 'User ID (Opcional)',
				name: 'listScheduleUserId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['listSchedules'],
					},
				},
				description: 'ID do usuário para filtrar agendamentos (opcional)',
			},
			{
				displayName: 'ID do Agendamento',
				name: 'scheduleId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['cancelSchedule'],
					},
				},
				description: 'ID do agendamento a ser cancelado',
			},
		{
			displayName: 'ID do Agendamento',
			name: 'calendarScheduleId',
			type: 'number',
			default: 0,
			displayOptions: {
				show: {
					operation: ['calendarLink'],
				},
			},
			description: 'ID do agendamento para gerar o link do calendário',
		},
		// Campos para Templates WABA
		{
			displayName: 'WhatsApp ID',
			name: 'wabaWhatsappId',
			type: 'number',
			default: 1,
			displayOptions: {
				show: {
					operation: ['listWabaTemplates', 'sendWabaTemplate'],
				},
			},
			description: 'ID da conexão WhatsApp WABA',
		},
		{
			displayName: 'Template ID',
			name: 'wabaTemplateId',
			type: 'number',
			default: 1,
			displayOptions: {
				show: {
					operation: ['sendWabaTemplate'],
				},
			},
			description: 'ID do template no sistema (obtido após importação)',
		},
		{
			displayName: 'Número de Telefone',
			name: 'wabaPhoneNumber',
			type: 'string',
			default: '5511999999999',
			displayOptions: {
				show: {
					operation: ['sendWabaTemplate'],
				},
			},
			description: 'Número do destinatário com DDI (ex: 5511999999999)',
		},
		{
			displayName: 'Parâmetros do Template (JSON)',
			name: 'wabaTemplateParams',
			type: 'json',
			default: '{}',
			displayOptions: {
				show: {
					operation: ['sendWabaTemplate'],
				},
			},
			description: 'Parâmetros customizados para substituir variáveis no template (ex: {"nome_cliente": "João", "numero_pedido": "12345"})',
		},
	],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('digitalsacApi');
		const baseUrl = credentials.baseUrl;
		const token = credentials.token;

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			let responseData;

			const headers: Record<string, string> = {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			};

			let url = '';
			let method: 'GET' | 'POST' = 'GET';
			let body;
			let param = this.getNodeParameter('param', i, '') as string;
			let options: Record<string, any> = {};

			switch (operation) {
				case 'validateWhatsapp':
					url = `/typebot/whatsappnumber/${param}`;
					break;
				case 'validateCpf':
					url = `/typebot/validate/cpf/${param}`;
					break;
				case 'validateDate':
					url = '/typebot/validate/data';
					method = 'POST';
					try {
						body = JSON.parse(this.getNodeParameter('bodyData', i) as string);
					} catch (e) {
						throw new Error('Formato de JSON inválido para Dados (JSON)');
					}
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
			case 'listQueues':
				url = '/typebot/listar_filas';
				break;
			case 'listAgents':
				const agentsFormat = this.getNodeParameter('agentsFormat', i, 'json') as string;
				url = '/typebot/listar_atendentes';
				if (agentsFormat === 'string') {
					url += '?format=string';
				}
				break;
				case 'transferQueue':
					url = '/typebot/transferir_para_fila';
					method = 'POST';
					try {
						body = JSON.parse(this.getNodeParameter('bodyData', i) as string);
					} catch (e) {
						throw new Error('Formato de JSON inválido para Dados (JSON)');
					}
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'transferAgent':
					url = '/typebot/transferir_para_atendente';
					method = 'POST';
					try {
						body = JSON.parse(this.getNodeParameter('bodyData', i) as string);
					} catch (e) {
						throw new Error('Formato de JSON inválido para Dados (JSON)');
					}
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'closeTicket':
					url = '/typebot/fechar_ticket';
					method = 'POST';
					try {
						body = JSON.parse(this.getNodeParameter('bodyData', i) as string);
					} catch (e) {
						throw new Error('Formato de JSON inválido para Dados (JSON)');
					}
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'sendMessage':
					// Validar se o UUID foi fornecido
					if (!param || param.trim() === '') {
						throw new Error('UUID da conexão é obrigatório para enviar mensagem. Preencha o campo "Parâmetro" com o UUID da conexão.');
					}
					
					url = `/v1/api/external/${param}`;
					method = 'POST';
					
					// Usar campos separados em vez de JSON
					const messageBody = this.getNodeParameter('messageBody', i) as string;
					const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
					const externalKey = this.getNodeParameter('externalKey', i) as string;
					
					// Verificar se há dados binários (para envio de arquivo)
					let hasBinaryData = false;
					let binaryData: Buffer | undefined;
					let binaryFileName: string | undefined;
					let binaryContentType: string | undefined;
					
					if (items[i].binary) {
						const binary = items[i].binary as IBinaryKeyData;
						// Procurar por qualquer propriedade binária disponível
						const binaryKeys = Object.keys(binary);
						if (binaryKeys.length > 0) {
							const binaryPropertyName = binaryKeys[0]; // Usar a primeira propriedade binária encontrada
							hasBinaryData = true;
							
							const binaryProperty = binary[binaryPropertyName];
							binaryData = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
							binaryFileName = binaryProperty.fileName || 'file';
							binaryContentType = binaryProperty.mimeType;
						}
					}
					
					if (hasBinaryData && binaryData) {
						// Enviar como FormData (para arquivos)
						const formData: IDataObject = {
							body: messageBody,
							number: phoneNumber,
							externalKey: externalKey,
							media: {
								value: binaryData,
								options: {
									filename: binaryFileName,
									contentType: binaryContentType,
								},
							},
						};
						
						options = {
							method,
							headers: {
								Authorization: `Bearer ${token}`,
								Accept: 'application/json',
							},
							formData: formData,
							uri: `${baseUrl}${url}`,
							json: true,
						};
					} else {
						// Enviar como JSON (para texto)
						body = {
							body: messageBody,
							number: phoneNumber,
							externalKey: externalKey
						};
						
						headers['Content-Type'] = 'application/json';
						options = {
							method,
							headers,
							body,
							uri: `${baseUrl}${url}`,
							json: true,
						};
					}
					break;
				case 'listTags':
					url = '/typebot/listar_tags';
					break;
				case 'linkTag':
					url = '/typebot/vincular_tag';
					method = 'POST';
					try {
						body = JSON.parse(this.getNodeParameter('bodyData', i) as string);
					} catch (e) {
						throw new Error('Formato de JSON inválido para Dados (JSON)');
					}
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'createTag':
					url = '/typebot/criar_tag';
					method = 'POST';
					
					// Usar campos separados para criar tag
					const tagName = this.getNodeParameter('tagName', i) as string;
					const tagColor = this.getNodeParameter('tagColor', i) as string;
					
					body = {
						tag: tagName,
						color: tagColor
					};
					
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'listKanbans':
					const userId = this.getNodeParameter('userId', i) as number;
					url = `/typebot/listar_kanbans_v2?userId=${userId}`;
					break;
				case 'linkKanban':
					url = '/typebot/vincular_kanban_v2';
					method = 'POST';
					try {
						body = JSON.parse(this.getNodeParameter('bodyData', i) as string);
					} catch (e) {
						throw new Error('Formato de JSON inválido para Dados (JSON)');
					}
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'listCarteiras':
					url = '/typebot/listar_carteiras';
					break;
				case 'linkCarteira':
					url = '/typebot/vincular_carteira';
					method = 'POST';
					try {
						body = JSON.parse(this.getNodeParameter('bodyData', i) as string);
					} catch (e) {
						throw new Error('Formato de JSON inválido para Dados (JSON)');
					}
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				
				// Casos para Agendamento
				case 'listServices':
					const scheduleUserId = this.getNodeParameter('scheduleUserId', i) as number;
					if (scheduleUserId > 0) {
						url = `/typebot/listar_servicos?userId=${scheduleUserId}`;
					} else {
						url = '/typebot/listar_servicos';
					}
					break;
				
				case 'listAvailableUsers':
					const serviceIdForUsers = this.getNodeParameter('serviceId', i) as number;
					const dateForUsers = this.getNodeParameter('scheduleDate', i) as string;
					const timeForUsers = this.getNodeParameter('scheduleTime', i) as string;
					
					url = `/typebot/listar_usuarios_disponiveis?serviceId=${serviceIdForUsers}&date=${dateForUsers}`;
					if (timeForUsers) {
						url += `&time=${timeForUsers}`;
					}
					break;
				
				case 'listAvailableSlots':
					const serviceIdForSlots = this.getNodeParameter('serviceId', i) as number;
					const userIdForSlots = this.getNodeParameter('scheduleAttendantId', i) as number;
					const dateForSlots = this.getNodeParameter('scheduleDate', i) as string;
					
					url = `/typebot/listar_horarios_disponiveis?serviceId=${serviceIdForSlots}&userId=${userIdForSlots}&date=${dateForSlots}`;
					break;
				
				case 'listSchedules':
					const dateForList = this.getNodeParameter('listScheduleDate', i) as string;
					const userIdForList = this.getNodeParameter('listScheduleUserId', i) as number;
					
					url = `/typebot/listar_agendamentos?date=${dateForList}`;
					if (userIdForList && userIdForList > 0) {
						url += `&userId=${userIdForList}`;
					}
					break;
				
				case 'createSchedule':
					url = '/typebot/criar_agendamento';
					method = 'POST';
					
					const serviceIdForCreate = this.getNodeParameter('serviceId', i) as number;
					const userIdForCreate = this.getNodeParameter('scheduleAttendantId', i) as number;
					const dateForCreate = this.getNodeParameter('scheduleDate', i) as string;
					const timeForCreate = this.getNodeParameter('scheduleTime', i) as string;
					const contactNameForCreate = this.getNodeParameter('contactName', i) as string;
					const contactPhoneForCreate = this.getNodeParameter('contactPhone', i) as string;
					const notesForCreate = this.getNodeParameter('scheduleNotes', i) as string;
					const whatsappIdForCreate = this.getNodeParameter('whatsappId', i) as number;
					const customMessageForCreate = this.getNodeParameter('customMessage', i) as string;
					const remindersForCreate = this.getNodeParameter('reminders', i) as string;
					const intervalDurationForCreate = this.getNodeParameter('intervalDuration', i) as number;
					const closeTicketForCreate = this.getNodeParameter('closeTicket', i) as boolean;
					
					// Converter string de lembretes para array
					const remindersArray = remindersForCreate ? remindersForCreate.split(',').map(r => parseInt(r.trim())) : [60, 240];
					
					body = {
						serviceId: serviceIdForCreate,
						userId: userIdForCreate,
						date: dateForCreate,
						time: timeForCreate,
						contactName: contactNameForCreate,
						contactPhone: contactPhoneForCreate,
						notes: notesForCreate,
						whatsappId: whatsappIdForCreate > 0 ? whatsappIdForCreate : undefined,
						message: customMessageForCreate || undefined,
						reminders: remindersArray,
						intervalDuration: intervalDurationForCreate,
						closeTicket: closeTicketForCreate
					};
					
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				
				case 'cancelSchedule':
					url = '/typebot/cancelar_agendamento';
					method = 'POST';
					
					const scheduleIdForCancel = this.getNodeParameter('scheduleId', i) as number;
					
					body = {
						scheduleId: scheduleIdForCancel
					};
					
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				
			case 'calendarLink':
				const calendarScheduleId = this.getNodeParameter('calendarScheduleId', i) as number;
				
				url = `/typebot/calendar-link?scheduleId=${calendarScheduleId}`;
				break;
			
			case 'listWabaTemplates':
				const wabaWhatsappIdForList = this.getNodeParameter('wabaWhatsappId', i) as number;
				
				url = `/typebot/listar_templates_waba/${wabaWhatsappIdForList}`;
				method = 'GET';
				break;
			
			case 'sendWabaTemplate':
				url = '/typebot/enviar_template_waba';
				method = 'POST';
				
				const wabaTemplateId = this.getNodeParameter('wabaTemplateId', i) as number;
				const wabaPhoneNumber = this.getNodeParameter('wabaPhoneNumber', i) as string;
				const wabaWhatsappId = this.getNodeParameter('wabaWhatsappId', i) as number;
				const wabaTemplateParams = this.getNodeParameter('wabaTemplateParams', i) as string;
				
				let parsedTemplateParams = {};
				if (wabaTemplateParams && wabaTemplateParams.trim() !== '' && wabaTemplateParams.trim() !== '{}') {
					try {
						parsedTemplateParams = JSON.parse(wabaTemplateParams);
					} catch (error) {
						throw new Error('Erro ao fazer parse do JSON dos parâmetros do template. Verifique a sintaxe.');
					}
				}
				
				body = {
					templateId: wabaTemplateId,
					phoneNumber: wabaPhoneNumber,
					whatsappId: wabaWhatsappId,
					templateParams: parsedTemplateParams
				};
				
				headers['Content-Type'] = 'application/json';
				options = {
					method,
					headers,
					body,
					uri: `${baseUrl}${url}`,
					json: true,
				};
				break;
			
			case 'sendButtons':
					// Validar se o UUID foi fornecido
					if (!param || param.trim() === '') {
						throw new Error('UUID da conexão é obrigatório para enviar botões. Preencha o campo "Parâmetro" com o UUID da conexão.');
					}
					
					url = `/v1/api/external/${param}/send-buttons`;
					method = 'POST';
					
					const buttonTitle = this.getNodeParameter('buttonTitle', i) as string;
					const buttonBody = this.getNodeParameter('buttonBody', i) as string;
					const buttonPhoneNumber = this.getNodeParameter('buttonPhoneNumber', i) as string;
					const buttonExternalKey = this.getNodeParameter('externalKey', i) as string;
					const buttonsData = this.getNodeParameter('buttonsData', i) as string;
					
					let parsedButtons;
					try {
						parsedButtons = JSON.parse(buttonsData);
					} catch (error) {
						throw new Error('Erro ao fazer parse do JSON dos botões. Verifique a sintaxe.');
					}
					
					body = {
						title: buttonTitle,
						body: buttonBody,
						number: buttonPhoneNumber,
						extraButtons: parsedButtons,
						externalKey: buttonExternalKey
					};
					
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'sendList':
					// Validar se o UUID foi fornecido
					if (!param || param.trim() === '') {
						throw new Error('UUID da conexão é obrigatório para enviar lista. Preencha o campo "Parâmetro" com o UUID da conexão.');
					}
					
					url = `/v1/api/external/${param}/send-list`;
					method = 'POST';
					
					const listTitle = this.getNodeParameter('listTitle', i) as string;
					const listText = this.getNodeParameter('listText', i) as string;
					const listButtonText = this.getNodeParameter('listButtonText', i) as string;
					const listFooter = this.getNodeParameter('listFooter', i) as string;
					const listPhoneNumber = this.getNodeParameter('listPhoneNumber', i) as string;
					const listExternalKey = this.getNodeParameter('externalKey', i) as string;
					const sectionsData = this.getNodeParameter('sectionsData', i) as string;
					
					let parsedSections;
					try {
						parsedSections = JSON.parse(sectionsData);
					} catch (error) {
						throw new Error('Erro ao fazer parse do JSON das seções. Verifique a sintaxe.');
					}
					
					body = {
						title: listTitle,
						text: listText,
						buttonText: listButtonText,
						footer: listFooter,
						number: listPhoneNumber,
						sections: parsedSections,
						externalKey: listExternalKey
					};
					
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'sendMediaCaption':
					// Validar se o UUID foi fornecido
					if (!param || param.trim() === '') {
						throw new Error('UUID da conexão é obrigatório para enviar mídia. Preencha o campo "Parâmetro" com o UUID da conexão.');
					}
					
					url = `/v1/api/external/${param}/send-media-caption`;
					method = 'POST';
					
					const mediaCaption = this.getNodeParameter('mediaCaption', i) as string;
					const mediaCaptionPhoneNumber = this.getNodeParameter('mediaCaptionPhoneNumber', i) as string;
					const mediaCaptionExternalKey = this.getNodeParameter('externalKey', i) as string;
					
					// Verificar se há dados binários
					let hasBinaryDataCaption = false;
					let binaryDataCaption: Buffer | undefined;
					let binaryFileNameCaption: string | undefined;
					let binaryContentTypeCaption: string | undefined;
					
					if (items[i].binary) {
						const binary = items[i].binary as IBinaryKeyData;
						const binaryKeys = Object.keys(binary);
						if (binaryKeys.length > 0) {
							const binaryPropertyName = binaryKeys[0];
							hasBinaryDataCaption = true;
							
							const binaryProperty = binary[binaryPropertyName];
							binaryDataCaption = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
							binaryFileNameCaption = binaryProperty.fileName || 'file';
							binaryContentTypeCaption = binaryProperty.mimeType;
						}
					}
					
					if (!hasBinaryDataCaption || !binaryDataCaption) {
						throw new Error('Arquivo binário é obrigatório para enviar mídia com caption. Conecte um nó com arquivo binário antes deste.');
					}
					
					// Enviar como FormData
					const formDataCaption: IDataObject = {
						caption: mediaCaption,
						number: mediaCaptionPhoneNumber,
						externalKey: mediaCaptionExternalKey,
						media: {
							value: binaryDataCaption,
							options: {
								filename: binaryFileNameCaption,
								contentType: binaryContentTypeCaption,
							},
						},
					};
					
					options = {
						method,
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
						formData: formDataCaption,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
				case 'sendBase64':
					// Validar se o UUID foi fornecido
					if (!param || param.trim() === '') {
						throw new Error('UUID da conexão é obrigatório para enviar base64. Preencha o campo "Parâmetro" com o UUID da conexão.');
					}
					
					url = `/v1/api/external/${param}/send-base64-media`;
					method = 'POST';
					
					const base64Caption = this.getNodeParameter('base64Caption', i) as string;
					const base64PhoneNumber = this.getNodeParameter('base64PhoneNumber', i) as string;
					const base64ExternalKey = this.getNodeParameter('externalKey', i) as string;
					const mediaBase64 = this.getNodeParameter('mediaBase64', i) as string;
					const mimeType = this.getNodeParameter('mimeType', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					
					// Validar campos obrigatórios
					if (!mediaBase64 || mediaBase64.trim() === '') {
						throw new Error('Arquivo Base64 é obrigatório.');
					}
					if (!mimeType || mimeType.trim() === '') {
						throw new Error('Tipo MIME é obrigatório.');
					}
					if (!fileName || fileName.trim() === '') {
						throw new Error('Nome do arquivo é obrigatório.');
					}
					
					const base64Body: IDataObject = {
						number: base64PhoneNumber,
						mediaBase64: mediaBase64,
						mimeType: mimeType,
						fileName: fileName,
						externalKey: base64ExternalKey
					};
					
					// Adicionar caption apenas se fornecido
					if (base64Caption && base64Caption.trim() !== '') {
						base64Body.caption = base64Caption;
					}
					
					headers['Content-Type'] = 'application/json';
					options = {
						method,
						headers,
						body: base64Body,
						uri: `${baseUrl}${url}`,
						json: true,
					};
					break;
			}

			// Se as opções não foram definidas no switch, defina-as aqui para operações GET
			if (!options.method) {
				options = {
					method,
					headers,
					uri: `${baseUrl}${url}`,
					json: true,
				};
			}

			try {
				responseData = await this.helpers.request(options);
				returnData.push({ json: responseData });
			} catch (error: any) {
				if (error.response) {
					returnData.push({ json: { error: error.response.body || error.message } });
				} else {
					returnData.push({ json: { error: error.message } });
				}
			}
		}

		return [returnData];
	}
}
