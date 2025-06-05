import { pgTable, serial, text, varchar, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const remotesTable = pgTable('remotes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  pairingCode: varchar('pairing_code', { length: 6 }).notNull().default('TEMP00'),
});

export const devicesTable = pgTable('devices', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'AC' or 'simple'
  icon: varchar('icon', { length: 100 }),
  imageUrl: text('image_url'),
  remoteId: integer('remote_id').references(() => remotesTable.id),
});

export const commandsTable = pgTable('commands', {
  id: serial('id').primaryKey(),
  deviceId: integer('device_id').references(() => devicesTable.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 50 }).notNull(), // CSS class like 'btn-primary'
  icon: varchar('icon', { length: 100 }).notNull(), // Font Awesome icon class
  irData: text('ir_data').notNull(), // Infrared signal data as string
});

// AC devices table for protocol and model
export const acDevicesTable = pgTable('ac_devices', {
  id: serial('id').primaryKey(),
  deviceId: integer('device_id').references(() => devicesTable.id).notNull(),
  protocol: varchar('protocol', { length: 100 }).notNull(),
  model: integer('model').notNull(),
});

// AC state table for current AC settings
export const acStatesTable = pgTable('ac_states', {
  id: serial('id').primaryKey(),
  acDeviceId: integer('ac_device_id').references(() => acDevicesTable.id).notNull(),
  power: boolean('power').notNull().default(false),
  temperature: integer('temperature').notNull().default(23),
  mode: varchar('mode', { length: 50 }).notNull().default('Cool'), // Cool, Heat, Dry, Fan, Auto
  fan: varchar('fan', { length: 50 }).notNull().default('Auto'), // Auto, Min, Low, Medium, Max
});

// Define relations
export const remotesRelations = relations(remotesTable, ({ many }) => ({
  devices: many(devicesTable),
}));

export const devicesRelations = relations(devicesTable, ({ one, many }) => ({
  remote: one(remotesTable, {
    fields: [devicesTable.remoteId],
    references: [remotesTable.id],
  }),
  commands: many(commandsTable),
  acDevice: one(acDevicesTable),
}));

export const commandsRelations = relations(commandsTable, ({ one }) => ({
  device: one(devicesTable, {
    fields: [commandsTable.deviceId],
    references: [devicesTable.id],
  }),
}));

export const acDevicesRelations = relations(acDevicesTable, ({ one }) => ({
  device: one(devicesTable, {
    fields: [acDevicesTable.deviceId],
    references: [devicesTable.id],
  }),
  acState: one(acStatesTable),
}));

export const acStatesRelations = relations(acStatesTable, ({ one }) => ({
  acDevice: one(acDevicesTable, {
    fields: [acStatesTable.acDeviceId],
    references: [acDevicesTable.id],
  }),
}));

export type Remote = typeof remotesTable.$inferSelect;
export type NewRemote = typeof remotesTable.$inferInsert;

export type Device = typeof devicesTable.$inferSelect;
export type NewDevice = typeof devicesTable.$inferInsert;

export type Command = typeof commandsTable.$inferSelect;
export type NewCommand = typeof commandsTable.$inferInsert;

export type AcDevice = typeof acDevicesTable.$inferSelect;
export type NewAcDevice = typeof acDevicesTable.$inferInsert;

export type AcState = typeof acStatesTable.$inferSelect;
export type NewAcState = typeof acStatesTable.$inferInsert; 