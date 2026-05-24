#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createWidelyClient } from './client.js';

const apiKey = process.env.WIDELY_API_KEY;
if (!apiKey) {
  console.error('Error: WIDELY_API_KEY environment variable is required.');
  process.exit(1);
}

const client = createWidelyClient(apiKey);
const server = new McpServer({ name: 'widely', version: '0.1.0' });

// ── Links ────────────────────────────────────────────────────────────────────

server.registerTool('list_links', {
  description: 'List all links on your Widely profile, ordered by position.',
  inputSchema: {},
}, async () => {
  const data = await client.links.list();
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.registerTool('get_link', {
  description: 'Get a single link by ID.',
  inputSchema: { id: z.string().describe('The link UUID') },
}, async ({ id }) => {
  const data = await client.links.get(id);
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.registerTool('create_link', {
  description: 'Create a new link on your Widely profile.',
  inputSchema: {
    title:    z.string().min(1).max(120).describe('Link label shown on the profile'),
    url:      z.string().url().describe('Destination URL'),
    featured: z.boolean().optional().describe('Pin this link at the top'),
  },
}, async (params) => {
  const data = await client.links.create(params);
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.registerTool('update_link', {
  description: 'Update an existing link. Only provided fields are changed.',
  inputSchema: {
    id:        z.string().describe('The link UUID'),
    title:     z.string().min(1).max(120).optional().describe('New label'),
    url:       z.string().url().optional().describe('New destination URL'),
    visible:   z.boolean().optional().describe('Show or hide the link'),
    featured:  z.boolean().optional().describe('Pin at top'),
    position:  z.number().int().min(0).optional().describe('Manual position index'),
    image_url: z.string().url().nullable().optional().describe('Thumbnail image URL, or null to remove'),
  },
}, async ({ id, ...fields }) => {
  const data = await client.links.update(id, fields);
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.registerTool('delete_link', {
  description: 'Permanently delete a link.',
  inputSchema: { id: z.string().describe('The link UUID') },
}, async ({ id }) => {
  const data = await client.links.remove(id);
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.registerTool('reorder_links', {
  description: 'Set the display order of links by providing all link IDs in the desired order.',
  inputSchema: {
    ids: z.array(z.string().uuid()).min(1).describe('All link UUIDs in desired order'),
  },
}, async ({ ids }) => {
  const data = await client.links.reorder(ids);
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

// ── Profile ──────────────────────────────────────────────────────────────────

server.registerTool('get_profile', {
  description: 'Get your Widely profile (username, display name, bio, theme, socials).',
  inputSchema: {},
}, async () => {
  const data = await client.profile.get();
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.registerTool('update_profile', {
  description: 'Update your Widely profile. Only provided fields are changed.',
  inputSchema: {
    display_name: z.string().max(80).optional().describe('Display name'),
    bio:          z.string().max(400).optional().describe('Short bio'),
    theme:        z.enum(['noir', 'neon', 'midnight', 'bone', 'indigo_mist', 'sunset', 'forest', 'mono']).optional(),
    socials:      z.record(z.string()).optional().describe('e.g. { "instagram": "@handle" }'),
  },
}, async (params) => {
  const data = await client.profile.update(params);
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

// ── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
