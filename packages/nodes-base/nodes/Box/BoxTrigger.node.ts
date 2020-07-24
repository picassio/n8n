import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	INodeTypeDescription,
	INodeType,
	IWebhookResponseData,
} from 'n8n-workflow';

import {
	boxApiRequest,
	boxApiRequestAllItems,
} from './GenericFunctions';

export class BoxTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Box Trigger',
		name: 'boxTrigger',
		icon: 'file:box.png',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when a Github events occurs.',
		defaults: {
			name: 'Box Trigger',
			color: '#00aeef',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'boxOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Collaboration Created',
						value: 'COLLABORATION.CREATED',
						description: 'A collaboration is created',
					},
					{
						name: 'Collaboration Accepted',
						value: 'COLLABORATION.ACCEPTED',
						description: 'A collaboration has been accepted',
					},
					{
						name: 'Collaboration Rejected',
						value: 'COLLABORATION.REJECTED',
						description: 'A collaboration has been rejected',
					},
					{
						name: 'Collaboration Removed',
						value: 'COLLABORATION.REMOVED',
						description: 'A collaboration has been removed',
					},
					{
						name: 'Collaboration Updated',
						value: 'COLLABORATION.UPDATED',
						description: 'A collaboration has been updated.',
					},
					{
						name: 'Comment Created',
						value: 'COMMENT.CREATED',
						description: 'A comment object is created',
					},
					{
						name: 'Comment Updated',
						value: 'COMMENT.UPDATED',
						description: 'A comment object is edited',
					},
					{
						name: 'Comment Deleted',
						value: 'COMMENT.DELETED',
						description: 'A comment object is removed',
					},
					{
						name: 'File Uploaded',
						value: 'FILE.UPLOADED',
						description: 'A file is uploaded to or moved to this folder',
					},
					{
						name: 'File Previewed',
						value: 'FILE.PREVIEWED',
						description: 'A file is previewed',
					},
					{
						name: 'File Downloaded',
						value: 'FILE.DOWNLOADED',
						description: 'A file is downloaded',
					},
					{
						name: 'File Trashed',
						value: 'FILE.TRASHED',
						description: 'A file is moved to the trash',
					},
					{
						name: 'File Deleted',
						value: 'FILE.DELETED',
						description: 'A file is moved to the trash',
					},
					{
						name: 'File Restored',
						value: 'FILE.RESTORED',
						description: 'A file is restored from the trash',
					},
					{
						name: 'File Copied',
						value: 'FILE.COPIED',
						description: 'A file is copied',
					},
					{
						name: 'File Moved',
						value: 'FILE.MOVED',
						description: 'A file is moved from one folder to another',
					},
					{
						name: 'File Locked',
						value: 'FILE.LOCKED',
						description: 'A file is locked',
					},
					{
						name: 'File Unlocked',
						value: 'FILE.UNLOCKED',
						description: 'A file is unlocked',
					},
					{
						name: 'File Renamed',
						value: 'FILE.RENAMED',
						description: 'A file was renamed.',
					},
					{
						name: 'Folder Created',
						value: 'FOLDER.CREATED',
						description: 'A folder is created',
					},
					{
						name: 'Folder Renamed',
						value: 'FOLDER.RENAMED',
						description: 'A folder was renamed.',
					},
					{
						name: 'Folder Downloaded',
						value: 'FOLDER.DOWNLOADED',
						description: 'A folder is downloaded',
					},
					{
						name: 'Folder Restored',
						value: 'FOLDER.RESTORED',
						description: 'A folder is restored from the trash',
					},
					{
						name: 'Folder Deleted',
						value: 'FOLDER.DELETED',
						description: 'A folder is permanently removed',
					},
					{
						name: 'Folder Copied',
						value: 'FOLDER.COPIED',
						description: 'A copy of a folder is made',
					},
					{
						name: 'Folder Moved',
						value: 'FOLDER.MOVED',
						description: 'A folder is moved to a different folder',
					},
					{
						name: 'Folder Trashed',
						value: 'FOLDER.TRASHED',
						description: 'A folder is moved to the trash',
					},
					{
						name: 'Metadata Instance Created',
						value: 'METADATA_INSTANCE.CREATED',
						description: 'A new metadata template instance is associated with a file or folder',
					},
					{
						name: 'Metadata Instance Updated',
						value: 'METADATA_INSTANCE.UPDATED',
						description: 'An attribute (value) is updated/deleted for an existing metadata template instance associated with a file or folder',
					},
					{
						name: 'Metadata Instance Deleted',
						value: 'METADATA_INSTANCE.DELETED',
						description: 'An existing metadata template instance associated with a file or folder is deleted',
					},
					{
						name: 'Sharedlink Deleted',
						value: 'SHARED_LINK.DELETED',
						description: 'A shared link was deleted',
					},
					{
						name: 'Sharedlink Created',
						value: 'SHARED_LINK.CREATED',
						description: 'A shared link was created',
					},
					{
						name: 'Sharedlink UPDATED',
						value: 'SHARED_LINK.UPDATED',
						description: 'A shared link was updated',
					},
					{
						name: 'Task Assignment Created',
						value: 'TASK_ASSIGNMENT.CREATED',
						description: 'A task is created',
					},
					{
						name: 'Task Assignment Updated',
						value: 'TASK_ASSIGNMENT.UPDATED',
						description: 'A task is updated',
					},
					{
						name: 'Webhook Deleted',
						value: 'WEBHOOK.DELETED',
						description: 'When a webhook is deleted',
					},
				],
				required: true,
				default: [],
				description: 'The events to listen to.',
			},
			{
				displayName: 'Target Type',
				name: 'targetType',
				type: 'options',
				options: [
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Folder',
						value: 'folder',
					},
				],
				default: '',
				description: 'The type of item to trigger a webhook',
			},
			{
				displayName: 'Target ID',
				name: 'targetId',
				type: 'string',
				required: false,
				default: '',
				description: 'The ID of the item to trigger a webhook',
			},
		],
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const events = this.getNodeParameter('events') as string;
				const targetId = this.getNodeParameter('targetId') as string;
				const targetType = this.getNodeParameter('targetType') as string;
				// Check all the webhooks which exist already if it is identical to the
				// one that is supposed to get created.
				const endpoint = '/webhooks';
				const webhooks = await boxApiRequestAllItems.call(this, 'entries', 'GET', endpoint, {});

				console.log(webhooks);

				for (const webhook of webhooks) {
					if (webhook.address === webhookUrl &&
						webhook.target.id === targetId &&
						webhook.target.type === targetType) {
						for (const event of events) {
							if (!webhook.triggers.includes(event)) {
								return false;
							}
						}
					}
					// Set webhook-id to be sure that it can be deleted
					webhookData.webhookId = webhook.id as string;
					return true;
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string;
				const targetId = this.getNodeParameter('targetId') as string;
				const targetType = this.getNodeParameter('targetType') as string;

				const endpoint = '/webhooks';

				const body = {
					address: webhookUrl,
					triggers: events,
					target: {
						id: targetId,
						type: targetType,
					}
				};

				const responseData = await boxApiRequest.call(this, 'POST', endpoint, body);

				if (responseData.id === undefined) {
					// Required data is missing so was not successful
					return false;
				}

				webhookData.webhookId = responseData.id as string;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId !== undefined) {

					const endpoint = `/webhooks/${webhookData.webhookId}`;

					try {
						await boxApiRequest.call(this, 'DELETE', endpoint);
					} catch (e) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registred anymore
					delete webhookData.webhookId;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		return {
			workflowData: [
				this.helpers.returnJsonArray(bodyData)
			],
		};
	}
}
