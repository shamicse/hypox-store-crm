-- Owner-requested access grant for this private test site only.
INSERT INTO crm_records (key,mode,resource,data,updatedAt)
SELECT 'live:users:kasif-akhtar','live','users','{"id": "kasif-akhtar", "name": "Kasif Akhtar", "email": "kasifakhtar45@gmail.com", "role": "owner", "status": "active"}',strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE NOT EXISTS (SELECT 1 FROM crm_records WHERE mode='live' AND resource='users' AND lower(json_extract(data,'$.email'))='kasifakhtar45@gmail.com');
--> statement-breakpoint
UPDATE crm_records SET data=json_set(data,'$.role','owner','$.status','active'), updatedAt=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE mode='live' AND resource='users' AND lower(json_extract(data,'$.email'))='kasifakhtar45@gmail.com';
--> statement-breakpoint
INSERT OR IGNORE INTO crm_records (key,mode,resource,data,updatedAt) VALUES ('live:audit:grant-kasif-access','live','audit',json_set('{"id": "grant-kasif-access", "name": "Full CRM access granted", "actor": "shamisa9234@gmail.com", "target": "users:kasif-akhtar", "status": "recorded"}','$.createdAt',strftime('%Y-%m-%dT%H:%M:%fZ','now')),strftime('%Y-%m-%dT%H:%M:%fZ','now'));
