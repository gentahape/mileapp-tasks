db = db.getSiblingDB('mileapp_tasks_db');

db.tasks.createIndex(
  { "userId": 1, "status": 1, "createdAt": -1 },
  { name: "user_status_index" }
);