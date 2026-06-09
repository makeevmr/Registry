-- Rename the `students` collection to `users` (employer user-type feature).
--
-- Background: the Strapi content-type formerly known as `students` now models
-- both students and employers. Its schema was updated:
--   collectionName: students -> users   (this physical table rename)
--   info.pluralName stays `students` — the built-in users-permissions plugin
--     already owns pluralName "users", so the REST route stays /api/students
--     and the server keeps calling `students`.
--   singularName stays `student` (so the uid api::student.student and all
--   relation FK columns like `student_id` are UNCHANGED).
-- A new enum column `user_type` ('student' | 'employer', default 'student')
-- is added AUTOMATICALLY by Strapi on boot from the schema change — it is NOT
-- created here.
--
-- IRREVERSIBLE. Run ONCE, while Strapi is STOPPED, BEFORE booting with the new
-- schema. Postgres updates foreign-key targets automatically on RENAME TABLE.
--
-- Verified affected physical tables (others are owned by other collections and
-- keep their names):
--   students            -> users
--   students_components -> users_components
-- `drafts_active_students_links` is owned by the team-builder draft side and is
-- left unchanged.
--
-- Boot order: stop Strapi -> run this -> start Strapi (adds user_type column,
-- expects tables `users` / `users_components`).

BEGIN;

ALTER TABLE students RENAME TO users;
ALTER TABLE students_components RENAME TO users_components;

COMMIT;
