Installation npm packages:
-------------------------
        1. Go to the backend directory.
        2. Run 'npm i'.
        All dependencies from 'package.json' must be downloaded and installed.
DB usage:
--------
        1. Create empty table before reestablishing.
        2. DB dump in /backend/db/dump.
        3. Run 'psql table_name < dump_name'.
Running server:
---------------------------------------------------
    * Server running by app.js with environment variables:
        1.NODE_ENV = development
        2.NODE_PATH = .
API requests:
------------
        1. /api/questions (GET)
            * Get all questions from DB, and rendering them.

        2. /api/question (POST)
            * Add question in DB. Question send by request's body.

        3. /api/question/id (PUT or DELETE)
            * Update or delete question from DB by id.

