import {
	IBinaryKeyData,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

const CREDENTIALS_NAME = 'digitalsacApi';

export class Digitalsac implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Digitalsac Izing Pro',
		name: 'digitalsac',
		icon: 'file:digitalsac.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with the Digitalsac Izing Pro API (WhatsApp, tickets, scheduling, WABA templates and more).',
		defaults: {
			name: 'Digitalsac',
		},
		inputs: ['main'] as unknown as NodeConnectionType[],
		outputs: ['main'] as unknown as NodeConnectionType[],
		credentials: [
			{
				name: CREDENTIALS_NAME,
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Validate WhatsApp', value: 'validateWhatsapp', action: 'Validate a WhatsApp number' },
					{ name: 'Validate CPF', value: 'validateCpf', action: 'Validate a CPF document' },
					{ name: 'Validate Date', value: 'validateDate', action: 'Validate a date' },
					{ name: 'List Queues', value: 'listQueues', action: 'List queues' },
					{ name: 'List Agents', value: 'listAgents', action: 'List agents' },
					{ name: 'Transfer to Queue', value: 'transferQueue', action: 'Transfer ticket to queue' },
					{ name: 'Transfer to Agent', value: 'transferAgent', action: 'Transfer ticket to agent' },
					{ name: 'Next Assignee in Queue', value: 'nextAssignee', action: 'Get next assignee in queue' },
					{ name: 'Transfer to Next Assignee', value: 'transferNextAssignee', action: 'Transfer to next assignee' },
					{ name: 'Close Ticket', value: 'closeTicket', action: 'Close a ticket' },
					{ name: 'Send Message', value: 'sendMessage', action: 'Send a message' },
					{ name: 'Send Buttons', value: 'sendButtons', action: 'Send interactive buttons' },
					{ name: 'Send List', value: 'sendList', action: 'Send a list' },
					{ name: 'Send Carousel', value: 'sendCarousel', action: 'Send a carousel' },
					{ name: 'Send Media With Caption', value: 'sendMediaCaption', action: 'Send media with caption' },
					{ name: 'Send Base64 File', value: 'sendBase64', action: 'Send a base64 encoded file' },
					{ name: 'List Tags', value: 'listTags', action: 'List tags' },
					{ name: 'Link Tag', value: 'linkTag', action: 'Link a tag to a ticket' },
					{ name: 'Create Tag', value: 'createTag', action: 'Create a tag' },
					{ name: 'List Kanbans', value: 'listKanbans', action: 'List kanbans' },
					{ name: 'Link Kanban', value: 'linkKanban', action: 'Link a kanban to a ticket' },
					{ name: 'List Wallets', value: 'listCarteiras', action: 'List wallets' },
					{ name: 'Link Wallet', value: 'linkCarteira', action: 'Link a wallet to a ticket' },
					{ name: 'List Services', value: 'listServices', action: 'List scheduling services' },
					{ name: 'List Available Users', value: 'listAvailableUsers', action: 'List available users for a service' },
					{ name: 'List Available Slots', value: 'listAvailableSlots', action: 'List available time slots' },
					{ name: 'List Schedules', value: 'listSchedules', action: 'List existing schedules' },
					{ name: 'Create Schedule', value: 'createSchedule', action: 'Create a schedule' },
					{ name: 'Cancel Schedule', value: 'cancelSchedule', action: 'Cancel a schedule' },
					{ name: 'Generate Calendar Link (.ics)', value: 'calendarLink', action: 'Generate a calendar link' },
					{ name: 'List WABA Templates', value: 'listWabaTemplates', action: 'List WhatsApp Business templates' },
					{ name: 'Send WABA Template', value: 'sendWabaTemplate', action: 'Send a WhatsApp Business template' },
					{ name: 'Send Short SMS', value: 'sendTypebotSms', action: 'Send a short SMS' },
				],
				default: 'validateWhatsapp',
			},
			{
				displayName: 'Parameter',
				name: 'param',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'validateWhatsapp',
							'validateCpf',
							'sendMessage',
							'sendButtons',
							'sendList',
							'sendCarousel',
							'sendMediaCaption',
							'sendBase64',
							'nextAssignee',
							'transferNextAssignee',
						],
					},
				},
				description: 'Phone number, CPF or connection UUID, depending on the operation',
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
				description: 'User ID used to list kanbans',
			},
			{
				displayName: 'Response Format',
				name: 'agentsFormat',
				type: 'options',
				options: [
					{ name: 'Full JSON (Recommended)', value: 'json' },
					{ name: 'Formatted Text (Compatibility)', value: 'string' },
				],
				default: 'json',
				displayOptions: {
					show: {
						operation: ['listAgents'],
					},
				},
				description: 'Response format: full JSON with all fields or text formatted for compatibility',
			},
			{
				displayName: 'Message Body',
				name: 'messageBody',
				type: 'string',
				default: 'Test message',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				description: 'Text of the message to send',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				description: 'Phone number with country and area code (e.g. 5511999999999)',
			},
			{
				displayName: 'External Key',
				name: 'externalKey',
				type: 'string',
				default: 'Digitalsac123',
				displayOptions: {
					show: {
						operation: ['sendMessage', 'sendButtons', 'sendList', 'sendCarousel', 'sendMediaCaption', 'sendBase64'],
					},
				},
				description: 'Optional unique identifier for the message',
			},
			{
				displayName: 'Title',
				name: 'buttonTitle',
				type: 'string',
				default: 'Choose an option',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Title of the button set',
			},
			{
				displayName: 'Message Body',
				name: 'buttonBody',
				type: 'string',
				default: 'Tap one of the options below:',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Body of the message that contains the buttons',
			},
			{
				displayName: 'Phone Number',
				name: 'buttonPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Phone number with country and area code',
			},
			{
				displayName: 'Buttons (JSON)',
				name: 'buttonsData',
				type: 'json',
				default:
					'[\n  {\n    "tipo": {"label": "Quick Reply", "value": "quick_reply"},\n    "display_text": "Yes",\n    "conteudo": "yes"\n  },\n  {\n    "tipo": {"label": "URL", "value": "url"},\n    "display_text": "Visit site",\n    "conteudo": "https://example.com"\n  }\n]',
				displayOptions: {
					show: {
						operation: ['sendButtons'],
					},
				},
				description: 'Array of buttons as JSON',
			},
			{
				displayName: 'Title',
				name: 'listTitle',
				type: 'string',
				default: 'Options Menu',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'List title',
			},
			{
				displayName: 'Text',
				name: 'listText',
				type: 'string',
				default: 'Pick a category:',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'List text',
			},
			{
				displayName: 'Button Text',
				name: 'listButtonText',
				type: 'string',
				default: 'See Options',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Text of the button that opens the list',
			},
			{
				displayName: 'Footer',
				name: 'listFooter',
				type: 'string',
				default: 'Powered by DigitalSac',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'List footer text',
			},
			{
				displayName: 'Phone Number',
				name: 'listPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Phone number with country and area code',
			},
			{
				displayName: 'Sections (JSON)',
				name: 'sectionsData',
				type: 'json',
				default:
					'[\n  {\n    "title": "Products",\n    "lines": [\n      {\n        "title": "Product A",\n        "description": "Description for product A",\n        "rowId": 1\n      }\n    ]\n  }\n]',
				displayOptions: {
					show: {
						operation: ['sendList'],
					},
				},
				description: 'Array of list sections as JSON',
			},
			{
				displayName: 'Title',
				name: 'carouselTitle',
				type: 'string',
				default: 'Weekly Highlights',
				displayOptions: {
					show: {
						operation: ['sendCarousel'],
					},
				},
				description: 'Carousel title',
			},
			{
				displayName: 'Text',
				name: 'carouselText',
				type: 'string',
				default: 'Pick an option from our carousel:',
				displayOptions: {
					show: {
						operation: ['sendCarousel'],
					},
				},
				description: 'Main carousel text',
			},
			{
				displayName: 'Footer',
				name: 'carouselFooter',
				type: 'string',
				default: 'DigitalSac',
				displayOptions: {
					show: {
						operation: ['sendCarousel'],
					},
				},
				description: 'Carousel footer text',
			},
			{
				displayName: 'Phone Number',
				name: 'carouselPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendCarousel'],
					},
				},
				description: 'Phone number with country and area code',
			},
			{
				displayName: 'Cards (JSON)',
				name: 'carouselCardsData',
				type: 'json',
				default:
					'[\n  {\n    "body": "Starter Plan",\n    "footer": "Starting at $49.90",\n    "image": {\n      "url": "https://picsum.photos/800/600"\n    },\n    "buttons": [\n      {\n        "type": "url",\n        "text": "See details",\n        "url": "https://digitalsac.com.br"\n      }\n    ]\n  },\n  {\n    "body": "Pro Plan",\n    "footer": "Starting at $99.98",\n    "image": {\n      "url": "https://picsum.photos/801/600"\n    },\n    "buttons": [\n      {\n        "type": "reply",\n        "text": "Tell me more",\n        "id": "pro_plan"\n      }\n    ]\n  }\n]',
				displayOptions: {
					show: {
						operation: ['sendCarousel'],
					},
				},
				description: 'Array of carousel cards as JSON',
			},
			{
				displayName: 'Caption',
				name: 'mediaCaption',
				type: 'string',
				default: 'File sent via API',
				displayOptions: {
					show: {
						operation: ['sendMediaCaption'],
					},
				},
				description: 'Caption for the file',
			},
			{
				displayName: 'Phone Number',
				name: 'mediaCaptionPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendMediaCaption'],
					},
				},
				description: 'Phone number with country and area code',
			},
			{
				displayName: 'Caption (Optional)',
				name: 'base64Caption',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'Optional caption for the file',
			},
			{
				displayName: 'Phone Number',
				name: 'base64PhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'Phone number with country and area code',
			},
			{
				displayName: 'Base64 File',
				name: 'mediaBase64',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'File contents encoded in base64',
			},
			{
				displayName: 'MIME Type',
				name: 'mimeType',
				type: 'string',
				default: 'image/png',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'MIME type of the file (e.g. image/png, application/pdf)',
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: 'file.png',
				displayOptions: {
					show: {
						operation: ['sendBase64'],
					},
				},
				description: 'File name including extension',
			},
			{
				displayName: 'Tag Name',
				name: 'tagName',
				type: 'string',
				default: 'New Tag',
				displayOptions: {
					show: {
						operation: ['createTag'],
					},
				},
				description: 'Name of the tag to create',
			},
			{
				displayName: 'Tag Color',
				name: 'tagColor',
				type: 'string',
				default: '#2196F3',
				displayOptions: {
					show: {
						operation: ['createTag'],
					},
				},
				description: 'Tag color in hexadecimal format (e.g. #FF5733, #2196F3, #4CAF50)',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"data": "2024-01-15"}',
				displayOptions: {
					show: {
						operation: ['validateDate'],
					},
				},
				description: 'Date to validate, sent as JSON',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "queueId": 1}',
				displayOptions: {
					show: {
						operation: ['transferQueue'],
					},
				},
				description: 'Ticket ID and destination queue ID',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "userId": 1}',
				displayOptions: {
					show: {
						operation: ['transferAgent'],
					},
				},
				description: 'Ticket ID and destination agent ID',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123}',
				displayOptions: {
					show: {
						operation: ['closeTicket'],
					},
				},
				description: 'ID of the ticket to close',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"queueId": 3, "ticketId": 1201, "method": "S", "allowOffline": false}',
				displayOptions: {
					show: {
						operation: ['nextAssignee'],
					},
				},
				description: 'Payload to query the next assignee in the queue (queueId, method, optional ticketId, optional allowOffline)',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"queueId": 3, "ticketId": 1201, "method": "S", "allowOffline": false}',
				displayOptions: {
					show: {
						operation: ['transferNextAssignee'],
					},
				},
				description: 'Payload to transfer the ticket to the next assignee (queueId, ticketId, method, optional allowOffline)',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "tagId": 456}',
				displayOptions: {
					show: {
						operation: ['linkTag'],
					},
				},
				description: 'Ticket ID and tag ID to link',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default:
					'{\n  "ticketId": 123,\n  "kanbanId": 456,\n  "userId": 789,\n  "value": 500.5,\n  "status": "new",\n  "kanbanCreatedAt": "2026-03-09T10:00:00Z",\n  "shortDesc": "Inbound lead",\n  "probability": 70,\n  "funnelStatus": "open",\n  "expectedCloseAt": "2026-04-01T12:00:00Z",\n  "assignedUserId": 12\n}',
				displayOptions: {
					show: {
						operation: ['linkKanban'],
					},
				},
				description: 'Payload for /typebot/vincular_kanban_v2. Required: ticketId, kanbanId, userId. Optional: value, status, kanbanCreatedAt, shortDesc, probability, funnelStatus, expectedCloseAt, assignedUserId',
			},
			{
				displayName: 'Data (JSON)',
				name: 'bodyData',
				type: 'json',
				default: '{"ticketId": 123, "userId": 456}',
				displayOptions: {
					show: {
						operation: ['linkCarteira'],
					},
				},
				description: 'Ticket ID and wallet user ID',
			},
			{
				displayName: 'User ID',
				name: 'scheduleUserId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['listServices'],
					},
				},
				description: 'User ID used to filter services (optional)',
			},
			{
				displayName: 'Service ID',
				name: 'serviceId',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: ['listAvailableUsers', 'listAvailableSlots', 'createSchedule'],
					},
				},
				description: 'Service ID',
			},
			{
				displayName: 'Date',
				name: 'scheduleDate',
				type: 'string',
				default: '',
				placeholder: '2025-08-07',
				displayOptions: {
					show: {
						operation: ['listAvailableUsers', 'listAvailableSlots', 'createSchedule'],
					},
				},
				description: 'Date in YYYY-MM-DD format',
			},
			{
				displayName: 'Time',
				name: 'scheduleTime',
				type: 'string',
				default: '',
				placeholder: '09:00',
				displayOptions: {
					show: {
						operation: ['listAvailableUsers', 'createSchedule'],
					},
				},
				description: 'Time in HH:mm format (optional when listing users)',
			},
			{
				displayName: 'User ID',
				name: 'scheduleAttendantId',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: ['listAvailableSlots', 'createSchedule'],
					},
				},
				description: 'Attendant/user ID',
			},
			{
				displayName: 'Contact Name',
				name: 'contactName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Customer/contact name',
			},
			{
				displayName: 'Contact Phone',
				name: 'contactPhone',
				type: 'string',
				default: '',
				placeholder: '5511999999999',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Customer/contact phone number',
			},
			{
				displayName: 'Notes',
				name: 'scheduleNotes',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Optional notes for the schedule',
			},
			{
				displayName: 'WhatsApp Connection ID',
				name: 'whatsappId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'WhatsApp connection ID (optional, defaults to the first available)',
			},
			{
				displayName: 'Custom Message',
				name: 'customMessage',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Optional custom message for the schedule',
			},
			{
				displayName: 'Reminders (Minutes)',
				name: 'reminders',
				type: 'string',
				default: '60,240',
				placeholder: '60,240,1440',
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Reminders in minutes before the schedule, comma separated',
			},
			{
				displayName: 'Interval Duration (Minutes)',
				name: 'intervalDuration',
				type: 'number',
				default: 30,
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Interval duration in minutes',
			},
			{
				displayName: 'Close Ticket After Scheduling',
				name: 'closeTicket',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['createSchedule'],
					},
				},
				description: 'Whether to close the ticket after creating the schedule',
			},
			{
				displayName: 'Date',
				name: 'listScheduleDate',
				type: 'string',
				default: '',
				placeholder: '2025-08-08',
				displayOptions: {
					show: {
						operation: ['listSchedules'],
					},
				},
				description: 'Date in YYYY-MM-DD format used to list schedules',
			},
			{
				displayName: 'User ID (Optional)',
				name: 'listScheduleUserId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['listSchedules'],
					},
				},
				description: 'User ID used to filter schedules (optional)',
			},
			{
				displayName: 'Schedule ID',
				name: 'scheduleId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['cancelSchedule'],
					},
				},
				description: 'Schedule ID to cancel',
			},
			{
				displayName: 'Schedule ID',
				name: 'calendarScheduleId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['calendarLink'],
					},
				},
				description: 'Schedule ID used to generate the calendar link',
			},
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
				description: 'ID of the WhatsApp WABA connection',
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
				description: 'ID of the template stored in the system (after import)',
			},
			{
				displayName: 'Phone Number',
				name: 'wabaPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendWabaTemplate'],
					},
				},
				description: 'Recipient phone number with country and area code (e.g. 5511999999999)',
			},
			{
				displayName: 'Body Parameters (JSON)',
				name: 'wabaTemplateParams',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['sendWabaTemplate'],
					},
				},
				description: 'Body variables indexed by number ({"1":"John","2":"12345"}) or by name. Supports placeholders {{1}}, {{2}}. Optional.',
			},
			{
				displayName: 'Header Media URL',
				name: 'wabaMediaUrl',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/file.jpg',
				displayOptions: {
					show: {
						operation: ['sendWabaTemplate'],
					},
				},
				description: 'Public http(s) URL of the media for templates with IMAGE, VIDEO or DOCUMENT header. If empty, the media stored in the template is used. Optional.',
			},
			{
				displayName: 'Header Parameters (JSON)',
				name: 'wabaHeaderParams',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['sendWabaTemplate'],
					},
				},
				description: 'Header TEXT variables indexed by number or name (e.g. {"1":"April Promotion"}). Optional.',
			},
			{
				displayName: 'Button Parameters (JSON)',
				name: 'wabaButtonParams',
				type: 'json',
				default: '[]',
				displayOptions: {
					show: {
						operation: ['sendWabaTemplate'],
					},
				},
				description: 'Array of overrides for dynamic URL buttons (e.g. [{"index":0,"type":"url","value":"order-123"}]). Each item identifies the button by index and provides the variable value. Optional.',
			},
			{
				displayName: 'Phone Number',
				name: 'smsPhoneNumber',
				type: 'string',
				default: '5511999999999',
				displayOptions: {
					show: {
						operation: ['sendTypebotSms'],
					},
				},
				description: 'Recipient phone number with country and area code',
			},
			{
				displayName: 'SMS Message',
				name: 'smsMessage',
				type: 'string',
				default: 'Hello! This is a Short SMS message.',
				displayOptions: {
					show: {
						operation: ['sendTypebotSms'],
					},
				},
				description: 'SMS message content',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials(CREDENTIALS_NAME);
		const baseUrl = String(credentials.baseUrl || '').replace(/\/+$/, '');

		const parseJsonParam = (
			raw: unknown,
			fieldName: string,
			itemIndex: number,
			fallback: unknown,
		): unknown => {
			if (raw === undefined || raw === null) return fallback;
			if (typeof raw !== 'string') return raw;
			if (raw.trim() === '') return fallback;
			try {
				return JSON.parse(raw);
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid JSON for "${fieldName}". Please check the syntax.`,
					{ itemIndex },
				);
			}
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const param = this.getNodeParameter('param', i, '') as string;

				let url = '';
				let method: IHttpRequestMethods = 'GET';
				let body: IDataObject | undefined;
				let formData: IDataObject | undefined;

				const requireParam = (action: string) => {
					if (!param || param.trim() === '') {
						throw new NodeOperationError(
							this.getNode(),
							`Connection UUID is required to ${action}. Fill the "Parameter" field with the connection UUID.`,
							{ itemIndex: i },
						);
					}
				};

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
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'listQueues':
						url = '/typebot/listar_filas';
						break;

					case 'listAgents': {
						const agentsFormat = this.getNodeParameter('agentsFormat', i, 'json') as string;
						url = '/typebot/listar_atendentes';
						if (agentsFormat === 'string') url += '?format=string';
						break;
					}

					case 'transferQueue':
						url = '/typebot/transferir_para_fila';
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'transferAgent':
						url = '/typebot/transferir_para_atendente';
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'closeTicket':
						url = '/typebot/fechar_ticket';
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'nextAssignee':
						requireParam('query the next assignee');
						url = `/v1/api/external/${param}/next-assignee`;
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'transferNextAssignee':
						requireParam('transfer to the next assignee');
						url = `/v1/api/external/${param}/transfer-next-assignee`;
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'sendMessage': {
						requireParam('send a message');
						url = `/v1/api/external/${param}`;
						method = 'POST';
						const messageBody = this.getNodeParameter('messageBody', i) as string;
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
						const externalKey = this.getNodeParameter('externalKey', i) as string;

						const binaryAttachment = await readBinaryAttachment.call(this, items, i);
						if (binaryAttachment) {
							formData = {
								body: messageBody,
								number: phoneNumber,
								externalKey,
								media: {
									value: binaryAttachment.buffer,
									options: {
										filename: binaryAttachment.fileName,
										contentType: binaryAttachment.contentType,
									},
								},
							};
						} else {
							body = { body: messageBody, number: phoneNumber, externalKey };
						}
						break;
					}

					case 'listTags':
						url = '/typebot/listar_tags';
						break;

					case 'linkTag':
						url = '/typebot/vincular_tag';
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'createTag': {
						url = '/typebot/criar_tag';
						method = 'POST';
						const tagName = this.getNodeParameter('tagName', i) as string;
						const tagColor = this.getNodeParameter('tagColor', i) as string;
						body = { tag: tagName, color: tagColor };
						break;
					}

					case 'listKanbans': {
						const userId = this.getNodeParameter('userId', i) as number;
						url = `/typebot/listar_kanbans_v2?userId=${userId}`;
						break;
					}

					case 'linkKanban':
						url = '/typebot/vincular_kanban_v2';
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'listCarteiras':
						url = '/typebot/listar_carteiras';
						break;

					case 'linkCarteira':
						url = '/typebot/vincular_carteira';
						method = 'POST';
						body = parseJsonParam(
							this.getNodeParameter('bodyData', i),
							'Data (JSON)',
							i,
							{},
						) as IDataObject;
						break;

					case 'listServices': {
						const scheduleUserId = this.getNodeParameter('scheduleUserId', i) as number;
						url =
							scheduleUserId > 0
								? `/typebot/listar_servicos?userId=${scheduleUserId}`
								: '/typebot/listar_servicos';
						break;
					}

					case 'listAvailableUsers': {
						const serviceIdForUsers = this.getNodeParameter('serviceId', i) as number;
						const dateForUsers = this.getNodeParameter('scheduleDate', i) as string;
						const timeForUsers = this.getNodeParameter('scheduleTime', i) as string;
						url = `/typebot/listar_usuarios_disponiveis?serviceId=${serviceIdForUsers}&date=${dateForUsers}`;
						if (timeForUsers) url += `&time=${timeForUsers}`;
						break;
					}

					case 'listAvailableSlots': {
						const serviceIdForSlots = this.getNodeParameter('serviceId', i) as number;
						const userIdForSlots = this.getNodeParameter('scheduleAttendantId', i) as number;
						const dateForSlots = this.getNodeParameter('scheduleDate', i) as string;
						url = `/typebot/listar_horarios_disponiveis?serviceId=${serviceIdForSlots}&userId=${userIdForSlots}&date=${dateForSlots}`;
						break;
					}

					case 'listSchedules': {
						const dateForList = this.getNodeParameter('listScheduleDate', i) as string;
						const userIdForList = this.getNodeParameter('listScheduleUserId', i) as number;
						url = `/typebot/listar_agendamentos?date=${dateForList}`;
						if (userIdForList && userIdForList > 0) url += `&userId=${userIdForList}`;
						break;
					}

					case 'createSchedule': {
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

						const remindersArray = remindersForCreate
							? remindersForCreate
									.split(',')
									.map(r => parseInt(r.trim(), 10))
									.filter(n => !Number.isNaN(n))
							: [60, 240];

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
							closeTicket: closeTicketForCreate,
						};
						break;
					}

					case 'cancelSchedule': {
						url = '/typebot/cancelar_agendamento';
						method = 'POST';
						const scheduleIdForCancel = this.getNodeParameter('scheduleId', i) as number;
						body = { scheduleId: scheduleIdForCancel };
						break;
					}

					case 'calendarLink': {
						const calendarScheduleId = this.getNodeParameter('calendarScheduleId', i) as number;
						url = `/typebot/calendar-link?scheduleId=${calendarScheduleId}`;
						break;
					}

					case 'listWabaTemplates': {
						const wabaWhatsappIdForList = this.getNodeParameter('wabaWhatsappId', i) as number;
						url = `/typebot/listar_templates_waba/${wabaWhatsappIdForList}`;
						method = 'GET';
						break;
					}

					case 'sendWabaTemplate': {
						url = '/typebot/enviar_template_waba';
						method = 'POST';

						const wabaTemplateId = this.getNodeParameter('wabaTemplateId', i) as number;
						const wabaPhoneNumber = this.getNodeParameter('wabaPhoneNumber', i) as string;
						const wabaWhatsappId = this.getNodeParameter('wabaWhatsappId', i) as number;
						const wabaTemplateParamsRaw = this.getNodeParameter('wabaTemplateParams', i, '{}');
						const wabaMediaUrl = (this.getNodeParameter('wabaMediaUrl', i, '') as string) || '';
						const wabaHeaderParamsRaw = this.getNodeParameter('wabaHeaderParams', i, '{}');
						const wabaButtonParamsRaw = this.getNodeParameter('wabaButtonParams', i, '[]');

						const parsedTemplateParams = parseJsonParam(
							wabaTemplateParamsRaw,
							'Body Parameters',
							i,
							{},
						) as unknown as IDataObject;
						const parsedHeaderParams = parseJsonParam(
							wabaHeaderParamsRaw,
							'Header Parameters',
							i,
							{},
						) as unknown as IDataObject;
						const parsedButtonParams = parseJsonParam(
							wabaButtonParamsRaw,
							'Button Parameters',
							i,
							[],
						) as unknown as IDataObject[];

						const wabaBody: IDataObject = {
							templateId: wabaTemplateId,
							phoneNumber: wabaPhoneNumber,
							whatsappId: wabaWhatsappId,
						};
						if (parsedTemplateParams && Object.keys(parsedTemplateParams).length > 0) {
							wabaBody.templateParams = parsedTemplateParams;
						}
						if (wabaMediaUrl.trim() !== '') {
							wabaBody.mediaUrl = wabaMediaUrl.trim();
						}
						if (parsedHeaderParams && Object.keys(parsedHeaderParams).length > 0) {
							wabaBody.headerParams = parsedHeaderParams;
						}
						if (Array.isArray(parsedButtonParams) && parsedButtonParams.length > 0) {
							wabaBody.buttonParams = parsedButtonParams;
						}
						body = wabaBody;
						break;
					}

					case 'sendTypebotSms': {
						url = '/typebot/enviar_sms';
						method = 'POST';
						const smsPhoneNumber = this.getNodeParameter('smsPhoneNumber', i) as string;
						const smsMessage = this.getNodeParameter('smsMessage', i) as string;
						body = { phoneNumber: smsPhoneNumber, message: smsMessage };
						break;
					}

					case 'sendButtons': {
						requireParam('send buttons');
						url = `/v1/api/external/${param}/send-buttons`;
						method = 'POST';
						const buttonTitle = this.getNodeParameter('buttonTitle', i) as string;
						const buttonBody = this.getNodeParameter('buttonBody', i) as string;
						const buttonPhoneNumber = this.getNodeParameter('buttonPhoneNumber', i) as string;
						const buttonExternalKey = this.getNodeParameter('externalKey', i) as string;
						const buttonsData = parseJsonParam(
							this.getNodeParameter('buttonsData', i),
							'Buttons (JSON)',
							i,
							[],
						) as unknown as IDataObject[];
						body = {
							title: buttonTitle,
							body: buttonBody,
							number: buttonPhoneNumber,
							extraButtons: buttonsData,
							externalKey: buttonExternalKey,
						};
						break;
					}

					case 'sendList': {
						requireParam('send a list');
						url = `/v1/api/external/${param}/send-list`;
						method = 'POST';
						const listTitle = this.getNodeParameter('listTitle', i) as string;
						const listText = this.getNodeParameter('listText', i) as string;
						const listButtonText = this.getNodeParameter('listButtonText', i) as string;
						const listFooter = this.getNodeParameter('listFooter', i) as string;
						const listPhoneNumber = this.getNodeParameter('listPhoneNumber', i) as string;
						const listExternalKey = this.getNodeParameter('externalKey', i) as string;
						const sectionsData = parseJsonParam(
							this.getNodeParameter('sectionsData', i),
							'Sections (JSON)',
							i,
							[],
						) as unknown as IDataObject[];
						body = {
							title: listTitle,
							text: listText,
							buttonText: listButtonText,
							footer: listFooter,
							number: listPhoneNumber,
							sections: sectionsData,
							externalKey: listExternalKey,
						};
						break;
					}

					case 'sendCarousel': {
						requireParam('send a carousel');
						url = `/v1/api/external/${param}/send-carousel`;
						method = 'POST';
						const carouselTitle = this.getNodeParameter('carouselTitle', i) as string;
						const carouselText = this.getNodeParameter('carouselText', i) as string;
						const carouselFooter = this.getNodeParameter('carouselFooter', i) as string;
						const carouselPhoneNumber = this.getNodeParameter('carouselPhoneNumber', i) as string;
						const carouselExternalKey = this.getNodeParameter('externalKey', i) as string;
						const carouselCardsData = parseJsonParam(
							this.getNodeParameter('carouselCardsData', i),
							'Cards (JSON)',
							i,
							[],
						) as unknown as IDataObject[];
						body = {
							title: carouselTitle,
							text: carouselText,
							description: carouselText,
							footer: carouselFooter,
							number: carouselPhoneNumber,
							cards: carouselCardsData,
							externalKey: carouselExternalKey,
						};
						break;
					}

					case 'sendMediaCaption': {
						requireParam('send media with caption');
						url = `/v1/api/external/${param}/send-media-caption`;
						method = 'POST';
						const mediaCaption = this.getNodeParameter('mediaCaption', i) as string;
						const mediaCaptionPhoneNumber = this.getNodeParameter('mediaCaptionPhoneNumber', i) as string;
						const mediaCaptionExternalKey = this.getNodeParameter('externalKey', i) as string;

						const binaryAttachment = await readBinaryAttachment.call(this, items, i);
						if (!binaryAttachment) {
							throw new NodeOperationError(
								this.getNode(),
								'A binary file is required to send media with caption. Connect a node that produces a binary attachment first.',
								{ itemIndex: i },
							);
						}
						formData = {
							caption: mediaCaption,
							number: mediaCaptionPhoneNumber,
							externalKey: mediaCaptionExternalKey,
							media: {
								value: binaryAttachment.buffer,
								options: {
									filename: binaryAttachment.fileName,
									contentType: binaryAttachment.contentType,
								},
							},
						};
						break;
					}

					case 'sendBase64': {
						requireParam('send a base64 file');
						url = `/v1/api/external/${param}/send-base64-media`;
						method = 'POST';
						const base64Caption = this.getNodeParameter('base64Caption', i) as string;
						const base64PhoneNumber = this.getNodeParameter('base64PhoneNumber', i) as string;
						const base64ExternalKey = this.getNodeParameter('externalKey', i) as string;
						const mediaBase64 = this.getNodeParameter('mediaBase64', i) as string;
						const mimeType = this.getNodeParameter('mimeType', i) as string;
						const fileName = this.getNodeParameter('fileName', i) as string;

						if (!mediaBase64 || mediaBase64.trim() === '') {
							throw new NodeOperationError(
								this.getNode(),
								'Base64 file content is required.',
								{ itemIndex: i },
							);
						}
						if (!mimeType || mimeType.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'MIME type is required.', { itemIndex: i });
						}
						if (!fileName || fileName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'File name is required.', { itemIndex: i });
						}

						const base64Body: IDataObject = {
							number: base64PhoneNumber,
							mediaBase64,
							mimeType,
							fileName,
							externalKey: base64ExternalKey,
						};
						if (base64Caption && base64Caption.trim() !== '') {
							base64Body.caption = base64Caption;
						}
						body = base64Body;
						break;
					}

					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unsupported operation: ${operation}`,
							{ itemIndex: i },
						);
				}

				const requestOptions: IHttpRequestOptions = {
					method,
					url: `${baseUrl}${url}`,
					headers: { Accept: 'application/json' },
					json: true,
				};
				if (formData) {
					(requestOptions as unknown as IDataObject).formData = formData;
				} else if (body !== undefined) {
					requestOptions.body = body;
				}

				const responseData = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					CREDENTIALS_NAME,
					requestOptions,
				)) as IDataObject | IDataObject[];

				if (Array.isArray(responseData)) {
					for (const entry of responseData) {
						returnData.push({ json: entry as IDataObject, pairedItem: { item: i } });
					}
				} else {
					returnData.push({
						json: (responseData ?? {}) as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: { error: message },
						error: error as NodeApiError,
						pairedItem: { item: i },
					});
					continue;
				}
				if (error instanceof NodeApiError || error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

interface BinaryAttachment {
	buffer: Buffer;
	fileName: string;
	contentType: string | undefined;
}

async function readBinaryAttachment(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<BinaryAttachment | undefined> {
	const binary = items[i].binary as IBinaryKeyData | undefined;
	if (!binary) return undefined;
	const binaryKeys = Object.keys(binary);
	if (binaryKeys.length === 0) return undefined;
	const binaryPropertyName = binaryKeys[0];
	const binaryProperty = binary[binaryPropertyName];
	const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
	return {
		buffer,
		fileName: binaryProperty.fileName || 'file',
		contentType: binaryProperty.mimeType,
	};
}
